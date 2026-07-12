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
import { rentFormSchema, type RentFormValues } from "@/app/lib/validation";

interface RentFlyoutFormProps {
  onSubmit: (values: RentFormValues) => Promise<void>;
  loading?: boolean;
  defaultValues?: Partial<RentFormValues>;
  submitLabel?: string;
}

export function RentFlyoutForm({
  onSubmit,
  loading,
  defaultValues,
  submitLabel = "Add Rent",
}: RentFlyoutFormProps) {
  const form = useForm<RentFormValues>({
    resolver: zodResolver(rentFormSchema),
    defaultValues: {
      name: "",
      monthlyAmount: 0,
      dueDay: 1,
      notes: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rent Name</FormLabel>
              <FormControl>
                <Input placeholder="House Rent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="monthlyAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Day</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={31} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea className="min-h-[72px] resize-none" {...field} />
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
