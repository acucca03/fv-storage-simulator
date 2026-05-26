import { defaultAdvancedEngineConfig } from "./advanced-config";
import type {
  AdvancedBatteryComparison,
  AdvancedEconomicAssumptions,
  AdvancedEconomicResult,
  AdvancedEnergyResult,
  AdvancedEngineConfig,
  AdvancedOptimizationInput,
  AdvancedOptimizationResult,
  AdvancedSystemResult,
  CostPoint,
  PartialAdvancedEngineConfig,
} from "./advanced-types";

function mergeConfig(
  partialConfig: PartialAdvancedEngineConfig | undefined,
): AdvancedEngineConfig {
  return {
    sizing: {
      ...defaultAdvancedEngineConfig.sizing,
      ...(partialConfig?.sizing ?? {}),
    },
    economics: {
      ...defaultAdvancedEngineConfig.economics,
      ...(partialConfig?.economics ?? {}),
    },
    battery: {
      ...defaultAdvancedEngineConfig.battery,
      ...(partialConfig?.battery ?? {}),
    },
    domesticConstraints: {
      ...defaultAdvancedEngineConfig.domesticConstraints,
      ...(partialConfig?.domesticConstraints ?? {}),
    },
    compromiseWeights: {
      ...defaultAdvancedEngineConfig.compromiseWeights,
      ...(partialConfig?.compromiseWeights ?? {}),
    },
  };
}

function estimateDaysFromProfileLength(length: number, resolutionMinutes = 60) {
  return Math.max(1, (length * resolutionMinutes) / 1440);
}

function getStepHours(index: number, timestamps: string[], fallbackHours: number) {
  const current = new Date(timestamps[index]).getTime();
  const next = new Date(timestamps[index + 1]).getTime();

  if (Number.isFinite(current) && Number.isFinite(next) && next > current) {
    return (next - current) / 3_600_000;
  }

  return fallbackHours;
}

function pickCostFromThresholdTable(size: number, table: CostPoint[]) {
  const sorted = [...table].sort((a, b) => a.size - b.size);
  const match = sorted.find((point) => size <= point.size);
  return match?.costEur ?? sorted[sorted.length - 1]?.costEur ?? 0;
}

function interpolateCost(size: number, table: CostPoint[]) {
  const sorted = [...table].sort((a, b) => a.size - b.size);

  if (sorted.length === 0) return 0;
  if (size <= sorted[0].size) return sorted[0].costEur;

  for (let index = 1; index < sorted.length; index += 1) {
    const left = sorted[index - 1];
    const right = sorted[index];

    if (size <= right.size) {
      const span = right.size - left.size;
      if (span <= 0) return right.costEur;

      const ratio = (size - left.size) / span;
      return left.costEur + ratio * (right.costEur - left.costEur);
    }
  }

  return sorted[sorted.length - 1].costEur;
}

