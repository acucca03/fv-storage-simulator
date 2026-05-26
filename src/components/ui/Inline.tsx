import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InlineGap = "xs" | "sm" | "md" | "lg";

type InlineProps = HTMLAttributes<HTMLDivElement> & {
  gap?: InlineGap;
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "between" | "end";
};

const gapClasses: Record<InlineGap, string> = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
} as const;

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  between: "justify-between",
  end: "justify-end",
} as const;

export function Inline({
  gap = "sm",
  align = "center",
  justify = "start",
  className,
  children,
  ...props
}: InlineProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
