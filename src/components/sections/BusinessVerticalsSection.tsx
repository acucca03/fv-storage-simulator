import { projectProfile } from "@/config/project";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Text } from "@/components/ui/Text";

export function BusinessVerticalsSection() {
  const presets = Object.values(projectProfile.business.presets);

  return (
    <Section id="verticals">
      <Container>
        <SectionHeading
          eyebrow="Verticali business"
          title="Una sola base madre, adattabile a più categorie di clienti."
          description="Ogni verticale ha CTA, focus SEO, sezioni consigliate e obiettivi di conversione propri."
        />

        <ResponsiveGrid columns="2" className="mt-10 sm:mt-12">
          {presets.map((preset) => {
            const isActive = preset.id === projectProfile.business.activeVertical;

            return (
              <Card
                key={preset.id}
                tone={isActive ? "elevated" : "default"}
                className="flex h-full flex-col gap-5"
              >
                <div>
                  <Badge variant={isActive ? "premium" : "neutral"}>
                    {isActive ? "Attivo — " : ""}
                    {preset.label}
                  </Badge>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                    {preset.headline}
                  </h3>

                  <Text className="mt-3" tone="muted" size="sm">
                    {preset.description}
                  </Text>
                </div>

                <FeatureList items={preset.sections.slice(0, 4)} columns="two" />
              </Card>
            );
          })}
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
