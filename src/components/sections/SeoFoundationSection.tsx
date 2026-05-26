import { seoProfile } from "@/config/seo-profile";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Surface } from "@/components/ui/Surface";

export function SeoFoundationSection() {
  return (
    <Section id="seo">
      <Container>
        <SectionHeading
          eyebrow="SEO locale"
          title="Metadata, sitemap, robots e dati strutturati collegati al preset attivo."
        />

        <Surface className="mt-10 sm:mt-12" tone="strong">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <StatusBadge tone="success">SEO-ready</StatusBadge>
              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-300">
                La base centralizza metadata, Open Graph, sitemap, robots e
                JSON-LD. Il tipo schema.org segue il verticale attivo:
                {" "}
                <strong className="text-white">{seoProfile.business.schemaType}</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-neutral-400 lg:max-w-md">
              Ogni progetto derivato dovrà sostituire URL, contatti, indirizzo,
              keyword locali e informazioni reali del cliente prima della
              pubblicazione.
            </div>
          </div>

          <div className="mt-8">
            <FeatureList items={seoProfile.rules} columns="two" />
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          <Card tone="elevated">
            <Badge variant="premium">Schema attivo</Badge>
            <p className="mt-5 text-2xl font-bold tracking-tight text-white">
              {seoProfile.business.schemaType}
            </p>
            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Tipo di dato strutturato collegato al preset business attivo.
            </p>
          </Card>

          <Card>
            <Badge>Keyword verticali</Badge>
            <div className="mt-5">
              <FeatureList items={seoProfile.business.seoFocus} />
            </div>
          </Card>

          <Card>
            <Badge>CTA SEO coerente</Badge>
            <p className="mt-5 text-lg font-semibold tracking-tight text-white">
              {seoProfile.business.primaryAction.label}
            </p>
            <p className="mt-4 text-sm leading-7 text-neutral-400">
              {seoProfile.business.primaryAction.intent}
            </p>
          </Card>
        </ResponsiveGrid>
      </Container>
    </Section>
  );
}
