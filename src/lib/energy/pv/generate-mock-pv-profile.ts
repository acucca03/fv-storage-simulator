import type { PvMinutePoint, PvProfileInput } from "@/types/energy";

const HOURS_PER_DAY = 24;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDaylightShape(hour: number, month: number) {
  const seasonalShift = Math.cos(((month - 6) / 12) * 2 * Math.PI);
  const sunrise = 7.1 - seasonalShift * 1.4;
  const sunset = 17.1 + seasonalShift * 1.7;

  if (hour < sunrise || hour > sunset) return 0;

  const progress = (hour - sunrise) / (sunset - sunrise);
  return Math.sin(progress * Math.PI);
}

function getMonthlyYieldFactor(month: number) {
  const summerBoost = Math.cos(((month - 6) / 12) * 2 * Math.PI);
  return clamp(1 + summerBoost * 0.45, 0.45, 1.45);
}

export function generateMockPvProfile(input: PvProfileInput): PvMinutePoint[] {
  const days = input.days ?? 365;
  const start = new Date(input.startDate ?? "2025-01-01T00:00:00.000Z");
  const totalHours = Math.round(days * HOURS_PER_DAY);
  const annualSpecificYield = input.annualSpecificYieldKwhPerKwp ?? 1450;
  const annualProductionKwh = input.pvKwp * annualSpecificYield;

  const rawWeights = Array.from({ length: totalHours }, (_, hourIndex) => {
    const timestamp = new Date(start.getTime() + hourIndex * 60 * 60 * 1000);
    const hour = timestamp.getUTCHours() + 0.5;
    const month = timestamp.getUTCMonth();

    return getDaylightShape(hour, month) * getMonthlyYieldFactor(month);
  });

  const totalWeight = rawWeights.reduce((sum, value) => sum + value, 0);
  const kwhPerWeightUnit =
    totalWeight > 0 ? annualProductionKwh / totalWeight : 0;

  return rawWeights.map((weight, hourIndex) => {
    const timestamp = new Date(start.getTime() + hourIndex * 60 * 60 * 1000);

    return {
      timestamp: timestamp.toISOString(),
      productionKwh: weight * kwhPerWeightUnit,
      source: "mock",
      originalResolutionMinutes: 60,
      pvKwp: input.pvKwp,
    };
  });
}
