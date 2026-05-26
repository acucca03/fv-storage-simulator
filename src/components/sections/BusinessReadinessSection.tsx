import { businessContentCatalog } from "@/config/business-content";
import { projectProfile } from "@/config/project";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Text } from "@/components/ui/Text";

export function BusinessReadinessSection() {
  const contact = businessContentCatalog.contactBlueprint;

  return (
    <Section id="business-readiness">
      <Container>
        <SectionHeading
          eyebrow="Prontezza progetto reale"
          title="FAQ, contatti e CTA devono essere già previsti nella foundation."
          description="La base non deve limitarsi all'estetica: deve aiutare a costruire pagine che rispondono, convincono e portano all'azione."
        />

        <ResponsiveGrid columns="2" className="mt-10 sm:mt-12">
          <Card>
            <Badge>FAQ blueprint</Badge>

            <div className="mt-6 grid gap-5">
              {businessContentCatalog.faqBlueprint.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold text-white">{item.question}</h3>
                  <Text className="mt-2" tone="muted" size="sm">
                    {item.answer}
                  </Text>
                </div>
              ))}
            </div>
          </Card>

          <Card tone="elevated">
            <Badge variant="premium">{contact.title}</Badge>

            <Text className="mt-5" tone="muted">
              {contact.description}
            </Text>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Canali minimi
              </p>
              <div className="mt-4">
                <FeatureList items={contact.requiredChannels} />
              </div>
            </div>
          </Card>
        </ResponsiveGrid>

        <Card className="mt-10">
          <h3 className="text-xl font-semibold tracking-tight text-white">
            Regole CTA per {projectProfile.business.preset.label}
          </h3>

          <div className="mt-5">
            <FeatureList items={contact.rules} columns="two" />
          </div>
        </Card>
      </Container>
    </Section>
  );
}
