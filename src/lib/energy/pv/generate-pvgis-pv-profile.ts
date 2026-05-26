import type { PvMinutePoint } from "@/types/energy";

const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_HOUR = 60;
const PVGIS_TIMEOUT_MS = 12000;

type PvgisHourlyPoint = {
  time?: string;
  P?: number | string;
};

type PvgisResponse = {
  outputs?: {
    hourly?: PvgisHourlyPoint[];
  };
};

type PvgisPvProfileInput = {
  latitude: number;
  longitude: number;
  pvKwp: number;
  days?: number;
  startDate?: string;
  lossPercent?: number;
  angleDeg?: number;
  aspectDeg?: number;
};

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

function toFiniteNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildTimestamp(start: Date, minuteIndex: number) {
  return new Date(start.getTime() + minuteIndex * 60_000).toISOString();
}

export async function generatePvgisPvProfile(
  input: PvgisPvProfileInput,
): Promise<PvMinutePoint[]> {
  const url = new URL("https://re.jrc.ec.europa.eu/api/v5_3/seriescalc");

  url.searchParams.set("lat", String(input.latitude));
  url.searchParams.set("lon", String(input.longitude));
  url.searchParams.set("outputformat", "json");
  url.searchParams.set("browser", "0");
  url.searchParams.set("usehorizon", "1");
  url.searchParams.set("pvcalculation", "1");
  url.searchParams.set("peakpower", String(input.pvKwp));
  url.searchParams.set("loss", String(input.lossPercent ?? 14));
  url.searchParams.set("angle", String(input.angleDeg ?? 30));
  url.searchParams.set("aspect", String(input.aspectDeg ?? 0));
  url.searchParams.set("mountingplace", "building");
  url.searchParams.set("pvtechchoice", "crystSi");
  url.searchParams.set("startyear", "2023");
  url.searchParams.set("endyear", "2023");

  const timeout = createTimeoutSignal(PVGIS_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: timeout.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`PVGIS request failed with status ${response.status}`);
    }

    const data = (await response.json()) as PvgisResponse;
    const hourly = data.outputs?.hourly;

    if (!hourly?.length) {
      throw new Error("PVGIS response does not contain hourly production data.");
    }

    const days = input.days ?? 365;
    const totalMinutes = Math.round(days * MINUTES_PER_DAY);
    const start = new Date(input.startDate ?? "2025-01-01T00:00:00.000Z");

    return Array.from({ length: totalMinutes }, (_, minuteIndex) => {
      const hourIndex = Math.floor(minuteIndex / MINUTES_PER_HOUR) % hourly.length;
      const hourlyPowerW = Math.max(0, toFiniteNumber(hourly[hourIndex]?.P));

      return {
        timestamp: buildTimestamp(start, minuteIndex),
        productionKwh: hourlyPowerW / 1000 / MINUTES_PER_HOUR,
        source: "pvgis",
        originalResolutionMinutes: 60,
        pvKwp: input.pvKwp,
      };
    });
  } finally {
    timeout.clear();
  }
}

export function scalePvgisReferenceProfile(params: {
  referenceProfile: PvMinutePoint[];
  pvKwp: number;
  days: number;
}): PvMinutePoint[] {
  const totalMinutes = Math.round(params.days * MINUTES_PER_DAY);

  return Array.from({ length: totalMinutes }, (_, minuteIndex) => {
    const referencePoint =
      params.referenceProfile[minuteIndex % params.referenceProfile.length];

    return {
      ...referencePoint,
      productionKwh: referencePoint.productionKwh * params.pvKwp,
      pvKwp: params.pvKwp,
    };
  });
}
