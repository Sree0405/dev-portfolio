import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { jobNoteFormSchema, type JobNoteFormValues } from "@/app/lib/validation";

interface JobNoteFormProps {
  defaultValues?: Partial<JobNoteFormValues>;
  onSubmit: (values: JobNoteFormValues) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

export function JobNoteForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = "Save Note",
}: JobNoteFormProps) {
  const form = useForm<JobNoteFormValues>({
    resolver: zodResolver(jobNoteFormSchema),
    defaultValues: { content: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note *</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="HR requested current CTC..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
