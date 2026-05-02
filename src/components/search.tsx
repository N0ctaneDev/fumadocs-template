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
import { create } from "@orama/orama";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "fumadocs-ui/components/ui/popover";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { ChevronDown } from "lucide-react";
import { PROJECTS, siteConfig } from "__CONFIG__";
import { getSections } from "@/lib/sections";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/cn";

function initOrama() {
  const res = create({
    schema: { _: "string" },
    language: "english",
  });

  return res;
}

type FilterItem = {
  name: string;
  value: string | undefined;
  description?: string;
  isGroup?: boolean;
};

export default function DefaultSearchDialog(props: SharedProps) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const params = useParams();

  const currentProject = typeof params.project === "string"
    ? params.project
    : undefined;

  const items = useMemo<FilterItem[]>(() => {
    const list: FilterItem[] = [];

    if (currentProject) {
      const projectConfig = PROJECTS.find((p) => p.slug === currentProject);
      if (!projectConfig) return list;

      // Project-level group item
      list.push({
        name: projectConfig.label,
        value: currentProject,
        description: `All ${projectConfig.label} pages`,
        isGroup: true,
      });

      // Section-level items — auto-detected from content subfolders
      getSections(currentProject).forEach((section) => {
        list.push({
          name: section.label,
          value: `${currentProject}/${section.slug}`,
          description: `/${currentProject}/${section.slug}/...`,
          isGroup: false,
        });
      });
    } else {
      list.push({name: "All Stuff", value: undefined, description: "Search All Across the wiki", isGroup:true,});
      // Not on a project route — show all projects
      PROJECTS.forEach((p) => {
        list.push({
          name: p.label,
          value: p.slug,
          description: `In /${p.slug} docs`,
          isGroup: true,
        });
      });
    }

    return list;
  }, [currentProject]);

  // Default to current project scope when on a project route
  // Explicit tag=undefined means "All Projects" was selected
  const effectiveTag = tag !== undefined
    ? tag
    : currentProject ?? undefined;

  const { search, setSearch, query } = useDocsSearch({
    type: "static",
    initOrama,
    from: `${siteConfig.basePath}/api/search`,
    tag: effectiveTag,
  });

  const selectedLabel =
    items.find((item) => item.value === effectiveTag)?.name ?? "All Projects";

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
        <SearchDialogList
          items={query.data !== "empty" ? query.data : null}
        />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: "sm",
                color: "ghost",
                className: "-m-1.5 me-auto",
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">
                Filter (where to search)
              </span>
              {selectedLabel}
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
                      setTag(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-lg text-start px-2 py-1.5",
                      item.isGroup &&
                      "mt-1 border-t border-fd-border pt-2 first:border-0 first:mt-0",
                      isSelected
                        ? "text-fd-primary bg-fd-primary/10"
                        : "hover:text-fd-accent-foreground hover:bg-fd-accent",
                    )}
                  >
                    <p
                      className={cn(
                        "mb-0.5",
                        item.isGroup
                          ? "font-semibold text-sm"
                          : "font-medium text-sm pl-3",
                      )}
                    >
                      {item.isGroup ? "▸ " : "· "}
                      {item.name}
                    </p>
                    {item.description && (
                      <p
                        className={cn(
                          "text-xs opacity-70",
                          !item.isGroup && "pl-3",
                        )}
                      >
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
