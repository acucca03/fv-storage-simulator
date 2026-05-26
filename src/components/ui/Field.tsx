import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  children: ReactNode;
  className?: string;
};

export function Field({ children, className }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}
