import { existsSync, readFileSync } from "node:fs";

const requiredPaths = [
  "README.md",
  ".env.example",
  ".gitignore",
  "next.config.ts",
  "package.json",

  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/not-found.tsx",
  "src/app/error.tsx",
  "src/app/robots.ts",
  "src/app/globals.css",

  "src/components/layout/Header.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/layout/MainLayout.tsx",

  "src/components/ui/Badge.tsx",
  "src/components/ui/Button.tsx",
  "src/components/ui/Card.tsx",
  "src/components/ui/Container.tsx",
  "src/components/ui/Field.tsx",
  "src/components/ui/FormMessage.tsx",
  "src/components/ui/Input.tsx",
  "src/components/ui/Label.tsx",
  "src/components/ui/Section.tsx",
  "src/components/ui/SectionHeading.tsx",
  "src/components/ui/SkipLink.tsx",
  "src/components/ui/Textarea.tsx",

  "src/config/site.ts",
  "src/config/navigation.ts",
  "src/config/theme.ts",
  "src/config/metadata.ts",

  "src/content/foundation.ts",
  "src/lib/utils.ts",

  "docs/index.md",
  "docs/project-brief.md",
  "docs/architecture.md",
  "docs/project-structure.md",
  "docs/decisions.md",
  "docs/roadmap.md",
  "docs/tasks.md",
  "docs/security.md",
  "docs/scalability.md",
  "docs/accessibility.md",
  "docs/responsive.md",
  "docs/reuse-guide.md",
  "docs/duplication-procedure.md",
  "docs/final-verification.md",
  "docs/foundation-quality-checklist.md",
];

const missing = requiredPaths.filter((path) => !existsSync(path));

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

const packageProblems = [];

if (packageJson.private !== true) {
  packageProblems.push("package.json should have private: true");
}

if (!packageJson.scripts?.check) {
  packageProblems.push("Missing script: check");
}

if (!packageJson.scripts?.["verify:structure"]) {
  packageProblems.push("Missing script: verify:structure");
}

if (!packageJson.scripts?.["check:full"]) {
  packageProblems.push("Missing script: check:full");
}

if (missing.length > 0 || packageProblems.length > 0) {
  console.error("\nFoundation verification failed.\n");

  if (missing.length > 0) {
    console.error("Missing required files:");
    for (const path of missing) {
      console.error(`- ${path}`);
    }
  }

  if (packageProblems.length > 0) {
    console.error("\nPackage problems:");
    for (const problem of packageProblems) {
      console.error(`- ${problem}`);
    }
  }

  process.exit(1);
}

console.log("Foundation structure verification passed.");
