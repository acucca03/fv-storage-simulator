import type { TextareaHTMLAttributes } from "react";

import { uiTokens } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 rounded-xl px-4 py-3",
        uiTokens.input,
        uiTokens.transition,
        uiTokens.focusRing,
        className,
      )}
      {...props}
    />
  );
}
