import type { HTMLAttributes } from "react";

import { uiTokens } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

type BadgeVariant = "neutral" | "premium" | "success" | "warning";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "border-white/10 bg-white/5 text-neutral-300",
  premium: "border-white/15 bg-white/10 text-white",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-100",
};

export function Badge({
  children,
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium",
        uiTokens.transition,
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
