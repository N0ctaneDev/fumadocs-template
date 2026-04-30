"use client";

import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  SearchDialogFooter,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "fumadocs-ui/components/ui/popover";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { ChevronDown } from "lucide-react";
import { PROJECTS, siteConfig } from "__CONFIG__";
import { SOURCE_REGISTRY } from "@/lib/sources";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/cn";

type FilterItem = {
  name: string;
  value: string | undefined;
  description?: string;
  isGroup?: boolean;
};

export default function DefaultSearchDialog(props: SharedProps) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | undefined>();
  const params = useParams();

  // Detect current project from URL params
  const currentProject = typeof params.project === "string"
    ? params.project
    : undefined;

  // Build contextual filter items based on current project
  const items = useMemo<FilterItem[]>(() => {
    const list: FilterItem[] = [
      { name: "All Projects", value: undefined },
    ];

    if (currentProject && currentProject in SOURCE_REGISTRY) {
      const source = SOURCE_REGISTRY[currentProject];
      const projectConfig = PROJECTS.find((p) => p.slug === currentProject);

      // Project-level filter (all pages in this project)
      list.push({
        name: projectConfig?.label ?? currentProject,
        value: currentProject,
        description: `All ${projectConfig?.label ?? currentProject} pages`,
        isGroup: true,
      });

      // Page-level filters (individual pages in this project)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      source.getPages().forEach((page: any) => {
        list.push({
          name: page.data.title,
          value: `${currentProject}/${page.slugs.join("/")}`,
          description: page.url,
        });
      });
    } else {
      // Not on a project route — show all projects as group filters
      PROJECTS.forEach((p) => {
        list.push({
          name: p.label,
          value: p.slug,
          description: `/${p.slug} docs`,
          isGroup: true,
        });
      });
    }

    return list;
  }, [currentProject]);

  // Default tag to current project when dialog opens on a project route
  const effectiveTag = tag ?? (currentProject ? currentProject : undefined);

  const { search, setSearch, query } = useDocsSearch({
    type: "static",
    locale: "en",
    from: `${siteConfig.basePath}/api/search/`,
    tag: effectiveTag,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: "sm",
                color: "ghost",
                className: "-m-1.5 me-auto",
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">Filter</span>
              {items.find((item) => item.value === effectiveTag)?.name ?? "All Projects"}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent
              className="flex flex-col p-1 gap-1 max-h-64 overflow-y-auto"
              align="start"
            >
              {items.map((item, i) => {
                const isSelected = item.value === effectiveTag;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      // clicking current project group → set to project tag
                      // clicking "All Projects" → clear tag
                      setTag(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-lg text-start px-2 py-1.5",
                      item.isGroup && "mt-1 border-t border-fd-border pt-2 first:border-0 first:mt-0",
                      isSelected
                        ? "text-fd-primary bg-fd-primary/10"
                        : "hover:text-fd-accent-foreground hover:bg-fd-accent",
                    )}
                  >
                    <p className={cn(
                      "mb-0.5",
                      item.isGroup ? "font-semibold text-sm" : "font-medium text-sm pl-2"
                    )}>
                      {item.isGroup ? "▸ " : ""}{item.name}
                    </p>
                    {item.description && (
                      <p className={cn(
                        "text-xs opacity-70",
                        !item.isGroup && "pl-2"
                      )}>
                        {item.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
          <a
            href="https://orama.com"
            rel="noreferrer noopener"
            target="_blank"
            className="text-xs text-nowrap text-fd-muted-foreground"
          >
            Powered by Orama
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}