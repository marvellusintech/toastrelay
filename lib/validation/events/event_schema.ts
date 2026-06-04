import { z } from "zod";

import {
  EVENT_TYPES,
  MAX_EVENT_DESCRIPTION_LENGTH,
  MAX_EVENT_NAME_LENGTH,
} from "@/lib/constants";

export const eventSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Stage name is required" })
    .max(MAX_EVENT_NAME_LENGTH, {
      message: `Max ${MAX_EVENT_NAME_LENGTH} characters`,
    }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(MAX_EVENT_DESCRIPTION_LENGTH, {
      message: `Max ${MAX_EVENT_DESCRIPTION_LENGTH} characters`,
    }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().optional(),
  location: z.string().trim().min(1, { message: "Location is required" }),
  type: z.enum(EVENT_TYPES),
  is_public: z.boolean(),
});

export type EventInput = z.infer<typeof eventSchema>;

export function validateEvent(data: EventInput) {
  const result = eventSchema.safeParse(data);

  if (result.success) {
    return { success: true as const, errors: null };
  }

  return {
    success: false as const,
    errors: {
      message: result.error.issues[0]?.message ?? "Invalid stage details",
    },
  };
}
