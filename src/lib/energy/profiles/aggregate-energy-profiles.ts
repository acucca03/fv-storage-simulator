import type {
  ConfidenceLevel,
  ConsumptionSource,
  MinuteEnergyPoint,
  PvMinutePoint,
} from "@/types/energy";

type Bucket<T> = {
  timestamp: string;
  total: number;
  points: T[];
};

function getBucketTimestamp(timestamp: string, resolutionMinutes: number) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  const bucketMs = resolutionMinutes * 60 * 1000;
  const bucketTime = Math.floor(date.getTime() / bucketMs) * bucketMs;

  return new Date(bucketTime).toISOString();
}

function getLowestConfidence(points: MinuteEnergyPoint[]): ConfidenceLevel {
  const rank: Record<ConfidenceLevel, number> = {
    low: 0,
    medium: 1,
    high: 2,
    very_high: 3,
  };

  return points.reduce<ConfidenceLevel>((lowest, point) => {
    return rank[point.confidence] < rank[lowest] ? point.confidence : lowest;
  }, "very_high");
}

function getMainConsumptionSource(points: MinuteEnergyPoint[]): ConsumptionSource {
  return points.some((point) => point.source === "uploaded_file")
    ? "uploaded_file"
    : "statistical_profile";
}

export function aggregateConsumptionProfileByResolution(
  profile: MinuteEnergyPoint[],
  resolutionMinutes = 60,
): MinuteEnergyPoint[] {
  const buckets = new Map<string, Bucket<MinuteEnergyPoint>>();

  for (const point of profile) {
    const bucketTimestamp = getBucketTimestamp(point.timestamp, resolutionMinutes);

    if (!buckets.has(bucketTimestamp)) {
      buckets.set(bucketTimestamp, {
        timestamp: bucketTimestamp,
        total: 0,
        points: [],
      });
    }

    const bucket = buckets.get(bucketTimestamp);

    if (!bucket) continue;

    bucket.total += point.consumptionKwh;
    bucket.points.push(point);
  }

  return [...buckets.values()]
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .map((bucket) => ({
      timestamp: bucket.timestamp,
      consumptionKwh: Math.round(bucket.total * 100000) / 100000,
      source: getMainConsumptionSource(bucket.points),
      originalResolutionMinutes: resolutionMinutes,
      confidence: getLowestConfidence(bucket.points),
    }));
}

export function aggregatePvProfileByResolution(
  profile: PvMinutePoint[],
  resolutionMinutes = 60,
): PvMinutePoint[] {
  const buckets = new Map<string, Bucket<PvMinutePoint>>();

  for (const point of profile) {
    const bucketTimestamp = getBucketTimestamp(point.timestamp, resolutionMinutes);

    if (!buckets.has(bucketTimestamp)) {
      buckets.set(bucketTimestamp, {
        timestamp: bucketTimestamp,
        total: 0,
        points: [],
      });
    }

    const bucket = buckets.get(bucketTimestamp);

    if (!bucket) continue;

    bucket.total += point.productionKwh;
    bucket.points.push(point);
  }

  return [...buckets.values()]
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .map((bucket) => {
      const firstPoint = bucket.points[0];

      return {
        timestamp: bucket.timestamp,
        productionKwh: Math.round(bucket.total * 100000) / 100000,
        source: firstPoint?.source ?? "estimated",
        originalResolutionMinutes: resolutionMinutes,
        pvKwp: firstPoint?.pvKwp ?? 0,
      };
    });
}
