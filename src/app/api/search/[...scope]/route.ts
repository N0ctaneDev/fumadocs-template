// src/app/api/search/[...scope]/route.ts
// Divisioned search DBs — one static JSON per scope:
//   /api/search/docs        → full docs content + title+desc for everything else
//   /api/search/docs/shell  → full docs/shell (+ project roots) + title+desc rest
// AUTO-CACHED at build time via generateStaticParams + static prerender.

import { initAdvancedSearch } from "fumadocs-core/search/server";
import { buildIndexesForScope, listScopes } from "@/lib/search-index";

export const revalidate = false;

export function generateStaticParams() {
  return listScopes().map((scope) => ({ scope: scope.split("/") }));
}

type RouteContext = {
  params: Promise<{ scope: string[] }>;
};

export async function GET(_req: Request, ctx: RouteContext) {
  const { scope } = await ctx.params;
  const key = scope.join("/");
  const api = initAdvancedSearch({
    language: "english",
    indexes: buildIndexesForScope(key),
  });
  return Response.json(await api.export());
}
