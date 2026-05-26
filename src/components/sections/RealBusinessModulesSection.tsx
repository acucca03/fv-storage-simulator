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

export function RealBusinessModulesSection() {
  const activeVertical = projectProfile.business.activeVertical;

  const modules = businessContentCatalog.serviceModules.filter((module) =>
    module.usefulFor.includes(activeVertical),
  );

  return (
    <Section id="real-business-modules">
      <Container>
        <SectionHeading
          eyebrow="Moduli reali"
          title="Blocchi concreti per trasformare la base in siti veri."
          description="Questi moduli rappresentano esigenze reali: offerta, fiducia, presenza locale, metodo, FAQ e contatto."
        />

        <ResponsiveGrid columns="2" className="mt-10 sm:mt-12">
          {modules.map((module) => (
            <Card key={module.id} tone="elevated">
              <Badge variant="premium">{module.title}</Badge>

              <Text className="mt-5" tone="muted">
                {module.description}
              </Text>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Obiettivo
                </p>
                <Text className="mt-3" size="sm">
                  {module.outcome}
                </Text>
              </div>
            </Card>
          ))}
        </ResponsiveGrid>

        <Card className="mt-10" tone="default">
          <h3 className="text-xl font-semibold tracking-tight text-white">
            Segnali di fiducia richiesti
          </h3>

          <div className="mt-5">
            <FeatureList items={businessContentCatalog.trustSignals} columns="two" />
          </div>
        </Card>
      </Container>
    </Section>
  );
}
