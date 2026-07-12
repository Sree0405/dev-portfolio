import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
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
import { loginSchema, type LoginFormValues } from "@/app/lib/validation";
import { DEMO_CREDENTIALS } from "@/app/lib/types";
import { cn } from "@/lib/utils";

export interface LoginFormHandle {
  fillDemo: () => void;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  loading?: boolean;
  success?: boolean;
  compact?: boolean;
}

export const LoginForm = forwardRef<LoginFormHandle, LoginFormProps>(function LoginForm(
  { onSubmit, loading, success, compact },
  ref,
) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: DEMO_CREDENTIALS.username,
      password: DEMO_CREDENTIALS.password,
    },
  });

  useImperativeHandle(ref, () => ({
    fillDemo: () => {
      form.setValue("username", DEMO_CREDENTIALS.username, { shouldValidate: true });
      form.setValue("password", DEMO_CREDENTIALS.password, { shouldValidate: true });
    },
  }));

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
    }
  }, [success]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(compact ? "space-y-3 lg:space-y-5" : "space-y-5")}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground/90">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter username"
                  autoComplete="username"
                  className={cn(
                    "border-white/10 bg-white/5 backdrop-blur-sm transition focus-visible:border-primary/50 focus-visible:ring-primary/20",
                    compact ? "h-10 lg:h-11" : "h-11",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground/90">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className={cn(
                    "border-white/10 bg-white/5 backdrop-blur-sm transition focus-visible:border-primary/50 focus-visible:ring-primary/20",
                    compact ? "h-10 lg:h-11" : "h-11",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading || showSuccess}
          className={cn(
            "relative w-full overflow-hidden rounded-xl font-semibold transition-all",
            compact ? "h-10 lg:h-11" : "h-11",
            "btn-sree-dev",
            "disabled:opacity-70 disabled:hover:scale-100",
          )}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </motion.span>
            ) : showSuccess ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Welcome!
              </motion.span>
            ) : (
              <motion.span
                key="login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                Login
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </form>
    </Form>
  );
});
