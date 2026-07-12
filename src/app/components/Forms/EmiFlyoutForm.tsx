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
import { emiFormSchema, type EmiFormValues } from "@/app/lib/validation";

interface EmiFlyoutFormProps {
  onSubmit: (values: EmiFormValues) => Promise<void>;
  loading?: boolean;
  defaultValues?: Partial<EmiFormValues>;
  submitLabel?: string;
}

export function EmiFlyoutForm({
  onSubmit,
  loading,
  defaultValues,
  submitLabel = "Add EMI",
}: EmiFlyoutFormProps) {
  const form = useForm<EmiFormValues>({
    resolver: zodResolver(emiFormSchema),
    defaultValues: {
      name: "",
      totalAmount: 0,
      emiAmount: 0,
      totalMonths: 12,
      startDate: new Date().toISOString().slice(0, 10),
      dueDay: 5,
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
              <FormLabel>EMI Name</FormLabel>
              <FormControl>
                <Input placeholder="Laptop EMI" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emiAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EMI Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="totalMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Months</FormLabel>
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
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
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
