import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/error.tsx",
  "src/app/not-found.tsx",
  "src/app/api/simulate/route.ts",
  "src/components/simulator/simulator-wizard.tsx",
  "src/lib/energy/consumption/generate-statistical-profile.ts",
  "src/lib/energy/pv/generate-mock-pv-profile.ts",
  "src/lib/energy/simulation/simulate-energy-system.ts",
  "src/lib/energy/optimizer/optimize-system.ts",
  "src/lib/energy/metrics/calculate-summary.ts",
  "src/types/energy.ts",
  "src/config/reliability-profile.ts",
];

function fail(message) {
  console.error(`Reliability verification failed: ${message}`);
  process.exitCode = 1;
}

function exists(path) {
  return existsSync(join(root, path));
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

for (const file of requiredFiles) {
  if (!exists(file)) {
    fail(`missing required reliability file: ${file}`);
  }
}

const apiSource = exists("src/app/api/simulate/route.ts")
  ? read("src/app/api/simulate/route.ts")
  : "";

for (const pattern of [
  "Number.isFinite",
  "annualConsumptionKwh <= 0",
  "status: 400",
  "targetSelfConsumptionPercent",
  "testedResults",
]) {
  if (!apiSource.includes(pattern)) {
    fail(`simulate API missing reliability pattern: ${pattern}`);
  }
}

const wizardSource = exists("src/components/simulator/simulator-wizard.tsx")
  ? read("src/components/simulator/simulator-wizard.tsx")
  : "";

for (const pattern of [
  "try",
  "catch",
  "finally",
  "isSimulating",
  "canContinue",
  "simulation?.error",
  "simulation?.summary",
]) {
  if (!wizardSource.includes(pattern)) {
    fail(`wizard missing reliability UX/error state pattern: ${pattern}`);
  }
}

const simulationSource = exists("src/lib/energy/simulation/simulate-energy-system.ts")
  ? read("src/lib/energy/simulation/simulate-energy-system.ts")
  : "";

for (const pattern of [
  "Math.min(config.consumptionProfile.length, config.pvProfile.length)",
  "Math.max(0",
  "batterySocKwh",
  "gridImportKwh",
  "gridExportKwh",
  "calculateSimulationSummaryFromTotals",
]) {
  if (!simulationSource.includes(pattern)) {
    fail(`simulation engine missing reliability pattern: ${pattern}`);
  }
}

const optimizerSource = exists("src/lib/energy/optimizer/optimize-system.ts")
  ? read("src/lib/energy/optimizer/optimize-system.ts")
  : "";

for (const pattern of [
  "testedResults",
  "scoreSummary",
  "targetSelfConsumptionPercent",
  "keepMinuteResults: false",
]) {
  if (!optimizerSource.includes(pattern)) {
    fail(`optimizer missing reliability/performance pattern: ${pattern}`);
  }
}

const metricsSource = exists("src/lib/energy/metrics/calculate-summary.ts")
  ? read("src/lib/energy/metrics/calculate-summary.ts")
  : "";

for (const pattern of [
  "annualConsumptionKwh > 0",
  "annualPvProductionKwh > 0",
  "equivalentBatteryCycles",
]) {
  if (!metricsSource.includes(pattern)) {
    fail(`metrics engine missing safe calculation pattern: ${pattern}`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Reliability verification passed.");
