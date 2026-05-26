import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionSpacing = "sm" | "md" | "lg";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  spacing?: SectionSpacing;
};

const spacingClasses: Record<SectionSpacing, string> = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-24 lg:py-32",
};

export function Section({
  children,
  className,
  spacing = "md",
  ...props
}: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)} {...props}>
      {children}
    </section>
  );
}
