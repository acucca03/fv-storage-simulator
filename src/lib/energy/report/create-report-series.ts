import type {
  SimulationMinuteResult,
  SimulationReportPeriod,
  SimulationReportSeries,
} from "@/types/energy";

type MutableReportPeriod = Omit<
  SimulationReportPeriod,
  "averageBatterySocKwh" | "maxBatterySocKwh"
> & {
  count: number;
  batterySocSumKwh: number;
  maxBatterySocKwh: number;
};

function roundEnergy(value: number) {
  return Math.round(value * 100) / 100;
}

function getDateParts(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return {
    year,
    month,
    day,
    monthKey: `${year}-${String(month).padStart(2, "0")}`,
    dayKey: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    monthLabel: new Intl.DateTimeFormat("it-IT", {
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    }).format(date),
    dayLabel: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`,
  };
}

function createEmptyPeriod(label: string, sortKey: string): MutableReportPeriod {
  return {
    label,
    sortKey,
    consumptionKwh: 0,
    pvProductionKwh: 0,
    directSelfConsumptionKwh: 0,
    batteryChargeKwh: 0,
    batteryDischargeKwh: 0,
    gridImportKwh: 0,
    gridExportKwh: 0,
    batterySocSumKwh: 0,
    maxBatterySocKwh: 0,
    count: 0,
  };
}

function addPoint(period: MutableReportPeriod, point: SimulationMinuteResult) {
  period.consumptionKwh += point.consumptionKwh;
  period.pvProductionKwh += point.pvProductionKwh;
  period.directSelfConsumptionKwh += point.directSelfConsumptionKwh;
  period.batteryChargeKwh += point.batteryChargeKwh;
  period.batteryDischargeKwh += point.batteryDischargeKwh;
  period.gridImportKwh += point.gridImportKwh;
  period.gridExportKwh += point.gridExportKwh;
  period.batterySocSumKwh += point.batterySocKwh;
  period.maxBatterySocKwh = Math.max(period.maxBatterySocKwh, point.batterySocKwh);
  period.count += 1;
}

function finalizePeriod(period: MutableReportPeriod): SimulationReportPeriod {
  return {
    label: period.label,
    sortKey: period.sortKey,
    consumptionKwh: roundEnergy(period.consumptionKwh),
    pvProductionKwh: roundEnergy(period.pvProductionKwh),
    directSelfConsumptionKwh: roundEnergy(period.directSelfConsumptionKwh),
    batteryChargeKwh: roundEnergy(period.batteryChargeKwh),
    batteryDischargeKwh: roundEnergy(period.batteryDischargeKwh),
    gridImportKwh: roundEnergy(period.gridImportKwh),
    gridExportKwh: roundEnergy(period.gridExportKwh),
    averageBatterySocKwh: roundEnergy(
      period.count > 0 ? period.batterySocSumKwh / period.count : 0,
    ),
    maxBatterySocKwh: roundEnergy(period.maxBatterySocKwh),
  };
}

function mapToSortedPeriods(map: Map<string, MutableReportPeriod>) {
  return [...map.values()]
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(finalizePeriod);
}

export function createReportSeries(
  results: SimulationMinuteResult[],
): SimulationReportSeries {
  const dailyMap = new Map<string, MutableReportPeriod>();
  const monthlyMap = new Map<string, MutableReportPeriod>();

  for (const point of results) {
    const dateParts = getDateParts(point.timestamp);

    if (!dateParts) continue;

    if (!dailyMap.has(dateParts.dayKey)) {
      dailyMap.set(
        dateParts.dayKey,
        createEmptyPeriod(dateParts.dayLabel, dateParts.dayKey),
      );
    }

    if (!monthlyMap.has(dateParts.monthKey)) {
      monthlyMap.set(
        dateParts.monthKey,
        createEmptyPeriod(dateParts.monthLabel, dateParts.monthKey),
      );
    }

    const dailyPeriod = dailyMap.get(dateParts.dayKey);
    const monthlyPeriod = monthlyMap.get(dateParts.monthKey);

    if (dailyPeriod) addPoint(dailyPeriod, point);
    if (monthlyPeriod) addPoint(monthlyPeriod, point);
  }

  return {
    daily: mapToSortedPeriods(dailyMap),
    monthly: mapToSortedPeriods(monthlyMap),
  };
}
