// @/components/templates/index.ts
import * as React from "react";
import { TemplateProps } from "./types";
import ModernWeddingTemplate from "./ModernWeddingTemplate";
import MinimalTemplate from "./MinimalTemplate";

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<TemplateProps>> = {
  "evermore": ModernWeddingTemplate,
  "essential": MinimalTemplate,
};

export function getTemplateComponent(templateId?: string | null): React.ComponentType<TemplateProps> {
  if (templateId && templateId in TEMPLATE_REGISTRY) {
    return TEMPLATE_REGISTRY[templateId];
  }
  return MinimalTemplate;
}