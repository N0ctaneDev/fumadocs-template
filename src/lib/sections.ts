// src/lib/sections.ts
// AUTO-GENERATED — DO NOT EDIT MANUALLY
// Edit content folder structure then run: npm run gen:sections
// Or just run npm run dev — predev hook handles it automatically

export type SectionEntry = { slug: string; label: string };

export const SECTIONS: Record<string, SectionEntry[]> = {
  "docs": [],
  "n0shop": [
    {
      "slug": "default",
      "label": "Default"
    },
    {
      "slug": "images",
      "label": "Images"
    }
  ]
};

/** Returns sections for a given project slug. Empty array if none. */
export function getSections(projectSlug: string): SectionEntry[] {
  return SECTIONS[projectSlug] ?? [];
}