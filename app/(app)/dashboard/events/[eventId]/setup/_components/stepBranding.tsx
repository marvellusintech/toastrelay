"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { type WizardFormValues } from "@/validations/event.schema";
import { FileUploadZone } from "@/components/fileUploadZone";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/richTextEditor";
import { getFileUrl } from "@/lib/utils/getFileUrl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Check,
  ChevronsUpDown,
  Loader2,
  Sparkles,
  ImagePlus,
  Plus,
  X,
  Film,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { getEventCatgoriesApi, getEventTemplatesApi } from "@/lib/api/events";
import { EventTemplate, EventType } from "@/types/response";
// import { type EventCategory, type EventTemplate } from "@/types/response";

const MAX_EXTRA_MEDIA = 10;

interface StepProps {
  onNext: () => Promise<void>;
  isSaving: boolean;
}

export function StepBranding({ onNext, isSaving }: StepProps) {
  const router = useRouter();

  const [uploadError, setUploadError] = React.useState<string | null>(null);

  // API State

  const [templates, setTemplates] = React.useState<EventTemplate[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = React.useState(true);

  const {
    watch,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useFormContext<WizardFormValues>();

  const selectedTemplate = watch("templateId");
  const isCustomTheme = watch("isCustomTheme");
  const currentTheme = watch("theme");
  const coverImage = watch("coverImage");
  const extraMedia = watch("extraMedia") || [];

  // Fetchtemplates on mount
  React.useEffect(() => {
    async function fetchMetadata() {
      try {
        setIsLoadingMeta(true);
        const [templatesRes] = await Promise.all([
          getEventTemplatesApi(),
        ]);

        // Safely parse API responses using unknown type narrowing
        const parsedTemplates = templatesRes as unknown;


        if (Array.isArray(parsedTemplates)) {
          setTemplates(parsedTemplates);
        } else if (
          parsedTemplates &&
          typeof parsedTemplates === "object" &&
          "data" in parsedTemplates &&
          Array.isArray((parsedTemplates as { data: unknown }).data)
        ) {
          setTemplates((parsedTemplates as { data: EventTemplate[] }).data);
        }
      } catch (error) {
        console.error("Failed to load event metadata:", error);
      } finally {
        setIsLoadingMeta(false);
      }
    }

    fetchMetadata();
  }, []);

  const isCoverVideo = React.useMemo(() => {
    if (!coverImage) return false;
    const cleanUrl = coverImage.split("?")[0];
    return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(cleanUrl);
  }, [coverImage]);

  const handleNext = async () => {
    const isValid = await trigger([
      "eventTypeId",
      "templateId",
      "description",
      "coverImage",
    ]);
    await onNext();
    if (isValid) {
      router.push("?step=ticketing");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Branding & Content
        </h2>
        <p className="text-sm text-zinc-500">
          Describe your event, set the theme category, and pick a visual
          presentation layout.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Error Banner */}
        {uploadError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-600 animate-in fade-in-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{uploadError}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. Cover Banner Image/Video Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 block">
            Cover Banner (Image or Video)
          </label>
          {coverImage ? (
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden group border bg-zinc-900">
              {isCoverVideo ? (
                <video
                  src={coverImage}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={getFileUrl(coverImage)}
                  alt="Cover preview"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <FileUploadZone
                  folder="events"
                  accept="image/*,video/*"
                  maxPhotoSizeMb={5}
                  maxVideoSizeMb={10}
                  onUploadError={(err) => setUploadError(err)}
                  onUploadSuccess={([res]) => {
                    setUploadError(null);
                    setValue("coverImage", res.key, { shouldValidate: true });
                  }}
                >
                  {({ isUploading }) => (
                    <span className="bg-white/90 text-zinc-900 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-white flex items-center gap-1.5 transition">
                      {isUploading && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      Change Cover
                    </span>
                  )}
                </FileUploadZone>

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 rounded-xl"
                  onClick={() => setValue("coverImage", "")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <FileUploadZone
              folder="events"
              accept="image/*,video/*"
              maxPhotoSizeMb={5}
              maxVideoSizeMb={10}
              className="w-full h-44 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:border-zinc-300 transition-colors justify-center items-center"
              onUploadError={(err) => setUploadError(err)}
              onUploadSuccess={([res]) => {
                setUploadError(null);
                setValue("coverImage", res.key, { shouldValidate: true });
              }}
            >
              {({ isUploading }) => (
                <div className="flex flex-col items-center justify-center p-4">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2" />
                  ) : (
                    <ImagePlus className="w-7 h-7 text-zinc-400 mb-2" />
                  )}
                  <span className="text-sm font-medium text-zinc-700">
                    {isUploading ? "Uploading file..." : "Upload Cover Banner"}
                  </span>
                  <span className="text-xs text-zinc-400 mt-1">
                    Photos up to 5MB, Videos up to 10MB
                  </span>
                </div>
              )}
            </FileUploadZone>
          )}
          {errors.coverImage && (
            <p className="text-xs text-red-500">{errors.coverImage.message}</p>
          )}
        </div>

        {/* 2. Extra Media Gallery Upload */}
        {coverImage && (
          <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <label className="text-sm font-medium text-zinc-900 block">
              Extra Media & Gallery
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {extraMedia.map((url: string, index: number) => {
                const isVideo = url.match(/\.(mp4|webm|mov)$/i);
                return (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-xl overflow-hidden border bg-zinc-100"
                  >
                    {isVideo ? (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white">
                        <Film className="w-6 h-6" />
                      </div>
                    ) : (
                      <img
                        src={getFileUrl(url)}
                        alt={`Gallery item ${index + 1}`}
                        className="object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "extraMedia",
                          extraMedia.filter((_, i) => i !== index),
                          { shouldValidate: true },
                        )
                      }
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {extraMedia.length < MAX_EXTRA_MEDIA && (
                <FileUploadZone
                  multiple
                  folder="events"
                  accept="image/*,video/*"
                  maxPhotoSizeMb={5}
                  maxVideoSizeMb={10}
                  currentFileCount={extraMedia.length}
                  maxFilesLimit={MAX_EXTRA_MEDIA}
                  className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100/80 items-center justify-center text-center transition-colors"
                  onUploadError={(err) => setUploadError(err)}
                  onUploadSuccess={(results) => {
                    setUploadError(null);
                    const newKeys = results.map((res) => res.key);
                    setValue("extraMedia", [...extraMedia, ...newKeys], {
                      shouldValidate: true,
                    });
                  }}
                >
                  {({ isUploading }) => (
                    <div className="flex flex-col items-center justify-center p-2">
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                      ) : (
                        <>
                          <Plus className="w-5 h-5 text-zinc-500 mb-1" />
                          <span className="text-xs font-medium text-zinc-600">
                            Add Media
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </FileUploadZone>
              )}
            </div>
          </div>
        )}

        {/* 3. Rich Text Event Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 block">
            Event Story & Details
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>



        {/* 5. Horizontal Scrollable Cards for Templates (Dynamic) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-900">
              Layout Template
            </label>
            <span className="text-xs text-zinc-400">Scroll to view all</span>
          </div>

          {isLoadingMeta ? (
            <div className="flex items-center justify-center h-24 bg-zinc-50 rounded-2xl border border-dashed">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
              {templates.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() =>
                      setValue("templateId", tpl.id, { shouldValidate: true })
                    }
                    className={cn(
                      "relative group flex-shrink-0 w-32 h-24 rounded-2xl overflow-hidden cursor-pointer snap-start border-2 transition-all duration-200",
                      isSelected
                        ? "border-zinc-950 ring-2 ring-zinc-950 ring-offset-2 scale-[1.01]"
                        : "border-transparent opacity-80 hover:opacity-100",
                    )}
                  >
                    {tpl.preview && (
                      <img
                        src={getFileUrl(tpl.preview)}
                        alt={tpl.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 bg-zinc-950 text-white rounded-full p-1 shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="absolute bottom-0 inset-x-0 p-3">
                      <p className="text-sm font-bold text-white leading-tight">
                        {tpl.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {errors.templateId && (
            <p className="text-xs text-red-500">{errors.templateId.message}</p>
          )}
        </div>

        {/* 6. Custom Theme Toggle & Controls */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-zinc-600" />
                <label className="text-sm font-medium text-zinc-900">
                  Custom Theme Overrides
                </label>
              </div>
              <p className="text-xs text-zinc-500">
                Customize colors and border curvature for your selected
                template.
              </p>
            </div>
            <Controller
              name="isCustomTheme"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {isCustomTheme && (
            <div className="p-4 rounded-2xl bg-zinc-50 border space-y-4 animate-in fade-in-50 slide-in-from-top-2 duration-200 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1.5">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentTheme?.primaryColor || "#09090b"}
                      onChange={(e) =>
                        setValue("theme.primaryColor", e.target.value)
                      }
                      className="w-10 h-10 rounded-xl border cursor-pointer p-0 overflow-hidden bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentTheme?.primaryColor || "#09090b"}
                      onChange={(e) =>
                        setValue("theme.primaryColor", e.target.value)
                      }
                      className="w-full text-sm px-3 border rounded-xl bg-white font-mono text-zinc-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1.5">
                    Background Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentTheme?.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        setValue("theme.backgroundColor", e.target.value)
                      }
                      className="w-10 h-10 rounded-xl border cursor-pointer p-0 overflow-hidden bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentTheme?.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        setValue("theme.backgroundColor", e.target.value)
                      }
                      className="w-full text-sm px-3 border rounded-xl bg-white font-mono text-zinc-700"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1.5">
                  Border Curvature
                </label>
                <select
                  value={currentTheme?.borderRadius || "md"}
                  onChange={(e) => {
                    const value = e.target
                      .value as WizardFormValues["theme"]["borderRadius"];
                    setValue("theme.borderRadius", value, {
                      shouldValidate: true,
                    });
                  }}
                  className="w-full text-sm p-2.5 border rounded-xl bg-white text-zinc-800 focus:ring-zinc-950 focus:outline-none"
                >
                  <option value="none">Sharp Corners (0px)</option>
                  <option value="sm">Subtle (4px)</option>
                  <option value="md">Standard (8px)</option>
                  <option value="lg">Soft Curvature (16px)</option>
                  <option value="full">Pill / Stadium</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex gap-3 pt-4 border-t justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("?step=logistics")}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1 sm:flex-initial"
          onClick={handleNext}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Continue to Tickets"
          )}
        </Button>
      </div>
    </div>
  );
}
