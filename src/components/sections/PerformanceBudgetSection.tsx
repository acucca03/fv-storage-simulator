import { performanceConfig } from "@/config/performance";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { MetricCard } from "@/components/ui/MetricCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Surface } from "@/components/ui/Surface";

export function PerformanceBudgetSection() {
  return (
    <Section id="performance-budget">
      <Container>
        <SectionHeading
          eyebrow="Performance budget"
          title="Ultra veloce non è uno slogan: è un vincolo tecnico della base 2.0.0."
        />

        <Surface className="mt-10 sm:mt-12" tone="strong">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <StatusBadge tone="success">Static-first</StatusBadge>
              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-300">
                {performanceConfig.goal}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-neutral-400 lg:max-w-md">
              La regola è che ogni nuovo modulo deve essere valutato anche per
              peso, rendering, stabilità visiva e impatto sul mobile.
            </div>
          </div>

          <div className="mt-8">
            <FeatureList items={performanceConfig.principles} columns="two" />
          </div>
        </Surface>

        <ResponsiveGrid columns="3" className="mt-10">
          {performanceConfig.budgets.map((budget) => (
            <MetricCard
              key={budget.metric}
              label={budget.metric}
              value={budget.strictTarget}
              description={`${budget.meaning} Target minimo: ${budget.target}.`}
            />
          ))}
        </ResponsiveGrid>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Controlli automatici
          </h3>

          <ResponsiveGrid columns="4" className="mt-6">
            {performanceConfig.checks.map((check) => (
              <Card key={check.name} className="p-5">
                <p className="text-sm font-semibold text-white">{check.name}</p>
                <p className="mt-3 break-words font-mono text-xs leading-6 text-neutral-500">
                  {check.command}
                </p>
                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  {check.expected}
                </p>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Cose che non entrano nella base madre
          </h3>

          <div className="mt-6">
            <FeatureList items={performanceConfig.forbiddenPatterns} columns="two" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
