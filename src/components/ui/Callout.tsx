import type { HTMLAttributes, ReactNode } from "react";

import { Surface } from "@/components/ui/Surface";
import { uiTokens } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

type CalloutTone = "info" | "success" | "warning";

type CalloutProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  children: ReactNode;
  tone?: CalloutTone;
};

const toneClasses: Record<CalloutTone, string> = {
  info: "text-sky-100",
  success: "text-emerald-100",
  warning: "text-amber-100",
};

const markerClasses: Record<CalloutTone, string> = {
  info: "bg-sky-300",
  success: "bg-emerald-300",
  warning: "bg-amber-300",
};

export function Callout({
  title,
  children,
  tone = "info",
  className,
  ...props
}: CalloutProps) {
  return (
    <Surface tone="elevated" className={cn("p-5 sm:p-6", className)} {...props}>
      <div className="flex gap-4">
        <span
          aria-hidden="true"
          className={cn("mt-2 size-2 shrink-0 rounded-full", markerClasses[tone])}
        />
        <div>
          <p className={cn("font-semibold", toneClasses[tone])}>{title}</p>
          <div className={cn("mt-3 text-sm leading-7", uiTokens.text.muted)}>
            {children}
          </div>
        </div>
      </div>
    </Surface>
  );
}
