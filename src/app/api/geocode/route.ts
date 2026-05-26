import { NextRequest, NextResponse } from "next/server";

import { geocodeAddressCandidates } from "@/lib/geo/geocode-address";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 3) {
    return NextResponse.json({
      results: [],
      message: "Scrivi almeno 3 caratteri per cercare una località.",
    });
  }

  const results = await geocodeAddressCandidates(query, 6);

  return NextResponse.json({
    results: results.map((result) => {
      const isHighLatitude = Math.abs(result.latitude) >= 60;

      return {
        ...result,
        isHighLatitude,
        note: isHighLatitude
          ? "Località ad alta latitudine: PVGIS può usare dataset/reanalysis più indicativi."
          : undefined,
      };
    }),
  });
}
