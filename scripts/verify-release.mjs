import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(message) {
  console.error(`Release verification failed: ${message}`);
  process.exitCode = 1;
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function exists(path) {
  return existsSync(join(root, path));
}

const requiredFiles = [
  "package.json",
  "README.md",
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/app/manifest.ts",
];

for (const file of requiredFiles) {
  if (!exists(file)) {
    fail(`missing required release file: ${file}`);
  }
}

const packageJson = JSON.parse(read("package.json"));

if (packageJson.name !== "fv-storage-simulator") {
  fail(`package.json name must be fv-storage-simulator, found ${packageJson.name}.`);
}

if (!/^\d+\.\d+\.\d+$/.test(packageJson.version)) {
  fail(`package.json version must use semantic versioning, found ${packageJson.version}.`);
}

const packageScripts = packageJson.scripts ?? {};

for (const script of ["dev", "build", "lint", "check", "check:full", "health", "release:check"]) {
  if (!packageScripts[script]) {
    fail(`missing required script: ${script}`);
  }
}

if (packageScripts["release:check"] !== "pnpm health") {
  fail('release:check must run "pnpm health".');
}

if (process.exitCode) {
  process.exit();
}

console.log("Release verification passed.");
