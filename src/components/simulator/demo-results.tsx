import { runDemoSimulation } from "@/lib/energy";
import {
  formatCycles,
  formatKwh,
  formatKwp,
  formatPercent,
} from "@/lib/format/energy-format";

const cardClass =
  "rounded-[1.25rem] border border-[#dde7df] bg-white p-4 shadow-sm sm:p-5";

export function DemoResults() {
  const result = runDemoSimulation();
  const summary = result.bestSummary;

  const cards = [
    {
      label: "Fotovoltaico consigliato",
      value: `${formatKwp(summary.recommendedPvKwp)} kWp`,
      helper: "Taglia selezionata dall’ottimizzatore base",
    },
    {
      label: "Batteria consigliata",
      value: `${formatKwp(summary.recommendedBatteryKwh)} kWh`,
      helper: "Accumulo simulato con stato di carica",
    },
    {
      label: "Autoconsumo FV",
      value: `${formatPercent(summary.selfConsumptionPercent)}%`,
      helper: "Quota di energia FV usata in casa",
    },
    {
      label: "Autosufficienza",
      value: `${formatPercent(summary.selfSufficiencyPercent)}%`,
      helper: "Quota dei consumi coperta da FV + batteria",
    },
    {
      label: "Energia prelevata",
      value: `${formatKwh(summary.gridImportKwh)} kWh`,
      helper: "Energia acquistata dalla rete nel periodo simulato",
    },
    {
      label: "Energia immessa",
      value: `${formatKwh(summary.gridExportKwh)} kWh`,
      helper: "Surplus FV non usato né accumulato",
    },
  ];

  return (
    <section className="rounded-[1.5rem] bg-white p-4 shadow-lg shadow-[#173b47]/8 sm:p-5 md:p-6">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1f4d3a]">
            Demo algoritmo
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Primo risultato generato dal motore energetico.
          </h2>
          <p className="mt-5 leading-8 text-[#52615d]">
            Questa anteprima usa un profilo consumi statistico da 4.500 kWh annui,
            una produzione FV stimata e il simulatore batteria con SOC minuto per minuto.
            Nel prossimo blocco collegheremo questi calcoli ai dati scelti dall’utente.
          </p>

          <div className="mt-5 rounded-[1.25rem] bg-[#eef5ef] p-4 sm:p-5">
            <h3 className="text-xl font-semibold">Dettaglio energetico demo</h3>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#52615d]">Consumo simulato</dt>
                <dd className="font-bold">{formatKwh(summary.annualConsumptionKwh)} kWh</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#52615d]">Produzione FV simulata</dt>
                <dd className="font-bold">{formatKwh(summary.annualPvProductionKwh)} kWh</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#52615d]">Autoconsumo diretto</dt>
                <dd className="font-bold">{formatKwh(summary.directSelfConsumptionKwh)} kWh</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#52615d]">Energia da batteria</dt>
                <dd className="font-bold">{formatKwh(summary.batterySelfConsumptionKwh)} kWh</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#52615d]">Cicli equivalenti batteria</dt>
                <dd className="font-bold">{formatCycles(summary.equivalentBatteryCycles)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <article key={card.label} className={cardClass}>
              <div className="text-sm font-semibold text-[#52615d]">{card.label}</div>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#1f4d3a]">{card.value}</div>
              <p className="mt-2 text-sm leading-6 text-[#52615d]">{card.helper}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
