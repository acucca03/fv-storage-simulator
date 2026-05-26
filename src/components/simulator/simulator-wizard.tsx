"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import type {
  SimulationReportSeries,
  SimulationSummary,
  UploadedConsumptionPoint,
} from "@/types/energy";
import type { AdvancedEngineConfig, AdvancedOptimizationResult, AdvancedSystemResult } from "@/lib/energy/advanced";
import {
  formatCycles,
  formatKwh,
  formatKwp,
  formatPercent,
} from "@/lib/format/energy-format";
import { parseConsumptionFile, type ParsedConsumptionFileSummary } from "@/lib/energy/consumption/parse-consumption-file";
import { downloadSimulationPdfReport } from "@/lib/report/generate-simulation-pdf-report";

type ConsumptionMode = "upload" | "manual" | null;

type Question = {
  id: string;
  title: string;
  description: string;
  options: string[];
};

type GeocodingCandidate = {
  latitude: number;
  longitude: number;
  displayName: string;
  provider: "nominatim";
  isHighLatitude?: boolean;
  note?: string;
};

type PvDataSource = {
  source: "pvgis" | "mock";
  label: string;
  provider?: string;
  latitude?: number;
  longitude?: number;
  resolvedAddress?: string;
  note?: string;
};

type ConsumptionDataSource = {
  source: "statistical_profile" | "uploaded_file";
  label: string;
  annualConsumptionKwh: number;
  uploadedRows?: number;
  coverageDays?: number;
  fileName?: string;
  note?: string;
};

type SimulationApiResponse = {
  summary?: SimulationSummary;
  testedResults?: SimulationSummary[];
  address?: string;
  pvDataSource?: PvDataSource;
  consumptionDataSource?: ConsumptionDataSource;
  reportSeries?: SimulationReportSeries;
  advanced?: AdvancedOptimizationResult;
  error?: string;
};

type EnergySegment = {
  label: string;
  value: number;
  className: string;
};

const questions: Question[] = [
  {
    id: "people",
    title: "Quante persone vivono abitualmente in casa? ",
    description: "Serve per distribuire meglio i consumi giornalieri.",
    options: ["1 persona", "2 persone", "3 persone", "4 persone", "5 o piÃ¹ persone"],
  },
  {
    id: "daytimePresence",
    title: "Durante il giorno la casa Ã¨ abitata? ",
    description: "La presenza nelle ore di sole aumenta lâ€™autoconsumo diretto.",
    options: ["Quasi mai", "Qualche volta", "Spesso", "Sempre"],
  },
  {
    id: "mainUsage",
    title: "Quando si concentrano maggiormente i consumi? ",
    description: "Aiuta a costruire una curva giornaliera piÃ¹ realistica.",
    options: ["Mattina", "Pomeriggio", "Sera", "Distribuiti durante il giorno"],
  },
  {
    id: "cooling",
    title: "Usi climatizzatori in estate? ",
    description: "I consumi estivi possono coincidere bene con la produzione FV.",
    options: ["No", "SÃ¬, poco", "SÃ¬, spesso", "SÃ¬, molte ore al giorno"],
  },
  {
    id: "heating",
    title: "Hai una pompa di calore elettrica? ",
    description: "La pompa di calore cambia molto il profilo invernale.",
    options: ["No", "SÃ¬, solo supporto", "SÃ¬, principale riscaldamento"],
  },
  {
    id: "cooking",
    title: "Che piano cottura utilizzi? ",
    description: "Lâ€™induzione sposta una parte dei consumi sul vettore elettrico.",
    options: ["Gas", "Induzione", "Misto"],
  },
  {
    id: "ev",
    title: "Hai o prevedi unâ€™auto elettrica? ",
    description: "La ricarica domestica puÃ² pesare molto sul dimensionamento.",
    options: ["No", "SÃ¬, ma la carico raramente", "SÃ¬, la carico spesso a casa"],
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getShare(value: number, total: number) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) return 0;

  return Math.max(0, Math.min(100, (value / total) * 100));
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYears(value: number | undefined) {
  if (!value || !Number.isFinite(value)) return "n/d";

  return `${value.toFixed(1).replace(".", ",")} anni`;
}


function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, value));
}


function formatUsefulLifeYears(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "n.d.";
  }

  const maximumFractionDigits = value < 10 ? 1 : 0;

  return `${new Intl.NumberFormat("it-IT", {
    maximumFractionDigits,
  }).format(value)} anni`;
}

function getSizingPvKwp(summary: SimulationSummary) {
  return summary.roundedRecommendedPvKwp ?? summary.recommendedPvKwp;
}

function getSizingBatteryKwh(summary: SimulationSummary) {
  return summary.roundedRecommendedBatteryKwh ?? summary.recommendedBatteryKwh;
}

function findNearestSizingSummary(
  testedResults: SimulationSummary[],
  selectedPvKwp: number,
  selectedBatteryKwh: number,
) {
  return testedResults.reduce((best, current) => {
    const bestDistance =
      Math.abs(getSizingPvKwp(best) - selectedPvKwp) * 2 +
      Math.abs(getSizingBatteryKwh(best) - selectedBatteryKwh);

    const currentDistance =
      Math.abs(getSizingPvKwp(current) - selectedPvKwp) * 2 +
      Math.abs(getSizingBatteryKwh(current) - selectedBatteryKwh);

    return currentDistance < bestDistance ? current : best;
  }, testedResults[0]);
}

