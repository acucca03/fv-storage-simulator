import { projectProfile } from "@/config/project";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function VerticalBlueprintsSection() {
  const presets = Object.values(projectProfile.business.presets);

  return (
    <Section id="vertical-blueprints">
      <Container>
        <SectionHeading
          eyebrow="Blueprint verticali"
          title="Ogni categoria di cliente ha una sequenza consigliata di sezioni."
          description="I blueprint sono guidati dai preset business e possono essere adattati senza riscrivere i componenti."
        />

        <ResponsiveGrid columns="2" className="mt-10 sm:mt-12">
          {presets.map((preset) => {
            const isActive = preset.id === projectProfile.business.activeVertical;

            return (
              <Card
                key={preset.id}
                tone={isActive ? "elevated" : "default"}
                className="flex h-full flex-col gap-6"
              >
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {preset.label}
                  </h3>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <StatusBadge tone={isActive ? "success" : "neutral"}>
                      CTA: {preset.primaryAction.label}
                    </StatusBadge>
                    <StatusBadge>{preset.secondaryAction.label}</StatusBadge>
                  </div>
                </div>

                <FeatureList items={preset.sections} />
              </Card>
            );
          })}
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
