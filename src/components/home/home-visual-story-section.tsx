const visualCards = [
  {
    badge: "Natura",
    title: "Energia pulita, dentro un contesto reale.",
    text: "Il fotovoltaico non è solo un calcolo: è una scelta per rendere la casa più autonoma, efficiente e sostenibile.",
    imageUrl: "/images/home/card-nature.svg",
  },
  {
    badge: "Fotovoltaico",
    title: "Stima della produzione solare.",
    text: "Il simulatore traduce località, consumi e resa FV in una prima indicazione concreta di dimensionamento.",
    imageUrl: "/images/home/card-solar.svg",
  },
  {
    badge: "Accumulo",
    title: "Più autoconsumo, meno energia sprecata.",
    text: "La batteria viene valutata come strumento per aumentare l’uso dell’energia prodotta durante il giorno.",
    imageUrl: "/images/home/card-battery.svg",
  },
];

export function HomeVisualStorySection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f0e6] px-6 py-20 text-[#1f2933]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(128, 167, 118, 0.22), transparent 34%), radial-gradient(circle at bottom right, rgba(34, 84, 61, 0.14), transparent 32%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <article
            className="relative min-h-[540px] overflow-hidden rounded-[2.5rem] bg-[#173b47] p-8 text-white shadow-2xl shadow-[#173b47]/20 md:p-10"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(8, 29, 35, 0.20), rgba(8, 29, 35, 0.86)), url('/images/home/hero-solar-living.svg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="flex h-full min-h-[460px] flex-col justify-between">
              <div className="inline-flex w-fit rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Casa, sole e indipendenza energetica
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/75">
                  Esperienza sostenibile
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                  Un simulatore che fa capire il valore reale dell’energia.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-8 text-white/82 md:text-lg">
                  L’obiettivo non è mostrare solo numeri, ma aiutare l’utente a
                  immaginare una casa più efficiente: meno sprechi, più
                  autoconsumo e una scelta energetica più consapevole.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            <div className="rounded-[2rem] bg-white/84 p-6 shadow-xl shadow-[#173b47]/10 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1f4d3a]">
                Non solo calcolo
              </p>

              <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                Il sito deve vendere fiducia prima ancora del risultato.
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#52615d]">
                Le immagini aiutano l’utente a percepire il servizio come
                professionale, concreto e vicino alla vita quotidiana: una casa,
                un impianto, una batteria, una scelta sostenibile.
              </p>
            </div>

            {visualCards.map((card) => (
              <article
                key={card.title}
                className="group grid min-h-[190px] overflow-hidden rounded-[2rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:grid-cols-[0.85fr_1.15fr]"
              >
                <div
                  className="min-h-[210px] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(23, 59, 71, 0.03), rgba(23, 59, 71, 0.14)), url('${card.imageUrl}')`,
                  }}
                />

                <div className="flex flex-col justify-center p-6">
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#1f4d3a]">
                    {card.badge}
                  </div>

                  <h3 className="mt-3 text-xl font-semibold">{card.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-[#52615d]">
                    {card.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
