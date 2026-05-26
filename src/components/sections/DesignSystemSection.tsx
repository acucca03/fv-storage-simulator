import { designSystemConfig } from "@/config/design-system";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Surface } from "@/components/ui/Surface";

export function DesignSystemSection() {
  return (
    <Section id="design-system">
      <Container>
        <SectionHeading
          eyebrow="Design system"
          title="Componenti essenziali, coerenti e progettati per non rallentare la base."
        />

        <Surface className="mt-10 sm:mt-12" tone="strong">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <StatusBadge tone="success">Standard v{designSystemConfig.version}</StatusBadge>
              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-300">
                {designSystemConfig.goal}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-neutral-400 lg:max-w-sm">
              La regola è semplice: se un componente non migliora riuso,
              chiarezza o conversione, non entra nella base madre.
            </div>
          </div>

          <div className="mt-8">
            <FeatureList items={designSystemConfig.rules} columns="two" />
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          {designSystemConfig.componentStandards.map((component) => (
            <Card key={component.name}>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {component.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                {component.purpose}
              </p>
              <p className="mt-4 text-sm leading-7 text-neutral-300">
                {component.quality}
              </p>
            </Card>
          ))}
        </ResponsiveGrid>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Token visivi controllati
          </h3>

          <ResponsiveGrid columns="4" className="mt-6">
            {designSystemConfig.tokens.map((token) => (
              <Card key={token.name} className="p-5">
                <p className="text-sm font-semibold text-white">{token.name}</p>
                <p className="mt-3 break-words font-mono text-xs leading-6 text-neutral-500">
                  {token.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  {token.reason}
                </p>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>
      </Container>
    </Section>
  );
}
