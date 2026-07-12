// app/(dashboard)/events/create/page.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  createEventSchema,
  type CreateEventValues,
} from "@/validations/event.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useMutation } from "@tanstack/react-query";
import { createEventApi } from "@/lib/api/events";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      isExternal: false,
    },
  });

  const createEventMutation = useMutation({
    mutationFn: createEventApi,
  });

  const isPending = createEventMutation.isPending;

  const onSubmit = async (data: CreateEventValues) => {
    try {
      const res = await createEventMutation.mutateAsync(data);

      toast.success("Event created successfully");
        // router.push(`/events/${res.data?.id}/setup?step=logistics`);
      router.push(`/dashboard/events/${res.data?.id}/setup?step=logistics`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create event",
      );
    }
  };

  return (
    <div className="mt-12 lg:mt-20">
      <h1 className="mb-10 text-center text-2xl font-bold font-display tracking-tight text-zinc-900">
        Create Event
      </h1>
      <Card className="mx-4 lg:max-w-2xl lg:mx-auto  shadow-sm">
        <CardHeader>
          <CardTitle className="mt-4 text-xl font-bold text-zinc-900">
            Give Your Event a Stage
          </CardTitle>
          <CardDescription>
            Get started in seconds. You can fill out the details later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 lg:space-y-6"
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Event Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. The Smith Wedding"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Internal Event Box */}
              <Controller
                control={control}
                name="isExternal"
                render={({ field }) => {
                  const isChecked = field.value === false;
                  return (
                    <label
                      htmlFor="internal-event"
                      className={`flex items-start p-4 rounded-xl border transition-all cursor-pointer bg-zinc-50 hover:bg-zinc-100/50 ${
                        isChecked
                          ? "border-zinc-950 ring-1 ring-zinc-950 bg-white"
                          : "border-zinc-200"
                      }`}
                    >
                      <Field
                        orientation="horizontal"
                        className="space-x-3 items-start"
                      >
                        <Checkbox
                          id="internal-event"
                          checked={isChecked}
                          onCheckedChange={() => field.onChange(false)}
                        />
                        <FieldContent className="space-y-1">
                          <FieldLabel
                            htmlFor="internal-event"
                            className="font-semibold text-zinc-800 cursor-pointer"
                          >
                            Internal Event
                          </FieldLabel>
                          <FieldDescription className="text-xs text-zinc-500 leading-normal">
                            Create and manage this event entirely on ToastRelay.
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </label>
                  );
                }}
              />

              {/* External Event Box */}
              <Controller
                control={control}
                name="isExternal"
                render={({ field }) => {
                  const isChecked = field.value === true;
                  return (
                    <label
                      htmlFor="external-event"
                      className={`flex items-start p-4 rounded-xl border transition-all cursor-pointer bg-card hover:bg-zinc-100/50 ${
                        isChecked
                          ? "border-zinc-950 ring-1 ring-zinc-950 bg-white"
                          : "border-zinc-200"
                      }`}
                    >
                      <Field
                        orientation="horizontal"
                        className="space-x-3 items-start"
                      >
                        <Checkbox
                          id="external-event"
                          checked={isChecked}
                          onCheckedChange={() => field.onChange(true)}
                        />
                        <FieldContent className="space-y-1">
                          <FieldLabel
                            htmlFor="external-event"
                            className="font-semibold text-zinc-800 cursor-pointer"
                          >
                            External Event
                          </FieldLabel>
                          <FieldDescription className="text-xs text-zinc-500 leading-normal">
                            Discovered on ToastRelay, hosted on another
                            platform.
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </label>
                  );
                }}
              />
            </div>

            <div className="mt-6 lg:mt-12 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/events")}
                className="text-sm"
              >
                Cancel
              </Button>
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isPending}
                className=" bg-zinc-950 text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                {isSubmitting && <Spinner data-icon="inline-start" />}
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
