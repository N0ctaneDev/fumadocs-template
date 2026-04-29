// scripts/gen-sources.mts
// Run with: npx tsx scripts/gen-sources.mts
// Auto-runs via predev / prebuild hooks — you never call this manually.

import { writeFileSync, mkdirSync } from "fs";
import { PROJECTS } from "__CONFIG__";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** "my-project" → "myProject" */
function toCamel(slug: string): string {
  return slug.replace(/[-_](\w)/g, (_, c: string) => c.toUpperCase());
}

/** "myProject" → "MyProject" */
function toPascal(slug: string): string {
  const c = toCamel(slug);
  return c.charAt(0).toUpperCase() + c.slice(1);
}

// ─── Generate source.config.ts ───────────────────────────────────────────────

const sourceConfigLines: string[] = [
  `// source.config.ts`,
  `// AUTO-GENERATED — DO NOT EDIT MANUALLY`,
  `// Edit __CONFIG__.ts then run: npm run gen:sources`,
  ``,
  `import { defineDocs, defineConfig } from "fumadocs-mdx/config";`,
  ``,
];

for (const project of PROJECTS) {
  const name = toCamel(project.slug);
  sourceConfigLines.push(
    `// ${toPascal(project.slug)} → ${project.contentDir}`,
    `export const ${name}Docs = defineDocs({`,
    `  dir: "${project.contentDir}",`,
    `});`,
    ``,
  );
}

sourceConfigLines.push(`export default defineConfig();`);
writeFileSync("source.config.ts", sourceConfigLines.join("\n"), "utf-8");
console.log("✅  source.config.ts written");

// ─── Generate src/lib/sources.ts ─────────────────────────────────────────────

const sourcesLines: string[] = [
  `// src/lib/sources.ts`,
  `// AUTO-GENERATED — DO NOT EDIT MANUALLY`,
  `// Edit __CONFIG__.ts then run: npm run gen:sources`,
  ``,
  `import { loader, type InferPageType } from "fumadocs-core/source";`,
  `import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";`,
  `import { PROJECTS } from "__CONFIG__";`,
  `import { i18n } from "@/lib/i18n";`, // ← @/ = .src, file is at src/lib/
  ``,
  `// v14: collections live in fumadocs-mdx:collections/server`,
  `// tsconfig alias: "collections/*" → ".source/*"`,
  `import {`,
];

for (const project of PROJECTS) {
  sourcesLines.push(`  ${toCamel(project.slug)}Docs,`);
}

sourcesLines.push(`} from "fumadocs-mdx:collections/server";`, ``);

// ── Per-project loader + typed utilities ────────────────────────────────────
for (const project of PROJECTS) {
  const name = toCamel(project.slug);
  const Pascal = toPascal(project.slug);
  const baseUrl = `/${project.slug}`;

  sourcesLines.push(
    `// ─── ${Pascal} ──────────────────────────────────────────────────────`,
    ``,

    // Loader
    `export const ${name}Source = loader({`,
    `  i18n,`,
    `  baseUrl: "${baseUrl}",`,
    `  source: ${name}Docs.toFumadocsSource(),`,
    `  plugins: () => [lucideIconsPlugin()],`,
    `});`,
    ``,

    // InferPageType alias
    `export type ${Pascal}Page = InferPageType<typeof ${name}Source>;`,
    ``,

    // getSection re-export namespaced per project
    `/** Returns the language section of a ${Pascal} page path. */`,
    `export { getSection as get${Pascal}Section } from "@/lib/i18n";`, // ← updated
    ``,

    // getPageImage
    `/** Builds the OG image URL + segments for a ${Pascal} page. */`,
    `export function get${Pascal}PageImage(page: ${Pascal}Page) {`,
    `  const segments = [...page.slugs, "image.png"];`,
    `  return {`,
    `    segments,`,
    `    url: \`/og${baseUrl}/\${segments.join("/")}\`,`,
    `  };`,
    `}`,
    ``,

    // getLLMText
    `/** Extracts clean plain text from a ${Pascal} page for LLM/AI use. */`,
    `export async function get${Pascal}LLMText(page: ${Pascal}Page): Promise<string> {`,
    `  const processed = await page.data.getText("processed");`,
    `  return \`# \${page.data.title}\\n\\n\${processed}\`;`,
    `}`,
    ``,
    ``,
  );
}

// ── Central dispatch registry ────────────────────────────────────────────────
sourcesLines.push(
  `// ─── Registry ────────────────────────────────────────────────────────────────`,
  `// Consumed by app/[project]/layout.tsx and page.tsx for dynamic dispatch.`,
  `// Individual sources above are fully typed — registry uses any for dispatch only.`,
  `// eslint-disable-next-line @typescript-eslint/no-explicit-any`,
  `export const SOURCE_REGISTRY: Record<string, any> = {`,
);

for (const project of PROJECTS) {
  sourcesLines.push(`  // eslint-disable-next-line @typescript-eslint/no-explicit-any`);
  sourcesLines.push(`  "${project.slug}": ${toCamel(project.slug)}Source as any,`);
}
sourcesLines.push(
  `};`,
  ``,
  `// All valid slugs — used for 404 guard in layout`,
  `export const VALID_SLUGS = new Set(PROJECTS.map((p) => p.slug));`,
);

writeFileSync("src/lib/sources.ts", sourcesLines.join("\n"), "utf-8"); // ← changed from "lib/sources.ts"
console.log("✅  src/lib/sources.ts written");

console.log(`\n🎉  Generated for ${PROJECTS.length} project(s):`);
PROJECTS.forEach((p) => console.log(`   • /${p.slug}  →  ${p.contentDir}`));
