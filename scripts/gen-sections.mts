// scripts/gen-sections.mts
// Auto-detects first-level subfolders in each project's content dir
// and writes src/lib/sections.ts for use in the search client.
// Run with: npx tsx scripts/gen-sections.mts
// Auto-runs via predev/prebuild hooks.

import { writeFileSync, readdirSync, statSync, mkdirSync } from "fs";
import { join } from "path";
import { PROJECTS } from "../__CONFIG__";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Converts a folder slug to a readable label */
function toLabel(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Gets immediate subdirectories of a path */
function getSubdirs(dirPath: string): string[] {
  try {
    return readdirSync(dirPath)
      .filter((name) => {
        // skip hidden files, meta files, index files
        if (name.startsWith(".") || name.startsWith("_")) return false;
        if (name.startsWith("index.")) return false;
        return statSync(join(dirPath, name)).isDirectory();
      })
      .sort();
  } catch {
    // dir doesn't exist or can't be read
    return [];
  }
}

// ─── Build sections map ──────────────────────────────────────────────────────

type SectionEntry = { slug: string; label: string };
type SectionsMap = Record<string, SectionEntry[]>;

const sections: SectionsMap = {};

for (const project of PROJECTS) {
  const subdirs = getSubdirs(project.contentDir);
  sections[project.slug] = subdirs.map((dir) => ({
    slug: dir,
    label: toLabel(dir),
  }));

  console.log(
    `📁 ${project.slug} → ${subdirs.length} section(s): ${subdirs.join(", ") || "none"}`
  );
}

// ─── Write src/lib/sections.ts ───────────────────────────────────────────────

mkdirSync("src/lib", { recursive: true });

const lines: string[] = [
  `// src/lib/sections.ts`,
  `// AUTO-GENERATED — DO NOT EDIT MANUALLY`,
  `// Edit content folder structure then run: npm run gen:sections`,
  `// Or just run npm run dev — predev hook handles it automatically`,
  ``,
  `export type SectionEntry = { slug: string; label: string };`,
  ``,
  `export const SECTIONS: Record<string, SectionEntry[]> = ${JSON.stringify(sections, null, 2)};`,
  ``,
  `/** Returns sections for a given project slug. Empty array if none. */`,
  `export function getSections(projectSlug: string): SectionEntry[] {`,
  `  return SECTIONS[projectSlug] ?? [];`,
  `}`,
];

writeFileSync("src/lib/sections.ts", lines.join("\n"), "utf-8");
console.log("\n✅  src/lib/sections.ts written");
console.log(`🎉  Detected sections for ${PROJECTS.length} project(s)`);