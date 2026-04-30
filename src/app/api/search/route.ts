// src/app/api/search/route.ts

import { SOURCE_REGISTRY } from "@/lib/sources";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

// createFromSource only accepts a single source.
// For multi-project we use createSearchAPI with a manually
// merged indexes array across all sources.
const indexes = Object.entries(SOURCE_REGISTRY).flatMap(
  ([projectSlug, source]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source.getPages().map((page: any) => ({
      title: page.data.title,
      description: page.data.description ?? "",
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: projectSlug, // enables per-project tag filtering
    }))
);

export const { staticGET: GET } = createSearchAPI("advanced", {
  language: "english",
  indexes,
});