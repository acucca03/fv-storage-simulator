import { foundationConfig } from "@/config/foundation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PrinciplesSection() {
  return (
    <Section id="principles">
      <Container>
        <SectionHeading
          eyebrow="Principi di costruzione"
          title="Ogni blocco della 2.0.0 deve essere solido, leggero e riutilizzabile."
        />

        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2">
          {foundationConfig.principles.map((principle) => (
            <Card key={principle}>
              <p className="text-sm leading-7 text-neutral-300">{principle}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
