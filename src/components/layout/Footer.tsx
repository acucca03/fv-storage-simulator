import Link from "next/link";

import { navigationConfig } from "@/config/navigation";
import { projectProfile } from "@/config/project";
import { Container } from "@/components/ui/Container";

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/cookie", label: "Cookie" },
  { href: "/termini", label: "Termini" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#102c35] py-12 text-white">
      <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold">{projectProfile.identity.name}</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            Simulatore professionale per stimare in modo preliminare impianti
            fotovoltaici domestici con accumulo, consumi reali, produzione solare
            e scenari economici.
          </p>
          <p className="mt-4 max-w-xl text-xs leading-6 text-white/55">
            Le simulazioni sono orientative e non sostituiscono progetto tecnico,
            sopralluogo, verifica normativa o preventivo commerciale.
          </p>
        </div>

        <nav aria-label="Navigazione footer" className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
            Sito
          </p>

          <div className="flex flex-col gap-3 text-sm text-white/70">
            <Link
              href="/"
              className="transition hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Home
            </Link>

            {navigationConfig.footer.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="transition hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <nav aria-label="Informazioni legali" className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
            Informazioni
          </p>

          <div className="flex flex-col gap-3 text-sm text-white/70">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </Container>

      <Container className="mt-10 border-t border-white/10 pt-6">
        <p className="text-xs leading-6 text-white/45">
          © {new Date().getFullYear()} {projectProfile.identity.name}. Versione
          in validazione pre-deploy. I dati del titolare saranno completati prima
          della pubblicazione commerciale definitiva.
        </p>
      </Container>
    </footer>
  );
}
