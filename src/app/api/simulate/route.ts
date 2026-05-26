import { NextRequest, NextResponse } from "next/server";
import { generateStatisticalConsumptionProfile } from "@/lib/energy/consumption/generate-statistical-profile";
import { normalizeUploadedConsumptionProfile } from "@/lib/energy/consumption/normalize-uploaded-consumption-profile";
import { createDefaultBatteryConfig } from "@/lib/energy/battery/default-battery-config";
import { optimizeSystem } from "@/lib/energy/optimizer/optimize-system";
import { generateMockPvProfile } from "@/lib/energy/pv/generate-mock-pv-profile";
import { createReportSeries } from "@/lib/energy/report/create-report-series";
import { aggregateConsumptionProfileByResolution, aggregatePvProfileByResolution } from "@/lib/energy/profiles/aggregate-energy-profiles";
import {
  generatePvgisPvProfile,
  scalePvgisReferenceProfile,
} from "@/lib/energy/pv/generate-pvgis-pv-profile";
import { geocodeAddress } from "@/lib/geo/geocode-address";
import { simulateEnergySystem } from "@/lib/energy/simulation/simulate-energy-system";
import type {
  MinuteEnergyPoint,
  PvMinutePoint,
  UploadedConsumptionPoint,
} from "@/types/energy";

type SimulationAnswers = Record<string, string | undefined>;

type SimulationRequestBody = {
  annualConsumptionKwh?: number | string;
  uploadedConsumptionProfile?: UploadedConsumptionPoint[];
  uploadedFileName?: string;
  address?: string;
  selectedLocation?: SelectedGeocodedLocation;
  target?: string;
  answers?: SimulationAnswers;
  includeReport?: boolean;
};

type SelectedGeocodedLocation = {
  latitude: number;
  longitude: number;
  displayName?: string;
};

type PvDataSourceResponse = {
  source: "pvgis" | "mock";
  label: string;
  provider?: string;
  latitude?: number;
  longitude?: number;
  resolvedAddress?: string;
  note?: string;
};

type ConsumptionDataSourceResponse = {
  source: "statistical_profile" | "uploaded_file";
  label: string;
  annualConsumptionKwh: number;
  uploadedRows?: number;
  coverageDays?: number;
  fileName?: string;
  note?: string;
};

function getTargetSelfConsumptionPercent(target?: string) {
  if (!target) return 45;

  const match = target.match(/(\d+(?:[,.]\d+)?)/);
  if (!match) return 45;

  return Number(match[1].replace(",", "."));
}

function getOptimizationGoal(target?: string) {
  const normalizedTarget = target?.toLowerCase() ?? "";

  if (
    normalizedTarget.includes("compromesso") ||
    normalizedTarget.includes("economico") ||
    normalizedTarget.includes("rientro") ||
    normalizedTarget.includes("payback")
  ) {
    return "balanced" as const;
  }

  if (
    normalizedTarget.includes("autoconsumo") ||
    normalizedTarget.includes("self consumption")
  ) {
    return "target_self_consumption" as const;
  }

  if (normalizedTarget.includes("autosufficienza")) {
    return "maximize_self_sufficiency" as const;
  }

  if (normalizedTarget.includes("minimo prelievo")) {
    return "minimize_grid_import" as const;
  }

  if (normalizedTarget.includes("costo") || normalizedTarget.includes("beneficio")) {
    return "balanced" as const;
  }

  return "balanced" as const;
}


function isValidSelectedLocation(
  location: SelectedGeocodedLocation | undefined,
): location is SelectedGeocodedLocation {
  if (!location) return false;

  return (
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude) &&
    location.latitude > -89 &&
    location.latitude < 89 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
}

async function createPvProfileFactory(address: string | undefined, selectedLocation?: SelectedGeocodedLocation): Promise<{
  pvProfileFactory?: (pvKwp: number, days: number) => PvMinutePoint[];
  pvDataSource: PvDataSourceResponse;
}> {
  const fallbackSource: PvDataSourceResponse = {
    source: "mock",
    label: "Produzione FV stimata internamente",
    note: "PVGIS non disponibile o località non risolta: uso del profilo FV interno.",
  };

  if (!address?.trim()) {
    return {
      pvDataSource: fallbackSource,
    };
  }

  try {
    const selectedGeocoding = isValidSelectedLocation(selectedLocation)
    ? {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        displayName:
          selectedLocation.displayName ?? address ?? "Località selezionata",
        provider: "nominatim" as const,
      }
    : null;

  const geocoding = selectedGeocoding ?? (await geocodeAddress(address ?? ""));

    if (!geocoding) {
      return {
        pvDataSource: {
          ...fallbackSource,
          note: "Indirizzo non geocodificato: uso del profilo FV interno.",
        },
      };
    }

    const referenceProfile = await generatePvgisPvProfile({
      latitude: geocoding.latitude,
      longitude: geocoding.longitude,
      pvKwp: 1,
      days: 365,
    });

    return {
      pvProfileFactory: (pvKwp: number, days: number) =>
        scalePvgisReferenceProfile({
          referenceProfile,
          pvKwp,
          days,
        }),
      pvDataSource: {
        source: "pvgis",
        label: "Produzione FV oraria da PVGIS",
        provider: "PVGIS 5.3 + OpenStreetMap Nominatim",
        latitude: geocoding.latitude,
        longitude: geocoding.longitude,
        resolvedAddress: geocoding.displayName,
        note:
        Math.abs(geocoding.latitude) >= 60
          ? "Profilo FV PVGIS su località ad alta latitudine: stima più indicativa."
          : "Profilo FV costruito da dati orari PVGIS e scalato sulle taglie testate.",
      },
    };
  } catch {
    return {
      pvDataSource: {
        ...fallbackSource,
        note: "Errore durante la chiamata PVGIS: uso del profilo FV interno.",
      },
    };
  }
}