function safePercent(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function simulateAdvancedEnergy(
  pvKwp: number,
  batteryKwh: number,
  input: AdvancedOptimizationInput,
  config: AdvancedEngineConfig,
): AdvancedEnergyResult {
  const days = estimateDaysFromProfileLength(input.consumptionProfile.length);
  const pvProfile = input.pvProfileFactory(pvKwp, days);

  const steps = Math.min(input.consumptionProfile.length, pvProfile.length);
  const timestamps = input.consumptionProfile
    .slice(0, steps)
    .map((point) => point.timestamp);

  const fallbackStepHours =
    input.consumptionProfile[0]?.originalResolutionMinutes !== undefined
      ? input.consumptionProfile[0].originalResolutionMinutes / 60
      : 1;

  const socMin = batteryKwh * config.battery.minSocPercent;
  const socMax = batteryKwh * config.battery.maxSocPercent;

  let soc = batteryKwh * config.battery.initialSocPercent;
  soc = Math.min(Math.max(soc, socMin), socMax);

  const batteryPowerLimitKw =
    batteryKwh <= 0
      ? 0
      : config.battery.useAbsolutePowerLimit
        ? Math.min(batteryKwh, config.battery.absolutePowerLimitKw)
        : batteryKwh;

  let annualConsumptionKwh = 0;
  let annualPvProductionKwh = 0;
  let directSelfConsumptionKwh = 0;
  let pvToBatteryKwh = 0;
  let batteryToLoadKwh = 0;
  let gridImportKwh = 0;
  let gridExportKwh = 0;

  const initialSoc = soc;

  for (let index = 0; index < steps; index += 1) {
    const stepHours = getStepHours(index, timestamps, fallbackStepHours);

    const consumptionKwh = Math.max(
      0,
      input.consumptionProfile[index]?.consumptionKwh ?? 0,
    );

    const pvProductionKwh = Math.max(0, pvProfile[index]?.productionKwh ?? 0);

    annualConsumptionKwh += consumptionKwh;
    annualPvProductionKwh += pvProductionKwh;

    const direct = Math.min(consumptionKwh, pvProductionKwh);
    directSelfConsumptionKwh += direct;

    let remainingLoad = consumptionKwh - direct;
    let surplusPv = pvProductionKwh - direct;

    const maxDischargeThisStep = batteryPowerLimitKw * stepHours;
    const availableFromBattery = Math.max(0, soc - socMin);

    const dischargeToLoad = Math.min(
      remainingLoad,
      availableFromBattery * config.battery.dischargeEfficiency,
      maxDischargeThisStep,
    );

    if (dischargeToLoad > 0) {
      soc -= dischargeToLoad / config.battery.dischargeEfficiency;
      batteryToLoadKwh += dischargeToLoad;
      remainingLoad -= dischargeToLoad;
    }

    gridImportKwh += Math.max(0, remainingLoad);

    const maxChargeThisStep = batteryPowerLimitKw * stepHours;
    const availableBatterySpace = Math.max(0, socMax - soc);

    const chargeFromPv = Math.min(
      surplusPv,
      availableBatterySpace / config.battery.chargeEfficiency,
      maxChargeThisStep,
    );

    if (chargeFromPv > 0) {
      soc += chargeFromPv * config.battery.chargeEfficiency;
      pvToBatteryKwh += chargeFromPv;
      surplusPv -= chargeFromPv;
    }

    gridExportKwh += Math.max(0, surplusPv);
    soc = Math.min(Math.max(soc, socMin), socMax);
  }

  const usefulSelfConsumptionKwh =
    directSelfConsumptionKwh + batteryToLoadKwh;

  const pvUtilizedKwh = directSelfConsumptionKwh + pvToBatteryKwh;

  const batteryLossesKwh = Math.max(
    0,
    pvToBatteryKwh - batteryToLoadKwh - Math.max(0, soc - initialSoc),
  );

  return {
    pvKwp,
    batteryKwh,

    annualConsumptionKwh,
    annualPvProductionKwh,
    productionToConsumptionRatio:
      annualConsumptionKwh > 0
        ? annualPvProductionKwh / annualConsumptionKwh
        : Number.POSITIVE_INFINITY,

    directSelfConsumptionKwh,
    pvToBatteryKwh,
    batteryToLoadKwh,
    batteryLossesKwh,

    usefulSelfConsumptionKwh,
    gridImportKwh,
    gridExportKwh,

    usefulSelfConsumptionPercent: safePercent(
      usefulSelfConsumptionKwh,
      annualPvProductionKwh,
    ),
    pvUtilizationPercent: safePercent(pvUtilizedKwh, annualPvProductionKwh),
    selfSufficiencyPercent: safePercent(
      usefulSelfConsumptionKwh,
      annualConsumptionKwh,
    ),
  };
}

function calculateAdvancedEconomics(
  energy: AdvancedEnergyResult,
  economics: AdvancedEconomicAssumptions,
): AdvancedEconomicResult {
  const pvMaterialCostEur =
    energy.pvKwp * economics.pvMaterialCostEurPerKwp;

  const inverterCostEur = pickCostFromThresholdTable(
    energy.pvKwp,
    economics.inverterCostTable,
  );

  const installationCostEur =
    economics.fixedSystemCostEur +
    economics.baseLaborCostEur +
    energy.pvKwp * economics.laborCostEurPerKwp;

  const initialBatteryCostEur = interpolateCost(
    energy.batteryKwh,
    economics.batteryCostTable,
  );

  const batteryReplacementCostEur =
    energy.batteryKwh > 0 &&
    economics.batteryReplacementYear <= economics.analysisYears
      ? initialBatteryCostEur * economics.batteryReplacementCostFactor
      : 0;

  const initialInvestmentEur =
    pvMaterialCostEur +
    inverterCostEur +
    installationCostEur +
    initialBatteryCostEur;

  const annualCostWithoutSystemEur =
    energy.annualConsumptionKwh * economics.gridImportPriceEurPerKwh;

  const annualEnergyCostWithSystemEur =
    energy.gridImportKwh * economics.gridImportPriceEurPerKwh -
    energy.gridExportKwh * economics.gridExportValueEurPerKwh;

  const annualMaintenanceEur =
    economics.annualFixedMaintenanceEur +
    energy.pvKwp * economics.annualPvMaintenanceEurPerKwp +
    energy.batteryKwh * economics.annualBatteryMaintenanceEurPerKwh;

  const annualOperatingBenefitEur =
    annualCostWithoutSystemEur -
    (annualEnergyCostWithSystemEur + annualMaintenanceEur);

  const taxDeductionBaseEur =
    initialInvestmentEur * economics.deductibleInvestmentShare;

  const taxDeductionTotalEur = economics.taxDeductionEnabled
    ? taxDeductionBaseEur * economics.taxDeductionRate
    : 0;

  const taxDeductionAnnualEur =
    economics.taxDeductionEnabled && economics.taxDeductionYears > 0
      ? taxDeductionTotalEur / economics.taxDeductionYears
      : 0;

  const taxDeductionRecoveredEur =
    taxDeductionAnnualEur *
    Math.min(economics.taxDeductionYears, economics.analysisYears);

  const totalCostWithoutSystemEur =
    annualCostWithoutSystemEur * economics.analysisYears;

  const totalCostWithSystemEur =
    initialInvestmentEur +
    (annualEnergyCostWithSystemEur + annualMaintenanceEur) *
      economics.analysisYears +
    batteryReplacementCostEur -
    taxDeductionRecoveredEur;

  const netBalance20YearsEur =
    totalCostWithoutSystemEur - totalCostWithSystemEur;

  const roi20YearsPercent =
    initialInvestmentEur > 0
      ? (netBalance20YearsEur / initialInvestmentEur) * 100
      : 0;

  let cumulativeCashFlow = -initialInvestmentEur;
  let paybackYears: number | null = null;

  for (let year = 1; year <= economics.analysisYears; year += 1) {
    const previousCashFlow = cumulativeCashFlow;

    let yearlyCashFlow = annualOperatingBenefitEur;

    if (economics.taxDeductionEnabled && year <= economics.taxDeductionYears) {
      yearlyCashFlow += taxDeductionAnnualEur;
    }

    if (year === economics.batteryReplacementYear) {
      yearlyCashFlow -= batteryReplacementCostEur;
    }

    cumulativeCashFlow += yearlyCashFlow;

    if (cumulativeCashFlow >= 0) {
      const yearlyIncrease = cumulativeCashFlow - previousCashFlow;
      paybackYears =
        yearlyIncrease > 0
          ? year - 1 + -previousCashFlow / yearlyIncrease
          : year;
      break;
    }
  }

  return {
    pvMaterialCostEur,
    inverterCostEur,
    installationCostEur,
    initialBatteryCostEur,
    batteryReplacementCostEur,

    initialInvestmentEur,

    annualCostWithoutSystemEur,
    annualEnergyCostWithSystemEur,
    annualMaintenanceEur,
    annualOperatingBenefitEur,

    taxDeductionTotalEur,
    taxDeductionAnnualEur,
    taxDeductionRecoveredEur,

    totalCostWithoutSystemEur,
    totalCostWithSystemEur,

    netBalance20YearsEur,
    roi20YearsPercent,
    paybackYears,
  };
}

function validateDomesticResult(
  result: AdvancedSystemResult,
  config: AdvancedEngineConfig,
) {
  const reasons: string[] = [];
  const constraints = config.domesticConstraints;

  if (!constraints.enabled) {
    return {
      isDomesticValid: true,
      domesticInvalidReasons: reasons,
    };
  }

  if (
    result.productionToConsumptionRatio >
    constraints.maxProductionToConsumptionRatio
  ) {
    reasons.push("FV troppo sovradimensionato rispetto ai consumi.");
  }

  if (
    result.usefulSelfConsumptionPercent <
    constraints.minUsefulSelfConsumptionPercent
  ) {
    reasons.push("Autoconsumo utile troppo basso.");
  }

  if (
    result.paybackYears === null ||
    result.paybackYears > constraints.maxPaybackYears
  ) {
    reasons.push("Tempo di rientro superiore al limite domestico.");
  }

  if (result.initialInvestmentEur > constraints.maxInitialInvestmentEur) {
    reasons.push("Investimento iniziale superiore al limite impostato.");
  }

  if (
    constraints.requirePositiveNetBalance &&
    result.netBalance20YearsEur <= 0
  ) {
    reasons.push("Saldo netto a 20 anni non positivo.");
  }

  return {
    isDomesticValid: reasons.length === 0,
    domesticInvalidReasons: reasons,
  };
}

function sortByPayback(results: AdvancedSystemResult[]) {
  return [...results].sort((a, b) => {
    const paybackA = a.paybackYears ?? Number.POSITIVE_INFINITY;
    const paybackB = b.paybackYears ?? Number.POSITIVE_INFINITY;

    if (paybackA !== paybackB) return paybackA - paybackB;
    return a.initialInvestmentEur - b.initialInvestmentEur;
  });
}

function normalizeHighIsGood(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) return values.map(() => 1);
  return values.map((value) => (value - min) / (max - min));
}

