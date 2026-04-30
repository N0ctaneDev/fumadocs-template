import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
import SearchDialog from "@/components/search";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteMetadata, siteConfig, socialConfig } from "__CONFIG__";
import { Body } from "./body";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

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
};


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <Body>
        <RootProvider
          search={{
            SearchDialog,
            options: {
              type: "static",
              from: `${siteConfig.basePath}/api/search/`,
            },
          }}
        >
          {children}
        </RootProvider>
      </Body>
    </html>
  );
}
