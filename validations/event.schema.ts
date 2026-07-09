import { z } from "zod";

// export const createEventSchema = z.object({
//   name: z
//     .string()
//     .min(1, "Event name is required")
//     .min(2, "Event name must be at least 2 characters"),
  
//   slug: z
//     .string()
//     .optional(),
  
//   description: z
//     .string()
//     .optional(),
  
//   startDate: z
//     .string(),
    
//   endDate: z
//     .string().optional(),
  
//   location: z
//     .string()
//     .optional(),
  
//   coverImage: z
//     .string()
//     .optional()
//     .or(z.string().optional()), // Falls back to standard string if it's a relative path
  
//   extraMedia: z
//     .array(z.string())
//     .optional(),
  
//   eventTypeId: z
//     .string()
//     .min(1, "Event type ID is required"),
  
//   templateId: z
//     .string()
//     .min(1, "Template ID is required"),
  
//   theme: z
//     .string()
//     .refine((val) => {
//       try {
//         JSON.parse(val);
//         return true;
//       } catch {
//         return false;
//       }
//     }, { message: "Invalid JSON string" }) // Matches @IsJSON()
//     .optional(),
  
//   isCustomTheme: z
//     .boolean()
//     .optional(),
  
//   isPublic: z
//     .boolean()
//     .optional(),
  
//   isExternal: z
//     .boolean()
//     .optional(),
  
//   externalUrl: z
//     .string()
//     .url({ message: "Invalid external URL" })
//     .optional(),
// });

// // Infer the type from the schema for TypeScript usage
// export type CreateEventInput = z.infer<typeof createEventSchema>;








export const createEventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  isExternal: z
    .boolean(),
});

export type CreateEventValues = z.infer<typeof createEventSchema>;

// validations/event-wizard.ts

export const logisticsBaseSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slugs can only contain lowercase letters, numbers, and dashes'),
  startDate: z.date().min(new Date(), 'Start date must be in the future'),
  endDate: z.date().optional(),
 isExternal: z.boolean(), 
  location: z.string().optional(),
  externalUrl: z.string().url('Please enter a valid URL').optional(),
});

export const brandingSchema = z.object({
  eventTypeId: z.string().min(1, 'Please select an event category'),
  templateId: z.string().min(1, 'Please select a base layout template'),
isCustomTheme: z.boolean(), 
  theme: z.object({
   primaryColor: z.string(),
    backgroundColor: z.string(),
    borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'full'])
  })
});

export const ticketingSchema = z.object({

  enableTicketing: z.boolean(),
  ticketingData: z.object({
    tiers: z.array(z.object({
      name: z.string().min(1, 'Tier name required'),
      price: z.number().min(0, 'Price cannot be negative'),
      capacity: z.number().int().min(1, 'Capacity must be at least 1')
    })).optional()
  })
});

export const contributionsSchema = z.object({

  enableContributions: z.boolean(),
  contributionsData: z.object({
    items: z.array(z.object({
      name: z.string().min(1, 'Item name required'),
      price: z.number().min(0, 'Price cannot be negative'),
      category: z.string().min(1, 'Category tag required'),
      image: z.string().optional()
    })).optional()
  })
});

// 3. Merge using the unrefined BASE logistics schema, then apply the refinement at the end!
export const eventWizardSchema = logisticsBaseSchema
  .merge(brandingSchema)
  .merge(ticketingSchema)
  .merge(contributionsSchema)
  .refine((data) => {
    // Re-apply the cross-field layout validation checks here for the whole pipeline
    if (data.isExternal && !data.externalUrl) return false;
    if (!data.isExternal && !data.location) return false;
    return true;
  }, {
    message: "Location details are required based on hosting type",
    path: ["location"]
  });

export type WizardFormValues = z.infer<typeof eventWizardSchema>;