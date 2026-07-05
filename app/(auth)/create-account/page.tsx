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

// 1. Ensure you import SocialAuthPayload if needed, or rely on socialAuthApi signature
import { createAccountApi, socialAuthApi } from "@/lib/api/auth";
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
import { SocialProvider } from "@/types/enum";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string | undefined;
            scope: string;
            callback: (response: { access_token: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential: string;       // This is the JWT token you need!
  select_by: string;        // e.g., "btn", "user_1tap"
}

export default function CreateAccount() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const createAccountMutation = useMutation({
    mutationFn: createAccountApi,
  });

  // 2. Instantiate the social auth mutation
  const socialAuthMutation = useMutation({
    mutationFn: socialAuthApi,
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

  async function onSubmit(data: CreateAccountValues) {
    try {
      const response = await createAccountMutation.mutateAsync(data);
      if (response.data?.user) setAuth(response.data.user);

      toast.success(response.message || "Account created successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create account",
      );
    }
  }

  // 3. Define the handler for Google Signup
  // async function handleGoogleSignup() {
  //   try {
  //     // NOTE: Replace this with your frontend provider implementation 
  //     // (e.g., Google Identity Services SDK, Firebase pop-up, or Clerk/Supabase token capture)
  //     const mockGoogleToken = "RECEIVED_GOOGLE_JWT_OR_ACCESS_TOKEN"; 

  //     if (!mockGoogleToken) return;

  //     const response = await socialAuthMutation.mutateAsync({
  //       token: mockGoogleToken,
  //       provider: SocialProvider.GOOGLE, // matches your SocialProvider union type
  //     });

  //     if (response.data?.user) setAuth(response.data.user);

  //     toast.success(response.message || "Signed up with Google successfully");
  //     router.push("/dashboard");
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error ? error.message : "Google authentication failed",
  //     );
  //   }
  // }




  // Prevent interactions while any mutation is pending
  const isPending = createAccountMutation.isPending 

 const handleGoogleSignup = () => {
  if (!window.google) {
    toast.error("Google authentication is loading. Please try again.");
    return;
  }

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    scope: "openid email profile", 
    callback: async (tokenResponse) => {
      if (tokenResponse.error) {
        toast.error("Google authentication cancelled.");
        return;
      }

      try {
        const apiResponse = await socialAuthMutation.mutateAsync({
          token: tokenResponse.access_token,
          provider: SocialProvider.GOOGLE,
        });

        if (apiResponse.data?.user) setAuth(apiResponse.data.user);
        toast.success(apiResponse.message || "Signed up successfully!");
        router.push("/dashboard");
      } catch (error) {
        toast.error("Google authentication failed backend verification.");
      }
    },
  });

  // 4. Force the popup window to open immediately
  client.requestAccessToken();
};

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
              <form
                id="create-account-form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Controller
                      name="firstName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="reg-first-name">
                            First name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="reg-first-name"
                            placeholder="Enter your first name"
                            aria-invalid={fieldState.invalid}
                            autoComplete="given-name"
                            disabled={isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="lastName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="reg-last-name">
                            Last name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="reg-last-name"
                            placeholder="Enter your last name"
                            aria-invalid={fieldState.invalid}
                            autoComplete="family-name"
                            disabled={isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
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
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
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
                  {createAccountMutation.isPending
                    ? "Creating account..."
                    : "Create account"}
                </Button>
              </form>
            </div>

            <div className="mt-4 space-y-4">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-black/5"></div>
                <span className="flex-shrink mx-4 text-black/50 text-[9px] font-mono uppercase tracking-[0.2em]">
                  OR
                </span>
                <div className="flex-grow border-t border-black/5"></div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {/* 4. Connected onClick handler and loading state */}
                <Button
                  variant={"secondary"}
                  className="w-full"
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isPending}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.15-.43-.19-.9-.19-1.39c0-.25.04-.49.1-.73z"
                      fillRule="evenodd"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  {socialAuthMutation.isPending
                    ? "Connecting to Google..."
                    : "Sign Up with Google"}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-black/40">
                Already have a stage pass?{" "}
                <Link
                  href="/login"
                  className="font-bold text-black hover:text-turquoise-dark underline"
                >
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