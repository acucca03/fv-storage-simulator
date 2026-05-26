import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(message) {
  console.error(`SEO verification failed: ${message}`);
  process.exitCode = 1;
}

function exists(path) {
  return existsSync(join(root, path));
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const requiredFiles = [
  "src/config/seo-profile.ts",
  "src/config/metadata.ts",
  "src/lib/structured-data.ts",
  "src/app/sitemap.ts",
  "src/app/robots.ts",
  "src/app/manifest.ts",
  "src/app/page.tsx",
  "src/app/simulatore/page.tsx",
  "src/components/home/home-hero.tsx",
  "src/components/home/home-sections.tsx",
];

for (const file of requiredFiles) {
  if (!exists(file)) {
    fail(`missing required SEO file: ${file}`);
  }
}

const seoProfileSource = read("src/config/seo-profile.ts");
const metadataSource = read("src/config/metadata.ts");
const structuredDataSource = read("src/lib/structured-data.ts");
const sitemapSource = read("src/app/sitemap.ts");
const robotsSource = read("src/app/robots.ts");
const manifestSource = read("src/app/manifest.ts");
const homepageSource = [
  read("src/components/home/home-hero.tsx"),
  read("src/components/home/home-sections.tsx"),
].join("\n");
const simulatorPageSource = read("src/app/simulatore/page.tsx");

for (const key of [
  "seoProfile",
  "schemaType",
  "seoFocus",
  "primaryAction",
  "keywords",
]) {
  if (!seoProfileSource.includes(key)) {
    fail(`seo profile missing key: ${key}`);
  }
}

for (const key of [
  "metadata",
  "keywords",
  "openGraph",
  "twitter",
]) {
  if (!metadataSource.includes(key)) {
    fail(`metadata config missing key: ${key}`);
  }
}

for (const key of [
  "@context",
  "@type",
  "potentialAction",
]) {
  if (!structuredDataSource.includes(key)) {
    fail(`structured data missing key: ${key}`);
  }
}

for (const concept of [
  "fotovoltaico",
  "accumulo",
  "autoconsumo",
  "simulazione",
]) {
  const haystack = `${seoProfileSource}\n${metadataSource}\n${homepageSource}`.toLowerCase();

  if (!haystack.includes(concept)) {
    fail(`SEO content missing FV concept: ${concept}`);
  }
}

if (!sitemapSource.includes("/simulatore")) {
  fail("sitemap must include simulator route.");
}

if (!robotsSource.includes("sitemap")) {
  fail("robots must expose sitemap.");
}

if (!manifestSource.includes("name")) {
  fail("manifest must include app name.");
}

if (!simulatorPageSource.includes("SimulatorWizard")) {
  fail("simulator page must render the simulator wizard.");
}

if (process.exitCode) {
  process.exit();
}

console.log("SEO verification passed.");
