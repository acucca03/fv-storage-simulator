import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn("max-w-3xl", centered && "mx-auto text-center", className)}
      {...props}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
          {eyebrow}
        </p>
    ) : null}

      <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-6 text-lg leading-8 text-neutral-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
