"use client";

import { useParams } from "next/navigation";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function useMode(): string | undefined {
  const params = useParams();
  if (params.project && typeof params.project === "string") {
    return params.project;
  }
  const { slug = [] } = params as { slug?: string[] };
  if (Array.isArray(slug) && slug.length > 0) return slug[0];
  return undefined;
}

export function Body({ children }: { children: ReactNode }): React.ReactElement {
  const mode = useMode();
  return (
    <body className={cn(mode, "relative flex min-h-screen flex-col")}>
      {children}
    </body>
  );
}