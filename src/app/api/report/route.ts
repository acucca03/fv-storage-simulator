import { NextRequest, NextResponse } from "next/server";

import {
  createSimulationPdfReport,
  type PdfReportInput,
} from "@/lib/report/generate-simulation-pdf-report";

export const runtime = "nodejs";

async function readPdfReportInput(request: NextRequest): Promise<PdfReportInput> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as PdfReportInput;
  }

  const formData = await request.formData();
  const payload = formData.get("payload");

  if (typeof payload !== "string") {
    throw new Error("Payload report mancante.");
  }

  return JSON.parse(payload) as PdfReportInput;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const input = await readPdfReportInput(request);
    const { doc, fileName } = await createSimulationPdfReport(input);
    const pdfArrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
    const safeFileName = sanitizeFileName(fileName);

    return new NextResponse(Buffer.from(pdfArrayBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Errore durante la generazione del report PDF.",
      },
      { status: 400 },
    );
  }
}
