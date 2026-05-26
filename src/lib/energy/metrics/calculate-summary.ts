import type { SimulationMinuteResult, SimulationSummary } from "@/types/energy";
import { estimateSystemUsefulLife } from "@/lib/energy/lifetime/estimate-useful-life";

type SimulationTotals = {
  annualConsumptionKwh: number;
  annualPvProductionKwh: number;
  directSelfConsumptionKwh: number;
  batterySelfConsumptionKwh: number;
  gridImportKwh: number;
  gridExportKwh: number;
  totalBatteryDischargeKwh: number;
};

function createSummaryFromTotals(params: {
  totals: SimulationTotals;
  recommendedPvKwp: number;
  recommendedBatteryKwh: number;
}): SimulationSummary {
  const usefulPvKwh =
    params.totals.directSelfConsumptionKwh + params.totals.batterySelfConsumptionKwh;

  const selfConsumptionPercent =
    params.totals.annualPvProductionKwh > 0
      ? (usefulPvKwh / params.totals.annualPvProductionKwh) * 100
      : 0;

  const selfSufficiencyPercent =
    params.totals.annualConsumptionKwh > 0
      ? (usefulPvKwh / params.totals.annualConsumptionKwh) * 100
      : 0;

  const equivalentBatteryCycles =
    params.recommendedBatteryKwh > 0
      ? params.totals.totalBatteryDischargeKwh / params.recommendedBatteryKwh
      : 0;

  return {
    annualConsumptionKwh: params.totals.annualConsumptionKwh,
    annualPvProductionKwh: params.totals.annualPvProductionKwh,
    directSelfConsumptionKwh: params.totals.directSelfConsumptionKwh,
    batterySelfConsumptionKwh: params.totals.batterySelfConsumptionKwh,
    gridImportKwh: params.totals.gridImportKwh,
    gridExportKwh: params.totals.gridExportKwh,
    selfConsumptionPercent,
    selfSufficiencyPercent,
    recommendedPvKwp: params.recommendedPvKwp,
    recommendedBatteryKwh: params.recommendedBatteryKwh,
    equivalentBatteryCycles,
    ...estimateSystemUsefulLife({
      batteryKwh: params.recommendedBatteryKwh,
      equivalentBatteryCycles,
    }),
  };
}

export function calculateSimulationSummaryFromTotals(params: {
  totals: SimulationTotals;
  recommendedPvKwp: number;
  recommendedBatteryKwh: number;
}): SimulationSummary {
  return createSummaryFromTotals(params);
}

export function calculateSimulationSummary(params: {
  results: SimulationMinuteResult[];
  recommendedPvKwp: number;
  recommendedBatteryKwh: number;
}): SimulationSummary {
  const totals = params.results.reduce<SimulationTotals>(
    (acc, point) => {
      acc.annualConsumptionKwh += point.consumptionKwh;
      acc.annualPvProductionKwh += point.pvProductionKwh;
      acc.directSelfConsumptionKwh += point.directSelfConsumptionKwh;
      acc.batterySelfConsumptionKwh += point.batteryDischargeKwh;
      acc.gridImportKwh += point.gridImportKwh;
      acc.gridExportKwh += point.gridExportKwh;
      acc.totalBatteryDischargeKwh += point.batteryDischargeKwh;
      return acc;
    },
    {
      annualConsumptionKwh: 0,
      annualPvProductionKwh: 0,
      directSelfConsumptionKwh: 0,
      batterySelfConsumptionKwh: 0,
      gridImportKwh: 0,
      gridExportKwh: 0,
      totalBatteryDischargeKwh: 0,
    },
  );

  return createSummaryFromTotals({
    totals,
    recommendedPvKwp: params.recommendedPvKwp,
    recommendedBatteryKwh: params.recommendedBatteryKwh,
  });
}
