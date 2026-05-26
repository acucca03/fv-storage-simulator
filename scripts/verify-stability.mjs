import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const srcRoot = join(root, "src");

const requiredFiles = [
  "src/app/error.tsx",
  "src/app/not-found.tsx",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/simulatore/page.tsx",
  "src/app/api/simulate/route.ts",
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/app/manifest.ts",
  "src/config/stability-profile.ts",
  "src/lib/energy/consumption/generate-statistical-profile.ts",
  "src/lib/energy/pv/generate-mock-pv-profile.ts",
  "src/lib/energy/simulation/simulate-energy-system.ts",
  "src/lib/energy/optimizer/optimize-system.ts",
  "src/components/simulator/simulator-wizard.tsx",
  "docs/ultimate/STABILITY.md",
];

const requiredLayoutPatterns = [
  "StructuredData",
  "siteStructuredData",
  "metadataConfig",
];

const forbiddenRuntimePatterns = [
  'dynamic = "force-dynamic"',
  "dynamic = 'force-dynamic'",
  "revalidate = 0",
  'cache: "no-store"',
  "cache: 'no-store'",
  "unstable_noStore",
];

const patternDocumentationFiles = new Set([
  "src/config/stability-profile.ts",
]);

function fail(message) {
  console.error(`Stability verification failed: ${message}`);
  process.exitCode = 1;
}

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      return [fullPath];
    }

    return [];
  });
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    fail(`missing required file: ${file}`);
  }
}

const layoutPath = join(root, "src/app/layout.tsx");

if (existsSync(layoutPath)) {
  const layoutSource = readFileSync(layoutPath, "utf8");

  for (const pattern of requiredLayoutPatterns) {
    if (!layoutSource.includes(pattern)) {
      fail(`layout missing required pattern: ${pattern}`);
    }
  }
}

const nextConfigPath = join(root, "next.config.ts");

if (!existsSync(nextConfigPath)) {
  fail("missing next.config.ts");
} else {
  const nextConfig = readFileSync(nextConfigPath, "utf8");

  for (const required of ["poweredByHeader: false", "compress: true", "headers()"]) {
    if (!nextConfig.includes(required)) {
      fail(`next.config.ts missing required stability setting: ${required}`);
    }
  }
}

if (existsSync(srcRoot)) {
  for (const file of walk(srcRoot)) {
    const source = readFileSync(file, "utf8");
    const rel = relative(root, file);

    if (!patternDocumentationFiles.has(rel)) {
      for (const pattern of forbiddenRuntimePatterns) {
        if (source.includes(pattern)) {
          fail(`forbidden runtime pattern "${pattern}" found in ${rel}`);
        }
      }
    }
  }
}

const stabilitySource = existsSync(join(root, "src/config/stability-profile.ts"))
  ? readFileSync(join(root, "src/config/stability-profile.ts"), "utf8")
  : "";

for (const key of [
  "requiredRuntimeFiles",
  "requiredFoundationFeatures",
  "forbiddenRuntimePatterns",
  "stabilityRules",
]) {
  if (!stabilitySource.includes(key)) {
    fail(`stability profile missing key: ${key}`);
  }
}

const apiSource = existsSync(join(root, "src/app/api/simulate/route.ts"))
  ? read("src/app/api/simulate/route.ts")
  : "";

for (const pattern of [
  "Number.isFinite",
  "annualConsumptionKwh <= 0",
  "NextResponse.json",
  "status: 400",
]) {
  if (!apiSource.includes(pattern)) {
    fail(`simulate API missing stability validation pattern: ${pattern}`);
  }
}

const wizardSource = existsSync(join(root, "src/components/simulator/simulator-wizard.tsx"))
  ? read("src/components/simulator/simulator-wizard.tsx")
  : "";

for (const pattern of [
  "try",
  "catch",
  "finally",
  "isSimulating",
  "disabled={!canContinue || isSimulating}",
]) {
  if (!wizardSource.includes(pattern)) {
    fail(`simulator wizard missing stability/error-handling pattern: ${pattern}`);
  }
}

const simulationSource = existsSync(join(root, "src/lib/energy/simulation/simulate-energy-system.ts"))
  ? read("src/lib/energy/simulation/simulate-energy-system.ts")
  : "";

for (const pattern of [
  "Math.min(config.consumptionProfile.length, config.pvProfile.length)",
  "Math.max(0",
  "batterySocKwh",
  "gridImportKwh",
  "gridExportKwh",
]) {
  if (!simulationSource.includes(pattern)) {
    fail(`energy simulation missing stability pattern: ${pattern}`);
  }
}

const optimizerSource = existsSync(join(root, "src/lib/energy/optimizer/optimize-system.ts"))
  ? read("src/lib/energy/optimizer/optimize-system.ts")
  : "";

if (!optimizerSource.includes("keepMinuteResults: false")) {
  fail("optimizer must avoid storing minute-level results for every scenario.");
}

if (process.exitCode) {
  process.exit();
}

console.log("Stability verification passed.");
