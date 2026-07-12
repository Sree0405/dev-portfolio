import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppModal } from "@/app/components/Modal/AppModal";
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
import { markPaidFormSchema, type MarkPaidFormValues } from "@/app/lib/validation";
import { toDateInputValue } from "@/app/lib/format";

interface MarkPaidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAmount: number;
  loading?: boolean;
  onSubmit: (values: MarkPaidFormValues) => Promise<void>;
}

export function MarkPaidModal({
  open,
  onOpenChange,
  defaultAmount,
  loading,
  onSubmit,
}: MarkPaidModalProps) {
  const form = useForm<MarkPaidFormValues>({
    resolver: zodResolver(markPaidFormSchema),
    defaultValues: {
      amount: defaultAmount,
      paidDate: toDateInputValue(),
      notes: "",
      transactionReference: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        amount: defaultAmount,
        paidDate: toDateInputValue(),
        notes: "",
        transactionReference: "",
      });
    }
  }, [open, defaultAmount, form]);

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Mark as Paid"
      description="Record a payment and update the record status."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
          })}
          className="space-y-3"
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paidDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paid Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transactionReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Reference</FormLabel>
                <FormControl>
                  <Input placeholder="UPI / bank reference" {...field} />
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
            {loading ? "Saving..." : "Confirm Payment"}
          </Button>
        </form>
      </Form>
    </AppModal>
  );
}
