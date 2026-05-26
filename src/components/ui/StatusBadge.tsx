import type { HTMLAttributes } from "react";

import { uiTokens } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "success" | "warning";

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-white/10 bg-white/[0.03] text-neutral-300",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-100",
};

export function StatusBadge({
  tone = "neutral",
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium",
        uiTokens.transition,
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
