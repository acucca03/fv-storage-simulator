import Link from "next/link";

const heroBenefits = [
  "FV consigliato",
  "Batteria ideale",
  "Report PDF",
];

const visualCards = [
  {
    label: "Natura",
    image: "/images/home/card-nature.svg",
  },
  {
    label: "Fotovoltaico",
    image: "/images/home/card-solar.svg",
  },
  {
    label: "Accumulo",
    image: "/images/home/card-battery.svg",
  },
];

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#082d2c] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-75"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(4, 28, 27, 0.95) 0%, rgba(4, 28, 27, 0.82) 55%, rgba(9, 53, 44, 0.58) 100%), url('/images/home/hero-solar-living.svg')",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7f4ec] via-transparent to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-9 pt-4 sm:px-6 sm:pb-14 sm:pt-6 lg:pb-16">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight sm:text-2xl">
            SolarScope
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 lg:flex">
            <a href="#come-funziona" className="transition hover:text-white">
              Come funziona
            </a>
            <a href="#risultati" className="transition hover:text-white">
              Risultati
            </a>
            <a href="#metodo" className="transition hover:text-white">
              Metodo
            </a>
          </nav>

          <Link
            href="/simulatore"
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0b2a29] shadow-lg transition hover:-translate-y-0.5 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Calcola
          </Link>
        </header>

        <div className="grid gap-6 py-8 sm:py-12 lg:grid-cols-[1.05fr_0.75fr] lg:items-end lg:gap-10 lg:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex max-w-full rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/88 backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
              Natura, casa e fotovoltaico domestico
            </div>

            <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-[1.04] tracking-tight sm:mt-5 sm:text-5xl lg:text-7xl">
              Quanto fotovoltaico e quanta batteria servono alla tua casa?
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/82 sm:text-lg sm:leading-8">
              Inserisci consumi e località: ottieni una stima pratica di impianto,
              accumulo, autoconsumo e risparmio.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:mt-7 sm:flex sm:flex-wrap">
              <Link
                href="/simulatore"
                className="inline-flex items-center justify-center rounded-full bg-[#f3c84c] px-5 py-3 text-sm font-bold text-[#132a2f] shadow-xl transition hover:-translate-y-0.5 sm:px-6 sm:py-4"
              >
                Inizia la simulazione
              </Link>

              <a
                href="#come-funziona"
                className="inline-flex items-center justify-center rounded-full border border-white/24 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/16 sm:px-6 sm:py-4"
              >
                Come funziona
              </a>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-7">
              {heroBenefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/14 bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white/88 backdrop-blur sm:px-4 sm:py-3 sm:text-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6">
              {visualCards.map((card) => (
                <div
                  key={card.label}
                  className="relative h-16 overflow-hidden rounded-2xl border border-white/14 bg-cover bg-center shadow-lg sm:h-24"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(15,47,40,0.08), rgba(15,47,40,0.52)), url('${card.image}')`,
                  }}
                >
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/88 px-2 py-1 text-[10px] font-bold text-[#173b47] sm:text-xs">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-[2rem] border border-white/14 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              <div className="rounded-[1.6rem] bg-white/92 p-5 text-[#17313a]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1f4d3a]">
                  Risultato finale
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Una scelta più chiara prima del preventivo.
                </h2>

                <div className="mt-5 grid gap-3">
                  {[
                    ["FV", "Taglia consigliata in kWp"],
                    ["Batteria", "Capacità utile in kWh"],
                    ["Risparmio", "Stima economica preliminare"],
                  ].map(([label, text]) => (
                    <div key={label} className="rounded-2xl bg-[#eef4ef] p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#1f4d3a]">
                        {label}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#52615d]">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/simulatore"
                  className="mt-5 inline-flex w-full justify-center rounded-full bg-[#173b47] px-5 py-3 text-sm font-bold text-white"
                >
                  Calcola il tuo impianto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
