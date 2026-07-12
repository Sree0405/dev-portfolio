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
import { noteFormSchema, type NoteFormValues } from "@/app/lib/validation";

interface NoteFormProps {
  defaultValues?: Partial<NoteFormValues>;
  onSubmit: (values: NoteFormValues) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

export function NoteForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = "Save Note",
}: NoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      content: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content *</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your note..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
