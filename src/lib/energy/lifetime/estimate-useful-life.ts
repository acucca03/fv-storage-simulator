import { ENERGY_ECONOMIC_ASSUMPTIONS } from "@/lib/energy/economics/economic-assumptions";

export type BatteryUsefulLifeLimit = "calendar" | "cycles" | "not_applicable";

function roundUsefulLife(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.round(value * 10) / 10;
}

export function estimateSystemUsefulLife(params: {
  batteryKwh: number;
  equivalentBatteryCycles: number;
}) {
  const pvUsefulLifeYears = ENERGY_ECONOMIC_ASSUMPTIONS.pvUsefulLifeYears;
  const batteryCycleLifeCycles =
    ENERGY_ECONOMIC_ASSUMPTIONS.batteryCycleLifeCycles;
  const batteryCalendarLifeYears =
    ENERGY_ECONOMIC_ASSUMPTIONS.batteryCalendarLifeYears;

  if (params.batteryKwh <= 0) {
    return {
      pvUsefulLifeYears,
      batteryUsefulLifeYears: 0,
      batteryUsefulLifeLimit: "not_applicable" as const,
      batteryCycleLifeCycles,
      batteryCalendarLifeYears,
    };
  }

  const equivalentBatteryCycles = Math.max(0, params.equivalentBatteryCycles);

  /*
   * Modello pragmatico per accumulo domestico:
   * - 15 anni come limite massimo calendario/garanzia a cicli quasi nulli;
   * - l'invecchiamento calendario viene convertito in cicli equivalenti annui;
   * - i cicli annui simulati si sommano all'usura calendario equivalente.
   *
   * Con 6000 cicli e 15 anni:
   * usura calendario equivalente = 400 cicli/anno.
   * 0 cicli/anno   -> 15 anni
   * 200 cicli/anno -> circa 10 anni
   * 300 cicli/anno -> circa 8,6 anni
   */
  const calendarEquivalentCyclesPerYear =
    batteryCycleLifeCycles / batteryCalendarLifeYears;

  const annualEquivalentWearCycles =
    calendarEquivalentCyclesPerYear + equivalentBatteryCycles;

  const batteryUsefulLifeYears =
    batteryCycleLifeCycles / annualEquivalentWearCycles;

  const batteryUsefulLifeLimit: BatteryUsefulLifeLimit =
    equivalentBatteryCycles > calendarEquivalentCyclesPerYear
      ? "cycles"
      : "calendar";

  return {
    pvUsefulLifeYears,
    batteryUsefulLifeYears: roundUsefulLife(batteryUsefulLifeYears),
    batteryUsefulLifeLimit,
    batteryCycleLifeCycles,
    batteryCalendarLifeYears,
  };
}
