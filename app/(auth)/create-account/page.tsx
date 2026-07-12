"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

import {
  createAccountSchema,
  type CreateAccountValues,
} from "@/validations/auth.schema";

import { createAccountApi } from "@/lib/api/auth";
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
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";

export default function CreateAccount() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const createAccountMutation = useMutation({
    mutationFn: createAccountApi,
  });

  const form = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const [isRegistered, setIsRegistered] = useState(false);
const [registeredEmail, setRegisteredEmail] = useState("");

  async function onSubmit(data: CreateAccountValues) {
    try {
      const response = await createAccountMutation.mutateAsync(data);
      if (response.data?.user) setAuth(response.data.user);

      toast.success(response.message || "Account created successfully");

      setRegisteredEmail(data.email);
    setIsRegistered(true)

    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create account",
      );
    }
  }

  const isPending = createAccountMutation.isPending;
if (isRegistered) {
  return (
    <div className="py-20 px-4 lg:px-0 max-w-xl mx-auto my-20">
      <Card className="p-8 text-center space-y-6">
        <h3 className="text-3xl font-bold tracking-tight text-black">Check your email</h3>
        <p className="text-sm text-black/60">
          We’ve sent a verification link to <strong className="text-black">{registeredEmail}</strong>. Please click the link in your email to verify your account.
        </p>
        <div className="pt-4 border-t border-black/5">
          <p className="text-xs text-black/40 mb-2">Wrong email address?</p>
          <Button variant="outline" size="sm" onClick={() => setIsRegistered(false)}>
            Change email address
          </Button>
        </div>
      </Card>
    </div>
  );
}

  return (
    <div className="py-20 px-4 lg:px-0">
      <motion.div
        key="login-page"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="max-w-xl mx-auto my-20"
      >
        <Card>
          <div className="px-4 md:px-6 py-8 lg:px-16">
            <div className="text-center space-y-1">
              <h3 className="text-3xl font-bold tracking-tight text-black">
                Let’s get you started
              </h3>
              <p className="mb-10 text-sm text-black/50 font-body">
                Bring people together, effortlessly.
              </p>
            </div>

            <div>
              <form id="create-account-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Controller
                      name="firstName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="reg-first-name">First name</FieldLabel>
                          <Input
                            {...field}
                            id="reg-first-name"
                            placeholder="Enter your first name"
                            aria-invalid={fieldState.invalid}
                            autoComplete="given-name"
                            disabled={isPending}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="lastName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="reg-last-name">Last name</FieldLabel>
                          <Input
                            {...field}
                            id="reg-last-name"
                            placeholder="Enter your last name"
                            aria-invalid={fieldState.invalid}
                            autoComplete="family-name"
                            disabled={isPending}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reg-email">Email</FieldLabel>
                        <Input
                          {...field}
                          id="reg-email"
                          type="email"
                          placeholder="Enter email"
                          aria-invalid={fieldState.invalid}
                          autoComplete="email"
                          disabled={isPending}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reg-password">Password</FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id="reg-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            aria-invalid={fieldState.invalid}
                            autoComplete="new-password"
                            className="pr-10"
                            disabled={isPending}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                            disabled={isPending}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button
                  type="submit"
                  form="create-account-form"
                  className="mt-8 w-full"
                  disabled={form.formState.isSubmitting || isPending}
                >
                  {isPending ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </div>

            {/* Render the reusable PKCE redirect buttons component here */}
            <SocialAuthButtons mode="signup" disabled={isPending} />

            <div className="mt-4 text-center">
              <p className="text-sm text-black/40">
                Already have a stage pass?{" "}
                <Link href="/login" className="font-bold text-black hover:text-turquoise-dark underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}