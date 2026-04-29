// app/[project]/layout.tsx

import { notFound } from "next/navigation";
import { DocsLayout } from "fumadocs-ui/layout";
import { PROJECT_MAP } from "@/__CONFIG__";
import { SOURCE_REGISTRY } from "@/lib/sources";
import type { ReactNode } from "react";

type Props = {
  params: Promise<{ project: string }>;
  children: ReactNode;
};

export default async function ProjectLayout({ params, children }: Props) {
  const { project } = await params;

  // Guard: if the project slug isn't in our manual registry, 404
  if (!(project in SOURCE_REGISTRY)) notFound();

  const source = SOURCE_REGISTRY[project as keyof typeof SOURCE_REGISTRY];
  const config = PROJECT_MAP[project];

  return (
    <DocsLayout tree={source.pageTree} nav={{ title: config.label }}>
      {children}
    </DocsLayout>
  );
}

// Tell Next.js exactly which [project] segments are valid at build time
export function generateStaticParams() {
  return Object.keys(SOURCE_REGISTRY).map((slug) => ({ project: slug }));
}
