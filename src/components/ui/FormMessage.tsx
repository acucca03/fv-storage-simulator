import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormMessageTone = "default" | "error" | "success";

type FormMessageProps = {
  children: ReactNode;
  tone?: FormMessageTone;
  className?: string;
};

const toneClasses: Record<FormMessageTone, string> = {
  default: "text-neutral-500",
  error: "text-red-300",
  success: "text-emerald-300",
};

export function FormMessage({
  children,
  tone = "default",
  className,
}: FormMessageProps) {
  return (
    <p className={cn("text-sm leading-6", toneClasses[tone], className)}>
      {children}
    </p>
  );
}
