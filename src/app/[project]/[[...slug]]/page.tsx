// app/[project]/[[...slug]]/page.tsx

import { notFound } from "next/navigation";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
  PageLastUpdate
} from "fumadocs-ui/page";
import { getMDXComponents } from "@/mdx-components";
import { SOURCE_REGISTRY } from "@/lib/sources";
import { PROJECT_MAP , socialConfig} from "__CONFIG__";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";


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
  const lastModifiedTime = page.data.lastModified;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
    </DocsPage>
  );
}

// Static generation: cross-product of all projects × all their pages
export async function generateStaticParams() {
  const params: { project: string; slug: string[] }[] = [];

  for (const [projectSlug, source] of Object.entries(SOURCE_REGISTRY)) {
    const projectParams = source.generateParams().map((p: { slug?: string[] }) => ({
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
  const source = SOURCE_REGISTRY[project];
  const config = PROJECT_MAP[project];

  const page = source.getPage(slug);
  if (!page) return {};

  const pageTitle = `${page.data.title} — ${config.label}`;
  const ogImageUrl = `/og/${project}/${[...page.slugs, "image.png"].join("/")}`;

  // OG route exists only if defaultOgImage is set OR you want per-page generated images
  // Here we tie it to the same flag — if blank, no OG image on any page
  const hasOgImage = socialConfig.defaultOgImage !== "";

  return {
    title: page.data.title,
    description: page.data.description,

    openGraph: {
      title: pageTitle,
      description: page.data.description,
      type: "article",
      ...(hasOgImage && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: pageTitle,
          },
        ],
      }),
    },

    twitter: {
      title: pageTitle,
      description: page.data.description,
      ...(hasOgImage && {
        images: [ogImageUrl],
      }),
    },
  };
}
