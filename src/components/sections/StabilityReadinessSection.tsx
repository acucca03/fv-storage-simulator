import { stabilityProfile } from "@/config/stability-profile";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";

export function StabilityReadinessSection() {
  return (
    <Section id="stability-readiness">
      <Container>
        <SectionHeading
          eyebrow="Stabilità applicativa"
          title="La foundation deve reggere crescita, refactor e nuovi progetti."
          description="La stabilità non riguarda solo la build: riguarda errori gestiti, struttura prevedibile, routing statico e assenza di pattern fragili."
        />

        <Surface tone="elevated" className="mt-10 sm:mt-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Badge variant="premium">Stable foundation</Badge>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                Runtime controllato
              </h3>
              <Text className="mt-4" tone="muted">
                Error boundary, not-found, metadata, manifest, sitemap e robots
                sono parte della base e vengono verificati automaticamente.
              </Text>
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Regole di stabilità
              </h3>
              <div className="mt-5">
                <FeatureList items={stabilityProfile.stabilityRules} columns="two" />
              </div>
            </div>
          </div>
        </Surface>

        <ResponsiveGrid columns="2" className="mt-10">
          <Card>
            <Badge>File runtime richiesti</Badge>
            <div className="mt-5">
              <FeatureList items={stabilityProfile.requiredRuntimeFiles} />
            </div>
          </Card>

          <Card>
            <Badge>Pattern vietati</Badge>
            <div className="mt-5">
              <FeatureList items={stabilityProfile.forbiddenRuntimePatterns} />
            </div>
          </Card>
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
