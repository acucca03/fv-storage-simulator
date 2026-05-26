import type { MinuteEnergyPoint, UploadedConsumptionPoint } from "@/types/energy";

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_ANNUAL_DAYS = 365;

export type NormalizedUploadedConsumptionProfile = {
  profile: MinuteEnergyPoint[];
  measuredConsumptionKwh: number;
  annualConsumptionKwh: number;
  uploadedRows: number;
  coverageDays: number;
  note: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function inferResolutionMinutes(points: UploadedConsumptionPoint[]) {
  const sortedTimes = points
    .map((point) => new Date(point.timestamp).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  const deltas = sortedTimes
    .slice(1)
    .map((time, index) => (time - sortedTimes[index]) / 60_000)
    .filter((delta) => delta > 0 && delta <= 1440)
    .sort((a, b) => a - b);

  if (!deltas.length) return 60;

  return clamp(Math.round(deltas[Math.floor(deltas.length / 2)]), 1, 1440);
}

function createTimestamp(start: Date, minuteIndex: number) {
  return new Date(start.getTime() + minuteIndex * 60_000).toISOString();
}

function expandToMinuteProfile(points: UploadedConsumptionPoint[]) {
  const sortedPoints = [...points]
    .filter(
      (point) =>
        Number.isFinite(new Date(point.timestamp).getTime()) &&
        Number.isFinite(point.consumptionKwh) &&
        point.consumptionKwh >= 0,
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (sortedPoints.length < 2) {
    throw new Error("Profilo consumi caricato non valido.");
  }

  const inferredResolutionMinutes = inferResolutionMinutes(sortedPoints);
  const minuteProfile: MinuteEnergyPoint[] = [];

  for (const point of sortedPoints) {
    const resolutionMinutes = clamp(
      Math.round(point.originalResolutionMinutes ?? inferredResolutionMinutes),
      1,
      1440,
    );

    const energyPerMinuteKwh = point.consumptionKwh / resolutionMinutes;
    const startTime = new Date(point.timestamp).getTime();

    for (let minuteOffset = 0; minuteOffset < resolutionMinutes; minuteOffset += 1) {
      minuteProfile.push({
        timestamp: new Date(startTime + minuteOffset * 60_000).toISOString(),
        consumptionKwh: energyPerMinuteKwh,
        source: "uploaded_file",
        originalResolutionMinutes: resolutionMinutes,
        confidence: "high",
      });
    }
  }

  return minuteProfile;
}

export function normalizeUploadedConsumptionProfile(params: {
  points: UploadedConsumptionPoint[];
  annualDays?: number;
}): NormalizedUploadedConsumptionProfile {
  const annualDays = params.annualDays ?? DEFAULT_ANNUAL_DAYS;
  const annualMinutes = annualDays * MINUTES_PER_DAY;
  const expandedProfile = expandToMinuteProfile(params.points);
  const measuredConsumptionKwh = expandedProfile.reduce(
    (total, point) => total + point.consumptionKwh,
    0,
  );

  const coverageDays = expandedProfile.length / MINUTES_PER_DAY;
  const annualProfile: MinuteEnergyPoint[] = [];
  const start = new Date("2025-01-01T00:00:00.000Z");

  for (let minuteIndex = 0; minuteIndex < annualMinutes; minuteIndex += 1) {
    const sourcePoint = expandedProfile[minuteIndex % expandedProfile.length];

    annualProfile.push({
      ...sourcePoint,
      timestamp: createTimestamp(start, minuteIndex),
    });
  }

  const annualConsumptionKwh = annualProfile.reduce(
    (total, point) => total + point.consumptionKwh,
    0,
  );

  const note =
    coverageDays >= 350
      ? "Consumi reali caricati e normalizzati su orizzonte annuale."
      : "Consumi reali caricati su periodo parziale e ripetuti per stimare l’anno completo.";

  return {
    profile: annualProfile,
    measuredConsumptionKwh,
    annualConsumptionKwh,
    uploadedRows: params.points.length,
    coverageDays,
    note,
  };
}
