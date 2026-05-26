import { defaultAdvancedEngineConfig, type AdvancedOptimizationResult, type AdvancedSystemResult } from "@/lib/energy/advanced";
import type {
  SimulationReportPeriod,
  SimulationReportSeries,
  SimulationSummary,
} from "@/types/energy";

type PdfPvDataSource = {
  label?: string;
  provider?: string;
  source?: "pvgis" | "mock";
  note?: string;
  latitude?: number;
  longitude?: number;
};

type PdfConsumptionDataSource = {
  label?: string;
  annualConsumptionKwh?: number;
  uploadedRows?: number;
  coverageDays?: number;
  fileName?: string;
  note?: string;
};

export type PdfReportInput = {
  summary: SimulationSummary;
  address?: string;
  pvDataSource?: PdfPvDataSource;
  consumptionDataSource?: PdfConsumptionDataSource;
  reportSeries: SimulationReportSeries;
  advanced?: AdvancedOptimizationResult;
};

type JsPdfDocument = InstanceType<typeof import("jspdf").jsPDF>;

type PdfColor = [number, number, number];

type EnergySegment = {
  label: string;
  value: number;
  color: PdfColor;
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  dark: [23, 59, 71] as PdfColor,
  green: [31, 77, 58] as PdfColor,
  softGreen: [121, 169, 125] as PdfColor,
  gold: [212, 168, 50] as PdfColor,
  cream: [247, 244, 236] as PdfColor,
  border: [220, 231, 223] as PdfColor,
  text: [31, 41, 51] as PdfColor,
  muted: [82, 97, 93] as PdfColor,
  loss: [184, 195, 184] as PdfColor,
};

function setFillColor(doc: JsPdfDocument, color: PdfColor) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function setTextColor(doc: JsPdfDocument, color: PdfColor) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setDrawColor(doc: JsPdfDocument, color: PdfColor) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function formatNumber(value: number | undefined, digits = 0) {
  return new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number.isFinite(value ?? Number.NaN) ? value ?? 0 : 0);
}

function formatKwh(value: number | undefined) {
  return `${formatNumber(value)} kWh`;
}

function formatKwp(value: number | undefined) {
  return `${formatNumber(value, 1)} kWp`;
}

function formatKwhPlain(value: number | undefined) {
  return `${formatNumber(value, 1)} kWh`;
}

function formatEuro(value: number | undefined) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value ?? Number.NaN) ? value ?? 0 : 0);
}

function formatPercent(value: number | undefined) {
  return `${formatNumber(value, 1)}%`;
}

function formatYears(value: number | null | undefined) {
  if (!value || !Number.isFinite(value)) return "n/d";
  return `${formatNumber(value, 1)} anni`;
}

function formatEuroPerKwh(value: number) {
  return `${formatNumber(value, 4)} €/kWh`;
}

function formatEuroPerKwp(value: number) {
  return `${formatEuro(value)} / kWp`;
}

function ensurePage(doc: JsPdfDocument, y: number, neededHeight: number) {
  if (y + neededHeight <= PAGE_HEIGHT - MARGIN) return y;
  doc.addPage();
  return MARGIN;
}

function addWrappedText(
  doc: JsPdfDocument,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 4.8,
) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function addFooter(doc: JsPdfDocument) {
  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextColor(doc, COLORS.muted);
    doc.text(
      `SolarScope - report preliminare FV con accumulo - pagina ${page}/${totalPages}`,
      MARGIN,
      PAGE_HEIGHT - 9,
    );
  }
}

