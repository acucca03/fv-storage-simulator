export type GeocodingResult = {
  latitude: number;
  longitude: number;
  displayName: string;
  provider: "nominatim";
};

type NominatimSearchItem = {
  lat?: string;
  lon?: string;
  display_name?: string;
};

const GEOCODING_TIMEOUT_MS = 8000;
const NOMINATIM_MIN_INTERVAL_MS = 1100;

let nominatimRequestQueue = Promise.resolve();
let nextNominatimRequestAt = 0;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForNominatimSlot() {
  const run = nominatimRequestQueue.then(async () => {
    const waitMs = Math.max(0, nextNominatimRequestAt - Date.now());

    if (waitMs > 0) {
      await sleep(waitMs);
    }

    nextNominatimRequestAt = Date.now() + NOMINATIM_MIN_INTERVAL_MS;
  });

  nominatimRequestQueue = run.catch(() => {});
  return run;
}

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

function toGeocodingResult(item: NominatimSearchItem): GeocodingResult | null {
  if (!item.lat || !item.lon) return null;

  const latitude = Number(item.lat);
  const longitude = Number(item.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude <= -89 || latitude >= 89) return null;
  if (longitude < -180 || longitude > 180) return null;

  return {
    latitude,
    longitude,
    displayName: item.display_name ?? `${latitude}, ${longitude}`,
    provider: "nominatim",
  };
}

export async function geocodeAddressCandidates(
  address: string,
  limit = 6,
): Promise<GeocodingResult[]> {
  const query = address.trim();

  if (query.length < 3) return [];

  await waitForNominatimSlot();

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 8)));
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("accept-language", "it");

  if (process.env.NOMINATIM_EMAIL) {
    url.searchParams.set("email", process.env.NOMINATIM_EMAIL);
  }

  const timeout = createTimeoutSignal(GEOCODING_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: timeout.signal,
      headers: {
        Accept: "application/json",
        "User-Agent":
          process.env.NOMINATIM_USER_AGENT ??
          "SolarScope/fv-storage-simulator contact: configure-NOMINATIM_USER_AGENT",
      },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as NominatimSearchItem[];
    const uniqueResults = new Map<string, GeocodingResult>();

    for (const item of data) {
      const result = toGeocodingResult(item);

      if (!result) continue;

      const key = `${result.latitude.toFixed(5)},${result.longitude.toFixed(5)}`;
      uniqueResults.set(key, result);
    }

    return [...uniqueResults.values()];
  } catch {
    return [];
  } finally {
    timeout.clear();
  }
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  const [firstResult] = await geocodeAddressCandidates(address, 1);
  return firstResult ?? null;
}
