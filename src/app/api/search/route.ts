// src/app/api/search/route.ts
// AUTO-CACHED at build time via staticGET.
// Tags: projectSlug (project-level) + projectSlug/section (section-level)

import { SOURCE_REGISTRY } from "@/lib/sources";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

const indexes = Object.entries(SOURCE_REGISTRY).flatMap(
  ([projectSlug, source]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source.getPages().flatMap((page: any) => {
      // section = first slug segment if page is inside a subfolder
      const section = page.slugs.length > 1 ? page.slugs[0] : null;

      const entries = [
        // Project-level tag — "docs", "n0shop"
        {
          title: page.data.title,
          description: page.data.description,
          url: page.url,
          id: `${page.url}`,
          structuredData: page.data.structuredData,
          tag: projectSlug,
        },
      ];

      // Section-level tag — "docs/install", "n0shop/components"
      // Only added if the page lives inside a subfolder
      if (section) {
        entries.push({
          title: page.data.title,
          description: page.data.description,
          url: page.url,
          id: `${page.url}`,
          structuredData: page.data.structuredData,
          tag: `${projectSlug}/${section}`,
        });
      }

      return entries;
    })
);

export const { staticGET: GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: indexes,
});
