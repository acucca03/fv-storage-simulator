import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const srcRoot = join(root, "src");

const forbiddenDirs = ["src/pages"];

const requiredProjectLayers = [
  "src/app",
  "src/components",
  "src/lib",
  "src/types",
];

function fail(message) {
  console.error(`Architecture verification failed: ${message}`);
  process.exitCode = 1;
}

function walk(dir) {
  if (!existsSync(dir)) return [];

  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function toProjectPath(file) {
  return file.replace(root + "/", "");
}

function isSourceFile(file) {
  return /\.(ts|tsx)$/.test(file);
}

function read(file) {
  return readFileSync(file, "utf8");
}

if (!existsSync(srcRoot)) {
  fail("missing src directory.");
}

for (const forbiddenDir of forbiddenDirs) {
  if (existsSync(join(root, forbiddenDir))) {
    fail(`forbidden directory present: ${forbiddenDir}`);
  }
}

for (const layer of requiredProjectLayers) {
  if (!existsSync(join(root, layer))) {
    fail(`missing required project layer: ${layer}`);
  }
}

const sourceFiles = walk(srcRoot).filter(isSourceFile);

for (const file of sourceFiles) {
  const projectPath = toProjectPath(file);
  const source = read(file);

  const parentRelativeImportPattern =
    /from\s+["']\.\.\/|import\s+["']\.\.\//g;

  if (parentRelativeImportPattern.test(source)) {
    fail(`${projectPath} uses parent relative imports. Use "@/..." for cross-folder imports.`);
  }

  const srcImportPattern =
    /from\s+["']src\/|import\s+["']src\//g;

  if (srcImportPattern.test(source)) {
    fail(`${projectPath} imports src without alias. Use "@/..." instead.`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Architecture verification passed.");
