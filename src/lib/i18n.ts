// src/lib/i18n.ts
// Shared i18n config used by all projects.
// To add a language later: add to `languages` array and update the map in getSection().

import type { I18nConfig } from "fumadocs-core/i18n";

export const i18n: I18nConfig = {
  defaultLanguage: "en",
  languages: ["en"],
};

/**
 * Extracts the language section from a file path.
 * e.g. "en/getting-started" → "en"
 * Falls back to defaultLanguage if unrecognised.
 *
 * When adding a new language (e.g. "hi"):
 *   1. Add "hi" to the languages array above
 *   2. Add `hi: "hi"` to the map below
 */
export function getSection(path: string | undefined): string {
  if (!path) return i18n.defaultLanguage;
  const [dir] = path.split("/", 1);
  if (!dir) return i18n.defaultLanguage;

  const map: Record<string, string> = {
    en: "en",
    // add new languages here, e.g: hi: "hi"
  };

  return map[dir] ?? i18n.defaultLanguage;
}
