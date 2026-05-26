import { privacyProfile } from "@/config/privacy-profile";
import { securityProfile } from "@/config/security-profile";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";

export function SecurityReadinessSection() {
  return (
    <Section id="security-readiness">
      <Container>
        <SectionHeading
          eyebrow="Security & privacy readiness"
          title="La foundation deve partire difensiva, prudente e pronta per progetti reali."
          description="Sicurezza e privacy non vengono aggiunte alla fine: sono guardrail strutturali della Base Madre Ultimate."
        />

        <Surface tone="elevated" className="mt-10 sm:mt-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Badge variant="premium">Security by default</Badge>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                Headers, CSP e validazione controllati
              </h3>
              <Text className="mt-4" tone="muted">
                La foundation verifica header, CSP, igiene ambiente, validazioni
                e regole privacy prima di ogni avanzamento importante.
              </Text>
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Regole privacy base
              </h3>
              <div className="mt-5">
                <FeatureList items={privacyProfile.dataMinimization} columns="two" />
              </div>
            </div>
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          <Card>
            <Badge>Header richiesti</Badge>
            <div className="mt-5">
              <FeatureList items={securityProfile.headers.required.slice(0, 6)} />
            </div>
          </Card>

          <Card>
            <Badge>Validazione form</Badge>
            <div className="mt-5">
              <FeatureList items={securityProfile.validation.rules} />
            </div>
          </Card>

          <Card tone="elevated">
            <Badge variant="premium">Checklist pubblicazione</Badge>
            <div className="mt-5">
              <FeatureList items={privacyProfile.publicationChecklist.slice(0, 4)} />
            </div>
          </Card>
        </ResponsiveGrid>

        <Card className="mt-10">
          <h3 className="text-xl font-semibold tracking-tight text-white">
            Pattern vietati come default
          </h3>
          <div className="mt-5">
            <FeatureList items={securityProfile.forbiddenDefaults} columns="two" />
          </div>
        </Card>
      </Container>
    </Section>
  );
}
