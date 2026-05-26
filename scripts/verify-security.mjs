import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const srcRoot = join(root, "src");

const requiredFiles = [
  "next.config.ts",
  "src/app/api/simulate/route.ts",
  "src/app/layout.tsx",
  "src/app/sitemap.ts",
  "src/lib/structured-data.ts",
  "src/components/simulator/simulator-wizard.tsx",
  "src/config/security-profile.ts",
];

const forbiddenPatterns = [
  "eval(",
  "new Function(",
  "innerHTML",
  "localStorage",
  "sessionStorage",
  "document.cookie",
];

const allowedDangerousHtmlFiles = new Set([
  "src/app/layout.tsx",
  "src/lib/structured-data.ts",
  "src/components/StructuredData.tsx",
  "src/components/seo/StructuredData.tsx",
]);

const allowedSecurityDocumentationFiles = new Set([
  "src/config/security-profile.ts",
  "src/config/performance-profile.ts",
]);

function fail(message) {
  console.error(`Security verification failed: ${message}`);
  process.exitCode = 1;
}

function walk(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
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
    fail(`missing required security file: ${file}`);
  }
}

const nextConfig = existsSync(join(root, "next.config.ts"))
  ? read("next.config.ts")
  : "";

for (const header of [
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "poweredByHeader: false",
]) {
  if (!nextConfig.includes(header)) {
    fail(`next.config.ts missing security setting/header: ${header}`);
  }
}

const apiSource = existsSync(join(root, "src/app/api/simulate/route.ts"))
  ? read("src/app/api/simulate/route.ts")
  : "";

for (const pattern of [
  "NextRequest",
  "Number.isFinite",
  "annualConsumptionKwh <= 0",
  "status: 400",
  "NextResponse.json",
]) {
  if (!apiSource.includes(pattern)) {
    fail(`simulate API missing security validation pattern: ${pattern}`);
  }
}

if (existsSync(srcRoot)) {
  for (const file of walk(srcRoot)) {
    const rel = relative(root, file);
    const source = readFileSync(file, "utf8");

    if (!allowedSecurityDocumentationFiles.has(rel)) {
      for (const pattern of forbiddenPatterns) {
        if (source.includes(pattern)) {
          fail(`forbidden security pattern "${pattern}" found in ${rel}`);
        }
      }
    }

    if (
      source.includes("dangerouslySetInnerHTML") &&
      !allowedDangerousHtmlFiles.has(rel)
    ) {
      fail(`dangerouslySetInnerHTML found outside structured data boundary: ${rel}`);
    }
  }
}

const wizardSource = existsSync(join(root, "src/components/simulator/simulator-wizard.tsx"))
  ? read("src/components/simulator/simulator-wizard.tsx")
  : "";

for (const pattern of [
  'fetch("/api/simulate"',
  "JSON.stringify",
  "response.ok",
  "setSimulation({ error:",
]) {
  if (!wizardSource.includes(pattern)) {
    fail(`wizard missing secure request/error handling pattern: ${pattern}`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Security verification passed.");
