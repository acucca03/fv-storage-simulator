import { projectProfile } from "@/config/project";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Text } from "@/components/ui/Text";

export function BusinessSectionsSection() {
  const sections = projectProfile.business.recommendedSections;

  return (
    <Section id="recommended-sections">
      <Container>
        <SectionHeading
          eyebrow="Sezioni consigliate"
          title="Una sequenza pronta per trasformare la foundation in un sito reale."
          description="Ogni preset business espone una struttura consigliata: cambia il verticale, cambia la sequenza, ma la base tecnica resta la stessa."
        />

        <ResponsiveGrid columns="3" className="mt-10 sm:mt-12">
          {sections.map((section, index) => (
            <Card key={section} tone={index === 0 ? "elevated" : "default"}>
              <Badge variant={index === 0 ? "premium" : "neutral"}>
                Sezione {index + 1}
              </Badge>

              <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                {section}
              </h3>

              <Text className="mt-4" tone="muted" size="sm">
                Modulo previsto dal preset attivo per costruire una pagina più
                concreta, ordinata e orientata alla conversione.
              </Text>
            </Card>
          ))}
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
