// src/app/api/search/route.ts

import { SOURCE_REGISTRY } from "@/lib/sources";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

// Each page gets TWO index entries:
// 1. Tagged with projectSlug       → for "filter by project" 
// 2. Tagged with project/pageSlug  → for "filter by specific page"
// Different ids so they don't dedupe, but same url for navigation.
const indexes = Object.entries(SOURCE_REGISTRY).flatMap(
  ([projectSlug, source]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source.getPages().flatMap((page: any) => [
      // Entry 1 — project-level tag
      {
        title: page.data.title,
        description: page.data.description ?? "",
        url: page.url,
        id: `${projectSlug}::${page.url}`,
        structuredData: page.data.structuredData,
        tag: projectSlug,
      },
      // Entry 2 — page-level tag
      {
        title: page.data.title,
        description: page.data.description ?? "",
        url: page.url,
        id: `${projectSlug}/${page.slugs.join("/")}::${page.url}`,
        structuredData: page.data.structuredData,
        tag: `${projectSlug}/${page.slugs.join("/")}`,
      },
    ])
);

export const { staticGET: GET } = createSearchAPI("advanced", {
  language: "english",
  indexes,
}); 