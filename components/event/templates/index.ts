// @/components/templates/index.ts
import * as React from "react";
import { TemplateProps } from "./types";
import ModernWeddingTemplate from "./ModernWeddingTemplate";
import MinimalTemplate from "./MinimalTemplate";
import StorybookWeddingTemplate from "./StorybookWeddingTemplate";
import { EventTemplate } from "@/types/response";

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<TemplateProps>> = {
  "evermore": ModernWeddingTemplate,
  "essential": MinimalTemplate,
  "the-invitation": StorybookWeddingTemplate,
};

export const BUILTIN_TEMPLATES: EventTemplate[] = [
  // {
  //   id: "essential",
  //   name: "Essential",
  //   description: "Clean, elegant, minimal design for all celebration types.",
  //   preview: "/templates/essential.png",
  //   priceCredits: 0,
  //   theme: {
  //     primaryColor: "#09090b",
  //     backgroundColor: "#ffffff",
  //   },
  // },
  // {
  //   id: "evermore",
  //   name: "Evermore",
  //   description: "Romantic serif layout with rich photography and dark luxury tones.",
  //   preview: "/templates/evermore.png",
  //   priceCredits: 0,
  //   theme: {
  //     primaryColor: "#e11d48",
  //     backgroundColor: "#0c0a09",
  //   },
  // },
  // {
  //   id: "the-invitation",
  //   name: "The Wedding Story",
  //   description: "Interactive 3D wedding keepsake book with ceremonial unboxing ribbon, chapter pages, audio, and RSVP.",
  //   preview: "/templates/wedding-story.png",
  //   priceCredits: 0,
  //   theme: {
  //   },
  // },
];

export function getTemplateComponent(templateId?: string | null): React.ComponentType<TemplateProps> {
  if (templateId && templateId in TEMPLATE_REGISTRY) {
    return TEMPLATE_REGISTRY[templateId];
  }
  return MinimalTemplate;
}