import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CREDENTIAL_CATEGORIES } from "@/app/lib/constants";
import { credentialFormSchema, type CredentialFormValues } from "@/app/lib/validation";

interface CredentialFormProps {
  defaultValues?: Partial<CredentialFormValues>;
  onSubmit: (values: CredentialFormValues) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

const defaultCredentialValues: CredentialFormValues = {
  serviceName: "",
  websiteUrl: "",
  username: "",
  password: "",
  category: "Development",
  notes: "",
};

export function CredentialForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = "Save Credential",
}: CredentialFormProps) {
  const form = useForm<CredentialFormValues>({
    resolver: zodResolver(credentialFormSchema),
    defaultValues: {
      ...defaultCredentialValues,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="serviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name *</FormLabel>
              <FormControl>
                <Input placeholder="Vercel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL *</FormLabel>
              <FormControl>
                <Input placeholder="https://vercel.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username / Email *</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
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
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CREDENTIAL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional notes about this credential..."
                  className="min-h-[88px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="sreeDev" className="w-full" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
