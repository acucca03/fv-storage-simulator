import { accessibilityConfig } from "@/config/accessibility";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Surface } from "@/components/ui/Surface";

export function AccessibilitySection() {
  return (
    <Section id="accessibility">
      <Container>
        <SectionHeading
          eyebrow="Accessibilità"
          title="La 2.0.0 deve essere più semplice da usare, leggere e navigare."
        />

        <Surface className="mt-10 sm:mt-12" tone="strong">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <StatusBadge tone="success">Accessibility-ready</StatusBadge>
              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-300">
                {accessibilityConfig.goal}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-neutral-400 lg:max-w-md">
              L&apos;accessibilità non è una rifinitura finale: è una parte della
              qualità strutturale della base.
            </div>
          </div>

          <div className="mt-8">
            <FeatureList items={accessibilityConfig.principles} columns="two" />
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          {accessibilityConfig.checks.map((check) => (
            <Card key={check.name}>
              <Badge>{check.name}</Badge>
              <p className="mt-4 break-words font-mono text-xs leading-6 text-neutral-500">
                {check.target}
              </p>
              <p className="mt-4 text-sm leading-7 text-neutral-400">
                {check.reason}
              </p>
            </Card>
          ))}
        </ResponsiveGrid>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Standard finali 2.0.0
          </h3>

          <div className="mt-6">
            <FeatureList items={accessibilityConfig.finalStandards} columns="two" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
