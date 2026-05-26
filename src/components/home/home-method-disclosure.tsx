import { defaultAdvancedEngineConfig } from "@/lib/energy/advanced";

const config = defaultAdvancedEngineConfig;
const economics = config.economics;
const domestic = config.domesticConstraints;
const weights = config.compromiseWeights;

function formatEuro(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDecimal(value: number, digits = 2) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatPercent(value: number, digits = 0) {
  return `${formatDecimal(value, digits)}%`;
}

const methodSteps = [
  {
    title: "1. Consumi della casa",
    simple:
      "Il simulatore parte dai consumi reali caricati dall’utente oppure, se il file non è disponibile, da una stima annua guidata.",
    technical:
      "Il profilo dei consumi viene convertito in una serie energetica in kWh. Se il file è quartorario, il sistema mantiene la distribuzione temporale e la usa per confrontare carico, produzione FV, batteria e rete.",
  },
  {
    title: "2. Produzione fotovoltaica da località",
    simple:
      "In base alla città o alle coordinate, il sito stima la produzione tipica di un impianto FV in quel punto geografico.",
    technical:
      "La produzione viene richiesta a PVGIS/JRC come profilo orario per 1 kWp, poi viene scalata sulle diverse taglie FV provate dall’algoritmo.",
  },
  {
    title: "3. Simulazione energetica FV + batteria",
    simple:
      "Per ogni istante il sito decide se l’energia FV va alla casa, alla batteria, alla rete oppure se serve comprare energia dalla rete.",
    technical:
      "La logica è: prima autoconsumo diretto, poi carica batteria se c’è surplus, poi immissione in rete. Quando il FV non basta, scarica la batteria rispettando SOC minimo, SOC massimo, rendimento e limite di potenza. Se resta deficit, preleva dalla rete.",
  },
  {
    title: "4. Confronto di molte taglie",
    simple:
      "Il sito non prova una sola soluzione: confronta molte combinazioni di fotovoltaico e accumulo.",
    technical:
      `Le taglie FV provate sono ${config.sizing.pvSizesKwp.join(", ")} kWp. Le taglie batteria provate sono ${config.sizing.batterySizesKwh.join(", ")} kWh. In totale vengono confrontate ${config.sizing.pvSizesKwp.length * config.sizing.batterySizesKwh.length} configurazioni.`,
  },
  {
    title: "5. Calcolo economico",
    simple:
      "Per ogni configurazione il sito stima investimento, risparmio, ricavi da immissione, manutenzione, detrazione e sostituzione batteria.",
    technical:
      "Il payback non è calcolato solo vendendo energia: considera risparmio da autoconsumo, valore dell’energia immessa, costi di manutenzione, detrazione fiscale e sostituzione della batteria dopo 10 anni.",
  },
  {
    title: "6. Scelta del risultato",
    simple:
      "Il sito mostra più risultati: massimo guadagno libero, rientro più rapido, miglior ROI e miglior compromesso domestico.",
    technical:
      "Lo scenario libero massimizza il risultato economico senza filtrare il sovradimensionamento. Lo scenario domestico applica vincoli su rapporto produzione/consumo, autoconsumo minimo, saldo positivo e payback massimo. Il miglior compromesso usa un punteggio pesato.",
  },
];

const economicRows = [
  {
    label: "Energia prelevata",
    value: `${formatDecimal(economics.gridImportPriceEurPerKwh, 4)} €/kWh`,
    note: "Prezzo usato per stimare il costo dell’energia comprata dalla rete.",
  },
  {
    label: "Energia immessa",
    value: `${formatDecimal(economics.gridExportValueEurPerKwh, 4)} €/kWh`,
    note: "Valore usato per stimare il ricavo dell’energia prodotta e non autoconsumata.",
  },
  {
    label: "Costo materiali FV",
    value: `${formatEuro(economics.pvMaterialCostEurPerKwp)} / kWp`,
    note: "Quota proporzionale alla potenza fotovoltaica installata.",
  },
  {
    label: "Costi fissi impianto",
    value: formatEuro(economics.fixedSystemCostEur),
    note: "Quota fissa del sistema, indipendente dalla potenza scelta.",
  },
  {
    label: "Manodopera base",
    value: formatEuro(economics.baseLaborCostEur),
    note: "Costo base di installazione considerato nella simulazione.",
  },
  {
    label: "Manodopera variabile",
    value: `${formatEuro(economics.laborCostEurPerKwp)} / kWp`,
    note: "Quota di installazione che cresce con la taglia FV.",
  },
  {
    label: "Manutenzione annua",
    value: `${formatEuro(economics.annualFixedMaintenanceEur)} + ${formatEuro(economics.annualPvMaintenanceEurPerKwp)}/kWp + ${formatEuro(economics.annualBatteryMaintenanceEurPerKwh)}/kWh`,
    note: "Costo annuo stimato per gestione, controlli e manutenzione ordinaria.",
  },
  {
    label: "Detrazione fiscale",
    value: economics.taxDeductionEnabled
      ? `${formatPercent(economics.taxDeductionRate * 100)} in ${economics.taxDeductionYears} anni`
      : "Non considerata",
    note: "La detrazione viene distribuita anno per anno nel calcolo del payback.",
  },
  {
    label: "Sostituzione batteria",
    value: `anno ${economics.batteryReplacementYear}, ${formatPercent(economics.batteryReplacementCostFactor * 100)} del costo iniziale`,
    note: "La simulazione considera una sostituzione dell’accumulo durante l’orizzonte di analisi.",
  },
  {
    label: "Durata analisi",
    value: `${economics.analysisYears} anni`,
    note: "Periodo usato per saldo netto, ROI e confronto economico finale.",
  },
];

const inverterRows = economics.inverterCostTable.map((point) => ({
  label: `fino a ${formatDecimal(point.size, 1)} kWp`,
  value: formatEuro(point.costEur),
}));

const batteryRows = economics.batteryCostTable.map((point) => ({
  label: `${formatDecimal(point.size, point.size % 1 === 0 ? 0 : 1)} kWh`,
  value: formatEuro(point.costEur),
}));

const scoreRows = [
  {
    label: "Saldo netto",
    value: formatPercent(weights.netBalance * 100),
  },
  {
    label: "Payback",
    value: formatPercent(weights.payback * 100),
  },
  {
    label: "ROI",
    value: formatPercent(weights.roi * 100),
  },
  {
    label: "Autoconsumo",
    value: formatPercent(weights.selfConsumption * 100),
  },
  {
    label: "Autosufficienza",
    value: formatPercent(weights.selfSufficiency * 100),
  },
  {
    label: "Investimento",
    value: formatPercent(weights.investment * 100),
  },
];

export function HomeMethodDisclosure() {
  return (
    <section
      id="metodo"
      className="bg-[#0f2f28] px-4 py-9 text-white sm:px-6 sm:py-14 lg:py-18"
    >
      <div className="mx-auto max-w-7xl">
        <details className="group rounded-[1.5rem] border border-white/12 bg-white/10 p-4 shadow-2xl shadow-black/10 backdrop-blur sm:rounded-[2rem] sm:p-7 lg:p-8">
          <summary className="grid cursor-pointer list-none gap-4 marker:hidden lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f2c94c] sm:text-sm">
                Metodo e algoritmo
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
                Come funziona davvero il nostro calcolo?
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78 sm:text-lg sm:leading-8">
                Questa sezione spiega il motore usato dal simulatore: dati di consumo,
                produzione PVGIS, batteria, costi, detrazione, payback, ROI, scenario
                libero e scenario domestico.
              </p>
            </div>

            <span className="inline-flex w-full justify-center rounded-full bg-[#f2c94c] px-5 py-3 text-sm font-bold text-[#173b47] shadow-xl transition group-open:bg-white sm:w-auto">
              <span className="group-open:hidden">Apri spiegazione tecnica</span>
              <span className="hidden group-open:inline">Chiudi spiegazione</span>
            </span>
          </summary>

          <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl bg-white p-4 text-[#1f2933] sm:rounded-[1.5rem] sm:p-6">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  Spiegazione semplice
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d] sm:text-base">
                  Il sito prende i consumi della casa, stima la produzione
                  fotovoltaica della località tramite PVGIS e prova molte taglie di
                  impianto e batteria. Poi confronta quanto energia viene usata in casa,
                  quanta passa dalla batteria, quanta viene comprata dalla rete e quanta
                  viene immessa.
                </p>
              </article>

              <article className="rounded-2xl bg-white p-4 text-[#1f2933] sm:rounded-[1.5rem] sm:p-6">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  Lettura tecnica professionale
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d] sm:text-base">
                  Il motore confronta profilo di carico, profilo FV orario da PVGIS,
                  modello di accumulo e rete elettrica. Per ogni configurazione calcola
                  autoconsumo, autosufficienza, prelievo, immissione, investimento,
                  saldo netto a 20 anni, ROI e payback con detrazione e sostituzione
                  batteria.
                </p>
              </article>
            </div>

            <div className="rounded-2xl bg-white p-4 text-[#1f2933] sm:rounded-[1.5rem] sm:p-6">
              <h3 className="text-xl font-semibold sm:text-2xl">
                Passaggi dell’algoritmo
              </h3>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-2">
                {methodSteps.map((step) => (
                  <article
                    key={step.title}
                    className="rounded-2xl border border-[#e3ece5] p-3 sm:p-4"
                  >
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
                className="rounded-2xl bg-white p-4 text-[#1f2933] shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:rounded-[1.5rem] sm:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1f4d3a]">
                  Produzione FV
                </p>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">PVGIS/JRC</h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Usiamo PVGIS come riferimento per stimare la producibilità
                  fotovoltaica in base alla posizione geografica. Il profilo da 1 kWp
                  viene poi scalato sulle taglie provate.
                </p>
              </a>

              <a
                href="https://www.consumienergia.it/eid-gateway/?client_id=Ah5HdneY38Nc9Ifd"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-white p-4 text-[#1f2933] shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:rounded-[1.5rem] sm:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1f4d3a]">
                  Consumi reali
                </p>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                  Portale Consumi
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  L’utente può caricare i dati reali della propria fornitura elettrica.
                  Se sono presenti colonne quartorarie ARERA, il sito le riconosce e le
                  trasforma in un profilo energetico annuale utilizzabile.
                </p>
              </a>
            </div>

            <div className="rounded-2xl bg-white p-4 text-[#1f2933] sm:rounded-[1.5rem] sm:p-6">
              <h3 className="text-xl font-semibold sm:text-2xl">
                Parametri economici usati
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#52615d]">
                Questi valori sono mostrati per trasparenza. Non sono un preventivo:
                servono a confrontare le taglie in modo coerente. Prima di una scelta
                reale vanno aggiornati con prezzi, incentivi e condizioni contrattuali
                effettive.
              </p>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                {economicRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-2 rounded-2xl border border-[#edf1ed] p-3 md:grid-cols-[0.7fr_0.5fr_1.2fr] md:items-center"
                  >
                    <div className="font-semibold text-[#1f2933]">{row.label}</div>
                    <div className="font-bold text-[#1f4d3a]">{row.value}</div>
                    <div className="text-sm leading-6 text-[#52615d]">{row.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 text-[#1f2933] sm:rounded-[1.5rem] sm:p-6">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  Tabella inverter
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Il costo inverter non viene calcolato solo in modo proporzionale:
                  usiamo soglie di potenza.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {inverterRows.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-xl border border-[#edf1ed] p-3"
                    >
                      <div className="text-sm text-[#52615d]">{row.label}</div>
                      <div className="font-bold text-[#1f4d3a]">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 text-[#1f2933] sm:rounded-[1.5rem] sm:p-6">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  Tabella batteria
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#52615d]">
                  Anche la batteria usa una tabella di costo per taglia, più realistica
                  di un semplice prezzo fisso al kWh.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {batteryRows.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-xl border border-[#edf1ed] p-3"
                    >
                      <div className="text-sm text-[#52615d]">{row.label}</div>
                      <div className="font-bold text-[#1f4d3a]">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 text-[#1f2933] sm:rounded-[1.5rem] sm:p-6">
              <h3 className="text-xl font-semibold sm:text-2xl">
                Vincoli dello scenario domestico
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#52615d]">
                Lo scenario domestico evita di proporre come soluzione principale un
                impianto troppo grande solo perché vende molta energia in rete.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-[#edf1ed] p-3">
                  <div className="text-sm text-[#52615d]">Rapporto FV/consumi</div>
                  <div className="font-bold text-[#1f4d3a]">
                    max {formatDecimal(domestic.maxProductionToConsumptionRatio, 1)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#edf1ed] p-3">
                  <div className="text-sm text-[#52615d]">Autoconsumo minimo</div>
                  <div className="font-bold text-[#1f4d3a]">
                    {formatPercent(domestic.minUsefulSelfConsumptionPercent)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#edf1ed] p-3">
                  <div className="text-sm text-[#52615d]">Payback massimo</div>
                  <div className="font-bold text-[#1f4d3a]">
                    {domestic.maxPaybackYears} anni
                  </div>
                </div>
                <div className="rounded-2xl border border-[#edf1ed] p-3">
                  <div className="text-sm text-[#52615d]">Saldo netto</div>
                  <div className="font-bold text-[#1f4d3a]">
                    {domestic.requirePositiveNetBalance ? "positivo richiesto" : "non vincolato"}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 text-[#1f2933] sm:rounded-[1.5rem] sm:p-6">
              <h3 className="text-xl font-semibold sm:text-2xl">
                Punteggio del miglior compromesso
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#52615d]">
                Il miglior compromesso domestico non massimizza una sola grandezza: usa
                un punteggio pesato che combina economia, rientro, rendimento e qualità
                energetica dell’impianto.
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {scoreRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-[#edf1ed] p-3"
                  >
                    <div className="text-sm text-[#52615d]">{row.label}</div>
                    <div className="font-bold text-[#1f4d3a]">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#f2c94c]/30 bg-[#f2c94c]/10 p-4 sm:rounded-[1.5rem] sm:p-6">
              <h3 className="text-xl font-semibold sm:text-2xl">
                Limiti della stima
              </h3>
              <div className="mt-3 grid gap-3 text-sm leading-6 text-white/78 md:grid-cols-3">
                <p>
                  <strong className="text-white">Non è un progetto tecnico.</strong>
                  <br />
                  Serve per orientarsi prima di sopralluogo, verifica strutturale,
                  verifica elettrica, pratiche di connessione e progetto firmato.
                </p>
                <p>
                  <strong className="text-white">Dipende dai dati inseriti.</strong>
                  <br />
                  Dati reali completi migliorano molto l’affidabilità rispetto a una
                  semplice stima annua.
                </p>
                <p>
                  <strong className="text-white">I costi possono cambiare.</strong>
                  <br />
                  Preventivi, incentivi, manutenzione, prezzi energia, condizioni di
                  scambio e abitudini di consumo possono modificare il risultato finale.
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
