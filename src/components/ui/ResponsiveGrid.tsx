import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GridColumns = "1" | "2" | "3" | "4";

type ResponsiveGridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: GridColumns;
};

const columnClasses: Record<GridColumns, string> = {
  "1": "",
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

export function ResponsiveGrid({
  columns = "3",
  className,
  children,
  ...props
}: ResponsiveGridProps) {
  return (
    <div className={cn("grid gap-4 sm:gap-5", columnClasses[columns], className)} {...props}>
      {children}
    </div>
  );
}