function normalizeLowIsGood(values: number[]) {
  const high = normalizeHighIsGood(values);
  return high.map((value) => 1 - value);
}

function addCompromiseScores(
  results: AdvancedSystemResult[],
  config: AdvancedEngineConfig,
) {
  if (results.length === 0) return [];

  const paybackValues = results.map(
    (result) => result.paybackYears ?? config.economics.analysisYears + 5,
  );

  const netScore = normalizeHighIsGood(
    results.map((result) => result.netBalance20YearsEur),
  );
  const paybackScore = normalizeLowIsGood(paybackValues);
  const roiScore = normalizeHighIsGood(
    results.map((result) => result.roi20YearsPercent),
  );
  const selfConsumptionScore = normalizeHighIsGood(
    results.map((result) => result.usefulSelfConsumptionPercent),
  );
  const selfSufficiencyScore = normalizeHighIsGood(
    results.map((result) => result.selfSufficiencyPercent),
  );
  const investmentScore = normalizeLowIsGood(
    results.map((result) => result.initialInvestmentEur),
  );

  return results.map((result, index) => ({
    ...result,
    compromiseScore:
      config.compromiseWeights.netBalance * netScore[index] +
      config.compromiseWeights.payback * paybackScore[index] +
      config.compromiseWeights.roi * roiScore[index] +
      config.compromiseWeights.selfConsumption * selfConsumptionScore[index] +
      config.compromiseWeights.selfSufficiency * selfSufficiencyScore[index] +
      config.compromiseWeights.investment * investmentScore[index],
  }));
}

