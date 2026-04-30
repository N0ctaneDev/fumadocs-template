// meta data
export const siteMetadata = {
  title: "Fumadocs-Template by N0ctaneDev",
  description:
    "A morden Static Site Template built with Fumadocs, Next.js and Tailwind CSS. built to host on github pages.",
  keywords: "Fumadocs, Next.js, Tailwind CSS, github pages",
  author: "N0ctaneDev",
};

// github config
export const githubConfig = {
  repo: "fumadocs-template",
  owner: "n0ctanedev",
  branch: "main",
};

// site config
export const siteConfig = {
  basePath: `/${githubConfig.repo}`, // set it to '' if you want to deploy to root (https://username.github.io/)
  name: "Fumadocs Template", // shown on the navbar and used as default title suffix
};

//the folders in /content... u can make separate folders for diff projects and add them here
export const PROJECTS: ProjectConfig[] = [
  {
    slug: "docs",
    label: "N0ctOS Docs",
    contentDir: "content/docs",
  },
  {
    slug: "n0shop",
    label: "N0shop Docs",
    contentDir: "content/n0shop",
  },
];

// social + SEO config
export const socialConfig = {
  /** Your deployed URL — no trailing slash */
  siteUrl: "https://n0ctanedev.github.io/fumadocs-template",

  /** Twitter/X handle — include the @ */
  twitterHandle: "@n0ctanedev",

  /** OG image shown when sharing the homepage/non-doc pages */
  defaultOgImage: "/og-default.png", // put this in /public

  /** locale for OG — always en_US for English */
  locale: "en_US",
};








// some backend stuff going on...
// dont touch unless you know what you're doing, but feel free to peek if you're curious how the sausage is made

export type ProjectConfig = {
  /** Route slug: /docs/... or /n0shop/... */
  slug: string;
  /** Human readable label */
  label: string;
  /** Content dir relative to project root */
  contentDir: string;
};

// Derived — no need to touch these
export const PROJECT_MAP = Object.fromEntries(
  PROJECTS.map((p) => [p.slug, p]),
) as Record<string, ProjectConfig>;

export type ProjectSlug = (typeof PROJECTS)[number]["slug"];
