"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <MainLayout>
      <Section className="flex min-h-[70vh] items-center">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Errore
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Qualcosa non ha funzionato.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
            Si è verificato un errore imprevisto. Puoi tornare alla homepage
            oppure riprovare tra poco senza perdere i dati già inseriti.
          </p>

          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-neutral-600">
              Error digest: {error.digest}
            </p>
          ) : null}

          <div className="mt-10">
            <Button onClick={reset}>Riprova</Button>
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