function SizingProgressBar({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-[#1f2933]">{label}</span>
        <span className="font-bold text-[#1f4d3a]">{detail}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#e6eee8]">
        <div
          className="h-full rounded-full bg-[#1f4d3a]"
          style={{ width: `${clampPercentage(value)}%` }}
        />
      </div>
    </div>
  );
}

function InteractiveSizingExplorer({
  summary,
  testedResults,
}: {
  summary: SimulationSummary;
  testedResults: SimulationSummary[];
}) {
  const validResults = testedResults.filter(
    (result) =>
      Number.isFinite(getSizingPvKwp(result)) &&
      Number.isFinite(getSizingBatteryKwh(result)),
  );

  const hasEnoughResults = validResults.length >= 2;

  const pvValues = hasEnoughResults
    ? [...new Set(validResults.map(getSizingPvKwp))].sort((a, b) => a - b)
    : [getSizingPvKwp(summary)];

  const batteryValues = hasEnoughResults
    ? [...new Set(validResults.map(getSizingBatteryKwh))].sort(
        (a, b) => a - b,
      )
    : [getSizingBatteryKwh(summary)];

  const initialPvKwp = getSizingPvKwp(summary);
  const initialBatteryKwh = getSizingBatteryKwh(summary);

  const [selectedPvKwp, setSelectedPvKwp] = useState(initialPvKwp);
  const [selectedBatteryKwh, setSelectedBatteryKwh] =
    useState(initialBatteryKwh);

  const selectedSummary = hasEnoughResults
    ? findNearestSizingSummary(validResults, selectedPvKwp, selectedBatteryKwh)
    : summary;

  if (!hasEnoughResults) return null;

  const effectivePvKwp = getSizingPvKwp(selectedSummary);
  const effectiveBatteryKwh = getSizingBatteryKwh(selectedSummary);
  const selectedInvestment = selectedSummary.estimatedInvestmentEur ?? 0;
  const selectedSavings = selectedSummary.annualEnergySavingsEur ?? 0;
  const locallyUsedPvKwh =
    selectedSummary.directSelfConsumptionKwh +
    selectedSummary.batterySelfConsumptionKwh;

  return (
    <div className="rounded-[1.35rem] border border-[#dbe7df] bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f4d3a] sm:text-xs">
                Simulazione interattiva
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#1f2933] sm:text-2xl">
                Cambia FV e accumulo, vedi subito i risultati.
              </h3>
            </div>

            <div className="shrink-0 rounded-full bg-[#f7f4ec] px-3 py-1.5 text-xs font-bold text-[#1f2933]">
              {formatKwp(effectivePvKwp)} kWp Â· {formatKwp(effectiveBatteryKwh)} kWh
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-[1.1rem] bg-[#f7f4ec] p-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-[#1f2933]">
                  Fotovoltaico
                </label>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#1f4d3a]">
                  {formatKwp(selectedPvKwp)} kWp
                </span>
              </div>
              <input
                type="range"
                min={pvValues[0]}
                max={pvValues[pvValues.length - 1]}
                step="0.5"
                value={selectedPvKwp}
                onChange={(event) => setSelectedPvKwp(Number(event.target.value))}
                className="mt-3 w-full accent-[#1f4d3a]"
              />
              <div className="mt-1 flex justify-between text-[11px] text-[#52615d]">
                <span>{formatKwp(pvValues[0])} kWp</span>
                <span>{formatKwp(pvValues[pvValues.length - 1])} kWp</span>
              </div>
            </div>

            <div className="rounded-[1.1rem] bg-[#f7f4ec] p-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-[#1f2933]">
                  Accumulo
                </label>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#1f4d3a]">
                  {formatKwp(selectedBatteryKwh)} kWh
                </span>
              </div>
              <input
                type="range"
                min={batteryValues[0]}
                max={batteryValues[batteryValues.length - 1]}
                step="1"
                value={selectedBatteryKwh}
                onChange={(event) =>
                  setSelectedBatteryKwh(Number(event.target.value))
                }
                className="mt-3 w-full accent-[#1f4d3a]"
              />
              <div className="mt-1 flex justify-between text-[11px] text-[#52615d]">
                <span>{formatKwp(batteryValues[0])} kWh</span>
                <span>{formatKwp(batteryValues[batteryValues.length - 1])} kWh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              label="Rientro"
              value={formatYears(selectedSummary.simplePaybackYears)}
              detail={`${formatEuro(selectedInvestment)} invest. Â· ${formatEuro(selectedSavings)}/anno`}
              tone="gold"
            />
            <MetricCard
              label="Autoconsumo"
              value={`${formatPercent(selectedSummary.selfConsumptionPercent)}%`}
              detail={`${formatKwh(locallyUsedPvKwh)} kWh usati in casa`}
              tone="green"
            />
            <MetricCard
              label="Autosuff."
              value={`${formatPercent(selectedSummary.selfSufficiencyPercent)}%`}
              detail={`${formatKwh(selectedSummary.gridImportKwh)} kWh da rete`}
              tone="blue"
            />
            <MetricCard
              label="Vita stimata"
              value={formatUsefulLifeYears(selectedSummary.batteryUsefulLifeYears)}
              detail={`Cicli annui: ${formatCycles(selectedSummary.equivalentBatteryCycles)}`}
              tone="neutral"
            />
          </div>

          <div className="rounded-[1.1rem] border border-[#e2ebe4] bg-[#fbfaf5] p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SizingProgressBar
                label="Autoconsumo"
                value={selectedSummary.selfConsumptionPercent}
                detail={`${formatPercent(selectedSummary.selfConsumptionPercent)}%`}
              />
              <SizingProgressBar
                label="Autosufficienza"
                value={selectedSummary.selfSufficiencyPercent}
                detail={`${formatPercent(selectedSummary.selfSufficiencyPercent)}%`}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#52615d]">
              <div className="rounded-2xl bg-white px-3 py-2">
                <span className="font-semibold text-[#1f2933]">Prelievo:</span>{" "}
                {formatKwh(selectedSummary.gridImportKwh)} kWh
              </div>
              <div className="rounded-2xl bg-white px-3 py-2">
                <span className="font-semibold text-[#1f2933]">Immessa:</span>{" "}
                {formatKwh(selectedSummary.gridExportKwh)} kWh
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function MetricCard(props: {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "gold" | "blue" | "neutral";
}) {
  const tone = props.tone ?? "neutral";

  const toneClass = {
    green: "bg-[#eef5ef] text-[#1f4d3a]",
    gold: "bg-[#fff7d7] text-[#6d5511]",
    blue: "bg-[#eef6f8] text-[#173b47]",
    neutral: "bg-[#f7f4ec] text-[#1f2933]",
  }[tone];

  return (
    <article className={cn("rounded-[1.25rem] p-3 sm:p-4", toneClass)}>
      <div className="text-sm font-semibold opacity-75">{props.label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
        {props.value}
      </div>
      <p className="mt-2 text-xs leading-5 opacity-75 sm:text-sm sm:leading-6">{props.detail}</p>
    </article>
  );
}

function Gauge(props: {
  value: number;
  label: string;
  description: string;
}) {
  const normalizedValue = Math.max(0, Math.min(100, props.value));

  return (
    <article className="rounded-[1.5rem] border border-[#dde7df] bg-white p-5">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <div
          className="relative grid size-32 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#1f4d3a ${normalizedValue * 3.6}deg, #e7eee8 0deg)`,
          }}
          aria-hidden="true"
        >
          <div className="grid size-24 place-items-center rounded-full bg-white">
            <span className="text-2xl font-bold text-[#1f4d3a]">
              {formatPercent(normalizedValue)}%
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{props.label}</h3>
          <p className="mt-2 leading-7 text-[#52615d]">{props.description}</p>
        </div>
      </div>
    </article>
  );
}

function StackedEnergyBar(props: {
  title: string;
  total: number;
  segments: EnergySegment[];
  caption: string;
}) {
  const visibleSegments = props.segments.filter((segment) => segment.value > 0);

  return (
    <article className="rounded-[1.5rem] border border-[#dde7df] bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{props.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#52615d]">{props.caption}</p>
        </div>

        <div className="text-sm font-bold text-[#1f4d3a]">
          Totale {formatKwh(props.total)} kWh
        </div>
      </div>

      <div className="mt-5 flex h-5 overflow-hidden rounded-full bg-[#e7eee8]">
        {visibleSegments.map((segment) => (
          <div
            key={segment.label}
            className={segment.className}
            style={{
              width: `${getShare(segment.value, props.total)}%`,
            }}
            title={`${segment.label}: ${formatKwh(segment.value)} kWh`}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {props.segments.map((segment) => (
          <div key={segment.label} className="rounded-2xl bg-[#f7f4ec] p-4">
            <div className="flex items-center gap-2">
              <span className={cn("size-3 rounded-full", segment.className)} />
              <span className="text-sm font-semibold text-[#52615d]">
                {segment.label}
              </span>
            </div>
            <div className="mt-2 text-lg font-bold text-[#1f2933]">
              {formatKwh(segment.value)} kWh
            </div>
            <div className="mt-1 text-sm text-[#52615d]">
              {formatPercent(getShare(segment.value, props.total))}%
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}


function formatEuroPerKwh(value: number) {
  return `${value.toFixed(4).replace(".", ",")} â‚¬/kWh`;
}

function formatEuroPerKwp(value: number) {
  return `${formatEuro(value)}/kWp`;
}

function AssumptionItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1rem] bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52615d]">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-[#1f2933]">{value}</div>
    </div>
  );
}

function AdvancedAssumptionsBlock({
  config,
}: {
  config: AdvancedEngineConfig;
}) {
  const economics = config.economics;
  const domestic = config.domesticConstraints;

  const inverterTable = economics.inverterCostTable
    .map((point) => `${point.size} kWp: ${formatEuro(point.costEur)}`)
    .join(" Â· ");

  const batteryTable = economics.batteryCostTable
    .map((point) => `${point.size} kWh: ${formatEuro(point.costEur)}`)
    .join(" Â· ");

  return (
    <details className="mt-4 rounded-[1rem] border border-[#dbe7df] bg-white p-4">
      <summary className="cursor-pointer text-base font-bold text-[#1f4d3a]">
        Parametri usati nella simulazione
      </summary>

      <p className="mt-2 text-sm leading-6 text-[#52615d]">
        Questi sono i valori economici e tecnici usati dal modello. Sono mostrati
        prima dei risultati per rendere la simulazione trasparente e modificabile.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <AssumptionItem
          label="Energia prelevata"
          value={formatEuroPerKwh(economics.gridImportPriceEurPerKwh)}
        />
        <AssumptionItem
          label="Energia immessa"
          value={formatEuroPerKwh(economics.gridExportValueEurPerKwh)}
        />
        <AssumptionItem
          label="Costo materiali FV"
          value={formatEuroPerKwp(economics.pvMaterialCostEurPerKwp)}
        />
        <AssumptionItem
          label="Costi fissi impianto"
          value={formatEuro(economics.fixedSystemCostEur)}
        />
        <AssumptionItem
          label="Manodopera base"
          value={formatEuro(economics.baseLaborCostEur)}
        />
        <AssumptionItem
          label="Manodopera variabile"
          value={formatEuroPerKwp(economics.laborCostEurPerKwp)}
        />
        <AssumptionItem
          label="Sostituzione batteria"
          value={`anno ${economics.batteryReplacementYear} Â· ${formatPercent(economics.batteryReplacementCostFactor * 100)}% del costo iniziale`}
        />
        <AssumptionItem
          label="Detrazione fiscale"
          value={
            economics.taxDeductionEnabled
              ? `${formatPercent(economics.taxDeductionRate * 100)}% in ${economics.taxDeductionYears} anni`
              : "Non considerata"
          }
        />
        <AssumptionItem
          label="Manutenzione"
          value={`${formatEuro(economics.annualFixedMaintenanceEur)}/anno + ${formatEuro(economics.annualPvMaintenanceEurPerKwp)}/kWp + ${formatEuro(economics.annualBatteryMaintenanceEurPerKwh)}/kWh batt.`}
        />
        <AssumptionItem
          label="Analisi economica"
          value={`${economics.analysisYears} anni`}
        />
        <AssumptionItem
          label="Vincolo FV/consumi"
          value={`max ${domestic.maxProductionToConsumptionRatio.toFixed(1).replace(".", ",")} volte i consumi`}
        />
        <AssumptionItem
          label="Autoconsumo minimo"
          value={`${formatPercent(domestic.minUsefulSelfConsumptionPercent)}%`}
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1rem] bg-[#fbfaf5] p-3 text-sm leading-6 text-[#52615d]">
          <strong className="text-[#1f2933]">Tabella inverter:</strong>
          <br />
          {inverterTable}
        </div>

        <div className="rounded-[1rem] bg-[#fbfaf5] p-3 text-sm leading-6 text-[#52615d]">
          <strong className="text-[#1f2933]">Tabella batterie:</strong>
          <br />
          {batteryTable}
        </div>
      </div>
    </details>
  );
}


function formatAdvancedSystem(result?: AdvancedSystemResult) {
  if (!result) return "n/d";

  return `${formatKwp(result.pvKwp)} kWp Â· ${formatKwp(result.batteryKwh)} kWh`;
}

function AdvancedResultsBlock({
  advanced,
}: {
  advanced?: AdvancedOptimizationResult;
}) {
  if (!advanced) return null;

  const freeBest = advanced.freeScenario.bestNetBalance;
  const domesticBest =
    advanced.domesticScenario.bestCompromise ??
    advanced.domesticScenario.bestNetBalance ??
    advanced.recommendedDomestic;

  const bestPayback =
    advanced.domesticScenario.bestPayback ?? advanced.freeScenario.bestPayback;

  const bestRoi =
    advanced.domesticScenario.bestRoi ?? advanced.freeScenario.bestRoi;

  const batteryComparisons = advanced.batteryComparisons.slice(0, 6);

  return (
    <section className="rounded-[1.25rem] border border-[#dbe7df] bg-[#fbfaf5] p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4d3a]">
            Algoritmo avanzato
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[#1f2933]">
            Risultati calcolati con il nuovo motore FV + accumulo.
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#52615d]">
            Qui il sito usa il nostro algoritmo: scenario libero, scenario domestico,
            saldo netto a 20 anni, ROI, payback e confronto batteria contro assenza
            di batteria.
          </p>
        </div>

        <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1f4d3a]">
          {advanced.allResults.length} combinazioni simulate
        </div>
      </div>

      {advanced.usedConfig ? <AdvancedAssumptionsBlock config={advanced.usedConfig} /> : null}

      {advanced.warnings.length ? (
        <div className="mt-4 rounded-[1rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <strong>Avvisi del modello:</strong>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {advanced.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Miglior compromesso domestico"
          value={formatAdvancedSystem(domesticBest)}
          detail={
            domesticBest
              ? `Saldo ${formatEuro(domesticBest.netBalance20YearsEur)} Â· ROI ${formatPercent(domesticBest.roi20YearsPercent)}% Â· payback ${formatYears(domesticBest.paybackYears ?? undefined)}`
              : "Nessuna soluzione domestica valida."
          }
          tone="green"
        />

        <MetricCard
          label="Scenario libero economico"
          value={formatAdvancedSystem(freeBest)}
          detail={
            freeBest
              ? `Saldo ${formatEuro(freeBest.netBalance20YearsEur)} Â· rapporto FV/consumi ${freeBest.productionToConsumptionRatio.toFixed(2).replace(".", ",")}`
              : "Non disponibile."
          }
          tone="blue"
        />

        <MetricCard
          label="Rientro piÃ¹ rapido"
          value={formatAdvancedSystem(bestPayback)}
          detail={
            bestPayback
              ? `Payback ${formatYears(bestPayback.paybackYears ?? undefined)} Â· investimento ${formatEuro(bestPayback.initialInvestmentEur)}`
              : "Nessuna configurazione rientra."
          }
          tone="gold"
        />

        <MetricCard
          label="Miglior ROI"
          value={formatAdvancedSystem(bestRoi)}
          detail={
            bestRoi
              ? `ROI ${formatPercent(bestRoi.roi20YearsPercent)}% Â· saldo ${formatEuro(bestRoi.netBalance20YearsEur)}`
              : "Non disponibile."
          }
          tone="neutral"
        />
      </div>

      {domesticBest ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-[1rem] bg-white p-4">
            <div className="text-sm font-semibold text-[#52615d]">
              Saldo netto 20 anni
            </div>
            <div className="mt-2 text-2xl font-bold text-[#1f4d3a]">
              {formatEuro(domesticBest.netBalance20YearsEur)}
            </div>
          </div>

          <div className="rounded-[1rem] bg-white p-4">
            <div className="text-sm font-semibold text-[#52615d]">
              Autoconsumo utile
            </div>
            <div className="mt-2 text-2xl font-bold text-[#1f4d3a]">
              {formatPercent(domesticBest.usefulSelfConsumptionPercent)}%
            </div>
          </div>

          <div className="rounded-[1rem] bg-white p-4">
            <div className="text-sm font-semibold text-[#52615d]">
              Autosufficienza
            </div>
            <div className="mt-2 text-2xl font-bold text-[#1f4d3a]">
              {formatPercent(domesticBest.selfSufficiencyPercent)}%
            </div>
          </div>
        </div>
      ) : null}

      {batteryComparisons.length ? (
        <div className="mt-4 overflow-hidden rounded-[1rem] border border-[#dbe7df] bg-white">
          <div className="border-b border-[#edf1ed] px-4 py-3">
            <h4 className="font-semibold text-[#1f2933]">
              Confronto batteria migliore vs senza batteria
            </h4>
            <p className="mt-1 text-sm text-[#52615d]">
              Questa tabella dice se lâ€™accumulo migliora davvero il risultato economico oppure solo lâ€™autonomia.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#f7f4ec] text-[#52615d]">
                <tr>
                  <th className="px-4 py-3">FV</th>
                  <th className="px-4 py-3">Batteria migliore</th>
                  <th className="px-4 py-3">Vantaggio economico</th>
                  <th className="px-4 py-3">Autosufficienza +</th>
                  <th className="px-4 py-3">Autoconsumo +</th>
                  <th className="px-4 py-3">Conviene?</th>
                </tr>
              </thead>
              <tbody>
                {batteryComparisons.map((comparison) => (
                  <tr key={comparison.pvKwp} className="border-t border-[#edf1ed]">
                    <td className="px-4 py-3 font-semibold">
                      {formatKwp(comparison.pvKwp)} kWp
                    </td>
                    <td className="px-4 py-3">
                      {formatKwp(comparison.bestBatteryKwh)} kWh
                    </td>
                    <td className="px-4 py-3">
                      {formatEuro(comparison.batteryNetAdvantageEur)}
                    </td>
                    <td className="px-4 py-3">
                      {formatPercent(comparison.selfSufficiencyGainPercent)} punti
                    </td>
                    <td className="px-4 py-3">
                      {formatPercent(comparison.usefulSelfConsumptionGainPercent)} punti
                    </td>
                    <td className="px-4 py-3">
                      {comparison.batteryEconomicallyUseful ? "SÃ¬" : "No / marginale"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ResultsPanel(props: {
  summary: SimulationSummary;
  testedResults?: SimulationSummary[];
  address?: string;
  pvDataSource?: PvDataSource;
  consumptionDataSource?: ConsumptionDataSource;
  reportSeries?: SimulationReportSeries;
  advanced?: AdvancedOptimizationResult;
  onRequestReportData?: () => Promise<SimulationApiResponse>;
}) {
  const { summary } = props;
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [serverReportPayload, setServerReportPayload] = useState<string | null>(
    null,
  );

  const locallyUsedPvKwh =
    summary.directSelfConsumptionKwh + summary.batterySelfConsumptionKwh;

  const batteryLossesKwh = Math.max(
    0,
    summary.annualPvProductionKwh -
      summary.directSelfConsumptionKwh -
      summary.batterySelfConsumptionKwh -
      summary.gridExportKwh,
  );

  const specificYield =
    summary.recommendedPvKwp > 0
      ? summary.annualPvProductionKwh / summary.recommendedPvKwp
      : 0;

  const precisePvKwp = summary.preciseRecommendedPvKwp ?? summary.recommendedPvKwp;
  const preciseBatteryKwh =
    summary.preciseRecommendedBatteryKwh ?? summary.recommendedBatteryKwh;
  const roundedPvKwp = summary.roundedRecommendedPvKwp ?? summary.recommendedPvKwp;
  const roundedBatteryKwh =
    summary.roundedRecommendedBatteryKwh ?? summary.recommendedBatteryKwh;

  const estimatedInvestmentEur = summary.estimatedInvestmentEur ?? 0;
  const annualEnergySavingsEur = summary.annualEnergySavingsEur ?? 0;
  const simplePaybackYears = summary.simplePaybackYears;

  const demandSegments: EnergySegment[] = [
    {
      label: "FV diretto",
      value: summary.directSelfConsumptionKwh,
      className: "bg-[#1f4d3a]",
    },
    {
      label: "Da batteria",
      value: summary.batterySelfConsumptionKwh,
      className: "bg-[#79a97d]",
    },
    {
      label: "Da rete",
      value: summary.gridImportKwh,
      className: "bg-[#d4a832]",
    },
  ];

  const pvUseSegments: EnergySegment[] = [
    {
      label: "Autoconsumo diretto",
      value: summary.directSelfConsumptionKwh,
      className: "bg-[#1f4d3a]",
    },
    {
      label: "Energia utile da batteria",
      value: summary.batterySelfConsumptionKwh,
      className: "bg-[#79a97d]",
    },
    {
      label: "Perdite accumulo",
      value: batteryLossesKwh,
      className: "bg-[#b8c3b8]",
    },
    {
      label: "Immissione in rete",
      value: summary.gridExportKwh,
      className: "bg-[#173b47]",
    },
  ];

  async function handleDownloadReport() {
    setIsDownloadingReport(true);
    setReportError(null);
    setServerReportPayload(null);

    try {
      const reportResponse = props.reportSeries
        ? undefined
        : await props.onRequestReportData?.();

      const reportSeries = props.reportSeries ?? reportResponse?.reportSeries;

      if (!reportSeries) {
        setReportError("Non sono riuscito a generare i dati del report. Riprova.");
        return;
      }

      const pdfReportInput = {
        summary: reportResponse?.summary ?? summary,
        address: reportResponse?.address ?? props.address,
        pvDataSource: reportResponse?.pvDataSource ?? props.pvDataSource,
        consumptionDataSource:
          reportResponse?.consumptionDataSource ?? props.consumptionDataSource,        reportSeries,
        advanced: reportResponse?.advanced ?? props.advanced,
      };

      if (shouldUseServerPdfDownload()) {
        const payload = JSON.stringify(pdfReportInput);
        setServerReportPayload(payload);
        submitServerPdfReport(payload);
        return;
      }

      await downloadSimulationPdfReport(pdfReportInput);
    } catch {
      setReportError("Errore durante la generazione del PDF. Riprova.");
    } finally {
      setIsDownloadingReport(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-[#173b47]/8">
      <div className="bg-[#173b47] p-4 text-white sm:p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f2c94c]">
              Risultato simulazione
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              Dimensionamento FV + accumulo consigliato.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 sm:text-base sm:leading-7 text-white/80">
              Il sistema ha generato il profilo dei consumi, simulato produzione
              fotovoltaica, carica/scarica della batteria e confronto con la rete.
              Poi ha scelto la combinazione piÃ¹ coerente tra{" "}
              {props.testedResults?.length ?? "piÃ¹"} scenari.
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-white/10 p-4 backdrop-blur">
            <div className="text-sm font-semibold text-white/70">
              LocalitÃ  e fonte dati
            </div>
            <div className="mt-2 text-2xl font-bold">
              {props.address?.trim() ? props.address : "Indirizzo inserito"}
            </div>
            <div className="mt-4 text-sm leading-6 text-white/70">
              <strong className="text-white">{props.pvDataSource?.label ?? "Produzione FV stimata"}</strong>
              {props.pvDataSource?.provider ? ` Â· ${props.pvDataSource.provider}` : ""}
              {props.pvDataSource?.note ? ` Â· ${props.pvDataSource.note}` : ""}
            </div>
            {props.pvDataSource?.latitude !== undefined &&
            props.pvDataSource.longitude !== undefined ? (
              <div className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-xs leading-5 text-white/70">
                Coordinate usate: {props.pvDataSource.latitude.toFixed(4)},{" "}
                {props.pvDataSource.longitude.toFixed(4)}
              </div>
            ) : null}

            {props.consumptionDataSource ? (
              <div className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-xs leading-5 text-white/70">
                Consumi:{" "}
                <strong className="text-white">{props.consumptionDataSource.label}</strong>
                {" Â· "}
                {formatKwh(props.consumptionDataSource.annualConsumptionKwh)} kWh/anno
                {props.consumptionDataSource.fileName
                  ? ` Â· ${props.consumptionDataSource.fileName}`
                  : ""}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:space-y-4 sm:p-5 md:p-6">
        <AdvancedResultsBlock advanced={props.advanced} />

        <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
          <MetricCard
            label="Fotovoltaico calcolato"
            value={`${formatKwp(precisePvKwp)} kWp`}
            detail={`Taglia commerciale: ${formatKwp(roundedPvKwp)} kWp. Produzione stimata: ${formatKwh(summary.annualPvProductionKwh)} kWh/anno.`}
            tone="green"
          />
          <MetricCard
            label="Accumulo calcolato"
            value={`${formatKwp(preciseBatteryKwh)} kWh`}
            detail={`Taglia commerciale: ${formatKwp(roundedBatteryKwh)} kWh. Cicli annui: ${formatCycles(summary.equivalentBatteryCycles)}. Vita utile realistica stimata: ${formatUsefulLifeYears(summary.batteryUsefulLifeYears)}.`}
            tone="blue"
          />

          <MetricCard
            label="Rientro investimento"
            value={formatYears(simplePaybackYears)}
            detail={`Investimento stimato: ${formatEuro(estimatedInvestmentEur)}. Beneficio operativo: ${formatEuro(annualEnergySavingsEur)}/anno + detrazioni se applicabili.`}
            tone="gold"
          />

          <MetricCard
            label="Obiettivo tecnico"
            value={summary.targetStatus === "achieved" ? "Raggiunto" : "Parziale"}
            detail="Compromesso raggiunto tra autoconsumo, autonomia e rientro economico."
            tone="neutral"
          />
          <MetricCard
            label="Energia prelevata"
            value={`${formatKwh(summary.gridImportKwh)} kWh`}
            detail="Quota annua che resta da acquistare dalla rete."
            tone="gold"
          />
          <MetricCard
            label="Energia immessa"
            value={`${formatKwh(summary.gridExportKwh)} kWh`}
            detail="Surplus FV non usato direttamente o tramite batteria."
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Gauge
            value={summary.selfConsumptionPercent}
            label="Autoconsumo FV"
            description="Indica quanta produzione fotovoltaica viene usata dalla casa, direttamente o passando dalla batteria."
          />
          <Gauge
            value={summary.selfSufficiencyPercent}
            label="Autosufficienza energetica"
            description="Indica quanta parte dei consumi annuali viene coperta da fotovoltaico e accumulo, senza prelievo dalla rete."
          />
        </div>

        <div className="grid gap-3">
          <StackedEnergyBar
            title="Copertura dei consumi domestici"
            total={summary.annualConsumptionKwh}
            caption="Mostra da dove arriva lâ€™energia consumata dalla casa durante lâ€™anno."
            segments={demandSegments}
          />

          <StackedEnergyBar
            title="Utilizzo della produzione fotovoltaica"
            total={summary.annualPvProductionKwh}
            caption="Mostra come viene distribuita lâ€™energia prodotta dallâ€™impianto FV."
            segments={pvUseSegments}
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.25rem] bg-[#eef5ef] p-4 sm:p-5">
            <h3 className="text-xl font-semibold sm:text-2xl">Lettura rapida</h3>
            <div className="mt-3 space-y-2 text-sm leading-6 text-[#52615d]">
              <p>
                Lâ€™impianto consigliato copre{" "}
                <strong className="text-[#1f4d3a]">
                  {formatPercent(summary.selfSufficiencyPercent)}%
                </strong>{" "}
                del fabbisogno annuo stimato.
              </p>
              <p>
                Dei {formatKwh(summary.annualPvProductionKwh)} kWh prodotti, circa{" "}
                <strong className="text-[#1f4d3a]">
                  {formatKwh(locallyUsedPvKwh)} kWh
                </strong>{" "}
                vengono utilizzati dalla casa tra uso diretto e batteria.
              </p>
              <p>
                La resa specifica stimata Ã¨ circa{" "}
                <strong className="text-[#1f4d3a]">
                  {formatKwh(specificYield)} kWh/kWp
                </strong>
                . {props.pvDataSource?.source === "pvgis" ? "Questo dato deriva dalla serie oraria PVGIS scalata sulla taglia scelta." : "Questo dato sarÃ  piÃ¹ preciso quando saranno caricati consumi reali."}
              </p>
            </div>
          </article>

          <article className="rounded-[1.25rem] border border-[#dde7df] p-4 sm:p-5">
            <h3 className="text-xl font-semibold sm:text-2xl">Dettaglio numerico</h3>

            <dl className="mt-3 space-y-2">
              {[
                ["Consumo annuo stimato", `${formatKwh(summary.annualConsumptionKwh)} kWh`],
                ["Produzione FV annua stimata", `${formatKwh(summary.annualPvProductionKwh)} kWh`],
                ["Autoconsumo diretto", `${formatKwh(summary.directSelfConsumptionKwh)} kWh`],
                ["Energia fornita dalla batteria", `${formatKwh(summary.batterySelfConsumptionKwh)} kWh`],
                ["Perdite accumulo", `${formatKwh(batteryLossesKwh)} kWh`],
                ["Prelievo dalla rete", `${formatKwh(summary.gridImportKwh)} kWh`],
                ["Immissione in rete", `${formatKwh(summary.gridExportKwh)} kWh`],
                ["Cicli equivalenti batteria", formatCycles(summary.equivalentBatteryCycles)],
                ["Vita utile FV stimata", formatUsefulLifeYears(summary.pvUsefulLifeYears)],
                [
                  "Vita utile accumulo realistica",
                  formatUsefulLifeYears(summary.batteryUsefulLifeYears),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-[#edf1ed] pb-3 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[#52615d]">{label}</dt>
                  <dd className="text-right font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>

          <InteractiveSizingExplorer
            summary={summary}
            testedResults={props.testedResults ?? []}
          />

        <div className="rounded-[1.25rem] border border-[#dbe7df] bg-white p-4 sm:p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4d3a]">
                Report professionale
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#1f2933]">
                Scarica il PDF con risultati, grafici e analisi.
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#52615d]">
                Il report include riepilogo tecnico, grafici mensili di consumi
                e produzione FV, uso della rete, andamento dellâ€™accumulo,
                analisi automatica e limiti della stima preliminare.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={isDownloadingReport || (!props.reportSeries && !props.onRequestReportData)}
              className="inline-flex items-center justify-center rounded-full bg-[#173b47] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloadingReport ? "Genero report..." : "Scarica / apri report PDF"}
            </button>

            {serverReportPayload ? (
              <div className="rounded-[1rem] border border-[#dbe7df] bg-[#f7f4ec] p-4 text-sm leading-6 text-[#52615d] lg:col-span-2">
                <strong className="text-[#1f2933]">Report PDF pronto.</strong>{" "}
                Se il browser non lo ha aperto automaticamente, usa il pulsante
                qui sotto.
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => submitServerPdfReport(serverReportPayload)}
                    className="rounded-full bg-[#1f4d3a] px-4 py-2 text-sm font-bold text-white"
                  >
                    Apri/scarica report PDF
                  </button>
                </div>
              </div>
            ) : null}

            {reportError ? (
              <p className="text-sm font-semibold text-red-700 lg:col-span-2">
                {reportError}
              </p>
            ) : null}
          </div>
        </div>



      </div>
    </section>
  );
}



function shouldUseServerPdfDownload() {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const isAppleTouchDevice =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1);

  return (
    /SamsungBrowser/i.test(userAgent) ||
    isAppleTouchDevice ||
    /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  );
}

function submitServerPdfReport(payload: string) {
  if (typeof document === "undefined") return;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/api/report";
  form.target = "_blank";
  form.enctype = "application/x-www-form-urlencoded";
  form.style.display = "none";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "payload";
  input.value = payload;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

function LocationSearchInput({
  label,
  value,
  onChange,
  selectedLocation,
  onSelectLocation,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  selectedLocation: GeocodingCandidate | null;
  onSelectLocation: (location: GeocodingCandidate | null) => void;
  placeholder: string;
}) {
  const [results, setResults] = useState<GeocodingCandidate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  async function searchLocations() {
    const query = value.trim();

    if (query.length < 3) {
      setResults([]);
      setSearchError("Scrivi almeno 3 caratteri, meglio cittÃ  + nazione.");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = (await response.json()) as {
        results?: GeocodingCandidate[];
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Ricerca localitÃ  non riuscita.");
      }

      const foundResults = data.results ?? [];
      setResults(foundResults);

      if (!foundResults.length) {
        setSearchError(
          "Nessuna localitÃ  trovata. Prova con cittÃ  + nazione, ad esempio â€œCagliari, Italiaâ€.",
        );
      }
    } catch (error) {
      setResults([]);
      setSearchError(
        error instanceof Error
          ? error.message
          : "Impossibile cercare la localitÃ .",
      );
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectLocation(location: GeocodingCandidate) {
    onChange(location.displayName);
    onSelectLocation(location);
    setResults([]);
    setSearchError(null);
  }

  return (
    <div className="rounded-[1.25rem] border border-[#dde7df] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <label className="block text-sm font-bold uppercase tracking-[0.18em] text-[#1f4d3a]">
            {label}
          </label>
          <input
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
              onSelectLocation(null);
              setResults([]);
              setSearchError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void searchLocations();
              }
            }}
            placeholder={placeholder}
            className="mt-3 w-full rounded-2xl border border-[#dde7df] bg-white px-4 py-3 outline-none transition focus:border-[#1f4d3a]"
          />
        </div>

        <button
          type="button"
          onClick={searchLocations}
          disabled={isSearching || value.trim().length < 3}
          className="rounded-full bg-[#1f4d3a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#173b2c] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSearching ? "Cerco..." : "Cerca localitÃ "}
        </button>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#52615d]">
        Scrivi cittÃ  e nazione, poi scegli il risultato corretto. Esempi:
        â€œCagliari, Italiaâ€, â€œUtsjoki, Finlandiaâ€, â€œMadrid, Spagnaâ€.
      </p>

      {selectedLocation ? (
        <div className="mt-3 rounded-2xl bg-[#eef5ef] px-4 py-3 text-sm leading-6 text-[#1f4d3a]">
          <strong>LocalitÃ  selezionata:</strong> {selectedLocation.displayName}
          <br />
          Coordinate usate: {selectedLocation.latitude.toFixed(4)},{" "}
          {selectedLocation.longitude.toFixed(4)}
          {selectedLocation.note ? (
            <>
              <br />
              {selectedLocation.note}
            </>
          ) : null}
        </div>
      ) : null}

      {searchError ? (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          {searchError}
        </div>
      ) : null}

      {results.length ? (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-2xl border border-[#dde7df] bg-white shadow-sm">
          {results.map((location) => (
            <button
              key={`${location.latitude}-${location.longitude}-${location.displayName}`}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className="block w-full border-b border-[#edf1ed] px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-[#f7f4ec]"
            >
              <span className="font-semibold text-[#1f2933]">
                {location.displayName}
              </span>
              <span className="mt-1 block text-xs text-[#52615d]">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                {location.isHighLatitude ? " Â· alta latitudine" : ""}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}


export function SimulatorWizard() {
  const [mode, setMode] = useState<ConsumptionMode>(null);
  const [annualConsumption, setAnnualConsumption] = useState("4500");
  const [uploadedConsumptionProfile, setUploadedConsumptionProfile] = useState<
    UploadedConsumptionPoint[]
  >([]);
  const [uploadedFileSummary, setUploadedFileSummary] =
    useState<ParsedConsumptionFileSummary | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isParsingUpload, setIsParsingUpload] = useState(false);
  const [isConsumptionGuideOpen, setIsConsumptionGuideOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<GeocodingCandidate | null>(null);
  const [target, setTarget] = useState("Compromesso: autoconsumo alto, autonomia buona, rientro sostenibile");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [simulation, setSimulation] = useState<SimulationApiResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const completedQuestions = useMemo(
    () => questions.filter((question) => answers[question.id]).length,
    [answers],
  );

  const annualConsumptionNumber = Number(annualConsumption.replace(",", "."));
  const isManualReady =
    mode === "manual" &&
    Number.isFinite(annualConsumptionNumber) &&
    annualConsumptionNumber > 0 &&
    completedQuestions >= 4 &&
    address.trim().length >= 3;

  const isUploadReady = mode === "upload" && uploadedConsumptionProfile.length > 0 && address.trim().length >= 3;
  const canContinue = isManualReady || isUploadReady;
  const progressPercent = (completedQuestions / questions.length) * 100;

  function selectMode(nextMode: ConsumptionMode) {
    setMode(nextMode);
    setSimulation(null);
  }

  async function handleUploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setSimulation(null);
    setUploadError(null);
    setUploadedConsumptionProfile([]);
    setUploadedFileSummary(null);

    if (!file) return;

    setIsParsingUpload(true);

    try {
      const parsedFile = await parseConsumptionFile(file);

      setUploadedConsumptionProfile(parsedFile.profile);
      setUploadedFileSummary(parsedFile.summary);
      setAnnualConsumption(String(Math.round(parsedFile.summary.annualConsumptionKwh)));
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Impossibile leggere il file consumi.",
      );
    } finally {
      setIsParsingUpload(false);
    }
  }

  async function requestSimulation(includeReport = false) {
    const response = await fetch("/api/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        annualConsumptionKwh: annualConsumptionNumber,
        uploadedConsumptionProfile:
          mode === "upload" ? uploadedConsumptionProfile : [],
        uploadedFileName: uploadedFileSummary?.fileName,
        address,
        selectedLocation: selectedLocation
          ? {
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              displayName: selectedLocation.displayName,
            }
          : undefined,
        target,
        answers,
        includeReport,
      }),
    });

    const data = (await response.json()) as SimulationApiResponse;

    if (!response.ok) {
      throw new Error(data.error ?? "Errore durante la simulazione.");
    }

    return data;
  }

  async function runSimulation() {
    if (!canContinue) return;

    setIsSimulating(true);
    setSimulation(null);

    try {
      const data = await requestSimulation(false);
      setSimulation(data);
    } catch (error) {
      setSimulation({ error:
        error instanceof Error
          ? error.message
          : "Impossibile completare la simulazione.",
      });
    } finally {
      setIsSimulating(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="rounded-[1.5rem] bg-white p-4 shadow-lg shadow-[#173b47]/8 sm:p-5 md:p-6">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1f4d3a]">
            Metodo consumi
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Come vuoi fornire i tuoi consumi?
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 sm:text-base sm:leading-7 text-[#52615d]">
            Puoi caricare un file reale dei consumi oppure partire dal consumo
            annuo e costruire una stima guidata delle abitudini della casa.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-7 sm:gap-4 lg:grid-cols-2">
          <button
            type="button"
            onClick={() => selectMode("upload")}
            aria-pressed={mode === "upload"}
            className={cn(
              "group overflow-hidden rounded-[1.75rem] border text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl",
              mode === "upload"
                ? "border-[#1f4d3a] bg-[#eef5ef] shadow-lg shadow-[#173b47]/10"
                : "border-[#dde7df] bg-white hover:border-[#1f4d3a]/40",
            )}
          >
            <div className="grid md:grid-cols-[0.72fr_1.28fr]">
              <div
                className="hidden min-h-[140px] bg-cover bg-center md:block md:min-h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(23,59,71,0.05), rgba(23,59,71,0.16)), url('/images/home/card-solar.svg')",
                }}
              />

              <div className="flex flex-col justify-center p-4 sm:p-5 md:p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#eef5ef] text-lg">
                  ðŸ“„
                </div>
                <h2 className="text-xl font-semibold sm:text-2xl">
                  Ho i file dei consumi reali
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Il sistema riconoscerÃ  formato, colonne, unitÃ  e risoluzione
                  temporale. Poi convertirÃ  i dati in una curva energetica
                  utilizzabile per la simulazione.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => selectMode("manual")}
            aria-pressed={mode === "manual"}
            className={cn(
              "group overflow-hidden rounded-[1.75rem] border text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl",
              mode === "manual"
                ? "border-[#1f4d3a] bg-[#eef5ef] shadow-lg shadow-[#173b47]/10"
                : "border-[#dde7df] bg-white hover:border-[#1f4d3a]/40",
            )}
          >
            <div className="grid md:grid-cols-[0.72fr_1.28fr]">
              <div
                className="hidden min-h-[140px] bg-cover bg-center md:block md:min-h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(23,59,71,0.05), rgba(23,59,71,0.16)), url('/images/home/card-battery.svg')",
                }}
              />

              <div className="flex flex-col justify-center p-4 sm:p-5 md:p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#fff7d7] text-lg">
                  âš¡
                </div>
                <h2 className="text-xl font-semibold sm:text-2xl">
                  Non ho file, conosco il consumo annuo
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Inserisci i kWh annui e rispondi a un questionario: genereremo
                  un profilo statistico piÃ¹ realistico di una media piatta.
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>
      {mode === "upload" ? (
        <section className="rounded-[1.5rem] bg-white p-4 shadow-lg shadow-[#173b47]/8 sm:p-5 md:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1f4d3a]">
            Upload consumi
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Carica il file dei consumi.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 sm:text-base sm:leading-7 text-[#52615d]">
            Il simulatore legge file semplici con data/ora e consumo in kWh oppure
            file ARERA con colonne ea1...ea96. Se mancano alcuni dati, il sistema
            completa il profilo per ottenere un anno coerente di simulazione.
          </p>

          <div className="mt-5 grid gap-4">
            <div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#9eb4a7] bg-[#f7f4ec] px-4 py-6 text-center sm:py-8 transition hover:border-[#1f4d3a] hover:bg-[#eef5ef]">
                <span className="text-lg font-semibold text-[#1f2933]">
                  {isParsingUpload ? "Lettura file in corso..." : "Seleziona un file consumi"}
                </span>
                <span className="mt-2 text-sm text-[#52615d]">
                  CSV, TXT o TSV con consumi orari, quartorari o formato ARERA
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept=".csv,.txt,.tsv,text/csv,text/plain"
                  onChange={handleUploadFile}
                  disabled={isParsingUpload}
                />
              </label>

              <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[#dbe7df] bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsConsumptionGuideOpen((value) => !value)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-[#f7f4ec]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef5ef] text-2xl">
                      ðŸ“„
                    </div>
                    <div>
                      <div className="font-semibold text-[#1f2933]">
                        Dove trovo il file dei consumi?
                      </div>
                      <div className="mt-1 text-sm leading-6 text-[#52615d]">
                        Guida rapida per scaricare letture e consumi dal Portale Consumi.
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#1f4d3a] px-3 py-1 text-sm font-semibold text-white">
                    {isConsumptionGuideOpen ? "Chiudi" : "Apri guida"}
                  </span>
                </button>

                {isConsumptionGuideOpen ? (
                  <div className="border-t border-[#dbe7df] bg-[#fbfaf5] px-4 py-4">
                    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                      <div>
                        <h3 className="text-lg font-semibold text-[#1f2933]">
                          Come scaricare il file dal Portale Consumi
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[#52615d]">
                          Accedi al portale ufficiale, entra con SPID, seleziona la tua utenza
                          elettrica e scarica il file delle letture o dei consumi. Il simulatore
                          prova a leggere direttamente i file CSV/TXT con dati orari, quartorari
                          o formato ARERA con colonne ea1...ea96.
                        </p>

                        <ol className="mt-5 grid gap-3 text-sm leading-6 text-[#52615d]">
                          <li className="rounded-2xl bg-white p-4">
                            <strong className="text-[#1f2933]">1. Apri il Portale Consumi.</strong>
                            <br />
                            Usa il pulsante qui sotto per entrare nel portale ufficiale.
                          </li>
                          <li className="rounded-2xl bg-white p-4">
                            <strong className="text-[#1f2933]">2. Accedi con SPID.</strong>
                            <br />
                            Completa lâ€™autenticazione e accedi alla tua area privata.
                          </li>
                          <li className="rounded-2xl bg-white p-4">
                            <strong className="text-[#1f2933]">3. Seleziona la fornitura elettrica.</strong>
                            <br />
                            Cerca la tua utenza luce, eventualmente riconoscendola dal POD o
                            dallâ€™indirizzo di fornitura.
                          </li>
                          <li className="rounded-2xl bg-white p-4">
                            <strong className="text-[#1f2933]">4. Vai su letture o consumi.</strong>
                            <br />
                            Apri la sezione dedicata a letture, consumi storici o misure della
                            fornitura elettrica.
                          </li>
                          <li className="rounded-2xl bg-white p-4">
                            <strong className="text-[#1f2933]">5. Scarica il file disponibile.</strong>
                            <br />
                            Se trovi unâ€™esportazione CSV/TXT, scaricala e caricala qui nel simulatore.
                          </li>
                        </ol>

                        <a
                          href="https://www.consumienergia.it/eid-gateway/?client_id=Ah5HdneY38Nc9Ifd"
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex rounded-full bg-[#1f4d3a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#173b2c]"
                        >
                          Apri Portale Consumi
                        </a>
                      </div>

                      <div className="rounded-[1.25rem] bg-white p-5">
                        <div className="text-sm font-bold uppercase tracking-[0.18em] text-[#1f4d3a]">
                          Anteprima percorso
                        </div>
                        <div className="mt-5 grid gap-3">
                          <div className="rounded-2xl border border-[#e5ece7] p-4">
                            <div className="text-2xl">ðŸ”</div>
                            <div className="mt-2 font-semibold text-[#1f2933]">Accesso SPID</div>
                            <p className="mt-1 text-sm leading-6 text-[#52615d]">
                              Entra nellâ€™area privata del portale.
                            </p>
                          </div>
                          <div className="rounded-2xl border border-[#e5ece7] p-4">
                            <div className="text-2xl">ðŸ </div>
                            <div className="mt-2 font-semibold text-[#1f2933]">Utenza luce</div>
                            <p className="mt-1 text-sm leading-6 text-[#52615d]">
                              Seleziona la fornitura elettrica corretta.
                            </p>
                          </div>
                          <div className="rounded-2xl border border-[#e5ece7] p-4">
                            <div className="text-2xl">ðŸ“Š</div>
                            <div className="mt-2 font-semibold text-[#1f2933]">Letture e consumi</div>
                            <p className="mt-1 text-sm leading-6 text-[#52615d]">
                              Scarica il file con le misure disponibili.
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 rounded-2xl bg-[#f7f4ec] p-4 text-xs leading-6 text-[#52615d]">
                          Nota: il nome delle sezioni puÃ² cambiare leggermente nel tempo.
                          Cerca voci come â€œlettureâ€, â€œconsumiâ€, â€œmisureâ€ o â€œstorico consumiâ€.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {uploadError ? (
                <div className="mt-4 rounded-[1.25rem] border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                  {uploadError}
                </div>
              ) : null}

              {uploadedFileSummary ? (
                <div className="mt-4 rounded-[1.25rem] bg-[#eef5ef] p-5">
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-[#1f4d3a]">
                    File riconosciuto
                  </div>
                  <div className="mt-3 text-2xl font-semibold">
                    {uploadedFileSummary.fileName}
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm text-[#52615d]">
                    <div className="flex justify-between gap-4">
                      <dt>Consumo annuo elaborato</dt>
                      <dd className="font-bold text-[#1f2933]">
                        {formatKwh(uploadedFileSummary.annualConsumptionKwh)} kWh
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Risoluzione dati</dt>
                      <dd className="font-bold text-[#1f2933]">
                        {uploadedFileSummary.resolutionMinutes} min
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Formato riconosciuto</dt>
                      <dd className="text-right font-bold text-[#1f2933]">
                        {uploadedFileSummary.detectedColumn}
                      </dd>
                    </div>
                    {uploadedFileSummary.selectedYear ? (
                      <div className="flex justify-between gap-4">
                        <dt>Anno di riferimento</dt>
                        <dd className="font-bold text-[#1f2933]">
                          {uploadedFileSummary.selectedYear}
                        </dd>
                      </div>
                    ) : uploadedFileSummary.selectedPeriodLabel ? (
                      <div className="flex justify-between gap-4">
                        <dt>Periodo elaborato</dt>
                        <dd className="text-right font-bold text-[#1f2933]">
                          {uploadedFileSummary.selectedPeriodLabel}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {uploadedFileSummary.selectedYear ? (
                    <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm leading-6 text-[#52615d]">
                      Il sistema ha selezionato automaticamente il periodo piÃ¹ coerente
                      disponibile e ha completato eventuali dati mancanti per ottenere
                      un anno utile alla simulazione.
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-4">
                <LocationSearchInput
                  label="Indirizzo abitazione / localitÃ  impianto"
                  value={address}
                  onChange={setAddress}
                  selectedLocation={selectedLocation}
                  onSelectLocation={setSelectedLocation}
                  placeholder="Esempio: Cagliari, Italia"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {mode === "manual" ? (
        <section className="rounded-[1.5rem] bg-white p-4 shadow-lg shadow-[#173b47]/8 sm:p-5 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.45fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1f4d3a]">
                Stima guidata
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                Costruiamo il profilo dei consumi.
              </h2>
            </div>

            <div className="rounded-[1.25rem] bg-[#f7f4ec] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[#52615d]">
                  Questionario
                </span>
                <span className="text-sm font-bold text-[#1f4d3a]">
                  {completedQuestions}/{questions.length}
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[#1f4d3a]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[1.25rem] bg-[#eef5ef] p-4 sm:p-5">
              <label className="block text-sm font-bold uppercase tracking-[0.2em] text-[#1f4d3a]">
                Consumo annuo
              </label>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <input
                  value={annualConsumption}
                  onChange={(event) => setAnnualConsumption(event.target.value)}
                  inputMode="decimal"
                  className="w-full bg-transparent text-2xl font-bold outline-none"
                  aria-label="Consumo annuo in kWh"
                />
                <span className="font-semibold text-[#52615d]">kWh</span>
              </div>

              <div className="mt-4">
                <LocationSearchInput
                  label="Indirizzo abitazione / localitÃ  impianto"
                  value={address}
                  onChange={setAddress}
                  selectedLocation={selectedLocation}
                  onSelectLocation={setSelectedLocation}
                  placeholder="Esempio: Cagliari, Italia"
                />
              </div>

              <label className="mt-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#1f4d3a]">
                Obiettivo principale
              </label>
              <select
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-[#dde7df] bg-white px-4 py-3 outline-none transition focus:border-[#1f4d3a]"
              >
                <option>Compromesso: autoconsumo alto, autonomia buona, rientro sostenibile</option>
                <option>Massima autosufficienza</option>
                <option>Miglior rapporto costo/beneficio</option>
                <option>Minimo prelievo dalla rete</option>
              </select>

              <div className="mt-4 rounded-2xl bg-white p-5">
                <div className="text-sm font-semibold text-[#52615d]">
                  Requisiti per calcolare
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#52615d]">
                  <li className={cn(address.trim().length >= 3 && "font-bold text-[#1f4d3a]")}>
                    Indirizzo inserito
                  </li>
                  <li className={cn(completedQuestions >= 4 && "font-bold text-[#1f4d3a]")}>
                    Almeno 4 risposte completate
                  </li>
                  <li
                    className={cn(
                      annualConsumptionNumber > 0 && "font-bold text-[#1f4d3a]",
                    )}
                  >
                    Consumo annuo valido
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-5">
              {questions.map((question) => (
                <article
                  key={question.id}
                  className="rounded-[1.25rem] border border-[#dde7df] p-4 transition hover:border-[#1f4d3a]/35"
                >
                  <h3 className="text-lg font-semibold">{question.title}</h3>
                  <p className="mt-2 leading-7 text-[#52615d]">{question.description}</p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: option,
                          }))
                        }
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-semibold transition",
                          answers[question.id] === option
                            ? "border-[#1f4d3a] bg-[#1f4d3a] text-white"
                            : "border-[#dde7df] bg-white text-[#52615d] hover:border-[#1f4d3a]",
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-[1.5rem] bg-[#173b47] p-4 text-white shadow-lg shadow-[#173b47]/8 sm:p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f2c94c]">
              Simulazione
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Produzione FV, batteria e risultati.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 sm:text-base sm:leading-7 text-white/80">
              Con i dati inseriti il sistema genera o usa un profilo annuale, simula FV e
              accumulo, poi prova piÃ¹ combinazioni per avvicinarsi allâ€™obiettivo scelto.
            </p>
          </div>

          <button
            type="button"
            onClick={runSimulation}
            disabled={!canContinue || isSimulating}
            className="rounded-full bg-[#f2c94c] px-5 py-3 text-sm font-bold text-[#173b47] shadow-xl transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSimulating ? "Calcolo in corso..." : "Calcola risultati"}
          </button>
        </div>
      </section>

      {simulation?.error ? (
        <div className="rounded-[1.25rem] border border-red-200 bg-red-50 p-4 text-red-800">
          {simulation.error}
        </div>
      ) : null}

      {simulation?.summary ? (
        <ResultsPanel
          summary={simulation.summary}
          testedResults={simulation.testedResults}
          address={simulation.address}
          pvDataSource={simulation.pvDataSource}
          consumptionDataSource={simulation.consumptionDataSource}
          reportSeries={simulation.reportSeries}
          advanced={simulation.advanced}
          onRequestReportData={() => requestSimulation(true)}
        />
      ) : null}
    </div>
  );
}



