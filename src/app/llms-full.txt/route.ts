// src/app/llms-full.txt/route.ts

import { getAllLLMText } from "@/lib/sources";
import { PROJECTS } from "__CONFIG__";

export const revalidate = false;

export async function GET() {
  const texts = await getAllLLMText();

  return new Response(texts.join("\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}