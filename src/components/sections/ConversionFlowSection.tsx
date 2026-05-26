import { businessModulesConfig } from "@/config/business-modules";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ConversionFlowSection() {
  return (
    <Section id="conversion-flow">
      <Container>
        <SectionHeading
          eyebrow="Conversione"
          title="La base deve guidare l'utente: capire, fidarsi, agire."
        />

        <ResponsiveGrid columns="4" className="mt-10 sm:mt-12">
          {businessModulesConfig.conversionFlow.map((step) => (
            <Card key={step.step}>
              <p className="font-mono text-sm text-neutral-500">
                Step {step.step}
              </p>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-400">
                {step.description}
              </p>
            </Card>
          ))}
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
