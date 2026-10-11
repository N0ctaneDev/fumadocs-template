// src/lib/sources.ts
// AUTO-GENERATED — DO NOT EDIT MANUALLY
// Edit __CONFIG__.ts then run: npm run gen:sources

import { loader, type InferPageType } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { PROJECTS } from "__CONFIG__";

// v14: collections live in fumadocs-mdx:collections/server
import {
  docsDocs,
  n0shopDocs,
} from "fumadocs-mdx:collections/server";

// ─── Docs ──────────────────────────────────────────────────────

export const docsSource = loader({
  baseUrl: "/docs",
  source: docsDocs.toFumadocsSource(),
  plugins: () => [lucideIconsPlugin()],
});

export type DocsPage = InferPageType<typeof docsSource>;

/** Builds the OG image URL + segments for a Docs page. */
export function getDocsPageImage(page: DocsPage) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

/** Extracts clean plain text from a Docs page for LLM/AI use. */
export async function getDocsLLMText(page: DocsPage): Promise<string> {
  const processed = await page.data.getText("processed");
  return `# ${page.data.title}\n\n${processed}`;
}


// ─── N0shop ──────────────────────────────────────────────────────

export const n0shopSource = loader({
  baseUrl: "/n0shop",
  source: n0shopDocs.toFumadocsSource(),
  plugins: () => [lucideIconsPlugin()],
});

export type N0shopPage = InferPageType<typeof n0shopSource>;

/** Builds the OG image URL + segments for a N0shop page. */
export function getN0shopPageImage(page: N0shopPage) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
    url: `/og/n0shop/${segments.join("/")}`,
  };
}

/** Extracts clean plain text from a N0shop page for LLM/AI use. */
export async function getN0shopLLMText(page: N0shopPage): Promise<string> {
  const processed = await page.data.getText("processed");
  return `# ${page.data.title}\n\n${processed}`;
}


// ─── Registry ────────────────────────────────────────────────────────────────
// Consumed by app/[project]/layout.tsx and page.tsx for dynamic dispatch.
// Individual sources above are fully typed — registry uses any for dispatch only.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SOURCE_REGISTRY: Record<string, any> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "docs": docsSource as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "n0shop": n0shopSource as any,
};

// All valid slugs — used for 404 guard in layout
export const VALID_SLUGS = new Set(PROJECTS.map((p) => p.slug));
// ─── Unified LLM text helper ─────────────────────────────────────────────────
// Used by app/llms-full.txt/route.ts — auto-updated when projects change
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LLM_GETTERS: Record<string, (page: any) => Promise<string>> = {
  "docs": getDocsLLMText,
  "n0shop": getN0shopLLMText,
};

/** Gets plain LLM text for every page across all projects. */
export async function getAllLLMText(): Promise<string[]> {
  const sections: string[] = [];
  for (const [slug, source] of Object.entries(SOURCE_REGISTRY)) {
    const getter = LLM_GETTERS[slug];
    if (!getter) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const texts = await Promise.all((source as any).getPages().map(getter));
    sections.push(...texts);
  }
  return sections;
}