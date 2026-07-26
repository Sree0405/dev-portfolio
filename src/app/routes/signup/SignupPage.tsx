import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { SignupForm } from "@/app/components/Forms/SignupForm";
import { TOOL_NAME, TOOL_TAGLINE } from "@/app/lib/brand";
import type { SignupFormValues } from "@/app/lib/validation";

export default function SignupPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const signupMutation = useMutation({
    mutationFn: api.signup,
    onSuccess: (data) => {
      setSignupSuccess(true);
      queryClient.setQueryData(["auth", "me"], data);
      toast.success(`Welcome to ${TOOL_NAME}!`);
      setTimeout(() => navigate("/dashboard", { replace: true }), 600);
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 409) {
        toast.error(error.message);
        return;
      }
      toast.error("Could not create account. Please try again.");
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    await signupMutation.mutateAsync({
      username: values.username,
      email: values.email,
      password: values.password,
      displayName: values.displayName || values.username,
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#07070f] px-4 py-12 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.22),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Create your workspace
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center">{TOOL_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{TOOL_TAGLINE}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <h2 className="text-lg font-semibold">Sign up</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a free account to manage your own isolated workspace.
          </p>

          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
            <div className="flex gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your projects, finance, credentials, and all workspace data are private to your
                account. Even administrators cannot view your data — only your account details
                appear in the user directory.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <SignupForm
              onSubmit={handleSubmit}
              loading={signupMutation.isPending}
              success={signupSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
