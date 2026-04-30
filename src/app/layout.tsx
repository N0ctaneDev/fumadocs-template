"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
import { useParams } from "next/navigation";
import SearchDialog from "@/components/search";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { siteMetadata } from "__CONFIG__";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export function Body({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const mode = useMode();
  return (
    <body className={cn(mode, "relative flex min-h-screen flex-col")}>
      {children}
    </body>
  );
}

/**
 * Reads the [project] segment from the URL for CSS mode theming.
 * e.g. /docs/... → "docs", /n0shop/... → "n0shop"
 * No locale logic — English only.
 */
export function useMode(): string | undefined {
  const params = useParams();
  if (params.project && typeof params.project === "string") {
    return params.project;
  }
  const { slug = [] } = params as { slug?: string[] };
  if (Array.isArray(slug) && slug.length > 0) return slug[0];
  return undefined;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <title>{siteMetadata.title}</title>
      <meta name="description" content={siteMetadata.description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta name="keywords" content={siteMetadata.keywords} />
      <meta name="author" content={siteMetadata.author} />
      <Body>
        <RootProvider search={{ SearchDialog }}>
          {children}
        </RootProvider>
      </Body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(socialConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,

  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: socialConfig.locale,
    url: socialConfig.siteUrl,
    title: siteConfig.name,
    description: siteMetadata.description,

    // ← only include images array if defaultOgImage is set
    ...(socialConfig.defaultOgImage && {
      images: [
        {
          url: socialConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    }),
  },

  twitter: {
    card: "summary_large_image",
    site: socialConfig.twitterHandle,
    creator: socialConfig.twitterHandle,
  },

  robots: {
    index: true,
    follow: true,
  },
}