import { businessModulesConfig } from "@/config/business-modules";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Surface } from "@/components/ui/Surface";

export function BusinessModulesSection() {
  return (
    <Section id="business-modules">
      <Container>
        <SectionHeading
          eyebrow="Moduli riutilizzabili"
          title="La base 2.0.0 deve adattarsi al cliente senza riscrivere tutto da zero."
        />

        <Surface className="mt-10 sm:mt-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <StatusBadge tone="success">Business-ready</StatusBadge>
              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-300">
                {businessModulesConfig.goal}
              </p>
            </div>

            <div className="lg:max-w-md">
              <FeatureList items={businessModulesConfig.rules} />
            </div>
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          {businessModulesConfig.modules.map((module) => (
            <Card key={module.name}>
              <Badge>{module.name}</Badge>
              <p className="mt-5 text-sm leading-7 text-neutral-400">
                {module.purpose}
              </p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Utile per
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {module.usefulFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-neutral-300">
                {module.conversion}
              </p>
            </Card>
          ))}
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
