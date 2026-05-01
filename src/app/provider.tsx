"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";
import type { ComponentType } from "react";

const SearchDialog = dynamic(
  () => import("@/components/search"),
  { ssr: false }
) as ComponentType<SharedProps>;

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }}>
      {children}
    </RootProvider>
  );
}