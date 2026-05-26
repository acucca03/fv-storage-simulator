import type { ConsumptionProfileInput, MinuteEnergyPoint } from "@/types/energy";

const MINUTES_PER_DAY = 24 * 60;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function gaussian(hour: number, center: number, width: number) {
  const distance = hour - center;
  return Math.exp(-(distance * distance) / (2 * width * width));
}

function getSeasonFactor(month: number, input: ConsumptionProfileInput) {
  const isWinter = month === 0 || month === 1 || month === 11;
  const isSummer = month === 5 || month === 6 || month === 7 || month === 8;

  let factor = 1;

  if (isSummer && input.cooling?.includes("spesso")) factor += 0.18;
  if (isSummer && input.cooling?.includes("molte")) factor += 0.3;
  if (isWinter && input.heating?.includes("principale")) factor += 0.35;
  if (isWinter && input.heating?.includes("supporto")) factor += 0.16;

  return factor;
}

function getDailyShapeWeight(hour: number, input: ConsumptionProfileInput) {
  const morning = gaussian(hour, 7.5, 1.4);
  const lunch = gaussian(hour, 13, 1.8);
  const evening = gaussian(hour, 20.5, 2.4);
  const nightBase = hour < 6 || hour > 23 ? 0.35 : 0.22;

  let weight = nightBase + morning * 0.9 + lunch * 0.55 + evening * 1.35;

  if (input.daytimePresence === "Spesso" || input.daytimePresence === "Sempre") {
    weight += gaussian(hour, 11.5, 3.2) * 0.7;
  }

  if (input.mainUsage === "Mattina") weight += morning * 0.8;
  if (input.mainUsage === "Pomeriggio") weight += gaussian(hour, 16, 2.4) * 0.8;
  if (input.mainUsage === "Sera") weight += evening * 0.9;
  if (input.mainUsage === "Distribuiti durante il giorno") weight += 0.35;

  if (input.cooking === "Induzione") {
    weight += lunch * 0.25 + evening * 0.35;
  }

  if (input.ev?.includes("spesso")) {
    weight += gaussian(hour, 1.5, 2.5) * 1.4;
  }

  return clamp(weight, 0.05, 8);
}

export function generateStatisticalConsumptionProfile(
  input: ConsumptionProfileInput,
): MinuteEnergyPoint[] {
  const days = input.days ?? 365;
  const start = new Date(input.startDate ?? "2025-01-01T00:00:00.000Z");
  const totalMinutes = days * MINUTES_PER_DAY;

  const rawWeights = Array.from({ length: totalMinutes }, (_, minuteIndex) => {
    const timestamp = new Date(start.getTime() + minuteIndex * 60_000);
    const hour = timestamp.getUTCHours() + timestamp.getUTCMinutes() / 60;
    const day = timestamp.getUTCDay();
    const month = timestamp.getUTCMonth();

    const weekendFactor = day === 0 || day === 6 ? 1.08 : 1;
    const seasonFactor = getSeasonFactor(month, input);
    const shapeWeight = getDailyShapeWeight(hour, input);

    return shapeWeight * weekendFactor * seasonFactor;
  });

  const totalWeight = rawWeights.reduce((sum, value) => sum + value, 0);
  const kwhPerWeightUnit = input.annualConsumptionKwh / totalWeight;

  return rawWeights.map((weight, minuteIndex) => {
    const timestamp = new Date(start.getTime() + minuteIndex * 60_000);

    return {
      timestamp: timestamp.toISOString(),
      consumptionKwh: weight * kwhPerWeightUnit,
      source: "statistical_profile",
      originalResolutionMinutes: 60,
      confidence: "medium",
    };
  });
}
