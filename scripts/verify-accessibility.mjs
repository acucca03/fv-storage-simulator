import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function exists(path) {
  return existsSync(join(root, path));
}

const requiredFiles = [
  "src/app/layout.tsx",
  "src/app/globals.css",
  "src/components/ui/SkipLink.tsx",
  "src/components/layout/MainLayout.tsx",
];

for (const file of requiredFiles) {
  if (!exists(file)) {
    errors.push(`Missing accessibility-related file: ${file}`);
  }
}

if (exists("src/app/layout.tsx")) {
  const layout = read("src/app/layout.tsx");

  if (!layout.includes('<html lang="it">')) {
    errors.push("Root layout should set html lang='it'.");
  }
}

if (exists("src/app/globals.css")) {
  const css = read("src/app/globals.css");

  const requiredCss = [
    "prefers-reduced-motion",
    "focus-visible",
    "scroll-behavior",
    "text-rendering",
  ];

  for (const rule of requiredCss) {
    if (!css.includes(rule)) {
      errors.push(`globals.css should include accessibility rule: ${rule}`);
    }
  }
}

if (exists("src/components/ui/SkipLink.tsx")) {
  const skipLink = read("src/components/ui/SkipLink.tsx");

  if (!skipLink.includes("#main-content")) {
    errors.push("SkipLink should point to #main-content.");
  }
}

if (exists("src/components/layout/MainLayout.tsx")) {
  const mainLayout = read("src/components/layout/MainLayout.tsx");

  if (!mainLayout.includes("SkipLink")) {
    errors.push("MainLayout should include SkipLink.");
  }

  if (!mainLayout.includes('id="main-content"')) {
    errors.push("MainLayout should expose main id='main-content'.");
  }
}

const packageJson = JSON.parse(read("package.json"));
const scripts = packageJson.scripts ?? {};

if (!scripts["verify:accessibility"]) {
  errors.push("Missing package script: verify:accessibility");
}

if (!scripts["check:full"]?.includes("verify:accessibility")) {
  errors.push("check:full should include verify:accessibility.");
}

if (errors.length > 0) {
  console.error("Accessibility verification failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Accessibility verification passed.");