function createConsumptionProfile(body: SimulationRequestBody): {
  consumptionProfile: MinuteEnergyPoint[];
  consumptionDataSource: ConsumptionDataSourceResponse;
} {
  if (body.uploadedConsumptionProfile?.length) {
    const normalized = normalizeUploadedConsumptionProfile({
      points: body.uploadedConsumptionProfile,
      annualDays: 365,
    });

    return {
      consumptionProfile: normalized.profile,
      consumptionDataSource: {
        source: "uploaded_file",
        label: "Consumi reali caricati da file",
        annualConsumptionKwh: normalized.annualConsumptionKwh,
        uploadedRows: normalized.uploadedRows,
        coverageDays: normalized.coverageDays,
        fileName: body.uploadedFileName,
        note: normalized.note,
      },
    };
  }

  const annualConsumptionKwh = Number(body.annualConsumptionKwh);

  if (!Number.isFinite(annualConsumptionKwh) || annualConsumptionKwh <= 0) {
    throw new Error("Consumo annuo non valido.");
  }

  const answers = body.answers ?? {};
  const consumptionProfile = generateStatisticalConsumptionProfile({
    annualConsumptionKwh,
    days: 365,
    people: answers.people,
    daytimePresence: answers.daytimePresence,
    mainUsage: answers.mainUsage,
    cooling: answers.cooling,
    heating: answers.heating,
    cooking: answers.cooking,
    ev: answers.ev,
  });

  return {
    consumptionProfile,
    consumptionDataSource: {
      source: "statistical_profile",
      label: "Consumi stimati da questionario",
      annualConsumptionKwh,
      note: "Profilo statistico generato dalle risposte inserite.",
    },
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SimulationRequestBody;

  let consumptionProfile: MinuteEnergyPoint[];
  let consumptionDataSource: ConsumptionDataSourceResponse;

  try {
    const consumptionResult = createConsumptionProfile(body);
    consumptionProfile = consumptionResult.consumptionProfile;
    consumptionDataSource = consumptionResult.consumptionDataSource;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Consumo annuo o file consumi non valido.",
      },
      { status: 400 },
    );
  }

  const { pvProfileFactory, pvDataSource } = await createPvProfileFactory(body.address, body.selectedLocation);

  const reportConsumptionProfile = aggregateConsumptionProfileByResolution(
    consumptionProfile,
    60,
  );

  const getPvProfile = (pvKwp: number, days: number) =>
    pvProfileFactory
      ? pvProfileFactory(pvKwp, days)
      : generateMockPvProfile({
          pvKwp,
          days,
        });

  const optimizationPvProfileFactory = (pvKwp: number, days: number) =>
    aggregatePvProfileByResolution(getPvProfile(pvKwp, days), 60);

  const result = optimizeSystem({
    consumptionProfile: reportConsumptionProfile,
    targetSelfConsumptionPercent: getTargetSelfConsumptionPercent(body.target),
    goal: getOptimizationGoal(body.target),
    pvProfileFactory: optimizationPvProfileFactory,
  });

  if (!body.includeReport) {
    return NextResponse.json({
      summary: result.bestSummary,
      testedResults: result.testedResults,
      address: body.address ?? "",
      pvDataSource,
      consumptionDataSource,
    });
  }

  const reportPvKwp =
    result.bestSummary.roundedRecommendedPvKwp ??
    result.bestSummary.recommendedPvKwp;
  const reportBatteryKwh =
    result.bestSummary.roundedRecommendedBatteryKwh ??
    result.bestSummary.recommendedBatteryKwh;
  const reportDays = Math.max(
    1,
    reportConsumptionProfile.reduce(
      (sum, point) => sum + (point.originalResolutionMinutes ?? 60),
      0,
    ) / 1440,
  );

  const reportPvProfile = optimizationPvProfileFactory(reportPvKwp, reportDays);

  const detailedSimulation = simulateEnergySystem({
    consumptionProfile: reportConsumptionProfile,
    pvProfile: reportPvProfile,
    battery: createDefaultBatteryConfig(reportBatteryKwh),
    pvKwp: reportPvKwp,
    batteryKwh: reportBatteryKwh,
    keepMinuteResults: true,
  });

  return NextResponse.json({
    summary: result.bestSummary,
    testedResults: result.testedResults,
    address: body.address ?? "",
    pvDataSource,
    consumptionDataSource,
    reportSeries: createReportSeries(detailedSimulation.results),
  });
}
