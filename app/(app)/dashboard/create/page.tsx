// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { createEventApi } from "@/lib/api/events";
// import {
//   CreateEventInput,
//   createEventSchema,
// } from "@/validations/event.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { LucideIcon, CalendarDays, Ticket, Palette, Check } from "lucide-react";
// import { ThemeConfig } from "@/types/payload";

// const EVENT_TYPES = [
//   { id: "type-1", name: "Wedding" },
//   { id: "type-2", name: "Conference" },
//   { id: "type-3", name: "Concert" },
//   { id: "type-4", name: "Birthday Party" },
// ];

// const TEMPLATES = [
//   {
//     id: "tmpl-1",
//     name: "Elegant Classic",
//     desc: "Traditional layout with refined spacing",
//     previewBg: "bg-amber-50/40",
//   },
//   {
//     id: "tmpl-2",
//     name: "Modern Dark",
//     desc: "Sleek, high-contrast immersive mode",
//     previewBg: "bg-zinc-900 text-white",
//   },
//   {
//     id: "tmpl-3",
//     name: "Minimalist Light",
//     desc: "Clean typography focused interface",
//     previewBg: "bg-slate-50",
//   },
// ];

// const FONTS = [
//   { id: "font-sans", name: "Modern Sans", utility: "font-sans" },
//   { id: "font-serif", name: "Elegant Serif", utility: "font-serif" },
//   { id: "font-mono", name: "Technical Mono", utility: "font-mono" },
// ];

// export default function CreateEvent() {
//   const [editingEventId, setEditingEventId] = useState<string | null>(null);
//   const [step, setStep] = useState<1 | 2 | 3>(1);

//   const form = useForm<CreateEventInput>({
//     resolver: zodResolver(createEventSchema),
//     defaultValues: {
//       name: "",
//       slug: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//       location: "",
//       coverImage: "",
//       extraMedia: [],
//       eventTypeId: "",
//       templateId: "tmpl-1",
//       theme: "",
//       isCustomTheme: true,
//       isPublic: false,
//       isExternal: false,
//       externalUrl: "",
//     },
//   });

//   const createAccountMutation = useMutation({
//     mutationFn: createEventApi,
//   });

//   const isPending = createAccountMutation.isPending;

//   const handleUpdateEvent = form.handleSubmit(async (data) => {
//     console.log("Update Data:", data);
//   });

//   const handleCreateEvent = form.handleSubmit(async (data) => {
//     console.log("Create Data:", data);
//   });

//   // Navigation validation helpers
//   const nextStep = async () => {
//     // Type the validation array explicitly using keys from your form schema
//     let fieldsToValidate: (keyof CreateEventInput)[] = [];

//     if (step === 1) {
//       fieldsToValidate = [
//         "name",
//         "eventTypeId",
//         "description",
//         "startDate",
//         "endDate",
//         "location",
//       ];
//     } else if (step === 2) {
//       fieldsToValidate = ["isExternal", "externalUrl"];
//     }

//     const isValid = await form.trigger(fieldsToValidate);

//     // Explicitly update step numbers safely without relying on any
//     if (isValid) {
//       setStep((prev) => (prev === 1 ? 2 : 3));
//     }
//   };

//   // Safe fallback to prevent step going below step 1
//   const prevStep = () => {
//     setStep((prev) => (prev === 3 ? 2 : 1));
//   };
//   // Live Watchers for visual customizer syncing
//   const watchedTemplate = form.watch("templateId");
//   const watchedTheme =
//     (form.watch("theme") as unknown as {
//       primaryColor?: string;
//       secondaryColor?: string;
//       fontFamily?: string;
//     }) || {};

//   return (
//     <main className="min-h-screen bg-neutral-50/50 py-10 px-4 md:px-20">
//       <div className="max-w-5xl mx-auto">
//         {/* Progress Tracker Header */}
//         <div className="mb-8 grid grid-cols-3 gap-4 text-center">
//           {[
//             { id: 1, label: "Event Details", icon: CalendarDays },
//             { id: 2, label: "Buyables & Scope", icon: Ticket },
//             { id: 3, label: "Visual Canvas", icon: Palette },
//           ].map((s) => {
//             const Icon = s.icon;
//             const isActive = step === s.id;
//             const isCompleted = step > s.id;
//             return (
//               <div
//                 key={s.id}
//                 className={`flex flex-col items-center gap-2 pb-4 border-b-2 transition-all duration-300 ${
//                   isActive
//                     ? "border-black text-black font-semibold"
//                     : isCompleted
//                       ? "border-emerald-500 text-emerald-600"
//                       : "border-neutral-200 text-neutral-400"
//                 }`}
//               >
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
//                     isActive
//                       ? "bg-black text-white"
//                       : isCompleted
//                         ? "bg-emerald-500 text-white"
//                         : "bg-neutral-200 text-neutral-600"
//                   }`}
//                 >
//                   {isCompleted ? <Check className="w-4 h-4" /> : s.id}
//                 </div>
//                 <span className="hidden md:inline text-xs uppercase tracking-wider">
//                   {s.label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//         <Card className="bg-white p-8 md:p-12 shadow-sm rounded-3xl border border-neutral-100">
//           <h1 className="text-4xl font-bold font-display uppercase tracking-tight mb-8">
//             {editingEventId ? "Update your" : "Create your"}{" "}
//             <span className="text-primary-550 italic lowercase font-sans">
//               Stage
//             </span>
//           </h1>

