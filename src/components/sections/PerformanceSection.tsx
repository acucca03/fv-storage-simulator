import { performanceTargets } from "@/config/foundation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PerformanceSection() {
  return (
    <Section id="performance">
      <Container>
        <SectionHeading
          eyebrow="Ultra veloce"
          title="La 2.0.0 nasce con un budget prestazionale, non con ottimizzazioni casuali alla fine."
        />

        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {performanceTargets.map((target) => (
            <Card key={target.metric}>
              <p className="font-mono text-sm text-neutral-500">
                {target.metric}
              </p>
              <p className="mt-4 text-2xl font-bold tracking-tight text-white">
                {target.target}
              </p>
              <p className="mt-4 text-sm leading-7 text-neutral-400">
                {target.reason}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
