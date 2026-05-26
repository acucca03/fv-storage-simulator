import type {
  SimulationConfig,
  SimulationMinuteResult,
  SimulationSummary,
} from "@/types/energy";
import { calculateSimulationSummaryFromTotals } from "@/lib/energy/metrics/calculate-summary";

export function simulateEnergySystem(config: SimulationConfig): {
  results: SimulationMinuteResult[];
  summary: SimulationSummary;
} {
  const length = Math.min(config.consumptionProfile.length, config.pvProfile.length);
  const keepMinuteResults = config.keepMinuteResults ?? true;

  const minSocKwh =
    config.battery.usableCapacityKwh * (config.battery.minSocPercent / 100);
  const maxSocKwh =
    config.battery.usableCapacityKwh * (config.battery.maxSocPercent / 100);

  let batterySocKwh = minSocKwh;
  const results: SimulationMinuteResult[] = [];
  const totals = {
    annualConsumptionKwh: 0,
    annualPvProductionKwh: 0,
    directSelfConsumptionKwh: 0,
    batterySelfConsumptionKwh: 0,
    gridImportKwh: 0,
    gridExportKwh: 0,
    totalBatteryDischargeKwh: 0,
  };

  for (let index = 0; index < length; index += 1) {
    const consumptionPoint = config.consumptionProfile[index];
    const pvPoint = config.pvProfile[index];

    const resolutionMinutes = Math.max(
      1,
      consumptionPoint.originalResolutionMinutes ??
        pvPoint.originalResolutionMinutes ??
        1,
    );
    const stepHours = resolutionMinutes / 60;
    const maxChargeKwhPerStep = config.battery.maxChargeKw * stepHours;
    const maxDischargeKwhPerStep = config.battery.maxDischargeKw * stepHours;

    const consumptionKwh = Math.max(0, consumptionPoint.consumptionKwh);
    const pvProductionKwh = Math.max(0, pvPoint.productionKwh);

    const directSelfConsumptionKwh = Math.min(consumptionKwh, pvProductionKwh);
    let remainingConsumptionKwh = consumptionKwh - directSelfConsumptionKwh;
    let surplusPvKwh = pvProductionKwh - directSelfConsumptionKwh;

    const availableBatteryToLoadKwh = Math.max(0, batterySocKwh - minSocKwh);
    const batteryDischargeKwh = Math.min(
      remainingConsumptionKwh,
      availableBatteryToLoadKwh * config.battery.dischargeEfficiency,
      maxDischargeKwhPerStep,
    );

    batterySocKwh -= batteryDischargeKwh / config.battery.dischargeEfficiency;
    remainingConsumptionKwh -= batteryDischargeKwh;

    const gridImportKwh = Math.max(0, remainingConsumptionKwh);

    const availableBatterySpaceKwh = Math.max(0, maxSocKwh - batterySocKwh);
    const batteryChargeInputKwh = Math.min(
      surplusPvKwh,
      availableBatterySpaceKwh / config.battery.chargeEfficiency,
      maxChargeKwhPerStep,
    );

    batterySocKwh += batteryChargeInputKwh * config.battery.chargeEfficiency;
    surplusPvKwh -= batteryChargeInputKwh;

    const gridExportKwh = Math.max(0, surplusPvKwh);

    totals.annualConsumptionKwh += consumptionKwh;
    totals.annualPvProductionKwh += pvProductionKwh;
    totals.directSelfConsumptionKwh += directSelfConsumptionKwh;
    totals.batterySelfConsumptionKwh += batteryDischargeKwh;
    totals.gridImportKwh += gridImportKwh;
    totals.gridExportKwh += gridExportKwh;
    totals.totalBatteryDischargeKwh += batteryDischargeKwh;

    if (keepMinuteResults) {
      results.push({
        timestamp: consumptionPoint.timestamp,
        consumptionKwh,
        pvProductionKwh,
        directSelfConsumptionKwh,
        batteryChargeKwh: batteryChargeInputKwh,
        batteryDischargeKwh,
        gridImportKwh,
        gridExportKwh,
        batterySocKwh,
      });
    }
  }

  return {
    results,
    summary: calculateSimulationSummaryFromTotals({
      totals,
      recommendedPvKwp: config.pvKwp,
      recommendedBatteryKwh: config.batteryKwh,
    }),
  };
}
