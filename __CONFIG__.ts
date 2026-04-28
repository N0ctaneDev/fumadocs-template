// meta data
export const siteMetadata = {
  title: 'Fumadocs-Template by N0ctaneDev',
  description: 'A morden Static Site Template built with Fumadocs, Next.js and Tailwind CSS. built to host on github pages.',
  keywords: 'Fumadocs, Next.js, Tailwind CSS, github pages',
  author: 'N0ctaneDev'
};

// site config
export const siteConfig = {
  basePath: '/fumadocs-template', // set it to '' if you want to deploy to root (https://username.github.io/)
  name: 'Fumadocs Template', // shown on the navbar and used as default title suffix
  docsPaths: ['docs'], //the folders in /content... u can make separate folders for diff projects and add them here 
};

// github config
export const githubConfig = {
  repo: 'fumadocs-template',
  owner: 'n0ctanedev',
  branch: 'main',
};