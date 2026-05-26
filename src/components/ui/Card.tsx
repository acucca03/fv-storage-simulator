import type { HTMLAttributes, ReactNode } from "react";

import { uiTokens, type UISurfaceTone } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: UISurfaceTone;
};

export function Card({
  children,
  className,
  tone = "default",
  ...props
}: CardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border p-6",
        uiTokens.surface[tone],
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}
