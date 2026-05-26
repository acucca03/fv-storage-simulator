export type ConsumptionSource = "uploaded_file" | "statistical_profile";

export type OptimizationGoal =
  | "target_self_consumption"
  | "maximize_self_sufficiency"
  | "balanced"
  | "minimize_grid_import";

export type ConfidenceLevel = "low" | "medium" | "high" | "very_high";

export type MinuteEnergyPoint = {
  timestamp: string;
  consumptionKwh: number;
  source: ConsumptionSource;
  originalResolutionMinutes?: number;
  confidence: ConfidenceLevel;
};

export type UploadedConsumptionPoint = {
  timestamp: string;
  consumptionKwh: number;
  originalResolutionMinutes?: number;
};

export type PvMinutePoint = {
  timestamp: string;
  productionKwh: number;
  source: "pvgis" | "estimated" | "mock";
  originalResolutionMinutes?: number;
  pvKwp: number;
};

export type BatteryConfig = {
  nominalCapacityKwh: number;
  usableCapacityKwh: number;
  minSocPercent: number;
  maxSocPercent: number;
  chargeEfficiency: number;
  dischargeEfficiency: number;
  maxChargeKw: number;
  maxDischargeKw: number;
};

export type SimulationMinuteResult = {
  timestamp: string;
  consumptionKwh: number;
  pvProductionKwh: number;
  directSelfConsumptionKwh: number;
  batteryChargeKwh: number;
  batteryDischargeKwh: number;
  gridImportKwh: number;
  gridExportKwh: number;
  batterySocKwh: number;
};

export type SimulationSummary = {
  annualConsumptionKwh: number;
  annualPvProductionKwh: number;
  directSelfConsumptionKwh: number;
  batterySelfConsumptionKwh: number;
  gridImportKwh: number;
  gridExportKwh: number;
  selfConsumptionPercent: number;
  selfSufficiencyPercent: number;
  recommendedPvKwp: number;
  recommendedBatteryKwh: number;
  equivalentBatteryCycles: number;
  pvUsefulLifeYears: number;
  batteryUsefulLifeYears: number;
  batteryUsefulLifeLimit: "calendar" | "cycles" | "not_applicable";
  batteryCycleLifeCycles: number;
  batteryCalendarLifeYears: number;
  preciseRecommendedPvKwp?: number;
  preciseRecommendedBatteryKwh?: number;
  roundedRecommendedPvKwp?: number;
  roundedRecommendedBatteryKwh?: number;
  commercialRoundingNote?: string;
  estimatedInvestmentEur?: number;
  annualEnergySavingsEur?: number;
  simplePaybackYears?: number;
  baselineAnnualEnergyCostEur?: number;
  estimatedAnnualEnergyCostAfterSystemEur?: number;
  targetStatus?: "achieved" | "partial";
  targetSelfConsumptionPercent?: number;
  selfConsumptionTargetGapPercent?: number;
};

export type ConsumptionProfileInput = {
  annualConsumptionKwh: number;
  startDate?: string;
  days?: number;
  people?: string;
  daytimePresence?: string;
  mainUsage?: string;
  cooling?: string;
  heating?: string;
  cooking?: string;
  ev?: string;
};

export type PvProfileInput = {
  pvKwp: number;
  annualSpecificYieldKwhPerKwp?: number;
  startDate?: string;
  days?: number;
};

export type SimulationConfig = {
  consumptionProfile: MinuteEnergyPoint[];
  pvProfile: PvMinutePoint[];
  battery: BatteryConfig;
  pvKwp: number;
  batteryKwh: number;
  keepMinuteResults?: boolean;
};

export type OptimizationInput = {
  consumptionProfile: MinuteEnergyPoint[];
  targetSelfConsumptionPercent: number;
  goal?: OptimizationGoal;
  pvProfileFactory?: (pvKwp: number, days: number) => PvMinutePoint[];
};

export type OptimizationResult = {
  bestSummary: SimulationSummary;
  testedResults: SimulationSummary[];
};

export type SimulationReportPeriod = {
  label: string;
  sortKey: string;
  consumptionKwh: number;
  pvProductionKwh: number;
  directSelfConsumptionKwh: number;
  batteryChargeKwh: number;
  batteryDischargeKwh: number;
  gridImportKwh: number;
  gridExportKwh: number;
  averageBatterySocKwh: number;
  maxBatterySocKwh: number;
};

export type SimulationReportSeries = {
  daily: SimulationReportPeriod[];
  monthly: SimulationReportPeriod[];
};