function addSectionTitle(doc: JsPdfDocument, title: string, y: number) {
  const nextY = ensurePage(doc, y, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setTextColor(doc, COLORS.green);
  doc.text(title, MARGIN, nextY);

  setDrawColor(doc, COLORS.border);
  doc.line(MARGIN, nextY + 4, PAGE_WIDTH - MARGIN, nextY + 4);

  return nextY + 12;
}

function drawMetricBox(
  doc: JsPdfDocument,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  tone: "green" | "gold" | "neutral" = "neutral",
) {
  const fill =
    tone === "green"
      ? [238, 245, 239]
      : tone === "gold"
        ? [255, 247, 215]
        : COLORS.cream;

  doc.setFillColor(fill[0], fill[1], fill[2]);
  doc.roundedRect(x, y, width, 25, 4, 4, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.muted);
  doc.text(label, x + 4, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setTextColor(doc, COLORS.text);
  doc.text(value, x + 4, y + 18);
}

function getReportConfig(input: PdfReportInput) {
  return input.advanced?.usedConfig ?? defaultAdvancedEngineConfig;
}

function getRecommendedAdvancedResult(input: PdfReportInput): AdvancedSystemResult | undefined {
  return (
    input.advanced?.recommendedDomestic ??
    input.advanced?.domesticScenario.bestCompromise ??
    input.advanced?.domesticScenario.bestNetBalance ??
    input.advanced?.freeScenario.bestNetBalance
  );
}

function getBatteryLossesKwh(
  summary: SimulationSummary,
  advanced?: AdvancedSystemResult,
) {
  if (advanced) {
    return Math.max(0, advanced.batteryLossesKwh);
  }

  return Math.max(
    0,
    summary.annualPvProductionKwh -
      summary.directSelfConsumptionKwh -
      summary.batterySelfConsumptionKwh -
      summary.gridExportKwh,
  );
}

function addExecutiveSummary(
  doc: JsPdfDocument,
  input: PdfReportInput,
  advanced?: AdvancedSystemResult,
) {
  const summary = input.summary;

  setFillColor(doc, COLORS.dark);
  doc.rect(0, 0, PAGE_WIDTH, 58, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(242, 201, 76);
  doc.text("REPORT PRELIMINARE FV CON ACCUMULO", MARGIN, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("SolarScope - simulazione energetica", MARGIN, 31);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(230, 236, 232);
  const location = input.address?.trim() ? input.address : "Località inserita";
  doc.text(`Località: ${location}`, MARGIN, 43);

  let y = 72;

  drawMetricBox(doc, "FV consigliato", formatKwp(summary.recommendedPvKwp), MARGIN, y, 40, "green");
  drawMetricBox(doc, "Accumulo", formatKwhPlain(summary.recommendedBatteryKwh), MARGIN + 46, y, 40, "neutral");
  drawMetricBox(doc, "Autosufficienza", formatPercent(summary.selfSufficiencyPercent), MARGIN + 92, y, 40, "green");
  drawMetricBox(doc, "Payback", formatYears(summary.simplePaybackYears), MARGIN + 138, y, 40, "gold");

  y += 38;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setTextColor(doc, COLORS.green);
  doc.text("Sintesi tecnica", MARGIN, y);

  y += 8;

  const locallyUsedPvKwh =
    summary.directSelfConsumptionKwh + summary.batterySelfConsumptionKwh;

  const lines = [
    `Il dimensionamento consigliato è ${formatKwp(summary.recommendedPvKwp)} di fotovoltaico e ${formatKwhPlain(summary.recommendedBatteryKwh)} di accumulo.`,
    `L'impianto copre circa il ${formatPercent(summary.selfSufficiencyPercent)} dei consumi annui e usa localmente il ${formatPercent(summary.selfConsumptionPercent)} della produzione FV.`,
    `La produzione FV stimata è ${formatKwh(summary.annualPvProductionKwh)} all'anno. Di questi, circa ${formatKwh(locallyUsedPvKwh)} vengono usati dalla casa direttamente o tramite batteria.`,
    `Il prelievo residuo dalla rete è ${formatKwh(summary.gridImportKwh)}, mentre l'energia immessa è ${formatKwh(summary.gridExportKwh)}.`,
    `Il payback è calcolato usando risparmio da autoconsumo, valore dell'energia immessa, manutenzione, detrazione fiscale e sostituzione batteria se prevista.`,
  ];

  if (advanced) {
    lines.push(
      `Saldo netto a ${input.advanced?.usedConfig.economics.analysisYears ?? 20} anni: ${formatEuro(advanced.netBalance20YearsEur)}. ROI: ${formatPercent(advanced.roi20YearsPercent)}.`,
    );
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setTextColor(doc, COLORS.muted);

  for (const line of lines) {
    y = addWrappedText(doc, `• ${line}`, MARGIN, y, CONTENT_WIDTH, 5);
    y += 1;
  }

  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextColor(doc, COLORS.text);
  doc.text("Fonti dati", MARGIN, y);

  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.muted);

  const pvSource = `${input.pvDataSource?.label ?? "Produzione FV stimata"}${
    input.pvDataSource?.provider ? ` - ${input.pvDataSource.provider}` : ""
  }`;
  const consumptionSource = `${input.consumptionDataSource?.label ?? "Consumi inseriti"}${
    input.consumptionDataSource?.fileName ? ` - file: ${input.consumptionDataSource.fileName}` : ""
  }`;

  y = addWrappedText(doc, `Produzione FV: ${pvSource}`, MARGIN, y, CONTENT_WIDTH, 4.5);
  y = addWrappedText(doc, `Consumi: ${consumptionSource}`, MARGIN, y + 1, CONTENT_WIDTH, 4.5);

  return y + 6;
}

function addEconomicAssumptions(doc: JsPdfDocument, input: PdfReportInput, y: number) {
  const config = getReportConfig(input);
  const economics = config.economics;
  const domestic = config.domesticConstraints;

  y = addSectionTitle(doc, "Parametri usati nella simulazione", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.muted);
  y = addWrappedText(
    doc,
    "Questi valori sono le ipotesi usate dal nuovo algoritmo. Non sono un preventivo commerciale: servono a confrontare le taglie in modo coerente e vanno verificati con prezzi reali, incentivi e sopralluogo.",
    MARGIN,
    y,
    CONTENT_WIDTH,
    4.5,
  );

  y += 4;

  const rows: Array<[string, string]> = [
    ["Energia acquistata dalla rete", formatEuroPerKwh(economics.gridImportPriceEurPerKwh)],
    ["Energia immessa in rete", formatEuroPerKwh(economics.gridExportValueEurPerKwh)],
    ["Costo materiali FV", formatEuroPerKwp(economics.pvMaterialCostEurPerKwp)],
    ["Costi fissi impianto", formatEuro(economics.fixedSystemCostEur)],
    ["Manodopera base", formatEuro(economics.baseLaborCostEur)],
    ["Manodopera variabile", formatEuroPerKwp(economics.laborCostEurPerKwp)],
    [
      "Manutenzione annua",
      `${formatEuro(economics.annualFixedMaintenanceEur)} + ${formatEuro(economics.annualPvMaintenanceEurPerKwp)}/kWp + ${formatEuro(economics.annualBatteryMaintenanceEurPerKwh)}/kWh batteria`,
    ],
    [
      "Detrazione fiscale",
      economics.taxDeductionEnabled
        ? `${formatPercent(economics.taxDeductionRate * 100)} in ${economics.taxDeductionYears} anni`
        : "Non considerata",
    ],
    [
      "Sostituzione batteria",
      `anno ${economics.batteryReplacementYear}, ${formatPercent(economics.batteryReplacementCostFactor * 100)} del costo iniziale`,
    ],
    ["Durata analisi economica", `${economics.analysisYears} anni`],
    [
      "Vincolo domestico FV/consumi",
      `max ${formatNumber(domestic.maxProductionToConsumptionRatio, 1)} volte i consumi`,
    ],
    ["Autoconsumo minimo domestico", formatPercent(domestic.minUsefulSelfConsumptionPercent)],
  ];

  for (const [label, value] of rows) {
    y = ensurePage(doc, y, 9);
    setDrawColor(doc, COLORS.border);
    doc.line(MARGIN, y + 2, PAGE_WIDTH - MARGIN, y + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextColor(doc, COLORS.muted);
    doc.text(label, MARGIN, y);

    doc.setFont("helvetica", "bold");
    setTextColor(doc, COLORS.text);
    doc.text(value, PAGE_WIDTH - MARGIN, y, { align: "right" });

    y += 8;
  }

  y += 5;
  y = ensurePage(doc, y, 40);

  const inverterTable = economics.inverterCostTable
    .map((point) => `${formatNumber(point.size, 1)} kWp: ${formatEuro(point.costEur)}`)
    .join(" | ");

  const batteryTable = economics.batteryCostTable
    .map((point) => `${formatNumber(point.size, point.size % 1 === 0 ? 0 : 1)} kWh: ${formatEuro(point.costEur)}`)
    .join(" | ");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setTextColor(doc, COLORS.text);
  doc.text("Tabella inverter", MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.muted);
  y = addWrappedText(doc, inverterTable, MARGIN, y + 5, CONTENT_WIDTH, 4);

  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setTextColor(doc, COLORS.text);
  doc.text("Tabella batterie", MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.muted);
  y = addWrappedText(doc, batteryTable, MARGIN, y + 5, CONTENT_WIDTH, 4);

  return y + 6;
}

function drawStackedBar(
  doc: JsPdfDocument,
  title: string,
  segments: EnergySegment[],
  total: number,
  y: number,
) {
  y = ensurePage(doc, y, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextColor(doc, COLORS.text);
  doc.text(title, MARGIN, y);

  y += 6;

  const barHeight = 8;
  let x = MARGIN;

  for (const segment of segments) {
    const width = Math.max(0, (segment.value / Math.max(total, 1)) * CONTENT_WIDTH);
    setFillColor(doc, segment.color);
    doc.rect(x, y, width, barHeight, "F");
    x += width;
  }

  y += 16;

  const columnWidth = CONTENT_WIDTH / 2;

  segments.forEach((segment, index) => {
    const itemX = MARGIN + (index % 2) * columnWidth;
    const itemY = y + Math.floor(index / 2) * 8;

    setFillColor(doc, segment.color);
    doc.rect(itemX, itemY - 3, 3, 3, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextColor(doc, COLORS.muted);
    doc.text(`${segment.label}: ${formatKwh(segment.value)}`, itemX + 5, itemY);
  });

  return y + Math.ceil(segments.length / 2) * 8 + 4;
}

function addAnnualBalance(
  doc: JsPdfDocument,
  input: PdfReportInput,
  advanced?: AdvancedSystemResult,
  y = MARGIN,
) {
  const summary = input.summary;
  const batteryLossesKwh = getBatteryLossesKwh(summary, advanced);
  const locallyUsedPvKwh =
    summary.directSelfConsumptionKwh + summary.batterySelfConsumptionKwh;

  y = addSectionTitle(doc, "Bilancio annuale simulato", y);

  y = drawStackedBar(
    doc,
    "Copertura dei consumi domestici",
    [
      { label: "FV diretto", value: summary.directSelfConsumptionKwh, color: COLORS.green },
      { label: "Da batteria", value: summary.batterySelfConsumptionKwh, color: COLORS.softGreen },
      { label: "Da rete", value: summary.gridImportKwh, color: COLORS.gold },
    ],
    summary.annualConsumptionKwh,
    y,
  );

  y = drawStackedBar(
    doc,
    "Utilizzo della produzione fotovoltaica",
    [
      { label: "Uso diretto", value: summary.directSelfConsumptionKwh, color: COLORS.green },
      { label: "Energia utile da batteria", value: summary.batterySelfConsumptionKwh, color: COLORS.softGreen },
      { label: "Perdite accumulo", value: batteryLossesKwh, color: COLORS.loss },
      { label: "Immissione in rete", value: summary.gridExportKwh, color: COLORS.dark },
    ],
    summary.annualPvProductionKwh,
    y + 4,
  );

  y += 2;
  y = addSectionTitle(doc, "Dettaglio numerico", y);

  const rows: Array<[string, string]> = [
    ["Consumo annuo", formatKwh(summary.annualConsumptionKwh)],
    ["Produzione FV annua", formatKwh(summary.annualPvProductionKwh)],
    ["Autoconsumo diretto", formatKwh(summary.directSelfConsumptionKwh)],
    ["Energia fornita dalla batteria", formatKwh(summary.batterySelfConsumptionKwh)],
    ["Perdite accumulo", formatKwh(batteryLossesKwh)],
    ["Energia FV usata localmente", formatKwh(locallyUsedPvKwh)],
    ["Prelievo dalla rete", formatKwh(summary.gridImportKwh)],
    ["Immissione in rete", formatKwh(summary.gridExportKwh)],
    ["Autoconsumo FV", formatPercent(summary.selfConsumptionPercent)],
    ["Autosufficienza energetica", formatPercent(summary.selfSufficiencyPercent)],
    ["Investimento stimato", formatEuro(summary.estimatedInvestmentEur)],
    ["Beneficio operativo annuo", formatEuro(summary.annualEnergySavingsEur)],
    ["Payback", formatYears(summary.simplePaybackYears)],
  ];

  if (advanced) {
    rows.push(
      ["Saldo netto 20 anni", formatEuro(advanced.netBalance20YearsEur)],
      ["ROI 20 anni", formatPercent(advanced.roi20YearsPercent)],
      ["Detrazione fiscale recuperata", formatEuro(advanced.taxDeductionRecoveredEur)],
      ["Sostituzione batteria prevista", formatEuro(advanced.batteryReplacementCostEur)],
    );
  }

  for (const [label, value] of rows) {
    y = ensurePage(doc, y, 8);
    setDrawColor(doc, COLORS.border);
    doc.line(MARGIN, y + 2, PAGE_WIDTH - MARGIN, y + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextColor(doc, COLORS.muted);
    doc.text(label, MARGIN, y);

    doc.setFont("helvetica", "bold");
    setTextColor(doc, COLORS.text);
    doc.text(value, PAGE_WIDTH - MARGIN, y, { align: "right" });

    y += 8;
  }

  return y + 6;
}

function drawMonthlyBars(
  doc: JsPdfDocument,
  title: string,
  data: SimulationReportPeriod[],
  firstKey: keyof SimulationReportPeriod,
  firstLabel: string,
  secondKey: keyof SimulationReportPeriod,
  secondLabel: string,
  y: number,
) {
  y = ensurePage(doc, y, 82);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextColor(doc, COLORS.text);
  doc.text(title, MARGIN, y);

  y += 7;

  if (!data.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextColor(doc, COLORS.muted);
    return addWrappedText(doc, "Dati mensili non disponibili.", MARGIN, y, CONTENT_WIDTH, 4.5) + 5;
  }

  const chartX = MARGIN + 18;
  const chartY = y;
  const chartWidth = CONTENT_WIDTH - 18;
  const chartHeight = 46;

  const values = data.flatMap((item) => [
    Number(item[firstKey]),
    Number(item[secondKey]),
  ]);

  const maxValue = Math.max(...values, 1);
  const groupWidth = chartWidth / data.length;
  const barWidth = Math.max(2, groupWidth * 0.26);

  setDrawColor(doc, COLORS.border);
  doc.rect(chartX, chartY, chartWidth, chartHeight);

  data.forEach((item, index) => {
    const firstValue = Number(item[firstKey]);
    const secondValue = Number(item[secondKey]);

    const firstHeight = (firstValue / maxValue) * (chartHeight - 6);
    const secondHeight = (secondValue / maxValue) * (chartHeight - 6);

    const baseX = chartX + index * groupWidth + groupWidth * 0.26;
    const baseY = chartY + chartHeight;

    setFillColor(doc, COLORS.green);
    doc.rect(baseX, baseY - firstHeight, barWidth, firstHeight, "F");

    setFillColor(doc, COLORS.gold);
    doc.rect(baseX + barWidth + 1, baseY - secondHeight, barWidth, secondHeight, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    setTextColor(doc, COLORS.muted);
    doc.text(item.label.slice(0, 3), chartX + index * groupWidth + groupWidth / 2, chartY + chartHeight + 5, {
      align: "center",
    });
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.muted);
  doc.text(`Scala max: ${formatKwh(maxValue)}`, MARGIN, chartY + 5);

  setFillColor(doc, COLORS.green);
  doc.rect(MARGIN, chartY + chartHeight + 12, 3, 3, "F");
  setTextColor(doc, COLORS.muted);
  doc.text(firstLabel, MARGIN + 5, chartY + chartHeight + 15);

  setFillColor(doc, COLORS.gold);
  doc.rect(MARGIN + 60, chartY + chartHeight + 12, 3, 3, "F");
  doc.text(secondLabel, MARGIN + 65, chartY + chartHeight + 15);

  return chartY + chartHeight + 24;
}

function addCharts(doc: JsPdfDocument, input: PdfReportInput, y: number) {
  const monthly = input.reportSeries.monthly ?? [];

  y = addSectionTitle(doc, "Grafici e andamento energetico", y);

  y = drawMonthlyBars(
    doc,
    "Consumi e produzione FV - andamento mensile",
    monthly,
    "consumptionKwh",
    "Consumi mensili",
    "pvProductionKwh",
    "Produzione FV mensile",
    y,
  );

  y = drawMonthlyBars(
    doc,
    "Rete elettrica - prelievo e immissione mensile",
    monthly,
    "gridImportKwh",
    "Prelievo dalla rete",
    "gridExportKwh",
    "Immissione in rete",
    y + 4,
  );

  return y;
}

function addNextStepsAndLimits(doc: JsPdfDocument, y: number) {
  y = addSectionTitle(doc, "Prossimi passi consigliati", y);

  const steps = [
    "Verificare superficie disponibile, orientamento, inclinazione e ombreggiamenti del tetto.",
    "Controllare potenza impegnata, quadro elettrico, spazio per inverter e batteria.",
    "Confrontare la taglia consigliata con un preventivo reale e con eventuali incentivi disponibili.",
    "Ricalcolare il risultato con consumi reali completi se il file caricato copre solo una parte dell'anno.",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.muted);

  for (let index = 0; index < steps.length; index += 1) {
    y = addWrappedText(doc, `${index + 1}. ${steps[index]}`, MARGIN, y, CONTENT_WIDTH, 4.6);
    y += 2;
  }

  y += 4;
  y = addSectionTitle(doc, "Limiti della stima", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.muted);

  return addWrappedText(
    doc,
    "Questo report è una stima preliminare generata automaticamente. Non sostituisce un progetto tecnico, un sopralluogo, una verifica strutturale o elettrica, né un'offerta commerciale. Orientamento, inclinazione, ombreggiamenti, vincoli di rete, incentivi, prezzi reali, manutenzione e abitudini di consumo possono modificare il risultato finale.",
    MARGIN,
    y,
    CONTENT_WIDTH,
    4.6,
  );
}

export async function createSimulationPdfReport(input: PdfReportInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const advancedRecommended = getRecommendedAdvancedResult(input);

  addExecutiveSummary(doc, input, advancedRecommended);

  doc.addPage();
  let y = MARGIN;
  y = addEconomicAssumptions(doc, input, y);

  doc.addPage();
  y = MARGIN;
  y = addAnnualBalance(doc, input, advancedRecommended, y);

  doc.addPage();
  y = MARGIN;
  y = addCharts(doc, input, y);

  doc.addPage();
  y = MARGIN;
  addNextStepsAndLimits(doc, y);

  addFooter(doc);

  return {
    doc,
    fileName: `solarscope-report-fv-accumulo-${new Date().toISOString().slice(0, 10)}.pdf`,
  };
}

export async function downloadSimulationPdfReport(input: PdfReportInput) {
  const { doc, fileName } = await createSimulationPdfReport(input);
  const blob = doc.output("blob") as Blob;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
