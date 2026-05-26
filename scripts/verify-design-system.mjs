import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/components/ui/tokens.ts",
  "src/components/ui/Badge.tsx",
  "src/components/ui/Button.tsx",
  "src/components/ui/Card.tsx",
  "src/components/ui/Container.tsx",
  "src/components/ui/Input.tsx",
  "src/components/ui/ResponsiveGrid.tsx",
  "src/components/ui/Section.tsx",
  "src/components/ui/Surface.tsx",
  "src/components/ui/Textarea.tsx",
  "src/components/ui/Stack.tsx",
  "src/components/ui/Inline.tsx",
  "src/components/ui/Divider.tsx",
  "src/components/ui/Callout.tsx",
  "src/components/ui/Text.tsx",
  "docs/ultimate/DESIGN-SYSTEM.md",
];

const tokenRequirements = [
  "uiTokens",
  "focusRing",
  "transition",
  "radius",
  "surface",
  "input",
];

const tokenConsumers = [
  "src/components/ui/Badge.tsx",
  "src/components/ui/Button.tsx",
  "src/components/ui/Card.tsx",
  "src/components/ui/Input.tsx",
  "src/components/ui/StatusBadge.tsx",
  "src/components/ui/Surface.tsx",
  "src/components/ui/Textarea.tsx",
  "src/components/ui/Callout.tsx",
];

const compositionPrimitives = [
  "Stack",
  "Inline",
  "Divider",
  "Callout",
  "Text",
];

function fail(message) {
  console.error(`Design system verification failed: ${message}`);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    fail(`missing required file: ${file}`);
  }
}

const tokensSource = readFileSync(join(root, "src/components/ui/tokens.ts"), "utf8");

for (const requirement of tokenRequirements) {
  if (!tokensSource.includes(requirement)) {
    fail(`design tokens missing: ${requirement}`);
  }
}

for (const file of tokenConsumers) {
  const source = readFileSync(join(root, file), "utf8");

  if (!source.includes("@/components/ui/tokens")) {
    fail(`${file} does not use shared UI tokens.`);
  }
}

const buttonSource = readFileSync(join(root, "src/components/ui/Button.tsx"), "utf8");

for (const variant of ["primary", "secondary", "ghost"]) {
  if (!buttonSource.includes(variant)) {
    fail(`Button missing variant: ${variant}`);
  }
}

const docsSource = readFileSync(join(root, "docs/ultimate/DESIGN-SYSTEM.md"), "utf8");

for (const primitive of compositionPrimitives) {
  if (!docsSource.includes(primitive)) {
    fail(`design system docs missing primitive: ${primitive}`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Design system verification passed.");
