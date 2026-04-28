// app/[project]/[[...slug]]/page.tsx

import { notFound } from "next/navigation";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { SOURCE_REGISTRY } from "@/lib/sources";
import { PROJECT_MAP } from "__CONFIG__";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ project: string; slug?: string[] }>;
};

export default async function DocPage({ params }: Props) {
  const { project, slug } = await params;

  // Dispatch: project segment selects the source
  if (!(project in SOURCE_REGISTRY)) notFound();
  const source = SOURCE_REGISTRY[project as keyof typeof SOURCE_REGISTRY];

  // Slug resolution: catch-all maps to a page within the source
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

// Static generation: cross-product of all projects × all their pages
export async function generateStaticParams() {
  const params: { project: string; slug: string[] }[] = [];

  for (const [projectSlug, source] of Object.entries(SOURCE_REGISTRY)) {
    const projectParams = source.generateParams().map((p) => ({
      project: projectSlug,
      slug: p.slug ?? [],
    }));
    params.push(...projectParams);
  }

  return params;
}

// Dynamic metadata per page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project, slug } = await params;

  if (!(project in SOURCE_REGISTRY)) return {};
  const source = SOURCE_REGISTRY[project as keyof typeof SOURCE_REGISTRY];
  const config = PROJECT_MAP[project];

  const page = source.getPage(slug);
  if (!page) return {};

  return {
    title: `${page.data.title} — ${config.label}`,
    description: page.data.description,
  };
}