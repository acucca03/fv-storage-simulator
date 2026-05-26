import { ENERGY_ECONOMIC_ASSUMPTIONS } from "@/lib/energy/economics/economic-assumptions";
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

type EnergyBarSegment = {
  label: string;
  value: number;
  color: [number, number, number];
};

export type PdfReportInput = {
  summary: SimulationSummary;
  address?: string;
  pvDataSource?: PdfPvDataSource;
  consumptionDataSource?: PdfConsumptionDataSource;
  reportSeries: SimulationReportSeries;
};

type JsPdfDocument = InstanceType<typeof import("jspdf").jsPDF>;

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  dark: [23, 59, 71] as [number, number, number],
  green: [31, 77, 58] as [number, number, number],
  softGreen: [121, 169, 125] as [number, number, number],
  gold: [212, 168, 50] as [number, number, number],
  cream: [247, 244, 236] as [number, number, number],
  border: [220, 231, 223] as [number, number, number],
  text: [31, 41, 51] as [number, number, number],
  muted: [82, 97, 93] as [number, number, number],
};

function setFillColor(doc: JsPdfDocument, color: [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function setTextColor(doc: JsPdfDocument, color: [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setDrawColor(doc: JsPdfDocument, color: [number, number, number]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("it-IT", {
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatKwh(value: number) {
  return `${formatNumber(value)} kWh`;
}

function formatKwp(value: number) {
  return formatNumber(value, 1);
}

function formatEuro(value: number | undefined) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value ?? Number.NaN) ? value ?? 0 : 0);
}

function formatPercent(value: number) {
  return `${formatNumber(value, 1)}%`;
}

function formatYears(value: number | undefined) {
  if (!value || !Number.isFinite(value)) return "n/d";

  return `${formatNumber(value, 1)} anni`;
}

function ensurePage(doc: JsPdfDocument, y: number, neededHeight: number) {
  if (y + neededHeight <= PAGE_HEIGHT - MARGIN) return y;

  doc.addPage();
  return MARGIN;
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

function addWrappedText(
  doc: JsPdfDocument,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 5,
) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function addSectionTitle(doc: JsPdfDocument, title: string, y: number) {
  const nextY = ensurePage(doc, y, 22);

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

function drawInfoCard(
  doc: JsPdfDocument,
  title: string,
  body: string,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  setFillColor(doc, COLORS.cream);
  doc.roundedRect(x, y, width, height, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setTextColor(doc, COLORS.text);
  doc.text(title, x + 5, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextColor(doc, COLORS.muted);
  addWrappedText(doc, body, x + 5, y + 16, width - 10, 4.2);
}

function getExecutiveJudgement(summary: SimulationSummary) {
  const payback = summary.simplePaybackYears;

  if (payback && Number.isFinite(payback) && payback <= 10) {
    return {
      label: "Scenario interessante",
      text: "La simulazione mostra un equilibrio favorevole tra investimento, autoconsumo e rientro economico. Il risultato merita una verifica tecnica con dati reali di tetto, esposizione e preventivo.",
    };
  }

  if (payback && Number.isFinite(payback) && payback <= 16) {
    return {
      label: "Scenario da verificare",
      text: "Il risultato è tecnicamente valido, ma il rientro economico dipende molto dal prezzo reale dell'impianto, dagli incentivi disponibili e dal profilo di consumo effettivo della casa.",
    };
  }

  return {
    label: "Scenario preliminare prudente",
    text: "Il sistema migliora l'autonomia energetica, ma il tempo di rientro risulta lungo. Prima di decidere conviene verificare costi reali, incentivi, taglia della batteria e abitudini di consumo.",
  };
}

function getAutomaticAnalysis(input: PdfReportInput) {
  const { summary } = input;
  const locallyUsedPvKwh =
    summary.directSelfConsumptionKwh + summary.batterySelfConsumptionKwh;

  const analysis = [
    `Il dimensionamento consigliato è pari a ${formatKwp(summary.recommendedPvKwp)} kWp di fotovoltaico e ${formatKwp(summary.recommendedBatteryKwh)} kWh di accumulo.`,
    `L'impianto copre circa il ${formatPercent(summary.selfSufficiencyPercent)} dei consumi annui e usa localmente il ${formatPercent(summary.selfConsumptionPercent)} della produzione FV.`,
    `La produzione FV stimata è pari a ${formatKwh(summary.annualPvProductionKwh)} all'anno. Di questi, circa ${formatKwh(locallyUsedPvKwh)} vengono usati dalla casa direttamente o tramite batteria.`,
    `Il prelievo residuo dalla rete è pari a ${formatKwh(summary.gridImportKwh)}, mentre l'energia immessa è pari a ${formatKwh(summary.gridExportKwh)}.`,
  ];

  if (summary.simplePaybackYears && Number.isFinite(summary.simplePaybackYears)) {
    analysis.push(
      `Il tempo di rientro semplice stimato è circa ${formatYears(summary.simplePaybackYears)}, calcolato con le ipotesi economiche dichiarate nel simulatore.`,
    );
  }

  if (input.pvDataSource?.source === "pvgis") {
    analysis.push(
      "La produzione FV è stata costruita usando una serie oraria PVGIS scalata sulla taglia scelta.",
    );
  } else {
    analysis.push(
      "La produzione FV usa un profilo interno di fallback: il risultato è indicativo e va verificato con dati solari più precisi.",
    );
  }

  return analysis;
}

function drawGroupedBarChart(params: {
  doc: JsPdfDocument;
  title: string;
  subtitle: string;
  data: SimulationReportPeriod[];
  y: number;
  firstKey: keyof SimulationReportPeriod;
  firstLabel: string;
  secondKey: keyof SimulationReportPeriod;
  secondLabel: string;
}) {
  const { doc } = params;
  let y = ensurePage(doc, params.y, 96);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextColor(doc, COLORS.text);
  doc.text(params.title, MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextColor(doc, COLORS.muted);
  y = addWrappedText(doc, params.subtitle, MARGIN, y + 5, CONTENT_WIDTH, 4);

  y += 3;

  const axisWidth = 18;
  const chartX = MARGIN + axisWidth;
  const chartY = y;
  const chartWidth = CONTENT_WIDTH - axisWidth;
  const chartHeight = 50;

  const values = params.data.flatMap((item) => [
    Number(item[params.firstKey]),
    Number(item[params.secondKey]),
  ]);

  const rawMaxValue = Math.max(...values, 1);
  const maxValue = Math.ceil(rawMaxValue / 50) * 50;
  const axisValues = [
    maxValue,
    maxValue * 0.75,
    maxValue * 0.5,
    maxValue * 0.25,
    0,
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextColor(doc, COLORS.muted);

  axisValues.forEach((value, index) => {
    const tickY = chartY + (chartHeight / (axisValues.length - 1)) * index;
    doc.text(`${formatNumber(value)} kWh`, MARGIN, tickY + 2);
  });

  setDrawColor(doc, [230, 238, 232]);
  doc.rect(chartX, chartY, chartWidth, chartHeight);

  axisValues.forEach((_, index) => {
    const gridY = chartY + (chartHeight / (axisValues.length - 1)) * index;
    setDrawColor(doc, [238, 243, 239]);
    doc.line(chartX, gridY, chartX + chartWidth, gridY);
  });

  const groupWidth = chartWidth / Math.max(params.data.length, 1);
  const barWidth = Math.max(2.5, groupWidth * 0.28);

  params.data.forEach((item, index) => {
    const firstValue = Number(item[params.firstKey]);
    const secondValue = Number(item[params.secondKey]);

    const firstHeight = (firstValue / maxValue) * (chartHeight - 8);
    const secondHeight = (secondValue / maxValue) * (chartHeight - 8);

    const baseX = chartX + index * groupWidth + groupWidth * 0.24;
    const baseY = chartY + chartHeight;

    setFillColor(doc, COLORS.green);
    doc.rect(baseX, baseY - firstHeight, barWidth, firstHeight, "F");

    setFillColor(doc, COLORS.gold);
    doc.rect(baseX + barWidth + 1.4, baseY - secondHeight, barWidth, secondHeight, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    setTextColor(doc, COLORS.muted);
    doc.text(item.label, baseX - 1, chartY + chartHeight + 5, {
      angle: 35,
    });
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextColor(doc, COLORS.muted);
  doc.text("Scala: kWh/mese", chartX, chartY - 2);

  setFillColor(doc, COLORS.green);
  doc.rect(chartX, chartY + chartHeight + 14, 4, 4, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.muted);
  doc.text(params.firstLabel, chartX + 6, chartY + chartHeight + 18);

  setFillColor(doc, COLORS.gold);
  doc.rect(chartX + 58, chartY + chartHeight + 14, 4, 4, "F");
  doc.text(params.secondLabel, chartX + 64, chartY + chartHeight + 18);

  return chartY + chartHeight + 25;
}

function drawLineChart(params: {
  doc: JsPdfDocument;
  title: string;
  subtitle: string;
  data: SimulationReportPeriod[];
  y: number;
  keyName: keyof SimulationReportPeriod;
  label: string;
}) {
  const { doc } = params;
  let y = ensurePage(doc, params.y, 96);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextColor(doc, COLORS.text);
  doc.text(params.title, MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextColor(doc, COLORS.muted);
  y = addWrappedText(doc, params.subtitle, MARGIN, y + 5, CONTENT_WIDTH, 4);

  y += 3;

  const axisWidth = 18;
  const chartX = MARGIN + axisWidth;
  const chartY = y;
  const chartWidth = CONTENT_WIDTH - axisWidth;
  const chartHeight = 48;

  const values = params.data.map((item) => Number(item[params.keyName]));
  const rawMaxValue = Math.max(...values, 1);
  const maxValue = Math.ceil(rawMaxValue);
  const axisValues = [
    maxValue,
    maxValue * 0.75,
    maxValue * 0.5,
    maxValue * 0.25,
    0,
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextColor(doc, COLORS.muted);

  axisValues.forEach((value, index) => {
    const tickY = chartY + (chartHeight / (axisValues.length - 1)) * index;
    doc.text(`${formatNumber(value, 1)} kWh`, MARGIN, tickY + 2);
  });

  setDrawColor(doc, [230, 238, 232]);
  doc.rect(chartX, chartY, chartWidth, chartHeight);

  axisValues.forEach((_, index) => {
    const gridY = chartY + (chartHeight / (axisValues.length - 1)) * index;
    setDrawColor(doc, [238, 243, 239]);
    doc.line(chartX, gridY, chartX + chartWidth, gridY);
  });

  setDrawColor(doc, COLORS.green);
  doc.setLineWidth(0.8);

  params.data.forEach((item, index) => {
    if (index === 0 || params.data.length <= 1) return;

    const previous = params.data[index - 1];
    const previousValue = Number(previous[params.keyName]);
    const currentValue = Number(item[params.keyName]);

    const previousX = chartX + ((index - 1) / (params.data.length - 1)) * chartWidth;
    const currentX = chartX + (index / (params.data.length - 1)) * chartWidth;

    const previousY =
      chartY + chartHeight - (previousValue / maxValue) * (chartHeight - 8);
    const currentY =
      chartY + chartHeight - (currentValue / maxValue) * (chartHeight - 8);

    doc.line(previousX, previousY, currentX, currentY);
  });

  params.data.forEach((item, index) => {
    const value = Number(item[params.keyName]);
    const pointX =
      params.data.length <= 1
        ? chartX + chartWidth / 2
        : chartX + (index / (params.data.length - 1)) * chartWidth;
    const pointY =
      chartY + chartHeight - (value / maxValue) * (chartHeight - 8);

    setFillColor(doc, COLORS.green);
    doc.circle(pointX, pointY, 0.8, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    setTextColor(doc, COLORS.muted);
    doc.text(item.label, pointX, chartY + chartHeight + 6, {
      align: "center",
    });
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextColor(doc, COLORS.muted);
  doc.text("Scala: kWh medi in batteria", chartX, chartY - 2);
  doc.text("Mesi", chartX + chartWidth / 2, chartY + chartHeight + 13, {
    align: "center",
  });

  setFillColor(doc, COLORS.green);
  doc.rect(chartX, chartY + chartHeight + 18, 4, 4, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.muted);
  doc.text(params.label, chartX + 6, chartY + chartHeight + 22);

  return chartY + chartHeight + 28;
}

function drawAnnualEnergyBars(
  doc: JsPdfDocument,
  summary: SimulationSummary,
  y: number,
) {
  const nextY = ensurePage(doc, y, 72);
  const width = CONTENT_WIDTH;

  const demandTotal = Math.max(summary.annualConsumptionKwh, 1);
  const pvTotal = Math.max(summary.annualPvProductionKwh, 1);

  const demandSegments: EnergyBarSegment[] = [
    {
      label: "FV diretto",
      value: summary.directSelfConsumptionKwh,
      color: COLORS.green,
    },
    {
      label: "Da batteria",
      value: summary.batterySelfConsumptionKwh,
      color: COLORS.softGreen,
    },
    {
      label: "Da rete",
      value: summary.gridImportKwh,
      color: COLORS.gold,
    },
  ];

  const pvSegments: EnergyBarSegment[] = [
    {
      label: "Uso diretto",
      value: summary.directSelfConsumptionKwh,
      color: COLORS.green,
    },
    {
      label: "Batteria",
      value: summary.batterySelfConsumptionKwh,
      color: COLORS.softGreen,
    },
    {
      label: "Rete",
      value: summary.gridExportKwh,
      color: COLORS.dark,
    },
  ];

  const drawStack = (
    label: string,
    segments: EnergyBarSegment[],
    total: number,
    barY: number,
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setTextColor(doc, COLORS.text);
    doc.text(label, MARGIN, barY - 3);

    let x = MARGIN;

    segments.forEach((segment) => {
      const segmentWidth = (segment.value / total) * width;

      setFillColor(doc, segment.color);
      doc.rect(x, barY, segmentWidth, 8, "F");
      x += segmentWidth;
    });

    let legendX = MARGIN;

    segments.forEach((segment) => {
      setFillColor(doc, segment.color);
      doc.rect(legendX, barY + 14, 3, 3, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setTextColor(doc, COLORS.muted);
      doc.text(`${segment.label}: ${formatKwh(segment.value)}`, legendX + 5, barY + 17);

      legendX += 58;
    });
  };

  drawStack("Copertura dei consumi domestici", demandSegments, demandTotal, nextY + 8);
  drawStack("Utilizzo della produzione fotovoltaica", pvSegments, pvTotal, nextY + 42);

  return nextY + 76;
}

function addEconomicAssumptions(doc: JsPdfDocument, y: number) {
  let nextY = addSectionTitle(doc, "Ipotesi economiche usate", y);

  const rows = [
    [
      "Costo energia acquistata",
      `${formatNumber(ENERGY_ECONOMIC_ASSUMPTIONS.electricityPurchasePriceEurPerKwh, 2)} €/kWh`,
    ],
    [
      "Valore energia immessa",
      `${formatNumber(ENERGY_ECONOMIC_ASSUMPTIONS.exportedEnergyValueEurPerKwh, 2)} €/kWh`,
    ],
    [
      "Costo fotovoltaico",
      `${formatEuro(ENERGY_ECONOMIC_ASSUMPTIONS.pvCostEurPerKwp)} / kWp`,
    ],
    [
      "Costo accumulo",
      `${formatEuro(ENERGY_ECONOMIC_ASSUMPTIONS.batteryCostEurPerKwh)} / kWh`,
    ],
    [
      "Costo fisso impianto",
      formatEuro(ENERGY_ECONOMIC_ASSUMPTIONS.fixedInstallationCostEur),
    ],
  ];

  rows.forEach(([label, value]) => {
    nextY = ensurePage(doc, nextY, 9);
    setDrawColor(doc, [237, 241, 237]);
    doc.line(MARGIN, nextY + 2, PAGE_WIDTH - MARGIN, nextY + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextColor(doc, COLORS.muted);
    doc.text(label, MARGIN, nextY);

    doc.setFont("helvetica", "bold");
    setTextColor(doc, COLORS.text);
    doc.text(value, PAGE_WIDTH - MARGIN, nextY, { align: "right" });

    nextY += 8;
  });

  nextY += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextColor(doc, COLORS.muted);
  return addWrappedText(
    doc,
    "Questi valori sono ipotesi preliminari usate per confrontare le taglie. Preventivi reali, incentivi, manutenzione, condizioni di scambio e prezzi dell'energia possono modificare il tempo di rientro finale.",
    MARGIN,
    nextY,
    CONTENT_WIDTH,
    4.2,
  );
}

function addNextSteps(doc: JsPdfDocument, y: number) {
  let nextY = addSectionTitle(doc, "Prossimi passi consigliati", y);

  const steps = [
    "Verificare superficie disponibile, orientamento, inclinazione e ombreggiamenti del tetto.",
    "Controllare potenza impegnata, quadro elettrico, spazio per inverter e batteria.",
    "Confrontare la taglia consigliata con un preventivo reale e con eventuali incentivi disponibili.",
    "Ricalcolare il risultato con consumi reali completi se il file caricato copre solo una parte dell'anno.",
  ];

  steps.forEach((step, index) => {
    nextY = ensurePage(doc, nextY, 12);

    setFillColor(doc, COLORS.cream);
    doc.circle(MARGIN + 3, nextY - 2, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setTextColor(doc, COLORS.green);
    doc.text(String(index + 1), MARGIN + 1.6, nextY + 0.4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextColor(doc, COLORS.muted);
    nextY = addWrappedText(doc, step, MARGIN + 10, nextY, CONTENT_WIDTH - 10, 4.4);
    nextY += 2;
  });

  return nextY;
}




function drawPvLifetimeProductionChart(
  doc: JsPdfDocument,
  summary: PdfReportInput["summary"],
  y: number,
) {
  const usefulLifeYears = Math.max(1, Math.round(summary.pvUsefulLifeYears));
  const annualDegradationRate =
    ENERGY_ECONOMIC_ASSUMPTIONS.pvAnnualDegradationRate;
  const annualProductionKwh = Math.max(summary.annualPvProductionKwh, 0);

  const data = Array.from({ length: usefulLifeYears }, (_, index) => {
    const year = index + 1;
    return {
      year,
      productionKwh:
        annualProductionKwh * Math.pow(1 - annualDegradationRate, index),
    };
  });

  y = ensurePage(doc, y, 96);
  y = addSectionTitle(doc, "Produzione FV nel tempo", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.muted);
  y = addWrappedText(
    doc,
    `Il grafico mostra la produzione annua stimata dell'impianto FV durante la vita utile ipotizzata di ${formatNumber(usefulLifeYears, 0)} anni, considerando un degrado tecnico dei moduli pari a ${formatNumber(annualDegradationRate * 100, 2)}%/anno.`,
    MARGIN,
    y,
    CONTENT_WIDTH,
    4.8,
  );

  y += 6;
  y = ensurePage(doc, y, 82);

  const axisWidth = 25;
  const chartX = MARGIN + axisWidth;
  const chartY = y;
  const chartWidth = CONTENT_WIDTH - axisWidth;
  const chartHeight = 56;

  const values = data.map((item) => item.productionKwh);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, maxValue);

  const lowerBound = Math.max(0, Math.floor((minValue * 0.98) / 250) * 250);
  const upperBound = Math.ceil((maxValue * 1.02) / 250) * 250;
  const range = Math.max(upperBound - lowerBound, 1);

  const getX = (index: number) =>
    data.length <= 1
      ? chartX
      : chartX + (index / (data.length - 1)) * chartWidth;

  const getY = (value: number) =>
    chartY + chartHeight - ((value - lowerBound) / range) * (chartHeight - 8) - 4;

  setDrawColor(doc, [230, 238, 232]);
  doc.rect(chartX, chartY, chartWidth, chartHeight);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setTextColor(doc, COLORS.muted);

  const tickCount = 5;
  for (let index = 0; index < tickCount; index += 1) {
    const tickY = chartY + (chartHeight / (tickCount - 1)) * index;
    const tickValue = upperBound - (range / (tickCount - 1)) * index;

    setDrawColor(doc, [238, 243, 239]);
    doc.line(chartX, tickY, chartX + chartWidth, tickY);

    setTextColor(doc, COLORS.muted);
    doc.text(formatKwh(tickValue), MARGIN, tickY + 1.5);
  }

  setDrawColor(doc, COLORS.green);
  doc.setLineWidth(1.2);

  data.forEach((item, index) => {
    if (index === 0) return;

    const previous = data[index - 1];
    doc.line(
      getX(index - 1),
      getY(previous.productionKwh),
      getX(index),
      getY(item.productionKwh),
    );
  });

  setFillColor(doc, COLORS.green);
  data.forEach((item, index) => {
    if (index === 0 || index === data.length - 1 || item.year % 5 === 0) {
      doc.circle(getX(index), getY(item.productionKwh), 1.2, "F");
    }
  });

  doc.setLineWidth(0.2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.muted);

  const middleIndex = Math.floor((data.length - 1) / 2);
  const axisLabels = [
    { label: "Anno 1", index: 0 },
    { label: `Anno ${middleIndex + 1}`, index: middleIndex },
    { label: `Anno ${usefulLifeYears}`, index: data.length - 1 },
  ];

  axisLabels.forEach((item) => {
    doc.text(item.label, getX(item.index), chartY + chartHeight + 6, {
      align: "center",
    });
  });

  doc.text("Produzione annua FV stimata", chartX, chartY - 2);
  doc.text("Anni di vita utile FV", chartX + chartWidth / 2, chartY + chartHeight + 13, {
    align: "center",
  });

  const firstYearProduction = data[0]?.productionKwh ?? annualProductionKwh;
  const lastYearProduction = data[data.length - 1]?.productionKwh ?? annualProductionKwh;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.text);
  doc.text(
    `Anno 1: ${formatKwh(firstYearProduction)}  |  Anno ${usefulLifeYears}: ${formatKwh(lastYearProduction)}`,
    MARGIN,
    chartY + chartHeight + 22,
  );

  return chartY + chartHeight + 30;
}



function drawBatteryCapacityLifetimeChart(
  doc: JsPdfDocument,
  summary: PdfReportInput["summary"],
  y: number,
) {
  const batteryUsefulLifeYears = Math.max(0, summary.batteryUsefulLifeYears);
  const batteryCapacityKwh = Math.max(
    summary.roundedRecommendedBatteryKwh ??
      summary.recommendedBatteryKwh ??
      0,
    0,
  );
  const endOfLifeCapacityPercent =
    ENERGY_ECONOMIC_ASSUMPTIONS.batteryEndOfLifeCapacityPercent;
  const endOfLifeCapacityKwh =
    batteryCapacityKwh * (endOfLifeCapacityPercent / 100);

  if (batteryUsefulLifeYears <= 0 || batteryCapacityKwh <= 0) {
    return y;
  }

  const points = 16;
  const data = Array.from({ length: points }, (_, index) => {
    const ratio = index / (points - 1);
    const year = batteryUsefulLifeYears * ratio;
    const capacityKwh =
      batteryCapacityKwh -
      (batteryCapacityKwh - endOfLifeCapacityKwh) * ratio;

    return {
      year,
      capacityKwh,
    };
  });

  y = ensurePage(doc, y, 96);
  y = addSectionTitle(doc, "Capacità accumulo nel tempo", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.muted);
  y = addWrappedText(
    doc,
    `Il grafico mostra una stima semplificata della capacità utile residua dell'accumulo durante la vita utile calcolata di ${formatUsefulLifeYears(batteryUsefulLifeYears)}. La curva parte da ${formatNumber(batteryCapacityKwh, 1)} kWh e arriva a circa ${formatNumber(endOfLifeCapacityKwh, 1)} kWh, assumendo fine vita al ${formatNumber(endOfLifeCapacityPercent, 0)}% della capacità iniziale.`,
    MARGIN,
    y,
    CONTENT_WIDTH,
    4.8,
  );

  y += 6;
  y = ensurePage(doc, y, 82);

  const axisWidth = 25;
  const chartX = MARGIN + axisWidth;
  const chartY = y;
  const chartWidth = CONTENT_WIDTH - axisWidth;
  const chartHeight = 56;

  const lowerBound = 0;
  const upperBound = Math.max(Math.ceil(batteryCapacityKwh * 1.05), 1);
  const range = Math.max(upperBound - lowerBound, 1);

  const getX = (index: number) =>
    data.length <= 1
      ? chartX
      : chartX + (index / (data.length - 1)) * chartWidth;

  const getY = (value: number) =>
    chartY + chartHeight - ((value - lowerBound) / range) * (chartHeight - 8) - 4;

  setDrawColor(doc, [230, 238, 232]);
  doc.rect(chartX, chartY, chartWidth, chartHeight);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setTextColor(doc, COLORS.muted);

  const tickCount = 5;
  for (let index = 0; index < tickCount; index += 1) {
    const tickY = chartY + (chartHeight / (tickCount - 1)) * index;
    const tickValue = upperBound - (range / (tickCount - 1)) * index;

    setDrawColor(doc, [238, 243, 239]);
    doc.line(chartX, tickY, chartX + chartWidth, tickY);

    setTextColor(doc, COLORS.muted);
    doc.text(`${formatNumber(tickValue, 1)} kWh`, MARGIN, tickY + 1.5);
  }

  setDrawColor(doc, COLORS.green);
  doc.setLineWidth(1.2);

  data.forEach((item, index) => {
    if (index === 0) return;

    const previous = data[index - 1];

    doc.line(
      getX(index - 1),
      getY(previous.capacityKwh),
      getX(index),
      getY(item.capacityKwh),
    );
  });

  setFillColor(doc, COLORS.green);
  data.forEach((item, index) => {
    if (index === 0 || index === data.length - 1) {
      doc.circle(getX(index), getY(item.capacityKwh), 1.2, "F");
    }
  });

  doc.setLineWidth(0.2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.muted);

  const middleIndex = Math.floor((data.length - 1) / 2);
  const axisLabels = [
    { label: "Anno 0", index: 0 },
    {
      label: `${formatNumber(batteryUsefulLifeYears / 2, 1)} anni`,
      index: middleIndex,
    },
    {
      label: `${formatNumber(batteryUsefulLifeYears, 1)} anni`,
      index: data.length - 1,
    },
  ];

  axisLabels.forEach((item) => {
    doc.text(item.label, getX(item.index), chartY + chartHeight + 6, {
      align: "center",
    });
  });

  doc.text("Capacità utile accumulo", chartX, chartY - 2);
  doc.text("Anni di vita utile accumulo", chartX + chartWidth / 2, chartY + chartHeight + 13, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.text);
  doc.text(
    `Inizio: ${formatNumber(batteryCapacityKwh, 1)} kWh  |  Fine vita: ${formatNumber(endOfLifeCapacityKwh, 1)} kWh`,
    MARGIN,
    chartY + chartHeight + 22,
  );

  return chartY + chartHeight + 30;
}


function formatUsefulLifeYears(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "n.d.";
  }

  return `${formatNumber(value, value < 10 ? 1 : 0)} anni`;
}

function showManualPdfDownloadNotice(params: {
  page: Document;
  url: string;
  fileName: string;
}) {
  const existingNotice = params.page.getElementById(
    "solarscope-pdf-download-notice",
  );

  existingNotice?.remove();

  const notice = params.page.createElement("div");
  notice.id = "solarscope-pdf-download-notice";
  notice.setAttribute("role", "status");
  notice.style.cssText = [
    "position:fixed",
    "left:16px",
    "right:16px",
    "bottom:16px",
    "z-index:99999",
    "padding:16px",
    "border-radius:18px",
    "background:#173b47",
    "color:#ffffff",
    "box-shadow:0 18px 45px rgba(23,59,71,0.28)",
    "font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  ].join(";");

  const title = params.page.createElement("div");
  title.textContent = "Report PDF pronto";
  title.style.cssText = "font-weight:700;font-size:15px;margin-bottom:6px";

  const description = params.page.createElement("div");
  description.textContent =
    "Se il download non parte automaticamente, apri o scarica il report da qui.";
  description.style.cssText =
    "font-size:13px;line-height:1.45;color:rgba(255,255,255,0.82);margin-bottom:12px";

  const actions = params.page.createElement("div");
  actions.style.cssText = "display:flex;gap:10px;align-items:center;flex-wrap:wrap";

  const link = params.page.createElement("a");
  link.href = params.url;
  link.download = params.fileName;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Apri/scarica report PDF";
  link.style.cssText = [
    "display:inline-flex",
    "align-items:center",
    "justify-content:center",
    "border-radius:999px",
    "background:#f2c94c",
    "color:#173b47",
    "font-weight:700",
    "font-size:13px",
    "text-decoration:none",
    "padding:10px 14px",
  ].join(";");

  const closeButton = params.page.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Chiudi";
  closeButton.style.cssText = [
    "border:0",
    "border-radius:999px",
    "background:rgba(255,255,255,0.12)",
    "color:#ffffff",
    "font-weight:700",
    "font-size:13px",
    "padding:10px 14px",
  ].join(";");

  closeButton.addEventListener("click", () => {
    notice.remove();
  });

  actions.appendChild(link);
  actions.appendChild(closeButton);
  notice.appendChild(title);
  notice.appendChild(description);
  notice.appendChild(actions);

  params.page.body.appendChild(notice);

  return notice;
}

function savePdfDocument(doc: JsPdfDocument, fileName: string) {
  const browserScope = globalThis as typeof globalThis & {
    document?: Document;
    navigator?: Navigator;
    window?: Window;
  };

  const page = browserScope.document;
  const navigatorRef = browserScope.navigator;
  const windowRef = browserScope.window;

  if (!page || !navigatorRef) {
    doc.save(fileName);
    return;
  }

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const userAgent = navigatorRef.userAgent;
  const platform = navigatorRef.platform;
  const isAppleTouchDevice =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === "MacIntel" && navigatorRef.maxTouchPoints > 1);
  const isSamsungInternet = /SamsungBrowser/i.test(userAgent);
  const isMobileBrowser =
    isAppleTouchDevice ||
    /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobileBrowser || isSamsungInternet) {
    let openedWindow: Window | null = null;

    try {
      openedWindow = windowRef?.open(url, "_blank", "noopener,noreferrer") ?? null;
    } catch {
      openedWindow = null;
    }

    const notice = showManualPdfDownloadNotice({
      page,
      url,
      fileName,
    });

    if (!openedWindow) {
      notice.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    setTimeout(() => {
      notice.remove();
      URL.revokeObjectURL(url);
    }, 10 * 60 * 1000);

    return;
  }

  const link = page.createElement("a");
  link.href = url;
  link.download = fileName;
  link.target = "_self";
  link.rel = "noopener noreferrer";

  page.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 3_000);
}


export async function createSimulationPdfReport(input: PdfReportInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const summary = input.summary;
  const monthly = input.reportSeries.monthly;
  const judgement = getExecutiveJudgement(summary);
  const locallyUsedPvKwh =
    summary.directSelfConsumptionKwh + summary.batterySelfConsumptionKwh;

  setFillColor(doc, COLORS.dark);
  doc.rect(0, 0, PAGE_WIDTH, 54, "F");

  setFillColor(doc, COLORS.gold);
  doc.circle(PAGE_WIDTH - 28, 18, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.setTextColor(255, 255, 255);
  doc.text("Report preliminare FV con accumulo", MARGIN, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(230, 238, 232);
  doc.text("SolarScope - simulazione energetica domestica", MARGIN, 33);
  doc.text(new Date().toLocaleDateString("it-IT"), PAGE_WIDTH - MARGIN, 33, {
    align: "right",
  });

  let y = 66;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setTextColor(doc, COLORS.text);
  doc.text("Sintesi del risultato", MARGIN, y);

  y += 8;

  drawMetricBox(
    doc,
    "FV consigliato",
    `${formatKwp(summary.recommendedPvKwp)} kWp`,
    MARGIN,
    y,
    42,
    "green",
  );
  drawMetricBox(
    doc,
    "Accumulo",
    `${formatKwp(summary.recommendedBatteryKwh)} kWh`,
    MARGIN + 46,
    y,
    42,
    "green",
  );
  drawMetricBox(
    doc,
    "Autosufficienza",
    formatPercent(summary.selfSufficiencyPercent),
    MARGIN + 92,
    y,
    42,
    "gold",
  );
  drawMetricBox(
    doc,
    "Payback",
    formatYears(summary.simplePaybackYears),
    MARGIN + 138,
    y,
    42,
    "neutral",
  );

  y += 36;

  drawInfoCard(
    doc,
    judgement.label,
    judgement.text,
    MARGIN,
    y,
    CONTENT_WIDTH,
    34,
  );

  y += 43;

  const sourceText = [
    `Località: ${input.address?.trim() ? input.address : "non specificata"}.`,
    `Fonte produzione FV: ${input.pvDataSource?.label ?? "produzione stimata"}.`,
    input.pvDataSource?.provider ? `Provider: ${input.pvDataSource.provider}.` : "",
    `Fonte consumi: ${input.consumptionDataSource?.label ?? "consumi inseriti"}.`,
    input.consumptionDataSource?.fileName
      ? `File caricato: ${input.consumptionDataSource.fileName}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setTextColor(doc, COLORS.muted);
  y = addWrappedText(doc, sourceText, MARGIN, y, CONTENT_WIDTH, 4.8);

  y += 8;

  y = addSectionTitle(doc, "Lettura tecnica semplificata", y);

  const analysis = getAutomaticAnalysis(input);
  analysis.forEach((sentence) => {
    y = ensurePage(doc, y, 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setTextColor(doc, COLORS.muted);
    y = addWrappedText(doc, `• ${sentence}`, MARGIN, y, CONTENT_WIDTH, 4.8);
    y += 2;
  });

  y += 4;

  drawInfoCard(
    doc,
    "Cosa significa per il cliente",
    `Su ${formatKwh(summary.annualPvProductionKwh)} prodotti in un anno, circa ${formatKwh(locallyUsedPvKwh)} vengono valorizzati localmente dalla casa. La parte ancora acquistata dalla rete è ${formatKwh(summary.gridImportKwh)}. La batteria aumenta l'autoconsumo, ma va verificata economicamente con prezzi reali e incentivi.`,
    MARGIN,
    y,
    CONTENT_WIDTH,
    38,
  );

  doc.addPage();
  y = MARGIN;

  y = addSectionTitle(doc, "Grafici e andamento energetico", y);

  y = drawGroupedBarChart({
    doc,
    title: "Consumi e produzione FV - andamento mensile",
    subtitle:
      "Confronta mese per mese il fabbisogno dell'utenza con la produzione fotovoltaica stimata. Serve a capire in quali periodi l'impianto produce più energia rispetto ai consumi.",
    data: monthly,
    y,
    firstKey: "consumptionKwh",
    firstLabel: "Consumi mensili",
    secondKey: "pvProductionKwh",
    secondLabel: "Produzione FV mensile",
  });

  y = drawGroupedBarChart({
    doc,
    title: "Rete elettrica - prelievo e immissione mensile",
    subtitle:
      "Mostra quanta energia viene ancora acquistata dalla rete e quanta produzione FV viene immessa perché non consumata o accumulata.",
    data: monthly,
    y: y + 4,
    firstKey: "gridImportKwh",
    firstLabel: "Prelievo dalla rete",
    secondKey: "gridExportKwh",
    secondLabel: "Immissione in rete",
  });

  y = drawLineChart({
    doc,
    title: "Accumulo - stato medio mensile della batteria",
    subtitle:
      "La linea rappresenta il livello medio di energia presente nella batteria nei diversi mesi. Aiuta a capire se l'accumulo lavora in modo significativo.",
    data: monthly,
    y: y + 4,
    keyName: "averageBatterySocKwh",
    label: "Stato medio batteria",
  });

  doc.addPage();
  y = MARGIN;

  y = drawPvLifetimeProductionChart(doc, summary, y);
  y = drawBatteryCapacityLifetimeChart(doc, summary, y + 4);

  doc.addPage();
  y = MARGIN;

  y = addSectionTitle(doc, "Bilancio annuale simulato", y);
  y = drawAnnualEnergyBars(doc, summary, y);

  y = addSectionTitle(doc, "Dettaglio numerico", y + 6);

  const details = [
    ["Consumo annuo", formatKwh(summary.annualConsumptionKwh)],
    ["Produzione FV annua", formatKwh(summary.annualPvProductionKwh)],
    ["Autoconsumo diretto", formatKwh(summary.directSelfConsumptionKwh)],
    ["Energia fornita dalla batteria", formatKwh(summary.batterySelfConsumptionKwh)],
    ["Energia FV usata localmente", formatKwh(locallyUsedPvKwh)],
    ["Prelievo dalla rete", formatKwh(summary.gridImportKwh)],
    ["Immissione in rete", formatKwh(summary.gridExportKwh)],
    ["Autoconsumo FV", formatPercent(summary.selfConsumptionPercent)],
    ["Autosufficienza energetica", formatPercent(summary.selfSufficiencyPercent)],
    ["Cicli equivalenti batteria", formatNumber(summary.equivalentBatteryCycles, 1)],
    ["Vita utile FV stimata", formatUsefulLifeYears(summary.pvUsefulLifeYears)],
    [
      "Degrado annuo FV ipotizzato",
      `${formatNumber(ENERGY_ECONOMIC_ASSUMPTIONS.pvAnnualDegradationRate * 100, 2)}%/anno`,
    ],
    ["Vita utile accumulo realistica", formatUsefulLifeYears(summary.batteryUsefulLifeYears)],
    [
      "Ipotesi vita accumulo",
      `${formatNumber(summary.batteryCycleLifeCycles, 0)} cicli / ${formatNumber(summary.batteryCalendarLifeYears, 0)} anni calendario/garanzia`,
    ],
    [
      "Soglia fine vita accumulo",
      `${formatNumber(ENERGY_ECONOMIC_ASSUMPTIONS.batteryEndOfLifeCapacityPercent, 0)}% della capacità iniziale`,
    ],
    [
      "Metodo vita accumulo",
      "15 anni a 0 cicli; circa 10 anni per uso domestico normale; riduzione progressiva con cicli annui elevati",
    ],
    ["Investimento stimato", formatEuro(summary.estimatedInvestmentEur)],
    ["Risparmio annuo stimato", formatEuro(summary.annualEnergySavingsEur)],
    ["Costo annuo ante impianto", formatEuro(summary.baselineAnnualEnergyCostEur)],
    [
      "Costo annuo post impianto",
      formatEuro(summary.estimatedAnnualEnergyCostAfterSystemEur),
    ],
  ];

  doc.setFontSize(9);

  details.forEach(([label, value]) => {
    y = ensurePage(doc, y, 9);
    setDrawColor(doc, [237, 241, 237]);
    doc.line(MARGIN, y + 2, PAGE_WIDTH - MARGIN, y + 2);

    doc.setFont("helvetica", "normal");
    setTextColor(doc, COLORS.muted);
    doc.text(label, MARGIN, y);

    doc.setFont("helvetica", "bold");
    setTextColor(doc, COLORS.text);
    doc.text(value, PAGE_WIDTH - MARGIN, y, { align: "right" });

    y += 8;
  });

  y = addEconomicAssumptions(doc, y + 8);
  y = addNextSteps(doc, y + 10);

  y = addSectionTitle(doc, "Limiti della stima", y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.muted);

  addWrappedText(
    doc,
    "Questo report è una stima preliminare generata automaticamente. Non sostituisce un progetto tecnico, un sopralluogo, una verifica strutturale o elettrica, né un'offerta commerciale. La vita utile del fotovoltaico è un'ipotesi tecnica di riferimento; la vita utile dell'accumulo è stimata confrontando cicli equivalenti annui, vita a cicli e limite calendario. Orientamento, inclinazione, ombreggiamenti, vincoli di rete, incentivi, prezzi reali e manutenzione possono modificare il risultato finale.",
    MARGIN,
    y,
    CONTENT_WIDTH,
    4.8,
  );

  addFooter(doc);

  const date = new Date().toISOString().slice(0, 10);
  return {
    doc,
    fileName: `solarscope-report-fv-accumulo-${date}.pdf`,
  };
}

export async function downloadSimulationPdfReport(input: PdfReportInput) {
  const { doc, fileName } = await createSimulationPdfReport(input);
  savePdfDocument(doc, fileName);
}
