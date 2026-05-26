import type { BatteryConfig } from "@/types/energy";

export function createDefaultBatteryConfig(nominalCapacityKwh: number): BatteryConfig {
  const usableCapacityKwh = nominalCapacityKwh * 0.9;

  return {
    nominalCapacityKwh,
    usableCapacityKwh,
    minSocPercent: 10,
    maxSocPercent: 100,
    chargeEfficiency: 0.95,
    dischargeEfficiency: 0.95,
    maxChargeKw: Math.max(2.5, nominalCapacityKwh * 0.5),
    maxDischargeKw: Math.max(2.5, nominalCapacityKwh * 0.5),
  };
}
