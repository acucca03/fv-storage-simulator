import type { AdvancedEngineConfig } from "./advanced-types";

export const defaultAdvancedEngineConfig: AdvancedEngineConfig = {
  sizing: {
    pvSizesKwp: [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12],
    batterySizesKwh: [0, 2, 3, 4, 5, 6, 8, 10, 12, 15],
  },

  economics: {
    analysisYears: 20,

    gridImportPriceEurPerKwh: 0.3,
    gridExportValueEurPerKwh: 0.0475,

    pvMaterialCostEurPerKwp: 650,
    fixedSystemCostEur: 900,
    baseLaborCostEur: 900,
    laborCostEurPerKwp: 170,

    inverterCostTable: [
      { size: 1.5, costEur: 700 },
      { size: 3, costEur: 900 },
      { size: 4, costEur: 1100 },
      { size: 6, costEur: 1400 },
      { size: 8, costEur: 1900 },
      { size: 10, costEur: 2400 },
      { size: 12, costEur: 3000 },
    ],

    batteryCostTable: [
      { size: 0, costEur: 0 },
      { size: 2, costEur: 1600 },
      { size: 3, costEur: 2200 },
      { size: 4, costEur: 2800 },
      { size: 5, costEur: 3400 },
      { size: 6, costEur: 4200 },
      { size: 8, costEur: 6000 },
      { size: 10, costEur: 7600 },
      { size: 12, costEur: 8800 },
      { size: 15, costEur: 10500 },
    ],

    batteryReplacementYear: 10,
    batteryReplacementCostFactor: 0.8,

    taxDeductionEnabled: true,
    taxDeductionRate: 0.5,
    taxDeductionYears: 10,
    deductibleInvestmentShare: 1,

    annualFixedMaintenanceEur: 60,
    annualPvMaintenanceEurPerKwp: 8,
    annualBatteryMaintenanceEurPerKwh: 2,
  },

  battery: {
    chargeEfficiency: 0.95,
    dischargeEfficiency: 0.95,
    minSocPercent: 0.1,
    maxSocPercent: 0.9,
    initialSocPercent: 0.1,
    useAbsolutePowerLimit: true,
    absolutePowerLimitKw: 5,
  },

  domesticConstraints: {
    enabled: true,
    maxProductionToConsumptionRatio: 3,
    minUsefulSelfConsumptionPercent: 20,
    maxPaybackYears: 20,
    maxInitialInvestmentEur: Number.POSITIVE_INFINITY,
    requirePositiveNetBalance: true,
  },

  compromiseWeights: {
    netBalance: 0.25,
    payback: 0.25,
    roi: 0.2,
    selfConsumption: 0.15,
    selfSufficiency: 0.1,
    investment: 0.05,
  },
};
