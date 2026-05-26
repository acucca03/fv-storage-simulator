import { projectProfile } from "@/config/project";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function FoundationHero() {
  return (
    <Section
      id="foundation"
      className="flex min-h-[calc(100vh-5rem)] items-center"
    >
      <Container>
        <Badge variant="premium">Target {projectProfile.release.targetVersion}</Badge>

        <h1 className="mt-6 max-w-5xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {projectProfile.positioning.headline}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300 sm:text-lg">
          {projectProfile.positioning.description}
        </p>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-500 sm:text-base">
          {projectProfile.positioning.promise}
        </p>

        <div
          className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          aria-label={`Progresso verso la versione ${projectProfile.release.targetVersion}: ${projectProfile.release.progress}%`}
        >
          <div className="flex items-center justify-between gap-4 text-sm text-neutral-300">
            <span>
              Progresso verso {projectProfile.release.label}{" "}
              {projectProfile.release.targetVersion}
            </span>
            <strong className="text-white">{projectProfile.release.progress}%</strong>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${projectProfile.release.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton href="#active-business">
            Preset attivo
          </LinkButton>
          <LinkButton href="#recommended-sections" variant="secondary">
            Sezioni consigliate
          </LinkButton>
          <LinkButton href="#performance" variant="secondary">
            Performance
          </LinkButton>
          <LinkButton href="#quality" variant="secondary">
            Qualità
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