//           <form
//             onSubmit={editingEventId ? handleUpdateEvent : handleCreateEvent}
//             className="space-y-8"
//           >
//             {/* STEP 1: EVENT DETAILS */}
//             {step === 1 && (
//               <div className="space-y-6 animate-in fade-in duration-300">
//                 <FieldGroup className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   <div className="aspect-4/3 bg-neutral-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 p-4">
//                     <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
//                       Cover Image Dropzone
//                     </span>
//                   </div>

//                   <div className="space-y-5 lg:col-span-2">
//                     <Controller
//                       name="name"
//                       control={form.control}
//                       render={({ field, fieldState }) => (
//                         <Field data-invalid={fieldState.invalid}>
//                           <FieldLabel>Event Name</FieldLabel>
//                           <Input
//                             {...field}
//                             placeholder="e.g. The Smith Wedding"
//                             disabled={isPending}
//                           />
//                           {fieldState.invalid && (
//                             <FieldError errors={[fieldState.error]} />
//                           )}
//                         </Field>
//                       )}
//                     />

//                     <Controller
//                       name="eventTypeId"
//                       control={form.control}
//                       render={({ field, fieldState }) => (
//                         <Field data-invalid={fieldState.invalid}>
//                           <FieldLabel>Event Type</FieldLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                             disabled={isPending}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select a type" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {EVENT_TYPES.map((type) => (
//                                 <SelectItem key={type.id} value={type.id}>
//                                   {type.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           {fieldState.invalid && (
//                             <FieldError errors={[fieldState.error]} />
//                           )}
//                         </Field>
//                       )}
//                     />

//                     <Controller
//                       name="description"
//                       control={form.control}
//                       render={({ field, fieldState }) => (
//                         <Field data-invalid={fieldState.invalid}>
//                           <FieldLabel>Description</FieldLabel>
//                           <Textarea
//                             {...field}
//                             placeholder="Tell guests what your event is about..."
//                             disabled={isPending}
//                           />
//                           {fieldState.invalid && (
//                             <FieldError errors={[fieldState.error]} />
//                           )}
//                         </Field>
//                       )}
//                     />

//                     <div className="grid grid-cols-2 gap-4">
//                       <Controller
//                         name="startDate"
//                         control={form.control}
//                         render={({ field, fieldState }) => (
//                           <Field data-invalid={fieldState.invalid}>
//                             <FieldLabel>Start Date</FieldLabel>
//                             <Input
//                               {...field}
//                               type="datetime-local"
//                               disabled={isPending}
//                             />
//                             {fieldState.invalid && (
//                               <FieldError errors={[fieldState.error]} />
//                             )}
//                           </Field>
//                         )}
//                       />
//                       <Controller
//                         name="endDate"
//                         control={form.control}
//                         render={({ field, fieldState }) => (
//                           <Field data-invalid={fieldState.invalid}>
//                             <FieldLabel>End Date</FieldLabel>
//                             <Input
//                               {...field}
//                               type="datetime-local"
//                               disabled={isPending}
//                             />
//                             {fieldState.invalid && (
//                               <FieldError errors={[fieldState.error]} />
//                             )}
//                           </Field>
//                         )}
//                       />
//                     </div>

//                     <Controller
//                       name="location"
//                       control={form.control}
//                       render={({ field, fieldState }) => (
//                         <Field data-invalid={fieldState.invalid}>
//                           <FieldLabel>Location</FieldLabel>
//                           <Input
//                             {...field}
//                             placeholder="e.g. Central Park, NY or Online"
//                             disabled={isPending}
//                           />
//                           {fieldState.invalid && (
//                             <FieldError errors={[fieldState.error]} />
//                           )}
//                         </Field>
//                       )}
//                     />
//                   </div>
//                 </FieldGroup>
//               </div>
//             )}

