import type { HTMLAttributes } from "react";

import { uiTokens, type UISurfaceTone } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: UISurfaceTone;
};

export function Surface({
  tone = "default",
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn("rounded-3xl border p-5 sm:p-6", uiTokens.surface[tone], className)}
      {...props}
    >
      {children}
    </div>
  );
}
