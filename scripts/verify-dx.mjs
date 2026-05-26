import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredDocs = [
  "README.md",
  "docs/ultimate/README.md",
  "docs/ultimate/ROADMAP.md",
  "docs/ultimate/PROGRESS.md",
  "docs/ultimate/RELEASE-CRITERIA.md",
  "docs/ultimate/DEVELOPMENT-DISCIPLINE.md",
  "docs/ultimate/ARCHITECTURE.md",
  "docs/ultimate/CONFIGURATION-LAYER.md",
  "docs/ultimate/DESIGN-SYSTEM.md",
  "docs/ultimate/BUSINESS-MODULES.md",
  "docs/ultimate/SEO-LOCAL.md",
  "docs/ultimate/PERFORMANCE-STABILITY.md",
  "docs/ultimate/STABILITY.md",
  "docs/ultimate/SECURITY-PRIVACY.md",
  "docs/ultimate/RELIABILITY.md",
  "docs/ultimate/DEVELOPER-EXPERIENCE.md",
  "docs/ultimate/PROJECT-HANDOFF.md",
  "docs/ultimate/OPERATIONS.md",
  "docs/ultimate/FINAL-QUALITY-SUMMARY.md",
  "docs/ultimate/RELEASE-PLAYBOOK.md",
  "docs/ultimate/RELEASE-3.0.0.md",
];

const requiredScripts = [
  "dev",
  "build",
  "lint",
  "check",
  "health",
  "release:check",
  "check:full",
  "verify:structure",
  "verify:architecture",
  "verify:configuration",
  "verify:design-system",
  "verify:business-modules",
  "verify:seo",
  "verify:performance",
  "verify:stability",
  "verify:security",
  "verify:reliability",
  "verify:accessibility",
  "verify:release",
  "verify:dx",
];

function fail(message) {
  console.error(`Developer experience verification failed: ${message}`);
  process.exitCode = 1;
}

for (const doc of requiredDocs) {
  if (!existsSync(join(root, doc))) {
    fail(`missing required documentation: ${doc}`);
  }
}

const packagePath = join(root, "package.json");

if (!existsSync(packagePath)) {
  fail("missing package.json");
} else {
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  const scripts = packageJson.scripts ?? {};

  for (const script of requiredScripts) {
    if (!scripts[script]) {
      fail(`missing package script: ${script}`);
    }
  }

  if (scripts.health !== "pnpm check:full") {
    fail('package script "health" must run "pnpm check:full".');
  }

  if (scripts["release:check"] !== "pnpm health") {
    fail('package script "release:check" must run "pnpm health".');
  }

  for (const script of [
    "verify:architecture",
    "verify:configuration",
    "verify:design-system",
    "verify:business-modules",
    "verify:seo",
    "verify:performance",
    "verify:stability",
    "verify:security",
    "verify:reliability",
    "verify:accessibility",
    "verify:release",
    "verify:dx",
  ]) {
    if (!scripts["check:full"]?.includes(script)) {
      fail(`check:full must include ${script}.`);
    }
  }
}

const progressPath = join(root, "docs/ultimate/PROGRESS.md");

if (existsSync(progressPath)) {
  const progress = readFileSync(progressPath, "utf8");

  if (!progress.includes("Progresso: 100%")) {
    fail("progress document must show 100% for the final release.");
  }

  if (!progress.includes("Blocco 10")) {
    fail("progress document must include Blocco 10.");
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Developer experience verification passed.");
