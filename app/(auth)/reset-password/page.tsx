"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { resetPasswordApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/validations/auth.schema";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);

  const resetMutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfully. You can now log in.");
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Unable to reset password",
      );
    },
  });

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: ResetPasswordValues) {
    if (!token) {
      toast.error("This reset link is missing its token.");
      return;
    }
    await resetMutation.mutateAsync({ token, newPassword: data.password });
  }

  if (!token) {
    return (
      <div className="px-4 py-20 lg:px-0">
        <div className="mx-auto my-20 max-w-lg">
          <Card className="p-8 text-center space-y-4">
            <KeyRound className="mx-auto h-10 w-10 text-destructive" />
            <h3 className="text-2xl font-bold text-black">Invalid Reset Link</h3>
            <p className="text-sm text-black/60">
              This password reset link is incomplete or has expired. Please
              request a new one.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => router.push("/forgot-password")}
            >
              Request a new link
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-20 lg:px-0">
      <div className="mx-auto my-20 max-w-lg">
        <Card className="p-8 md:p-10">
          <div className="text-center space-y-1">
            <KeyRound className="mx-auto h-10 w-10 text-turquoise" />
            <h3 className="font-display text-2xl font-bold tracking-tight text-black">
              Choose a new password
            </h3>
            <p className="mb-8 text-sm text-black/50">
              Your new password must be at least 6 characters long.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reset-password">New password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="reset-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="new-password"
                        className="pr-10"
                        disabled={resetMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        disabled={resetMutation.isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm new password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                      disabled={resetMutation.isPending}
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
              variant="secondary"
              className="mt-8 w-full"
              disabled={form.formState.isSubmitting || resetMutation.isPending}
            >
              {resetMutation.isPending ? "Resetting..." : "Reset password"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-black/40">
            Changed your mind?{" "}
            <Link
              href="/login"
              className="font-bold text-black underline hover:text-turquoise-dark"
            >
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 lg:px-0">
          <div className="mx-auto my-20 max-w-lg">
            <Card className="p-8 text-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent mx-auto" />
              <p className="text-sm font-medium text-black/60">
                Loading password reset form...
              </p>
            </Card>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}