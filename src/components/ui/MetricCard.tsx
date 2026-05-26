import type { HTMLAttributes } from "react";

import { Card } from "@/components/ui/Card";

type MetricCardProps = HTMLAttributes<HTMLElement> & {
  label: string;
  value: string;
  description: string;
};

export function MetricCard({
  label,
  value,
  description,
  className,
  ...props
}: MetricCardProps) {
  return (
    <Card className={className} {...props}>
      <p className="font-mono text-sm text-neutral-500">{label}</p>
      <p className="mt-4 text-2xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-4 text-sm leading-7 text-neutral-400">{description}</p>
    </Card>
  );
}
