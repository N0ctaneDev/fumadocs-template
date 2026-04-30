// src/app/api/search/route.ts
// Search API — indexes pages across ALL projects in SOURCE_REGISTRY
// statically cached at build time

import { SOURCE_REGISTRY } from "@/lib/sources";
import { createFromSource } from "fumadocs-core/search/server";

export const revalidate = false;

// Fumadocs' createFromSource only accepts a single source.
// For multi-project, we build a unified index manually by
// merging all pages from all sources into one search endpoint.
// The `tag` field is set to the project slug for per-project filtering.

// Collect all sources as an array
const allSources = Object.values(SOURCE_REGISTRY);

// createFromSource accepts multiple sources via array in fumadocs-core
export const { staticGET: GET } = createFromSource(allSources, {
	localeMap: {
		en: { language: "english" },
	},
	buildIndex(page) {
		return {
			title: page.data.title,
			description: page.data.description,
			url: page.url,
			id: page.url,
			structuredData: page.data.structuredData,
			tag: page.slugs[0], // project slug used for filtering in search UI
		};
	},
});
