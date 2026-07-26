import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound, UserRound } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import {
  changePasswordFormSchema,
  profileFormSchema,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from "@/app/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        displayName: user.displayName ?? user.username,
        email: user.email,
      });
    }
  }, [user, profileForm]);

  const profileMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], (prev: { features?: unknown } | undefined) => ({
        ...prev,
        user: data.user,
      }));
      toast.success("Profile updated");
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 409) {
        toast.error(error.message);
        return;
      }
      toast.error(error.message);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: api.changePassword,
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Password changed successfully");
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 400) {
        toast.error(error.message);
        return;
      }
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Profile"
        description="Manage your account details and password"
      />

      <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
        {user && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-surface/50 px-4 py-3 text-sm">
            <UserRound className="h-4 w-4 text-primary" />
            <span className="font-medium">{user.username}</span>
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
          </div>
        )}

        <section className="rounded-xl border border-border/60 bg-surface/50 p-5">
          <h2 className="text-base font-semibold">Account details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your display name and email address.
          </p>

          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit((values) => profileMutation.mutate(values))}
              className="mt-4 space-y-4"
            >
              <FormField
                control={profileForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={profileMutation.isPending}>
                {profileMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </section>

        <section className="rounded-xl border border-border/60 bg-surface/50 p-5">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Change password</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a strong password with at least 8 characters.
          </p>

          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit((values) =>
                passwordMutation.mutate({
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                }),
              )}
              className="mt-4 space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? "Updating..." : "Update password"}
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
}
