import { performanceProfile } from "@/config/performance-profile";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";

export function PerformanceStabilitySection() {
  return (
    <Section id="performance-stability">
      <Container>
        <SectionHeading
          eyebrow="Stabilità"
          title="La Base Madre Ultimate deve restare veloce anche mentre cresce."
          description="Le performance non vengono lasciate alla sensazione: la foundation espone budget, limiti e controlli automatici."
        />

        <Surface tone="elevated" className="mt-10 sm:mt-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Badge variant="premium">
                {performanceProfile.strategy.rendering}
              </Badge>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                Client JavaScript {performanceProfile.strategy.clientJavaScript}
              </h3>
              <Text className="mt-4" tone="muted">
                La homepage resta statica e i componenti sono server-first salvo
                eccezioni motivate.
              </Text>
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Guardrail automatici
              </h3>
              <div className="mt-5">
                <FeatureList
                  items={[
                    `Massimo src: ${performanceProfile.budgets.maxSourceSizeKb} KB`,
                    `Massimo public: ${performanceProfile.budgets.maxPublicSizeKb} KB`,
                    `Massimo file sorgente: ${performanceProfile.budgets.maxSourceFiles}`,
                    "Client component solo se autorizzato",
                    "Dipendenze pesanti vietate",
                    "Accesso browser vietato nei server component",
                  ]}
                  columns="two"
                />
              </div>
            </div>
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          {performanceProfile.quality.budgets.map((budget) => (
            <Card key={budget.metric}>
              <Badge>{budget.metric}</Badge>
              <p className="mt-5 text-2xl font-bold tracking-tight text-white">
                {budget.strictTarget}
              </p>
              <Text className="mt-4" tone="muted" size="sm">
                {budget.meaning}
              </Text>
            </Card>
          ))}
        </ResponsiveGrid>

        <Card className="mt-10">
          <h3 className="text-xl font-semibold tracking-tight text-white">
            Pattern vietati
          </h3>
          <div className="mt-5">
            <FeatureList
              items={performanceProfile.quality.forbiddenPatterns}
              columns="two"
            />
          </div>
        </Card>
      </Container>
    </Section>
  );
}