function getBestBatteryForEachPv(results: AdvancedSystemResult[]) {
  const pvSizes = [...new Set(results.map((result) => result.pvKwp))].sort(
    (a, b) => a - b,
  );

  return pvSizes
    .map((pvKwp) => {
      const rows = results.filter((result) => result.pvKwp === pvKwp);
      return [...rows].sort(
        (a, b) => b.netBalance20YearsEur - a.netBalance20YearsEur,
      )[0];
    })
    .filter(Boolean);
}

function getBatteryComparisons(
  results: AdvancedSystemResult[],
): AdvancedBatteryComparison[] {
  const pvSizes = [...new Set(results.map((result) => result.pvKwp))].sort(
    (a, b) => a - b,
  );

  return pvSizes.flatMap((pvKwp) => {
    const rows = results.filter((result) => result.pvKwp === pvKwp);
    const noBattery = rows.find((result) => result.batteryKwh === 0);
    const withBatteryRows = rows.filter((result) => result.batteryKwh > 0);

    if (!noBattery || withBatteryRows.length === 0) return [];

    const bestBattery = [...withBatteryRows].sort(
      (a, b) => b.netBalance20YearsEur - a.netBalance20YearsEur,
    )[0];

    const batteryNetAdvantageEur =
      bestBattery.netBalance20YearsEur - noBattery.netBalance20YearsEur;

    return [
      {
        pvKwp,

        bestBatteryKwh: bestBattery.batteryKwh,
        bestBatteryNetBalanceEur: bestBattery.netBalance20YearsEur,
        noBatteryNetBalanceEur: noBattery.netBalance20YearsEur,
        batteryNetAdvantageEur,

        bestBatteryPaybackYears: bestBattery.paybackYears,
        noBatteryPaybackYears: noBattery.paybackYears,

        bestBatterySelfSufficiencyPercent:
          bestBattery.selfSufficiencyPercent,
        noBatterySelfSufficiencyPercent: noBattery.selfSufficiencyPercent,
        selfSufficiencyGainPercent:
          bestBattery.selfSufficiencyPercent -
          noBattery.selfSufficiencyPercent,

        bestBatteryUsefulSelfConsumptionPercent:
          bestBattery.usefulSelfConsumptionPercent,
        noBatteryUsefulSelfConsumptionPercent:
          noBattery.usefulSelfConsumptionPercent,
        usefulSelfConsumptionGainPercent:
          bestBattery.usefulSelfConsumptionPercent -
          noBattery.usefulSelfConsumptionPercent,

        batteryEconomicallyUseful: batteryNetAdvantageEur > 0,
      },
    ];
  });
}

