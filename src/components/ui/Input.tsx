import type { InputHTMLAttributes } from "react";

import { uiTokens } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 rounded-xl px-4",
        uiTokens.input,
        uiTokens.transition,
        uiTokens.focusRing,
        className,
      )}
      {...props}
    />
  );
}
