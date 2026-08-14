"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { changePasswordApi, updateProfileApi } from "@/lib/api/auth";
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
import { getInitials } from "@/lib/utils/helpers";
import { cn } from "@/lib/utils";
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordValues,
  type ProfileValues,
} from "@/validations/auth.schema";

type ProfileTab = "profile" | "security";

const tabs: { id: ProfileTab; label: string; icon: typeof UserRound }[] = [
  { id: "profile", label: "Profile details", icon: UserRound },
  { id: "security", label: "Change password", icon: ShieldCheck },
];

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [showPassword, setShowPassword] = useState(false);

  const profileMutation = useMutation({ mutationFn: updateProfileApi });
  const passwordMutation = useMutation({ mutationFn: changePasswordApi });

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user, profileForm]);

  async function onProfileSubmit(data: ProfileValues) {
    try {
      const response = await profileMutation.mutateAsync(data);
      if (response.data) setAuth(response.data);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update profile",
      );
    }
  }

  async function onPasswordSubmit(data: ChangePasswordValues) {
    try {
      await passwordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed");
      passwordForm.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to change password",
      );
    }
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-6 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </main>
    );
  }

  return (
    <main className="bg-[#FAF9F6]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div>
              <h1 className="mt-2 text-4xl font-bold font-display md:text-2xl">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 py-8 md:grid-cols-[240px_1fr]">
          {/* ── Vertical tab rail ─────────────── */}
          <nav className="flex flex-row gap-2 md:flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition",
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "text hover:bg-black/[0.04] hover:text-foreground",
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* ── Active tab content ────────────── */}
          <div>
            {activeTab === "profile" ? (
              <Card className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-turquoise" />
                  <h2 className="text-xl font-bold">Profile details</h2>
                </div>

                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <FieldGroup className="gap-4">
                    <Controller
                      name="firstName"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="profile-first-name">
                            First name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="profile-first-name"
                            placeholder="Enter your first name"
                            aria-invalid={fieldState.invalid}
                            disabled={profileMutation.isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="lastName"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="profile-last-name">
                            Last name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="profile-last-name"
                            placeholder="Enter your last name"
                            aria-invalid={fieldState.invalid}
                            disabled={profileMutation.isPending}
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
                    disabled={
                      profileForm.formState.isSubmitting ||
                      profileMutation.isPending
                    }
                  >
                    {profileMutation.isPending ? "Saving..." : "Save changes"}
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-coral" />
                  <h2 className="text-xl font-bold">Change password</h2>
                </div>

                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <FieldGroup className="gap-4">
                    <Controller
                      name="currentPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="current-password">
                            Current password
                          </FieldLabel>
                          <Input
                            {...field}
                            id="current-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            aria-invalid={fieldState.invalid}
                            autoComplete="current-password"
                            disabled={passwordMutation.isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="newPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="new-password">
                            New password
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              id="new-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              aria-invalid={fieldState.invalid}
                              autoComplete="new-password"
                              className="pr-10"
                              disabled={passwordMutation.isPending}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              tabIndex={-1}
                              disabled={passwordMutation.isPending}
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
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="confirm-new-password">
                            Confirm new password
                          </FieldLabel>
                          <Input
                            {...field}
                            id="confirm-new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Re-enter new password"
                            aria-invalid={fieldState.invalid}
                            autoComplete="new-password"
                            disabled={passwordMutation.isPending}
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
                    disabled={
                      passwordForm.formState.isSubmitting ||
                      passwordMutation.isPending
                    }
                  >
                    {passwordMutation.isPending
                      ? "Updating..."
                      : "Update password"}
                  </Button>
                </form>
              </Card>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
