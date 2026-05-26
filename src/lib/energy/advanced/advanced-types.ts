import type { MinuteEnergyPoint, PvMinutePoint } from "@/types/energy";

export type AdvancedSizingGrid = {
  pvSizesKwp: number[];
  batterySizesKwh: number[];
};

export type CostPoint = {
  size: number;
  costEur: number;
};

export type AdvancedEconomicAssumptions = {
  analysisYears: number;

  gridImportPriceEurPerKwh: number;
  gridExportValueEurPerKwh: number;

  pvMaterialCostEurPerKwp: number;
  fixedSystemCostEur: number;
  baseLaborCostEur: number;
  laborCostEurPerKwp: number;

  inverterCostTable: CostPoint[];
  batteryCostTable: CostPoint[];

  batteryReplacementYear: number;
  batteryReplacementCostFactor: number;

  taxDeductionEnabled: boolean;
  taxDeductionRate: number;
  taxDeductionYears: number;
  deductibleInvestmentShare: number;

  annualFixedMaintenanceEur: number;
  annualPvMaintenanceEurPerKwp: number;
  annualBatteryMaintenanceEurPerKwh: number;
};

export type AdvancedBatteryAssumptions = {
  chargeEfficiency: number;
  dischargeEfficiency: number;
  minSocPercent: number;
  maxSocPercent: number;
  initialSocPercent: number;
  useAbsolutePowerLimit: boolean;
  absolutePowerLimitKw: number;
};

export type AdvancedDomesticConstraints = {
  enabled: boolean;
  maxProductionToConsumptionRatio: number;
  minUsefulSelfConsumptionPercent: number;
  maxPaybackYears: number;
  maxInitialInvestmentEur: number;
  requirePositiveNetBalance: boolean;
};

export type AdvancedCompromiseWeights = {
  netBalance: number;
  payback: number;
  roi: number;
  selfConsumption: number;
  selfSufficiency: number;
  investment: number;
};

export type AdvancedEngineConfig = {
  sizing: AdvancedSizingGrid;
  economics: AdvancedEconomicAssumptions;
  battery: AdvancedBatteryAssumptions;
  domesticConstraints: AdvancedDomesticConstraints;
  compromiseWeights: AdvancedCompromiseWeights;
};

export type AdvancedEnergyResult = {
  pvKwp: number;
  batteryKwh: number;

  annualConsumptionKwh: number;
  annualPvProductionKwh: number;
  productionToConsumptionRatio: number;

  directSelfConsumptionKwh: number;
  pvToBatteryKwh: number;
  batteryToLoadKwh: number;
  batteryLossesKwh: number;

  usefulSelfConsumptionKwh: number;
  gridImportKwh: number;
  gridExportKwh: number;

  usefulSelfConsumptionPercent: number;
  pvUtilizationPercent: number;
  selfSufficiencyPercent: number;
};

export type AdvancedEconomicResult = {
  pvMaterialCostEur: number;
  inverterCostEur: number;
  installationCostEur: number;
  initialBatteryCostEur: number;
  batteryReplacementCostEur: number;

  initialInvestmentEur: number;

  annualCostWithoutSystemEur: number;
  annualEnergyCostWithSystemEur: number;
  annualMaintenanceEur: number;
  annualOperatingBenefitEur: number;

  taxDeductionTotalEur: number;
  taxDeductionAnnualEur: number;
  taxDeductionRecoveredEur: number;

  totalCostWithoutSystemEur: number;
  totalCostWithSystemEur: number;

  netBalance20YearsEur: number;
  roi20YearsPercent: number;
  paybackYears: number | null;
};

export type AdvancedSystemResult = AdvancedEnergyResult &
  AdvancedEconomicResult & {
    isDomesticValid: boolean;
    domesticInvalidReasons: string[];
    compromiseScore?: number;
  };

export type AdvancedBatteryComparison = {
  pvKwp: number;

  bestBatteryKwh: number;
  bestBatteryNetBalanceEur: number;
  noBatteryNetBalanceEur: number;
  batteryNetAdvantageEur: number;

  bestBatteryPaybackYears: number | null;
  noBatteryPaybackYears: number | null;

  bestBatterySelfSufficiencyPercent: number;
  noBatterySelfSufficiencyPercent: number;
  selfSufficiencyGainPercent: number;

  bestBatteryUsefulSelfConsumptionPercent: number;
  noBatteryUsefulSelfConsumptionPercent: number;
  usefulSelfConsumptionGainPercent: number;

  batteryEconomicallyUseful: boolean;
};

export type AdvancedScenarioSelection = {
  bestNetBalance?: AdvancedSystemResult;
  bestPayback?: AdvancedSystemResult;
  bestRoi?: AdvancedSystemResult;
  bestCompromise?: AdvancedSystemResult;
};

export type AdvancedOptimizationResult = {
  usedConfig: AdvancedEngineConfig;
  allResults: AdvancedSystemResult[];

  freeScenario: AdvancedScenarioSelection;
  domesticScenario: AdvancedScenarioSelection;

  domesticResults: AdvancedSystemResult[];
  bestBatteryForEachPv: AdvancedSystemResult[];
  batteryComparisons: AdvancedBatteryComparison[];

  recommendedDomestic?: AdvancedSystemResult;
  warnings: string[];
};

export type AdvancedOptimizationInput = {
  consumptionProfile: MinuteEnergyPoint[];
  pvProfileFactory: (pvKwp: number, days: number) => PvMinutePoint[];
  config?: PartialAdvancedEngineConfig;
};

export type PartialAdvancedEngineConfig = Partial<{
  sizing: Partial<AdvancedSizingGrid>;
  economics: Partial<AdvancedEconomicAssumptions>;
  battery: Partial<AdvancedBatteryAssumptions>;
  domesticConstraints: Partial<AdvancedDomesticConstraints>;
  compromiseWeights: Partial<AdvancedCompromiseWeights>;
}>;
