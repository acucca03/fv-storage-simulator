import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/config/project.ts",
  "src/config/project-presets.ts",
  "src/types/project.ts",
  "docs/ultimate/CONFIGURATION-LAYER.md",
];

const requiredVerticals = [
  "hotel",
  "restaurant",
  "professional",
  "local-business",
];

function fail(message) {
  console.error(`Configuration verification failed: ${message}`);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    fail(`missing required file: ${file}`);
  }
}

const presetsPath = join(root, "src/config/project-presets.ts");
const projectPath = join(root, "src/config/project.ts");

const presetsSource = readFileSync(presetsPath, "utf8");
const projectSource = readFileSync(projectPath, "utf8");

for (const vertical of requiredVerticals) {
  if (!presetsSource.includes(vertical)) {
    fail(`missing project preset for vertical: ${vertical}`);
  }
}

const activeVerticalMatch = presetsSource.match(
  /activeProjectVertical\s*=\s*"([^"]+)"/,
);

if (!activeVerticalMatch) {
  fail("missing activeProjectVertical declaration.");
} else if (!requiredVerticals.includes(activeVerticalMatch[1])) {
  fail(`activeProjectVertical is invalid: ${activeVerticalMatch[1]}`);
}

const requiredProjectProfileKeys = [
  "identity",
  "release",
  "positioning",
  "business",
  "configuration",
  "activeProjectPreset",
  "projectPresets",
];

for (const key of requiredProjectProfileKeys) {
  if (!projectSource.includes(key)) {
    fail(`project profile missing key or import: ${key}`);
  }
}

if (!projectSource.includes('targetVersion: "3.0.0"')) {
  fail("project profile target version must be 3.0.0.");
}

if (process.exitCode) {
  process.exit();
}

console.log("Configuration verification passed.");
