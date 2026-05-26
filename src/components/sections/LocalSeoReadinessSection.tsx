import { localSeoProfile } from "@/config/local-seo";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";

export function LocalSeoReadinessSection() {
  return (
    <Section id="local-seo-readiness">
      <Container>
        <SectionHeading
          eyebrow="Local SEO readiness"
          title="Prima della pubblicazione, ogni progetto deve completare dati locali, riferimenti e contenuti finali."
          description="La foundation prepara struttura, metadata e dati strutturati; il progetto finale deve inserire dati locali reali, coerenti e verificabili."
        />

        <Surface tone="elevated" className="mt-10 sm:mt-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Badge variant="premium">{localSeoProfile.schemaType}</Badge>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                Schema collegato al verticale attivo
              </h3>
              <Text className="mt-4" tone="muted">
                La CTA primaria usata nei dati strutturati è:{" "}
                {localSeoProfile.primaryAction.label}.
              </Text>
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Controlli di coerenza
              </h3>
              <div className="mt-5">
                <FeatureList items={localSeoProfile.consistencyChecks} columns="two" />
              </div>
            </div>
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          {localSeoProfile.requiredProjectData.map((item) => (
            <Card key={item.key}>
              <Badge>{item.label}</Badge>
              <Text className="mt-5" tone="muted" size="sm">
                {item.reason}
              </Text>
            </Card>
          ))}
        </ResponsiveGrid>

        <Card className="mt-10">
          <h3 className="text-xl font-semibold tracking-tight text-white">
            Pattern vietati in produzione
          </h3>
          <div className="mt-5">
            <FeatureList items={localSeoProfile.forbiddenSeoPatterns} columns="two" />
          </div>
        </Card>
      </Container>
    </Section>
  );
}
