import { qualityPillars, releaseMilestones } from "@/config/foundation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const statusLabel = {
  ready: "Pronto",
  "in-progress": "In corso",
  planned: "Pianificato",
} as const;

export function QualitySection() {
  return (
    <Section id="quality">
      <Container>
        <SectionHeading
          eyebrow="Sistema qualità"
          title="La versione 2.0.0 deve essere misurabile, non solo dichiarata."
        />

        <div className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-2">
          {qualityPillars.map((pillar) => (
            <Card key={pillar.title}>
              <h3 className="text-xl font-semibold tracking-tight text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                {pillar.description}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-neutral-300">
                {pillar.checks.map((check) => (
                  <li key={check} className="flex gap-2">
                    <span aria-hidden="true" className="text-neutral-500">
                      —
                    </span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Roadmap committabile verso la 2.0.0
          </h3>

          <div className="mt-6 grid gap-3">
            {releaseMilestones.map((milestone) => (
              <Card key={milestone.title} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="font-semibold text-white">
                      {milestone.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-neutral-400">
                      {milestone.description}
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">
                    {statusLabel[milestone.status]}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
