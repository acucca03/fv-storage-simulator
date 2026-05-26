import Link from "next/link";
import { SimulatorWizard } from "@/components/simulator/simulator-wizard";

export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] px-4 py-4 text-[#1f2933] sm:px-6 sm:py-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-row items-center justify-between gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1f4d3a] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            ← Torna alla homepage
          </Link>

          <div className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#52615d] shadow-sm">
            SolarScope Simulator
          </div>
        </div>

        <SimulatorWizard />

        <section className="mx-auto mt-5 max-w-5xl rounded-[1.5rem] border border-[#e4dac7] bg-white/85 p-4 sm:p-5 text-[#1f2933] shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7c6f5a]">
            Nota tecnica
          </p>
          <p className="mt-2 text-sm leading-6 text-[#4a5a62]">
            La simulazione è preliminare: non sostituisce progetto tecnico,
            sopralluogo, verifica strutturale o elettrica, pratica di connessione
            alla rete o preventivo commerciale. I risultati servono per orientare
            una valutazione iniziale.
          </p>
        </section>
      </div>
    </main>
  );
}
