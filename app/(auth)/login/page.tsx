"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { loginSchema, type LoginValues } from "@/validations/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { saveAuthToken } from "@/lib/auth-cookies";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: loginApi,
  });

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginValues) {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.data?.token) {
        saveAuthToken(response.data.token, response.data.tokenExpiresOn);
        setAuth(response.data.user);
      }
      toast.success("Welcome back");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    }
  }

  return (
    <div className="z-0 px-4 lg:px-0 py-20 relative overflow-hidden bg-[#FAF9F6] ">
      <div className="flex justify-center items-center gap-2 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="w-8 h-8"
          viewBox="0 0 859 867"
        >
          <path
            fillRule="evenodd"
            fill="rgb(0, 0, 0)"
            d="M854.363,351.300 C680.101,355.561 548.211,457.780 427.319,322.050 C402.012,293.638 377.681,239.638 390.269,175.802 C398.068,117.308 405.870,58.797 413.669,0.304 C484.138,-1.459 592.187,13.495 624.266,47.103 C618.961,78.902 584.713,107.709 567.717,130.952 C528.071,186.196 488.414,241.456 448.768,296.700 C447.747,316.248 448.193,321.888 456.568,333.750 C459.818,335.050 463.069,336.350 466.318,337.650 C500.673,346.151 529.644,302.240 550.167,286.950 C614.510,238.206 678.872,189.447 743.215,140.702 C789.641,167.166 850.305,282.178 854.363,351.300 ZM0.274,386.399 C-1.107,323.152 24.620,264.236 49.023,222.601 C51.623,222.601 54.223,222.601 56.823,222.601 C77.616,241.093 222.695,350.461 245.971,341.550 C251.170,337.000 256.371,332.449 261.571,327.900 C261.681,250.434 147.663,192.355 127.022,127.052 C159.315,80.573 226.799,38.978 288.870,23.704 C297.948,177.379 362.861,288.632 230.371,374.699 C203.076,392.430 154.519,412.337 101.673,401.999 C67.876,396.799 34.070,391.599 0.274,386.399 ZM858.263,495.598 C855.444,583.542 803.896,660.524 760.765,712.045 C758.165,712.045 755.564,712.045 752.965,712.045 C696.122,665.061 632.989,622.941 569.667,583.347 C540.519,565.121 517.520,524.801 474.118,522.897 C466.969,529.397 459.818,535.898 452.668,542.397 C452.836,577.821 576.891,727.539 602.817,758.845 C615.815,773.793 628.818,788.746 641.816,803.694 C637.931,786.479 612.551,867.709 429.269,866.093 C418.870,802.400 408.468,738.688 398.069,674.996 C387.879,622.798 407.871,576.893 425.369,550.197 C520.457,405.124 683.008,494.275 858.263,495.598 ZM0.274,491.698 C51.396,484.284 83.940,479.539 121.172,472.198 C160.738,464.397 194.820,480.403 218.671,489.748 C356.626,543.796 322.770,692.952 304.470,846.593 C302.520,846.593 300.570,846.593 298.620,846.593 C255.370,832.310 146.798,786.985 138.722,745.195 C179.668,689.301 220.625,633.390 261.571,577.497 C273.836,558.450 267.778,534.293 247.921,526.797 C212.556,513.448 103.357,647.451 66.573,655.496 C43.101,660.629 1.041,527.652 0.274,491.698 Z"
          />
        </svg>
        <h3 className="font-display uppercase">Toastrelay</h3>
      </div>
      <div className="z-0 pointer-events-none absolute bottom-60 -right-80 md:-bottom-40 md:-right-20 lg:-right-0 opacity-[0.035] select-none ">
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

      <motion.div
        key="login-page"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className=" relative z-10 mx-auto mt-20 mb-20 max-w-md "
      >
        <Card>
          <div className=" px-4 md:px-6 lg:px-8 py-8">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold font-display tracking-tight text-black">
                Welcome back
              </h1>
              <p className="mb-6 text-sm text-black/50 font-body">
                Sign in to manage your stages.
              </p>
            </div>

            <SocialAuthButtons
              mode="login"
              disabled={loginMutation.isPending}
            />

            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="grid grid-cols-1 gap-4">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="login-email"
                        type="email"
                        placeholder="Enter email"
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between gap-4">
                        <FieldLabel htmlFor="login-password">
                          Password
                        </FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs font-bold text-black/50 hover:text-black"
                        >
                          Forgot?
                        </Link>
                      </div>
                      <Input
                        {...field}
                        id="login-password"
                        type="password"
                        placeholder="Enter password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="current-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                form="login-form"
                className="mt-8 w-full"
                variant={"secondary"}
                disabled={
                  form.formState.isSubmitting || loginMutation.isPending
                }
              >
                {"Log in"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-black/40">
              New to ToastRelay?{" "}
              <Link
                href="/create-account"
                className="font-bold text-black underline hover:text-turquoise-dark"
              >
                Create account
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
