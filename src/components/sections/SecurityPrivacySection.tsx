import { securityConfig } from "@/config/security";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Surface } from "@/components/ui/Surface";

export function SecurityPrivacySection() {
  return (
    <Section id="security-privacy">
      <Container>
        <SectionHeading
          eyebrow="Sicurezza e privacy"
          title="La base 2.0.0 deve partire difensiva, prudente e documentata."
        />

        <Surface className="mt-10 sm:mt-12" tone="strong">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <StatusBadge tone="success">Security-ready</StatusBadge>
              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-300">
                {securityConfig.goal}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-neutral-400 lg:max-w-md">
              La base non sostituisce una consulenza legale o un audit di
              sicurezza, ma impone fondamenta tecniche più solide per i siti
              derivati.
            </div>
          </div>

          <div className="mt-8">
            <FeatureList items={securityConfig.principles} columns="two" />
          </div>
        </Surface>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Header principali
          </h3>

          <ResponsiveGrid columns="3" className="mt-6">
            {securityConfig.headers.map((header) => (
              <Card key={header.name}>
                <Badge>{header.name}</Badge>
                <p className="mt-4 break-words font-mono text-xs leading-6 text-neutral-500">
                  {header.value}
                </p>
                <p className="mt-4 text-sm leading-7 text-neutral-400">
                  {header.purpose}
                </p>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Regole gestione dati
          </h3>

          <ResponsiveGrid columns="3" className="mt-6">
            {securityConfig.dataRules.map((item) => (
              <Card key={item.title}>
                <h4 className="text-lg font-semibold tracking-tight text-white">
                  {item.title}
                </h4>
                <p className="mt-4 text-sm leading-7 text-neutral-400">
                  {item.rule}
                </p>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Vietato come default
          </h3>

          <div className="mt-6">
            <FeatureList items={securityConfig.forbiddenDefaults} columns="two" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
