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
      if (response.data?.user) setAuth(response.data.user);

      toast.success(response.message || "Welcome back");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    }
  }

  return (
    <div className="px-4 lg:px-0 py-20">
      <motion.div
        key="login-page"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="mx-auto my-20 max-w-md"
      >
        <Card>
          <div className="px-4 md:px-6 py-8 lg:px-16 px-6">
            <div className="space-y-1 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Welcome back
              </h1>
              <p className="mb-10 text-sm text-black/50 font-body">
                Sign in to manage your stages.
              </p>
            </div>

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
                disabled={
                  form.formState.isSubmitting || loginMutation.isPending
                }
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
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
