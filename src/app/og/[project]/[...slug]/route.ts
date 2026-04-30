// src/app/og/[project]/[...slug]/route.ts
// Generates OG preview images for all projects dynamically.
// URL pattern: /og/[project]/[...page-slugs]/image.png
// e.g. /og/docs/getting-started/install/image.png

import { notFound } from "next/navigation";
import { generateOGImage } from "fumadocs-ui/og";
import { SOURCE_REGISTRY } from "@/lib/sources";
import { PROJECT_MAP } from "__CONFIG__";

export const revalidate = false;

type Props = {
  params: Promise<{ project: string; slug: string[] }>;
};

export async function GET(_req: Request, { params }: Props) {
  const { project, slug } = await params;

  // Guard: unknown project → 404
  if (!(project in SOURCE_REGISTRY)) notFound();

  const source = SOURCE_REGISTRY[project];
  const config = PROJECT_MAP[project];

  // slug ends with "image.png" — strip it to get the actual page slug
  const pageSlug = slug.slice(0, -1);
  const page = source.getPage(pageSlug);
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: config.label, // e.g. "N0ctOS Docs" or "N0shop Docs"
  });
}

// Pre-generate OG images for every page in every project at build time
export async function generateStaticParams() {
  const params: { project: string; slug: string[] }[] = [];

  for (const [projectSlug, source] of Object.entries(SOURCE_REGISTRY)) {
    const pages = source.getPages();
    for (const page of pages) {
      params.push({
        project: projectSlug,
        slug: [...page.slugs, "image.png"],
      });
    }
  }

  return params;
}