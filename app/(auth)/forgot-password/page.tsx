"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { forgotPasswordApi } from "@/lib/api/auth";
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
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/validations/auth.schema";

export default function ForgotPasswordPage() {
  const forgotMutation = useMutation({
    mutationFn: forgotPasswordApi,
  });

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordValues) {
    try {
      const response = await forgotMutation.mutateAsync(data);
      toast.success(response?.message ?? "Reset link sent!");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send reset link",
      );
    }
  }

  return (
    <div className="px-4 py-20 lg:px-0">
      <div className="mx-auto my-20 max-w-lg">
        <Card className="p-8 md:p-10">
          <div className="text-center space-y-1">
            <MailCheck className="mx-auto h-10 w-10 text-turquoise" />
            <h3 className="font-display text-2xl font-bold tracking-tight text-black">
              Forgot your password?
            </h3>
            <p className="mb-8 text-sm text-black/50">
              Enter your email and we&apos;ll send you a link to reset it.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      aria-invalid={fieldState.invalid}
                      autoComplete="email"
                      disabled={forgotMutation.isPending}
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
              disabled={form.formState.isSubmitting || forgotMutation.isPending}
            >
              {forgotMutation.isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-black/40">
            Remembered your password?{" "}
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
