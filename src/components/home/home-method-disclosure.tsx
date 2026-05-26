import { ENERGY_ECONOMIC_ASSUMPTIONS } from "@/lib/energy/economics/economic-assumptions";

function formatEuro(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const methodSteps = [
  {
    title: "1. Consumi della casa",
    simple:
      "Il simulatore parte dai consumi elettrici: puoi usare il consumo annuo oppure dati reali scaricati dal Portale Consumi.",
    technical:
      "I dati vengono trasformati in un profilo temporale di consumo in kWh, così possono essere confrontati con produzione FV, accumulo e rete elettrica.",
  },
  {
    title: "2. Produzione fotovoltaica",
    simple:
      "In base alla località, il sito stima quanta energia può produrre il fotovoltaico durante l’anno.",
    technical:
      "Il riferimento tecnico è PVGIS/JRC: la produzione solare viene stimata su base geografica e poi scalata sulla taglia FV valutata.",
  },
  {
    title: "3. Batteria e autoconsumo",
    simple:
      "Il sistema controlla quando l’energia va direttamente in casa, quando carica la batteria e quando finisce in rete.",
    technical:
      "La simulazione segue lo stato di carica della batteria, distinguendo autoconsumo diretto, energia accumulata, prelievo dalla rete e immissione in rete.",
  },
  {
    title: "4. Scelta della taglia",
    simple:
      "Il risultato finale suggerisce una combinazione indicativa di kWp fotovoltaici e kWh di accumulo.",
    technical:
      "L’algoritmo confronta più taglie tecniche e restituisce un dimensionamento preliminare in funzione di autoconsumo, autosufficienza, scambi con la rete e stima economica.",
  },
];

const economicRows = [
  {
    label: "Energia prelevata",
    value: `${formatDecimal(
      ENERGY_ECONOMIC_ASSUMPTIONS.electricityPurchasePriceEurPerKwh,
    )} €/kWh`,
    note: "Costo indicativo dell’energia acquistata dalla rete. Incide sul risparmio generato dall’autoconsumo.",
  },
  {
    label: "Energia immessa",
    value: `${formatDecimal(
      ENERGY_ECONOMIC_ASSUMPTIONS.exportedEnergyValueEurPerKwh,
    )} €/kWh`,
    note: "Valore indicativo riconosciuto all’energia non consumata e ceduta alla rete.",
  },
  {
    label: "Costo fotovoltaico",
    value: `${formatEuro(ENERGY_ECONOMIC_ASSUMPTIONS.pvCostEurPerKwp)} / kWp`,
    note: "Ipotesi preliminare per fornitura, installazione e componenti principali dell’impianto FV.",
  },
  {
    label: "Costo accumulo",
    value: `${formatEuro(
      ENERGY_ECONOMIC_ASSUMPTIONS.batteryCostEurPerKwh,
    )} / kWh`,
    note: "Ipotesi preliminare per batteria domestica, elettronica di gestione e integrazione con l’impianto.",
  },
  {
    label: "Costo fisso impianto",
    value: formatEuro(ENERGY_ECONOMIC_ASSUMPTIONS.fixedInstallationCostEur),
    note: "Quota indicativa per pratiche, installazione, configurazione e componenti non proporzionali alla potenza.",
  },
];

export function HomeMethodDisclosure() {
  return (
    <section id="metodo" className="bg-[#0f2f28] px-4 py-9 text-white sm:px-6 sm:py-14 lg:py-18">
      <div className="mx-auto max-w-7xl">
        <details className="group rounded-[1.5rem] border border-white/12 bg-white/10 p-4 sm:rounded-[2rem] sm:p-6 shadow-2xl shadow-black/10 backdrop-blur sm:p-7 lg:p-8">
          <summary className="grid cursor-pointer list-none gap-4 marker:hidden lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f2c94c] sm:text-sm">
                Metodo e algoritmo
              </p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
                Vuoi capire come funziona davvero il calcolo?
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78 sm:text-lg sm:leading-8">
                La homepage resta semplice, ma qui puoi aprire la spiegazione completa:
                dati usati, logica della batteria, ipotesi economiche e limiti della stima.
              </p>
            </div>

            <span className="inline-flex w-full justify-center rounded-full bg-[#f2c94c] px-5 py-3 text-sm font-bold text-[#173b47] shadow-xl transition group-open:bg-white sm:w-auto">
              <span className="group-open:hidden">Apri spiegazione tecnica</span>
              <span className="hidden group-open:inline">Chiudi spiegazione</span>
            </span>
          </summary>

          <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl bg-white p-4 sm:rounded-[1.5rem] sm:p-5 text-[#1f2933] sm:p-6">
                <h3 className="text-xl font-semibold sm:text-2xl">Spiegazione semplice</h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d] sm:text-base">
                  Il sito prende i consumi della casa, stima quanta energia può produrre
                  un impianto fotovoltaico nella tua zona e simula cosa succede all’energia
                  durante l’anno: una parte viene usata subito, una parte può caricare la
                  batteria, una parte può essere immessa in rete e una parte viene ancora
                  acquistata dalla rete.
                </p>
              </article>

              <article className="rounded-2xl bg-white p-4 sm:rounded-[1.5rem] sm:p-5 text-[#1f2933] sm:p-6">
                <h3 className="text-xl font-semibold sm:text-2xl">Lettura tecnica professionale</h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d] sm:text-base">
                  La simulazione confronta profilo di carico, profilo di produzione FV e
                  modello di accumulo. Il bilancio energetico separa autoconsumo diretto,
                  carica/scarica batteria, grid import, grid export e stato di carica medio.
                  Il dimensionamento è preliminare e serve a individuare una taglia coerente
                  prima del progetto esecutivo.
                </p>
              </article>
            </div>

            <div className="rounded-2xl bg-white p-4 sm:rounded-[1.5rem] sm:p-5 text-[#1f2933] sm:p-6">
              <h3 className="text-xl font-semibold sm:text-2xl">Passaggi dell’algoritmo</h3>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-2">
                {methodSteps.map((step) => (
                  <article key={step.title} className="rounded-2xl border border-[#e3ece5] p-3 sm:p-4">
                    <h4 className="font-semibold text-[#173b47]">{step.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#52615d]">
                      <strong>In parole semplici:</strong> {step.simple}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#52615d]">
                      <strong>Dato tecnico:</strong> {step.technical}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <a
                href="https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis_en"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-white p-4 sm:rounded-[1.5rem] sm:p-5 text-[#1f2933] shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1f4d3a]">
                  Produzione FV
                </p>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">PVGIS</h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Riferimento europeo del Joint Research Centre per stimare radiazione
                  solare e producibilità fotovoltaica in base alla posizione geografica.
                </p>
              </a>

              <a
                href="https://www.consumienergia.it/eid-gateway/?client_id=Ah5HdneY38Nc9Ifd"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-white p-4 sm:rounded-[1.5rem] sm:p-5 text-[#1f2933] shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1f4d3a]">
                  Consumi reali
                </p>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">Portale Consumi</h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Portale da cui l’utente può accedere con SPID e scaricare i dati della
                  propria fornitura elettrica, utili per una simulazione più affidabile
                  rispetto alla sola stima annua.
                </p>
              </a>
            </div>

            <div className="rounded-2xl bg-white p-4 sm:rounded-[1.5rem] sm:p-5 text-[#1f2933] sm:p-6">
              <h3 className="text-xl font-semibold sm:text-2xl">
                Ipotesi economiche usate nella simulazione
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#52615d]">
                Questi valori sono parametri preliminari usati per stimare investimento,
                risparmio e tempo di rientro. Non sono un preventivo commerciale e andranno
                aggiornati in base a prezzi reali, incentivi, manutenzione, condizioni
                contrattuali e caratteristiche dell’abitazione.
              </p>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                {economicRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-2 rounded-2xl border border-[#edf1ed] p-3 md:grid-cols-[0.7fr_0.45fr_1.2fr] md:items-center"
                  >
                    <div className="font-semibold text-[#1f2933]">{row.label}</div>
                    <div className="font-bold text-[#1f4d3a]">{row.value}</div>
                    <div className="text-sm leading-6 text-[#52615d]">{row.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#f2c94c]/30 bg-[#f2c94c]/10 p-4 sm:rounded-[1.5rem] sm:p-5 sm:p-6">
              <h3 className="text-xl font-semibold sm:text-2xl">Limiti della stima</h3>
              <div className="mt-3 grid gap-3 text-sm leading-6 text-white/78 md:grid-cols-3">
                <p>
                  <strong className="text-white">Non è un progetto tecnico.</strong>
                  <br />
                  Serve per orientarsi prima di sopralluogo, verifica strutturale,
                  verifica elettrica e progetto firmato.
                </p>
                <p>
                  <strong className="text-white">Dipende dai dati inseriti.</strong>
                  <br />
                  Dati reali di consumo migliorano l’affidabilità rispetto a una stima
                  basata solo sui kWh annui.
                </p>
                <p>
                  <strong className="text-white">I costi possono cambiare.</strong>
                  <br />
                  Incentivi, pratiche, manutenzione, prezzi energia e offerte commerciali
                  possono modificare il risultato finale.
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
