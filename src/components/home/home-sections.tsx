import Link from "next/link";

const steps = [
  {
    title: "Consumi",
    text: "Inserisci kWh annui o file reali.",
  },
  {
    title: "Località",
    text: "Stimiamo la produzione solare.",
  },
  {
    title: "Risultato",
    text: "Ottieni FV, batteria e report.",
  },
];

const consumptionCards = [
  {
    eyebrow: "Metodo veloce",
    title: "Conosco il consumo annuo",
    text: "Inserisci i kWh annui e poche informazioni sulla casa per una prima stima sostenibile.",
    buttonLabel: "Usa stima guidata",
    buttonClassName: "bg-[#f2c94c] text-[#173b47]",
  },
  {
    eyebrow: "Metodo più preciso",
    title: "Ho i file dei consumi",
    text: "Carica i dati reali e confrontali con produzione FV, accumulo e rete.",
    buttonLabel: "Carica consumi",
    buttonClassName: "bg-[#173b47] text-white",
  },
];

const resultCards = [
  ["kWp FV", "Taglia fotovoltaico"],
  ["kWh batteria", "Accumulo consigliato"],
  ["Autoconsumo", "Energia solare usata in casa"],
  ["PDF", "Report scaricabile"],
];

export function HomeHowItWorks() {
  return (
    <section id="come-funziona" className="bg-white px-4 py-9 text-[#1f2933] sm:px-6 sm:py-14 lg:py-18">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1f4d3a] sm:text-sm">
            Come funziona
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
            Da consumi a dimensionamento in pochi passaggi.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#52615d] sm:text-lg sm:leading-8">
            Una lettura rapida per orientarti prima di chiedere preventivi o parlare con un tecnico.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-[#dde7df] bg-[#f7f4ec] p-3 sm:rounded-[1.5rem] sm:p-6"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1f4d3a] text-xs font-bold text-white sm:mb-5 sm:h-10 sm:w-10 sm:text-sm">
                {index + 1}
              </div>
              <h3 className="text-sm font-semibold sm:text-xl">{step.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#52615d] sm:mt-3 sm:text-base sm:leading-7">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeConsumptionMethods() {
  return (
    <section id="consumi" className="bg-[#eef5ef] px-4 py-9 text-[#1f2933] sm:px-6 sm:py-14 lg:py-18">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1f4d3a] sm:text-sm">
            Da dove parti
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
            Puoi iniziare anche solo dal consumo annuo.
          </h2>
        </div>

        <div className="mt-5 grid gap-3 lg:mt-8 lg:grid-cols-2">
          {consumptionCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl bg-white p-4 shadow-lg shadow-[#173b47]/8 sm:rounded-[1.5rem] sm:p-6"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f4d3a]">
                {card.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight sm:mt-3 sm:text-2xl">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#52615d] sm:mt-3 sm:text-base sm:leading-7">
                {card.text}
              </p>
              <Link
                href="/simulatore"
                className={`mt-4 inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 sm:mt-6 sm:w-auto ${card.buttonClassName}`}
              >
                {card.buttonLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeResultsPreview() {
  return (
    <section id="risultati" className="bg-[#f7f4ec] px-4 py-9 text-[#1f2933] sm:px-6 sm:py-14 lg:py-18">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1f4d3a] sm:text-sm">
            Cosa ottieni
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
            Numeri chiari, non teoria infinita.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#52615d] sm:text-lg sm:leading-8">
            Una stima pratica della combinazione FV + accumulo più sensata per la casa.
          </p>
          <Link
            href="/simulatore"
            className="mt-5 inline-flex w-full justify-center rounded-full bg-[#173b47] px-6 py-3 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 sm:mt-7 sm:w-auto sm:py-4"
          >
            Vai al simulatore
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {resultCards.map(([value, label]) => (
            <article key={value} className="rounded-2xl bg-white p-4 shadow-md shadow-[#173b47]/8 sm:rounded-[1.5rem] sm:p-5">
              <div className="text-xl font-bold text-[#1f4d3a] sm:text-3xl">
                {value}
              </div>
              <p className="mt-1 text-xs leading-5 text-[#52615d] sm:mt-3 sm:text-sm sm:leading-6">
                {label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
