import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formSubmissionSchema, type FormSubmissionFormValues } from "@/app/lib/validation";

interface FormSubmissionFormProps {
  defaultValues?: Partial<FormSubmissionFormValues>;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: FormSubmissionFormValues) => Promise<void>;
}

export function FormSubmissionForm({
  defaultValues,
  loading = false,
  submitLabel = "Save Form",
  onSubmit,
}: FormSubmissionFormProps) {
  const form = useForm<FormSubmissionFormValues>({
    resolver: zodResolver(formSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Sender name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="sender@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="What is this about?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder="Message body..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="sreeDev" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
