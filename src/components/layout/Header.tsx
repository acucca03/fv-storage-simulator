import Link from "next/link";

import { navigationConfig } from "@/config/navigation";
import { projectProfile } from "@/config/project";
import { Container } from "@/components/ui/Container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/85 py-4 text-white backdrop-blur">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="w-fit text-sm font-semibold tracking-tight outline-none transition hover:text-neutral-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base"
        >
          {projectProfile.identity.name}
        </Link>

        <nav
          aria-label="Navigazione principale"
          className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-neutral-400 sm:gap-5"
        >
          {navigationConfig.main.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="outline-none transition hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
