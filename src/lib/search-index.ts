// src/lib/search-index.ts
// Divisioned search index builder — single source of truth for ALL search routes.
// Scopes: "all" | "<project>" | "<project>/<section>"
//   - "all":     every page indexed as title + description only (no headings/contents)
//   - project:  pages of that project indexed FULL, everything else title+desc only
//   - section:  pages of that project+section (+ project roots, section==null) FULL,
//               everything else title+desc only
//
// Out-of-scope pages stay discoverable by name (title/description match) but their
// body text never ships in that scope's DB — this is what keeps projects isolated.

import { PROJECTS } from "__CONFIG__";
import { SECTIONS } from "@/lib/sections";
import { SOURCE_REGISTRY } from "@/lib/sources";

export const ALL_SCOPE = "all";

/** All searchable scopes: project slugs + project/section combos. Excludes "all". */
export function listScopes(): string[] {
  const scopes: string[] = [];
  for (const p of PROJECTS) {
    scopes.push(p.slug);
    for (const sec of SECTIONS[p.slug] ?? []) {
      scopes.push(`${p.slug}/${sec.slug}`);
    }
  }
  return scopes;
}

/** Valid scope = "all" or anything from listScopes(). */
export function isValidScope(scope: string): boolean {
  if (scope === ALL_SCOPE) return true;
  return listScopes().includes(scope);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSectionOf(page: any): string | null {
  const slugs: string[] = page.slugs ?? [];
  return slugs.length > 1 ? slugs[0] : null;
}

/**
 * True when a page's full content belongs in the given scope's DB.
 * - "all" → nothing is full (everything is title+desc)
 * - "proj" → every page of that project (any section + roots)
 * - "proj/sec" → pages of proj where section==sec OR section==null (roots)
 */
export function isInScope(
  projectSlug: string,
  section: string | null,
  scope: string,
): boolean {
  if (scope === ALL_SCOPE) return false;
  const slash = scope.indexOf("/");
  if (slash === -1) return projectSlug === scope;
  const proj = scope.slice(0, slash);
  const sec = scope.slice(slash + 1);
  return projectSlug === proj && (section === sec || section === null);
}

export type SearchIndexEntry = {
  title: string;
  description: string;
  url: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  structuredData: any;
  // No `tag` — each scope gets its own DB file, so Orama tag filtering is unused.
};

/**
 * Builds the `indexes` array for `createSearchAPI("advanced")` for one scope.
 * In-scope pages keep their full structuredData; out-of-scope pages are
 * stripped to title+description so they only match by name.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildIndexesForScope(scope: string): SearchIndexEntry[] {
  return Object.entries(SOURCE_REGISTRY).flatMap(([projectSlug, source]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (source as any).getPages().map((page: any) => {
      const section = getSectionOf(page);
      const full = isInScope(projectSlug, section, scope);
      return {
        title: page.data.title,
        description: page.data.description ?? "",
        url: page.url,
        id: page.url,
        structuredData: full
          ? page.data.structuredData
          : { headings: [], contents: [] },
      };
    }),
  );
}
