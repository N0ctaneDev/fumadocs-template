// src/app/api/search/route.ts
// ALL scope — title + description only, no body/headings.
// Served at /api/search. Scoped DBs live under /api/search/[...scope].
// AUTO-CACHED at build time via staticGET.

import { createSearchAPI } from "fumadocs-core/search/server";
import { ALL_SCOPE, buildIndexesForScope } from "@/lib/search-index";

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: buildIndexesForScope(ALL_SCOPE),
});
