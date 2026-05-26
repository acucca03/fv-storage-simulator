export const ENERGY_ECONOMIC_ASSUMPTIONS = {
  electricityPurchasePriceEurPerKwh: 0.28,
  exportedEnergyValueEurPerKwh: 0.1,
  pvCostEurPerKwp: 1_500,
  batteryCostEurPerKwh: 650,
  fixedInstallationCostEur: 1_200,
  pvUsefulLifeYears: 25,
  pvAnnualDegradationRate: 0.005,
  batteryCycleLifeCycles: 6000,
  batteryCalendarLifeYears: 15,
  batteryEndOfLifeCapacityPercent: 70,
} as const;
