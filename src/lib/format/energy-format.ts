export function formatKwh(value: number) {
  return new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKwp(value: number) {
  return new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCycles(value: number) {
  return new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 0,
  }).format(value);
}