function buildWarnings(result: AdvancedOptimizationResult) {
  const warnings: string[] = [];

  const bestFree = result.freeScenario.bestNetBalance;
  const bestDomestic = result.domesticScenario.bestCompromise;

  if (
    bestFree &&
    bestFree.productionToConsumptionRatio > 3
  ) {
    warnings.push(
      "La migliore soluzione economica libera risulta sovradimensionata rispetto ai consumi: va distinta dal dimensionamento domestico.",
    );
  }

  if (!bestDomestic) {
    warnings.push(
      "Nessuna soluzione rispetta tutti i vincoli domestici: è necessario rivedere vincoli o costi.",
    );
  }

  const usefulBatteryComparisons = result.batteryComparisons.filter(
    (comparison) => comparison.batteryEconomicallyUseful,
  );

  if (usefulBatteryComparisons.length === 0) {
    warnings.push(
      "Con i parametri attuali la batteria migliora l'autosufficienza, ma non migliora il risultato economico rispetto alla soluzione senza accumulo.",
    );
  }

  return warnings;
}

export function runAdvancedOptimization(
  input: AdvancedOptimizationInput,
): AdvancedOptimizationResult {
  const config = mergeConfig(input.config);
  const allResults: AdvancedSystemResult[] = [];

  for (const pvKwp of config.sizing.pvSizesKwp) {
    for (const batteryKwh of config.sizing.batterySizesKwh) {
      const energy = simulateAdvancedEnergy(pvKwp, batteryKwh, input, config);
      const economic = calculateAdvancedEconomics(energy, config.economics);

      const baseResult: AdvancedSystemResult = {
        ...energy,
        ...economic,
        isDomesticValid: false,
        domesticInvalidReasons: [],
      };

      const validation = validateDomesticResult(baseResult, config);

      allResults.push({
        ...baseResult,
        ...validation,
      });
    }
  }

  const freeByNetBalance = [...allResults].sort(
    (a, b) => b.netBalance20YearsEur - a.netBalance20YearsEur,
  );

  const freeByPayback = sortByPayback(
    allResults.filter((result) => result.paybackYears !== null),
  );

  const freeByRoi = [...allResults].sort(
    (a, b) => b.roi20YearsPercent - a.roi20YearsPercent,
  );

  const domesticResultsWithoutScore = allResults.filter(
    (result) => result.isDomesticValid,
  );

  const domesticResults = addCompromiseScores(
    domesticResultsWithoutScore,
    config,
  );

  const domesticByNetBalance = [...domesticResults].sort(
    (a, b) => b.netBalance20YearsEur - a.netBalance20YearsEur,
  );

  const domesticByPayback = sortByPayback(domesticResults);
  const domesticByRoi = [...domesticResults].sort(
    (a, b) => b.roi20YearsPercent - a.roi20YearsPercent,
  );

  const domesticByCompromise = [...domesticResults].sort(
    (a, b) => (b.compromiseScore ?? 0) - (a.compromiseScore ?? 0),
  );

  const result: AdvancedOptimizationResult = {
    usedConfig: config,

    allResults,

    freeScenario: {
      bestNetBalance: freeByNetBalance[0],
      bestPayback: freeByPayback[0],
      bestRoi: freeByRoi[0],
    },

    domesticScenario: {
      bestNetBalance: domesticByNetBalance[0],
      bestPayback: domesticByPayback[0],
      bestRoi: domesticByRoi[0],
      bestCompromise: domesticByCompromise[0],
    },

    domesticResults,
    bestBatteryForEachPv: getBestBatteryForEachPv(allResults),
    batteryComparisons: getBatteryComparisons(allResults),

    recommendedDomestic:
      domesticByCompromise[0] ?? domesticByNetBalance[0] ?? freeByNetBalance[0],

    warnings: [],
  };

  return {
    ...result,
    warnings: buildWarnings(result),
  };
}