//             {/* STEP 2: BUYABLES & PRIVACY */}
//             {step === 2 && (
//               <div className="space-y-6 animate-in fade-in duration-300">
//                 <div className="border border-neutral-100 p-6 rounded-2xl bg-neutral-50/50 space-y-6">
//                   <div>
//                     <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-1">
//                       Access Configuration
//                     </h3>
//                     <p className="text-xs text-neutral-400">
//                       Specify if entries are hosted natively or offloaded
//                       elsewhere.
//                     </p>
//                   </div>

//                   <Controller
//                     name="isExternal"
//                     control={form.control}
//                     render={({ field: { value, onChange, ...field } }) => (
//                       <div className="flex items-center space-x-3">
//                         <Switch
//                           checked={value}
//                           onCheckedChange={onChange}
//                           {...field}
//                         />
//                         <label className="text-sm font-medium">
//                           This is an external marketplace / has ticketing URLs
//                         </label>
//                       </div>
//                     )}
//                   />

//                   {form.watch("isExternal") && (
//                     <Controller
//                       name="externalUrl"
//                       control={form.control}
//                       render={({ field, fieldState }) => (
//                         <Field
//                           data-invalid={fieldState.invalid}
//                           className="animate-in slide-in-from-top-2 duration-200"
//                         >
//                           <FieldLabel>External Ticketing URL</FieldLabel>
//                           <Input
//                             {...field}
//                             type="url"
//                             placeholder="https://external-ticket-provider.com/id"
//                             disabled={isPending}
//                           />
//                           {fieldState.invalid && (
//                             <FieldError errors={[fieldState.error]} />
//                           )}
//                         </Field>
//                       )}
//                     />
//                   )}
//                 </div>

//                 <div className="w-full pt-4">
//                   <Controller
//                     name="isPublic"
//                     control={form.control}
//                     render={({ field: { value, onChange } }) => (
//                       <div className="flex items-center gap-3 p-5 bg-neutral-900 rounded-2xl text-white">
//                         <Checkbox
//                           checked={value}
//                           onCheckedChange={onChange}
//                           className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
//                         />
//                         <div>
//                           <label className="text-xs font-bold uppercase tracking-widest cursor-pointer block">
//                             Publish to Explore Feed
//                           </label>
//                           <span className="text-[11px] text-neutral-400">
//                             Checking this indexation toggle displays your event
//                             on global networks.
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* STEP 3: TEMPLATES & VISUAL CANVAS (THEMING) */}
//             {step === 3 && (
//               <div className="space-y-8 animate-in fade-in duration-300">
//                 {/* Visual Layout Picker */}
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 mb-4">
//                     Select Template Canvas
//                   </label>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {TEMPLATES.map((tmpl) => (
//                       <div
//                         key={tmpl.id}
//                         onClick={() => form.setValue("templateId", tmpl.id)}
//                         className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex flex-col justify-between h-40 ${
//                           watchedTemplate === tmpl.id
//                             ? "border-black bg-neutral-50/50 ring-1 ring-black"
//                             : "border-neutral-200 bg-white hover:border-neutral-300"
//                         }`}
//                       >
//                         <div
//                           className={`w-full h-16 rounded-xl mb-3 ${tmpl.previewBg} border border-neutral-200/60 flex items-center justify-center overflow-hidden p-2`}
//                         >
//                           <span className="text-[10px] font-mono opacity-40">
//                             Layout Wireframe
//                           </span>
//                         </div>
//                         <div>
//                           <p className="text-xs font-bold text-neutral-900">
//                             {tmpl.name}
//                           </p>
//                           <p className="text-[11px] text-neutral-400 line-clamp-1">
//                             {tmpl.desc}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Real-Time Theme Customizer Custom Canvas */}
//                 <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100 space-y-6">
//                   <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
//                     Live Aesthetics Architecture
//                   </h3>

//                   <Controller
//                     name="theme"
//                     control={form.control}
//                     render={({ field }) => {
//                       // Cast the JSON field value to your strict interface or use safe defaults
//                       const currentTheme =
//                         (field.value as unknown as ThemeConfig) || {
//                           palette: "custom",
//                           primaryColor: "#000000",
//                           secondaryColor: "#ffffff",
//                           fontFamily: "font-sans",
//                           updatedAt: new Date().toISOString(),
//                         };

//                       // Explicitly type the key parameter to match your interface properties
//                       const updateThemeKey = (
//                         key: keyof ThemeConfig,
//                         val: string,
//                       ) => {
//                         const updated: ThemeConfig = {
//                           ...currentTheme,
//                           [key]: val,
//                           updatedAt: new Date().toISOString(),
//                         };
//                         field.onChange(updated);
//                       };

