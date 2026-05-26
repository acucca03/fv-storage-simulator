import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StackGap = "xs" | "sm" | "md" | "lg" | "xl";

type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: StackGap;
};

const gapClasses: Record<StackGap, string> = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
  xl: "gap-12",
};

export function Stack({
  gap = "md",
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div className={cn("flex flex-col", gapClasses[gap], className)} {...props}>
      {children}
    </div>
  );
}
