import Link from "next/link";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <MainLayout>
      <Section className="flex min-h-[70vh] items-center">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
            404
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Pagina non trovata.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
            Il percorso richiesto non esiste oppure e stato spostato. Nei
            progetti derivati questa pagina potra essere personalizzata in base
            al sito reale.
          </p>

          <div className="mt-10">
            <Button asChild>
              <Link href="/">Torna alla home</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
