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
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { createEventApi } from "@/lib/api/events";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      isExternal: false,
      // Left unselected to require explicit user action
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
      router.push(`/dashboard/events/${res.data?.id}/setup?step=logistics`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create event",
      );
    }
  };

  return (
    <div className="min-h-screen pt-12 lg:pt-20 pb-12 relative">
      <div className="pointer-events-none absolute bottom-20 -right-20 md:-bottom-40 md:-right-20 lg:-right-0 opacity-[0.035] select-none z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="w-[600px] h-[600px] md:w-[600px] md:h-[600px] text-zinc-950"
          viewBox="0 0 859 867"
        >
          <path
            fillRule="evenodd"
            fill="currentColor"
            d="M854.363,351.300 C680.101,355.561 548.211,457.780 427.319,322.050 C402.012,293.638 377.681,239.638 390.269,175.802 C398.068,117.308 405.870,58.797 413.669,0.304 C484.138,-1.459 592.187,13.495 624.266,47.103 C618.961,78.902 584.713,107.709 567.717,130.952 C528.071,186.196 488.414,241.456 448.768,296.700 C447.747,316.248 448.193,321.888 456.568,333.750 C459.818,335.050 463.069,336.350 466.318,337.650 C500.673,346.151 529.644,302.240 550.167,286.950 C614.510,238.206 678.872,189.447 743.215,140.702 C789.641,167.166 850.305,282.178 854.363,351.300 ZM0.274,386.399 C-1.107,323.152 24.620,264.236 49.023,222.601 C51.623,222.601 54.223,222.601 56.823,222.601 C77.616,241.093 222.695,350.461 245.971,341.550 C251.170,337.000 256.371,332.449 261.571,327.900 C261.681,250.434 147.663,192.355 127.022,127.052 C159.315,80.573 226.799,38.978 288.870,23.704 C297.948,177.379 362.861,288.632 230.371,374.699 C203.076,392.430 154.519,412.337 101.673,401.999 C67.876,396.799 34.070,391.599 0.274,386.399 ZM858.263,495.598 C855.444,583.542 803.896,660.524 760.765,712.045 C758.165,712.045 755.564,712.045 752.965,712.045 C696.122,665.061 632.989,622.941 569.667,583.347 C540.519,565.121 517.520,524.801 474.118,522.897 C466.969,529.397 459.818,535.898 452.668,542.397 C452.836,577.821 576.891,727.539 602.817,758.845 C615.815,773.793 628.818,788.746 641.816,803.694 C637.931,786.479 612.551,867.709 429.269,866.093 C418.870,802.400 408.468,738.688 398.069,674.996 C387.879,622.798 407.871,576.893 425.369,550.197 C520.457,405.124 683.008,494.275 858.263,495.598 ZM0.274,491.698 C51.396,484.284 83.940,479.539 121.172,472.198 C160.738,464.397 194.820,480.403 218.671,489.748 C356.626,543.796 322.770,692.952 304.470,846.593 C302.520,846.593 300.570,846.593 298.620,846.593 C255.370,832.310 146.798,786.985 138.722,745.195 C179.668,689.301 220.625,633.390 261.571,577.497 C273.836,558.450 267.778,534.293 247.921,526.797 C212.556,513.448 103.357,647.451 66.573,655.496 C43.101,660.629 1.041,527.652 0.274,491.698 Z"
          />
        </svg>
      </div>
      <div className="relative z-10">
        <h1 className="mb-10 text-center text-2xl font-bold font-display tracking-tight text-zinc-900">
          Create Event
        </h1>
        <Card className="mx-4 lg:px-4 lg:max-w-2xl lg:mx-auto shadow-sm">
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
              {/* Event Name */}
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

              {/* Currency Select Dropdown */}
              <Controller
                control={control}
                name="currency"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Event Currency</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">
                          <span className="flex items-center gap-2">
                            <span>🇳🇬</span>
                            <span>Nigerian Naira (NGN - ₦)</span>
                          </span>
                        </SelectItem>
                        {/* <SelectItem value="USD">
                          <span className="flex items-center gap-2">
                            <span>🇺🇸</span>
                            <span>US Dollar (USD - $)</span>
                          </span>
                        </SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FieldDescription className="text-xs text-zinc-500 mt-1">
                      This will be used for tickets and registry items across your event.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Event Type (Internal vs External) */}
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
                              Create and manage this event entirely on
                              ToastRelay.
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

              {/* Form Controls */}
              <div className="mt-6 lg:mt-12 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/events")}
                  className="text-sm"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="bg-zinc-950 text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {(isSubmitting || isPending) && (
                    <Spinner data-icon="inline-start" />
                  )}
                  Create Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}