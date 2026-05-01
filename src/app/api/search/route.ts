import { SOURCE_REGISTRY } from "@/lib/sources";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

const indexes = Object.entries(SOURCE_REGISTRY).flatMap(
  ([projectSlug, source]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source.getPages().flatMap((page: any) => {
      // section = first slug segment e.g. "install", "setup"
      // falls back to projectSlug if page is at root (no subfolders)
      const section = page.slugs.length > 1
        ? page.slugs[0]
        : null;

      const entries = [
        // Entry 1 — project-level tag
        {
          title: page.data.title,
          description: page.data.description ?? "",
          url: page.url,
          id: `project::${projectSlug}::${page.url}`,
          structuredData: page.data.structuredData,
          tag: projectSlug,
        },
      ];

      // Entry 2 — section-level tag (only if page is inside a subfolder)
      if (section) {
        entries.push({
          title: page.data.title,
          description: page.data.description ?? "",
          url: page.url,
          id: `section::${projectSlug}/${section}::${page.url}`,
          structuredData: page.data.structuredData,
          tag: `${projectSlug}/${section}`,
        });
      }

      return entries;
    })
);

export const { staticGET: GET } = createSearchAPI("advanced", {
  language: "english",
  indexes,
});
