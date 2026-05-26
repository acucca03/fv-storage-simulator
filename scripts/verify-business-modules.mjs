import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(message) {
  console.error(`Business modules verification failed: ${message}`);
  process.exitCode = 1;
}

function exists(path) {
  return existsSync(join(root, path));
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const requiredFiles = [
  "src/app/page.tsx",
  "src/app/simulatore/page.tsx",
  "src/app/api/simulate/route.ts",
  "src/components/home/home-page.tsx",
  "src/components/home/home-hero.tsx",
  "src/components/home/home-sections.tsx",
  "src/components/simulator/simulator-wizard.tsx",
  "src/lib/energy/consumption/generate-statistical-profile.ts",
  "src/lib/energy/pv/generate-mock-pv-profile.ts",
  "src/lib/energy/simulation/simulate-energy-system.ts",
  "src/lib/energy/optimizer/optimize-system.ts",
  "src/types/energy.ts",
];

for (const file of requiredFiles) {
  if (!exists(file)) {
    fail(`missing required FV business module file: ${file}`);
  }
}

const homepage = [
  read("src/components/home/home-hero.tsx"),
  read("src/components/home/home-sections.tsx"),
].join("\n");

const simulator = read("src/components/simulator/simulator-wizard.tsx");
const api = read("src/app/api/simulate/route.ts");
const engine = [
  read("src/lib/energy/consumption/generate-statistical-profile.ts"),
  read("src/lib/energy/simulation/simulate-energy-system.ts"),
  read("src/lib/energy/optimizer/optimize-system.ts"),
].join("\n");

const requiredHomepageConceptGroups = [
  ["fotovoltaico"],
  ["accumulo"],
  ["autoconsumo"],
  ["batteria"],
  ["sostenibile", "sostenibilità"],
  ["simulazione"],
];

for (const conceptGroup of requiredHomepageConceptGroups) {
  const hasOneConcept = conceptGroup.some((concept) =>
    homepage.toLowerCase().includes(concept),
  );

  if (!hasOneConcept) {
    fail(`homepage missing FV business concept group: ${conceptGroup.join(" / ")}`);
  }
}

const requiredSimulatorConcepts = [
  "Ho i file dei consumi reali",
  "Non ho file",
  "Consumo annuo",
  "Indirizzo abitazione",
  "Calcola risultati",
];

for (const concept of requiredSimulatorConcepts) {
  if (!simulator.includes(concept)) {
    fail(`simulator missing intake concept: ${concept}`);
  }
}

const requiredApiConcepts = [
  "generateStatisticalConsumptionProfile",
  "optimizeSystem",
  "targetSelfConsumptionPercent",
];

for (const concept of requiredApiConcepts) {
  if (!api.includes(concept)) {
    fail(`simulate API missing concept: ${concept}`);
  }
}

const requiredEngineConcepts = [
  "batterySocKwh",
  "gridImportKwh",
  "gridExportKwh",
  "selfConsumptionPercent",
  "selfSufficiencyPercent",
];

for (const concept of requiredEngineConcepts) {
  if (!engine.includes(concept)) {
    fail(`energy engine missing concept: ${concept}`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Business modules verification passed.");