//                       return (
//                         <div className="space-y-6">
//                           {/* Color Input Grid */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">
//                                 Primary Accent
//                               </label>
//                               <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-neutral-200">
//                                 <input
//                                   type="color"
//                                   value={currentTheme.primaryColor}
//                                   onChange={(e) =>
//                                     updateThemeKey(
//                                       "primaryColor",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="w-10 h-10 rounded-lg border border-neutral-100 cursor-pointer bg-transparent"
//                                 />
//                                 <input
//                                   type="text"
//                                   value={currentTheme.primaryColor}
//                                   onChange={(e) =>
//                                     updateThemeKey(
//                                       "primaryColor",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="flex-1 bg-transparent border-none text-xs font-mono focus:outline-none"
//                                 />
//                               </div>
//                             </div>

//                             <div>
//                               <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">
//                                 Secondary Accent
//                               </label>
//                               <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-neutral-200">
//                                 <input
//                                   type="color"
//                                   value={currentTheme.secondaryColor}
//                                   onChange={(e) =>
//                                     updateThemeKey(
//                                       "secondaryColor",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="w-10 h-10 rounded-lg border border-neutral-100 cursor-pointer bg-transparent"
//                                 />
//                                 <input
//                                   type="text"
//                                   value={currentTheme.secondaryColor}
//                                   onChange={(e) =>
//                                     updateThemeKey(
//                                       "secondaryColor",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="flex-1 bg-transparent border-none text-xs font-mono focus:outline-none"
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           {/* Typography Selector */}
//                           <div>
//                             <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">
//                               Typography Sandbox
//                             </label>
//                             <div className="grid grid-cols-3 gap-3">
//                               {FONTS.map((font) => {
//                                 const isSelected =
//                                   currentTheme.fontFamily === font.id;
//                                 return (
//                                   <button
//                                     key={font.id}
//                                     type="button"
//                                     onClick={() =>
//                                       updateThemeKey("fontFamily", font.id)
//                                     }
//                                     className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-16 ${
//                                       isSelected
//                                         ? "border-black bg-white shadow-sm ring-1 ring-black"
//                                         : "border-neutral-200 bg-white hover:border-neutral-300"
//                                     }`}
//                                   >
//                                     <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
//                                       {font.name}
//                                     </span>
//                                     <span
//                                       className={`text-sm lowercase block tracking-tight ${font.utility}`}
//                                     >
//                                       Aa Style
//                                     </span>
//                                   </button>
//                                 );
//                               })}
//                             </div>
//                           </div>

//                           {/* Live Preview Display Box */}
//                           <div
//                             className="p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between"
//                             style={{
//                               backgroundColor: currentTheme.secondaryColor,
//                               borderColor: `${currentTheme.primaryColor}20`,
//                             }}
//                           >
//                             <span
//                               className="text-[9px] uppercase tracking-widest opacity-50 block mb-2"
//                               style={{ color: currentTheme.primaryColor }}
//                             >
//                               Live Interactive Preview
//                             </span>
//                             <h4
//                               className={`text-xl font-bold tracking-tight mb-1 transition-all ${
//                                 currentTheme.fontFamily === "font-serif"
//                                   ? "font-serif"
//                                   : currentTheme.fontFamily === "font-mono"
//                                     ? "font-mono"
//                                     : "font-sans"
//                               }`}
//                               style={{ color: currentTheme.primaryColor }}
//                             >
//                               {form.watch("name") || "Your Event Heading Here"}
//                             </h4>
//                             <p
//                               className="text-xs opacity-70 line-clamp-1"
//                               style={{ color: currentTheme.primaryColor }}
//                             >
//                               {form.watch("description") ||
//                                 "The visual output text changes dynamically..."}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Form Wizard Navigation Bar Controls */}
//             <div className="flex justify-between items-center border-t pt-6 mt-8">
//               {step > 1 ? (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={prevStep}
//                   className="rounded-xl px-5"
//                 >
//                   Back
//                 </Button>
//               ) : (
//                 <div />
//               )}

//               {step < 3 ? (
//                 <Button
//                   type="button"
//                   onClick={nextStep}
//                   className="bg-black hover:bg-neutral-800 text-white rounded-xl px-6"
//                 >
//                   Continue
//                 </Button>
//               ) : (
//                 <Button
//                   type="submit"
//                   disabled={isPending}
//                   className="bg-black hover:bg-neutral-800 text-white rounded-xl px-6"
//                 >
//                   {isPending
//                     ? "Saving..."
//                     : editingEventId
//                       ? "Update Event"
//                       : "Create Event"}
//                 </Button>
//               )}
//             </div>
//           </form>
//         </Card>
//       </div>
//     </main>
//   );
// }
