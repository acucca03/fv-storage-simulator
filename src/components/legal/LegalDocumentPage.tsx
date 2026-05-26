import Link from "next/link";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalDocumentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
};

export function LegalDocumentPage({
  eyebrow,
  title,
  description,
  sections,
}: LegalDocumentPageProps) {
  return (
    <main className="bg-[#f7f4ec] px-6 py-20 text-[#1f2933]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex rounded-full border border-[#d8cbb3] px-4 py-2 text-sm font-semibold text-[#173b47] transition hover:bg-white"
        >
          Torna alla home
        </Link>

        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.28em] text-[#7c6f5a]">
          {eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#173b47] md:text-6xl">
          {title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-[#4a5a62]">{description}</p>

        <div className="mt-12 rounded-[2rem] border border-[#e4dac7] bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold text-[#7c6f5a]">
            Ultimo aggiornamento: maggio 2026
          </p>

          <div className="mt-8 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold text-[#173b47]">
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4 text-base leading-8 text-[#4a5a62]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
