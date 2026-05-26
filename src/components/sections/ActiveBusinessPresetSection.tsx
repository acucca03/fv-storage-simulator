import { projectProfile } from "@/config/project";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";

export function ActiveBusinessPresetSection() {
  const preset = projectProfile.business.preset;

  return (
    <Section id="active-business">
      <Container>
        <SectionHeading
          eyebrow="Preset business attivo"
          title={preset.headline}
          description={preset.description}
        />

        <Surface tone="elevated" className="mt-10 sm:mt-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <div>
              <Badge variant="premium">{preset.label}</Badge>

              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                Configurazione pronta per {preset.businessType}
              </h3>

              <Text className="mt-4" tone="muted">
                {projectProfile.positioning.promise}
              </Text>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <LinkButton href={preset.primaryAction.href}>
                  {preset.primaryAction.label}
                </LinkButton>
                <LinkButton href={preset.secondaryAction.href} variant="secondary">
                  {preset.secondaryAction.label}
                </LinkButton>
              </div>
            </div>

            <Callout title="Obiettivo del preset" tone="success">
              {preset.primaryAction.intent}
            </Callout>
          </div>
        </Surface>

        <ResponsiveGrid columns="2" className="mt-10">
          <Card>
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Focus SEO
            </h3>
            <div className="mt-5">
              <FeatureList items={preset.seoFocus} />
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Obiettivi di conversione
            </h3>
            <div className="mt-5">
              <FeatureList items={preset.conversionGoals} />
            </div>
          </Card>
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
