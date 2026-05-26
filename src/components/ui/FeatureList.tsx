import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type FeatureListProps = HTMLAttributes<HTMLUListElement> & {
  items: readonly string[];
  columns?: "one" | "two";
};

const columnClasses = {
  one: "",
  two: "sm:grid-cols-2",
} as const;

export function FeatureList({
  items,
  columns = "one",
  className,
  ...props
}: FeatureListProps) {
  return (
    <ul
      className={cn("grid gap-2 text-sm text-neutral-300", columnClasses[columns], className)}
      {...props}
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl bg-white/[0.04] px-3 py-2 leading-6"
        >
          <span aria-hidden="true" className="text-neutral-500">
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
