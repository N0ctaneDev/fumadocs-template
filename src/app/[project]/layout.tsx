import { notFound } from "next/navigation";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { PROJECT_MAP, siteConfig } from "__CONFIG__";
import { SOURCE_REGISTRY } from "@/lib/sources";
import type { ReactNode } from "react";

type Props = {
  params: Promise<{ project: string }>;
  children: ReactNode;
};

export default async function ProjectLayout({ params, children }: Props) {
  const { project } = await params;

  if (!(project in SOURCE_REGISTRY)) notFound();

  const source = SOURCE_REGISTRY[project as keyof typeof SOURCE_REGISTRY];
  const config = PROJECT_MAP[project];

  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{ title: config.label }}
      searchToggle={{
        enabled: true,
      }}
    >
      {children}
    </DocsLayout>
  );
}

export function generateStaticParams() {
  return Object.keys(SOURCE_REGISTRY).map((slug) => ({ project: slug }));
}