import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const srcDir = join(root, "src");
const publicDir = join(root, "public");

const allowedClientFiles = new Set([
  "src/app/error.tsx",
  "src/components/simulator/simulator-wizard.tsx",
]);

const patternDocumentationFiles = new Set([
  "src/config/performance-profile.ts",
]);

const forbiddenDependencies = [
  "framer-motion",
  "gsap",
  "lodash",
  "moment",
  "swiper",
  "slick-carousel",
  "jquery",
  "bootstrap",
  "axios",
  "date-fns",
  "recharts",
  "lucide-react",
];

const forbiddenSourcePatterns = [
  "useEffect",
  "window.",
  "document.",
  "localStorage",
  "sessionStorage",
];

const sourceSizeBudgetKb = 850;
const publicSizeBudgetKb = 512;
const sourceFileBudget = 180;

const warnings = [];
const errors = [];

function walk(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    return [fullPath];
  });
}

function walkSourceFiles(dir) {
  return walk(dir).filter((file) => /\.(ts|tsx|js|jsx)$/.test(file));
}

function directorySizeKb(dir) {
  return Math.ceil(
    walk(dir).reduce((total, file) => total + statSync(file).size, 0) / 1024,
  );
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function fail(message) {
  errors.push(message);
}

if (!existsSync(srcDir)) {
  fail("Missing src directory.");
} else {
  const sourceFiles = walkSourceFiles(srcDir);
  const sourceSizeKb = directorySizeKb(srcDir);

  if (sourceFiles.length > sourceFileBudget) {
    fail(`Too many source files: ${sourceFiles.length}/${sourceFileBudget}.`);
  }

  if (sourceSizeKb > sourceSizeBudgetKb) {
    fail(`Source directory too large: ${sourceSizeKb}KB/${sourceSizeBudgetKb}KB.`);
  }

  for (const file of sourceFiles) {
    const content = readFileSync(file, "utf8");
    const rel = relative(root, file);

    const isAllowedClientFile = allowedClientFiles.has(rel);

    if (content.includes('"use client"') || content.includes("'use client'")) {
      if (!isAllowedClientFile) {
        fail(`Unexpected client component: ${rel}`);
      }
    }

    if (content.includes("dangerouslySetInnerHTML") && !rel.includes("StructuredData.tsx")) {
      warnings.push(`dangerouslySetInnerHTML found outside SEO structured data: ${rel}`);
    }

    if (!isAllowedClientFile && !patternDocumentationFiles.has(rel)) {
      for (const pattern of forbiddenSourcePatterns) {
        if (content.includes(pattern)) {
          fail(`Forbidden browser/client pattern "${pattern}" found in ${rel}.`);
        }
      }
    }
  }
}

if (existsSync(publicDir)) {
  const publicSizeKb = directorySizeKb(publicDir);

  if (publicSizeKb > publicSizeBudgetKb) {
    fail(`Public directory too large: ${publicSizeKb}KB/${publicSizeBudgetKb}KB.`);
  }
}

const packageJson = readJson(join(root, "package.json"));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

for (const dependency of forbiddenDependencies) {
  if (dependencies[dependency]) {
    fail(`Forbidden heavy dependency found: ${dependency}`);
  }
}

const nextConfigPath = join(root, "next.config.ts");

if (!existsSync(nextConfigPath)) {
  fail("Missing next.config.ts.");
} else {
  const nextConfig = readFileSync(nextConfigPath, "utf8");

  const requiredHeaders = [
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ];

  for (const header of requiredHeaders) {
    if (!nextConfig.includes(header)) {
      warnings.push(`Recommended header not found in next.config.ts: ${header}`);
    }
  }

  if (!nextConfig.includes("compress: true")) {
    fail("Next config must keep compression enabled.");
  }

  if (!nextConfig.includes("poweredByHeader: false")) {
    fail("Next config must disable poweredByHeader.");
  }
}

const requiredFiles = [
  "src/config/performance-profile.ts",
  "src/app/api/simulate/route.ts",
  "src/components/simulator/simulator-wizard.tsx",
  "src/lib/energy/simulation/simulate-energy-system.ts",
  "src/lib/energy/optimizer/optimize-system.ts",
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    fail(`Missing performance-critical file: ${file}`);
  }
}

const optimizerSource = readFileSync(
  join(root, "src/lib/energy/optimizer/optimize-system.ts"),
  "utf8",
);

if (!optimizerSource.includes("keepMinuteResults: false")) {
  fail("Optimizer must avoid storing minute results for every tested scenario.");
}

if (warnings.length > 0) {
  console.log("Performance verification warnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
  console.log("");
}

if (errors.length > 0) {
  console.error("Performance verification failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Performance verification passed.");
