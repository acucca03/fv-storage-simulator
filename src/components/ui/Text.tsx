import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextTone = "body" | "muted" | "subtle";
type TextSize = "sm" | "md" | "lg";

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  tone?: TextTone;
  size?: TextSize;
};

const toneClasses: Record<TextTone, string> = {
  body: "text-neutral-300",
  muted: "text-neutral-400",
  subtle: "text-neutral-500",
};

const sizeClasses: Record<TextSize, string> = {
  sm: "text-sm leading-7",
  md: "text-base leading-8",
  lg: "text-lg leading-8",
};

export function Text({
  tone = "body",
  size = "md",
  className,
  ...props
}: TextProps) {
  return (
    <p
      className={cn(sizeClasses[size], toneClasses[tone], className)}
      {...props}
    />
  );
}
