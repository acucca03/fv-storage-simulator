import { reliabilityProfile } from "@/config/reliability-profile";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";

export function ReliabilityReadinessSection() {
  return (
    <Section id="reliability-readiness">
      <Container>
        <SectionHeading
          eyebrow="Affidabilità"
          title="La foundation deve essere pronta a diventare base di progetti reali."
          description="Affidabilità significa errori gestiti, form prudenti, controlli automatici, dati minimi e rilascio verificabile."
        />

        <Surface tone="elevated" className="mt-10 sm:mt-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Badge variant="premium">{reliabilityProfile.baseline.recovery}</Badge>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                Recovery e controlli prima del rilascio
              </h3>
              <Text className="mt-4" tone="muted">
                Ogni progetto derivato deve partire con error handling, privacy,
                sicurezza e stabilità già considerati.
              </Text>
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Check richiesti
              </h3>
              <div className="mt-5">
                <FeatureList items={reliabilityProfile.requiredChecks} columns="two" />
              </div>
            </div>
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          <Card>
            <Badge>Failure handling</Badge>
            <div className="mt-5">
              <FeatureList items={reliabilityProfile.failureHandling} />
            </div>
          </Card>

          <Card>
            <Badge>Form reliability</Badge>
            <div className="mt-5">
              <FeatureList items={reliabilityProfile.formReliability} />
            </div>
          </Card>

          <Card tone="elevated">
            <Badge variant="premium">Operational readiness</Badge>
            <div className="mt-5">
              <FeatureList items={reliabilityProfile.operationalReadiness} />
            </div>
          </Card>
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
