import { projectProfile } from "@/config/project";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Text } from "@/components/ui/Text";

export function BusinessConversionGoalsSection() {
  const { primaryAction, secondaryAction, conversionGoals } =
    projectProfile.business;

  return (
    <Section id="business-conversion">
      <Container>
        <SectionHeading
          eyebrow="Conversione business"
          title="Ogni sito reale deve avere azioni chiare, non solo una bella pagina."
          description="La Base Madre Ultimate separa la struttura tecnica dalle azioni commerciali, così ogni progetto può avere CTA coerenti con il suo settore."
        />

        <ResponsiveGrid columns="3" className="mt-10 sm:mt-12">
          <Card tone="elevated">
            <Badge variant="premium">Azione primaria</Badge>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
              {primaryAction.label}
            </h3>
            <Text className="mt-4" tone="muted" size="sm">
              {primaryAction.intent}
            </Text>
          </Card>

          <Card>
            <Badge>Azione secondaria</Badge>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
              {secondaryAction.label}
            </h3>
            <Text className="mt-4" tone="muted" size="sm">
              {secondaryAction.intent}
            </Text>
          </Card>

          <Card>
            <Badge>Obiettivi</Badge>
            <div className="mt-5">
              <FeatureList items={conversionGoals} />
            </div>
          </Card>
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
