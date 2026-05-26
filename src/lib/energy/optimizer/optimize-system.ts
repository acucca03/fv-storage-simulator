import type {
  OptimizationInput,
  OptimizationResult,
  PvMinutePoint,
  SimulationSummary,
} from "@/types/energy";
import { createDefaultBatteryConfig } from "@/lib/energy/battery/default-battery-config";
import { generateMockPvProfile } from "@/lib/energy/pv/generate-mock-pv-profile";
import { simulateEnergySystem } from "@/lib/energy/simulation/simulate-energy-system";
import { ENERGY_ECONOMIC_ASSUMPTIONS } from "@/lib/energy/economics/economic-assumptions";

const MIN_PV_KWP = 0.3;
const MAX_DOMESTIC_PV_KWP = 12;
const MAX_DOMESTIC_BATTERY_KWH = 15;

const PV_SEARCH_STEP_KWP = 0.1;
const BATTERY_SEARCH_STEP_KWH = 0.1;

const PV_COMMERCIAL_STEP_KWP = 0.5;
const BATTERY_COMMERCIAL_STEP_KWH = 1;


type Candidate = {
  precisePvKwp: number;
  preciseBatteryKwh: number;
  roundedPvKwp: number;
  roundedBatteryKwh: number;
  summary: SimulationSummary;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundUpToStep(value: number, step: number) {
  if (value <= 0) return 0;
  return Math.ceil((value - Number.EPSILON) / step) * step;
}

function roundTo(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function createNumberRange(min: number, max: number, step: number) {
  const values: number[] = [];

  for (let value = min; value <= max + Number.EPSILON; value += step) {
    values.push(roundTo(value, 2));
  }

  return values;
}

function scalePvProfile(profile: PvMinutePoint[], pvKwp: number): PvMinutePoint[] {
  return profile.map((point) => ({
    ...point,
    productionKwh: point.productionKwh * pvKwp,
    pvKwp,
  }));
}

function calculateEconomics(summary: SimulationSummary) {
  const selfConsumedKwh =
    summary.directSelfConsumptionKwh + summary.batterySelfConsumptionKwh;

  const baselineAnnualEnergyCostEur =
    summary.annualConsumptionKwh *
    ENERGY_ECONOMIC_ASSUMPTIONS.electricityPurchasePriceEurPerKwh;

  const estimatedAnnualEnergyCostAfterSystemEur =
    summary.gridImportKwh *
      ENERGY_ECONOMIC_ASSUMPTIONS.electricityPurchasePriceEurPerKwh -
    summary.gridExportKwh *
      ENERGY_ECONOMIC_ASSUMPTIONS.exportedEnergyValueEurPerKwh;

  const annualEnergySavingsEur =
    selfConsumedKwh * ENERGY_ECONOMIC_ASSUMPTIONS.electricityPurchasePriceEurPerKwh +
    summary.gridExportKwh * ENERGY_ECONOMIC_ASSUMPTIONS.exportedEnergyValueEurPerKwh;

  const estimatedInvestmentEur =
    summary.recommendedPvKwp * ENERGY_ECONOMIC_ASSUMPTIONS.pvCostEurPerKwp +
    summary.recommendedBatteryKwh * ENERGY_ECONOMIC_ASSUMPTIONS.batteryCostEurPerKwh +
    ENERGY_ECONOMIC_ASSUMPTIONS.fixedInstallationCostEur;

  const simplePaybackYears =
    annualEnergySavingsEur > 0
      ? estimatedInvestmentEur / annualEnergySavingsEur
      : Number.POSITIVE_INFINITY;

  return {
    estimatedInvestmentEur,
    annualEnergySavingsEur,
    simplePaybackYears,
    baselineAnnualEnergyCostEur,
    estimatedAnnualEnergyCostAfterSystemEur,
  };
}

function addEconomicMetadata(summary: SimulationSummary): SimulationSummary {
  return {
    ...summary,
    ...calculateEconomics(summary),
  };
}

function addSizingAndTargetMetadata(params: {
  summary: SimulationSummary;
  precisePvKwp: number;
  preciseBatteryKwh: number;
  roundedPvKwp: number;
  roundedBatteryKwh: number;
  targetSelfConsumptionPercent: number;
}) {
  const selfConsumptionTargetGapPercent = Math.max(
    0,
    params.targetSelfConsumptionPercent - params.summary.selfConsumptionPercent,
  );

  const targetStatus =
    params.summary.selfConsumptionPercent >= params.targetSelfConsumptionPercent
      ? "achieved"
      : "partial";

  return {
    ...params.summary,
    recommendedPvKwp: params.roundedPvKwp,
    recommendedBatteryKwh: params.roundedBatteryKwh,
    preciseRecommendedPvKwp: params.precisePvKwp,
    preciseRecommendedBatteryKwh: params.preciseBatteryKwh,
    roundedRecommendedPvKwp: params.roundedPvKwp,
    roundedRecommendedBatteryKwh: params.roundedBatteryKwh,
    commercialRoundingNote:
      "Taglia tecnica calcolata con passo 0,1 e poi arrotondata per eccesso a passi commerciali: FV 0,5 kWp, accumulo 1 kWh.",
    targetStatus,
    targetSelfConsumptionPercent: params.targetSelfConsumptionPercent,
    selfConsumptionTargetGapPercent,
  } satisfies SimulationSummary;
}

function compareTargetCandidates(a: Candidate, b: Candidate, target: number) {
  const aMeetsAutoconsumption = a.summary.selfConsumptionPercent >= target;
  const bMeetsAutoconsumption = b.summary.selfConsumptionPercent >= target;

  if (aMeetsAutoconsumption !== bMeetsAutoconsumption) {
    return aMeetsAutoconsumption ? -1 : 1;
  }

  if (aMeetsAutoconsumption && bMeetsAutoconsumption) {
    const selfSufficiencyDelta =
      b.summary.selfSufficiencyPercent - a.summary.selfSufficiencyPercent;

    if (Math.abs(selfSufficiencyDelta) > 0.2) {
      return selfSufficiencyDelta;
    }
  }

  if (!aMeetsAutoconsumption && !bMeetsAutoconsumption) {
    const selfConsumptionDelta =
      b.summary.selfConsumptionPercent - a.summary.selfConsumptionPercent;

    if (Math.abs(selfConsumptionDelta) > 0.2) {
      return selfConsumptionDelta;
    }
  }

  const aEconomics = calculateEconomics(a.summary);
  const bEconomics = calculateEconomics(b.summary);

  const aPayback = Number.isFinite(aEconomics.simplePaybackYears)
    ? aEconomics.simplePaybackYears
    : 999;

  const bPayback = Number.isFinite(bEconomics.simplePaybackYears)
    ? bEconomics.simplePaybackYears
    : 999;

  if (Math.abs(aPayback - bPayback) > 0.2) {
    return aPayback - bPayback;
  }

  const aSize = a.roundedPvKwp * 2 + a.roundedBatteryKwh;
  const bSize = b.roundedPvKwp * 2 + b.roundedBatteryKwh;

  return aSize - bSize;
}

function getProfileDays(profile: OptimizationInput["consumptionProfile"]) {
  const totalMinutes = profile.reduce(
    (sum, point) => sum + (point.originalResolutionMinutes ?? 1),
    0,
  );

  return Math.max(1, totalMinutes / 1440);
}

function scoreSummary(summary: SimulationSummary, input: OptimizationInput) {
  const economics = calculateEconomics(summary);
  const goal = input.goal ?? "balanced";
  const target = input.targetSelfConsumptionPercent;

  const paybackYears = Number.isFinite(economics.simplePaybackYears)
    ? economics.simplePaybackYears
    : 999;

  const selfConsumptionDeficit = Math.max(
    0,
    target - summary.selfConsumptionPercent,
  );

  const domesticSizePenalty =
    summary.recommendedPvKwp * 28 + summary.recommendedBatteryKwh * 32;

  const investmentPenalty = economics.estimatedInvestmentEur * 0.018;
  const paybackPenalty = paybackYears * 180;

  if (goal === "maximize_self_sufficiency") {
    return (
      summary.selfSufficiencyPercent * 220 +
      summary.selfConsumptionPercent * 45 +
      economics.annualEnergySavingsEur * 0.35 -
      paybackYears * 120 -
      domesticSizePenalty
    );
  }

  if (goal === "minimize_grid_import") {
    return (
      -summary.gridImportKwh * 2 +
      summary.selfSufficiencyPercent * 180 +
      summary.selfConsumptionPercent * 35 -
      paybackYears * 120 -
      domesticSizePenalty
    );
  }

  if (goal === "target_self_consumption") {
    const meetsTarget = summary.selfConsumptionPercent >= target;

    return (
      (meetsTarget ? 100_000 : 0) +
      summary.selfSufficiencyPercent * 85 +
      summary.selfConsumptionPercent * 90 -
      selfConsumptionDeficit * 4_000 -
      paybackYears * 140 -
      domesticSizePenalty
    );
  }

  return (
    summary.selfConsumptionPercent * 115 +
    summary.selfSufficiencyPercent * 125 +
    economics.annualEnergySavingsEur * 0.45 -
    selfConsumptionDeficit * 1_600 -
    paybackPenalty -
    investmentPenalty -
    domesticSizePenalty
  );
}

export function optimizeSystem(input: OptimizationInput): OptimizationResult {
  const testedResults: SimulationSummary[] = [];
  const days = getProfileDays(input.consumptionProfile);

  const createFullPvProfile = (pvKwp: number) =>
    input.pvProfileFactory
      ? input.pvProfileFactory(pvKwp, days)
      : generateMockPvProfile({
          pvKwp,
          days,
        });

  const oneKwpPvProfile = createFullPvProfile(1);
  const oneKwpBattery = createDefaultBatteryConfig(0);

  const { summary: oneKwpSummaryRaw } = simulateEnergySystem({
    consumptionProfile: input.consumptionProfile,
    pvProfile: oneKwpPvProfile,
    battery: oneKwpBattery,
    pvKwp: 1,
    batteryKwh: 0,
    keepMinuteResults: false,
  });

  const annualConsumptionKwh = oneKwpSummaryRaw.annualConsumptionKwh;
  const dailyConsumptionKwh = annualConsumptionKwh / 365;
  const specificYieldKwhPerKwp = Math.max(
    1,
    oneKwpSummaryRaw.annualPvProductionKwh,
  );

  const maxPvKwp = clamp(
    (annualConsumptionKwh / specificYieldKwhPerKwp) * 3.4,
    1.5,
    MAX_DOMESTIC_PV_KWP,
  );

  const maxBatteryKwh = clamp(
    dailyConsumptionKwh * 3,
    2,
    MAX_DOMESTIC_BATTERY_KWH,
  );

  const pvCandidates = createNumberRange(
    MIN_PV_KWP,
    roundTo(maxPvKwp, 1),
    PV_SEARCH_STEP_KWP,
  );

  const batteryCandidates = createNumberRange(
    0,
    roundTo(maxBatteryKwh, 1),
    BATTERY_SEARCH_STEP_KWH,
  );

  const commercialCandidateMap = new Map<
    string,
    {
      precisePvKwp: number;
      preciseBatteryKwh: number;
      roundedPvKwp: number;
      roundedBatteryKwh: number;
    }
  >();

  for (const precisePvKwp of pvCandidates) {
    for (const preciseBatteryKwh of batteryCandidates) {
      const roundedPvKwp = roundTo(
        roundUpToStep(precisePvKwp, PV_COMMERCIAL_STEP_KWP),
        1,
      );

      const roundedBatteryKwh = roundTo(
        roundUpToStep(preciseBatteryKwh, BATTERY_COMMERCIAL_STEP_KWH),
        1,
      );

      const key = `${roundedPvKwp}:${roundedBatteryKwh}`;

      if (!commercialCandidateMap.has(key)) {
        commercialCandidateMap.set(key, {
          precisePvKwp,
          preciseBatteryKwh,
          roundedPvKwp,
          roundedBatteryKwh,
        });
      }
    }
  }

  const candidates: Candidate[] = [];

  for (const candidate of commercialCandidateMap.values()) {
    const battery = createDefaultBatteryConfig(candidate.roundedBatteryKwh);

    const { summary } = simulateEnergySystem({
      consumptionProfile: input.consumptionProfile,
      pvProfile: scalePvProfile(oneKwpPvProfile, candidate.roundedPvKwp),
      battery,
      pvKwp: candidate.roundedPvKwp,
      batteryKwh: candidate.roundedBatteryKwh,
      keepMinuteResults: false,
    });

    const summaryWithEconomics = addEconomicMetadata(summary);

    testedResults.push(summaryWithEconomics);

    candidates.push({
      ...candidate,
      summary: summaryWithEconomics,
    });
  }

  const goal = input.goal ?? "target_self_consumption";

  const bestCandidate =
    goal === "target_self_consumption"
      ? [...candidates].sort((a, b) =>
          compareTargetCandidates(
            a,
            b,
            input.targetSelfConsumptionPercent,
          ),
        )[0]
      : candidates.reduce((best, current) => {
          const bestScore = scoreSummary(best.summary, input);
          const currentScore = scoreSummary(current.summary, input);

          return currentScore > bestScore ? current : best;
        }, candidates[0]);

  const bestSummary = addEconomicMetadata(
    addSizingAndTargetMetadata({
      summary: bestCandidate.summary,
      precisePvKwp: bestCandidate.precisePvKwp,
      preciseBatteryKwh: bestCandidate.preciseBatteryKwh,
      roundedPvKwp: bestCandidate.roundedPvKwp,
      roundedBatteryKwh: bestCandidate.roundedBatteryKwh,
      targetSelfConsumptionPercent: input.targetSelfConsumptionPercent,
    }),
  );

  return {
    bestSummary,
    testedResults,
  };
}
