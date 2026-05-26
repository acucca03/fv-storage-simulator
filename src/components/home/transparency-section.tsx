import { ENERGY_ECONOMIC_ASSUMPTIONS } from "@/lib/energy/economics/economic-assumptions";

function formatEuro(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDecimal(value: number) {
  return value.toFixed(2).replace(".", ",");
}

const methodSteps = [
  {
    eyebrow: "01",
    title: "Consumi della casa",
    text: "Il simulatore parte dai consumi annui inseriti manualmente oppure da un file consumi reale. Quando viene caricato un file ARERA o CSV, il sistema prova a leggere i dati, pulirli e ricostruire un profilo energetico coerente.",
  },
  {
    eyebrow: "02",
    title: "Produzione fotovoltaica",
    text: "La produzione FV viene stimata in base alla località dell’impianto. L’obiettivo è avvicinare la simulazione al comportamento reale del sole nella zona scelta, considerando una resa annuale plausibile.",
  },
  {
    eyebrow: "03",
    title: "Fotovoltaico e accumulo",
    text: "Il motore confronta produzione solare, consumi e batteria. Stima quanta energia viene autoconsumata subito, quanta passa dall’accumulo, quanta viene acquistata dalla rete e quanta viene immessa.",
  },
  {
    eyebrow: "04",
    title: "Consiglio finale",
    text: "Il sistema confronta più combinazioni di kWp fotovoltaici e kWh di accumulo, cercando un equilibrio tra autonomia energetica, autoconsumo, investimento iniziale e tempo di rientro.",
  },
];

const economicRows = [
  {
    label: "Costo energia acquistata",
    value: `${formatDecimal(ENERGY_ECONOMIC_ASSUMPTIONS.electricityPurchasePriceEurPerKwh)} €/kWh`,
    note: "Usato per stimare il risparmio quando l’impianto evita di comprare energia dalla rete.",
  },
  {
    label: "Valore energia immessa",
    value: `${formatDecimal(ENERGY_ECONOMIC_ASSUMPTIONS.exportedEnergyValueEurPerKwh)} €/kWh`,
    note: "Stima prudenziale del valore dell’energia prodotta ma non autoconsumata.",
  },
  {
    label: "Costo fotovoltaico",
    value: `${formatEuro(ENERGY_ECONOMIC_ASSUMPTIONS.pvCostEurPerKwp)} / kWp`,
    note: "Ipotesi preliminare per moduli, inverter, installazione e componenti principali.",
  },
  {
    label: "Costo accumulo",
    value: `${formatEuro(ENERGY_ECONOMIC_ASSUMPTIONS.batteryCostEurPerKwh)} / kWh`,
    note: "Ipotesi preliminare per batteria domestica, elettronica e integrazione con l’impianto.",
  },
  {
    label: "Costo fisso impianto",
    value: formatEuro(ENERGY_ECONOMIC_ASSUMPTIONS.fixedInstallationCostEur),
    note: "Quota indicativa per pratiche, installazione e componenti non proporzionali alla potenza.",
  },
];

export function TransparencySection() {
  return (
    <section className="bg-[#f7f4ec] px-6 py-20 text-[#1f2933]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1f4d3a]">
              Metodo trasparente
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              Come funzionano i calcoli del simulatore.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52615d]">
              Il risultato non è una promessa commerciale, ma una stima tecnica
              preliminare costruita a partire dai consumi, dalla località
              dell’impianto, dalla produzione solare stimata e da ipotesi
              economiche dichiarate.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a
                href="https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis_en"
                target="_blank"
                rel="noreferrer"
                className="rounded-[1.5rem] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4d3a]">
                  Produzione FV
                </div>
                <div className="mt-3 text-xl font-semibold">PVGIS</div>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Riferimento europeo per stimare radiazione solare e resa
                  fotovoltaica in base alla posizione geografica.
                </p>
              </a>

              <a
                href="https://www.consumienergia.it/eid-gateway/?client_id=Ah5HdneY38Nc9Ifd"
                target="_blank"
                rel="noreferrer"
                className="rounded-[1.5rem] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4d3a]">
                  Consumi reali
                </div>
                <div className="mt-3 text-xl font-semibold">Portale Consumi</div>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Portale da cui l’utente può accedere con SPID e scaricare i
                  dati della propria fornitura elettrica.
                </p>
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {methodSteps.map((step) => (
              <article
                key={step.title}
                className="rounded-[1.5rem] bg-white p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef5ef] font-bold text-[#1f4d3a]">
                    {step.eyebrow}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#52615d]">
                      {step.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-[2rem] bg-white p-6 shadow-xl shadow-[#173b47]/10 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1f4d3a]">
                Ipotesi economiche attuali
              </p>

              <h3 className="mt-4 text-3xl font-semibold tracking-tight">
                I numeri usati per stimare investimento e rientro.
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#52615d]">
                Questi valori sono ipotesi iniziali, utili per confrontare le
                taglie. In una fase successiva potranno diventare parametri
                modificabili dall’utente o dal professionista.
              </p>
            </div>

            <div className="grid gap-3">
              {economicRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-2 rounded-2xl border border-[#edf1ed] p-4 md:grid-cols-[0.7fr_0.45fr_1.2fr] md:items-center"
                >
                  <div className="font-semibold text-[#1f2933]">
                    {row.label}
                  </div>
                  <div className="font-bold text-[#1f4d3a]">{row.value}</div>
                  <div className="text-sm leading-6 text-[#52615d]">
                    {row.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[#dbe7df] bg-[#fbfaf5] p-6">
          <h3 className="text-2xl font-semibold">
            Cosa significa stima preliminare?
          </h3>

          <div className="mt-4 grid gap-4 text-sm leading-7 text-[#52615d] md:grid-cols-3">
            <p>
              <strong className="text-[#1f2933]">
                Non sostituisce un progetto.
              </strong>
              <br />
              Serve per orientarsi prima di un sopralluogo tecnico.
            </p>

            <p>
              <strong className="text-[#1f2933]">
                Dipende dalla qualità dei dati.
              </strong>
              <br />
              Un file consumi reale rende la simulazione più affidabile rispetto
              a un consumo annuo stimato.
            </p>

            <p>
              <strong className="text-[#1f2933]">
                I costi vanno verificati.
              </strong>
              <br />
              Prezzi, incentivi, pratiche, manutenzione e offerte commerciali
              possono cambiare il tempo di rientro finale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
