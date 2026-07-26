import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { jobSalariesFormSchema, type JobSalariesFormValues } from "@/app/lib/validation";

interface JobSalariesFormProps {
  defaultValues?: Partial<JobSalariesFormValues>;
  onSubmit: (values: JobSalariesFormValues) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

export function JobSalariesForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = "Update Salaries",
}: JobSalariesFormProps) {
  const form = useForm<JobSalariesFormValues>({
    resolver: zodResolver(jobSalariesFormSchema),
    defaultValues: {
      expectedSalary: undefined,
      currentSalary: undefined,
      negotiatedSalary: undefined,
      offeredSalary: undefined,
      companyStandardSalary: undefined,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["expectedSalary", "Expected Salary"],
              ["currentSalary", "Current Salary"],
              ["negotiatedSalary", "Negotiated Salary"],
              ["offeredSalary", "Offered Salary"],
              ["companyStandardSalary", "Company Standard Salary"],
            ] as const
          ).map(([name, label]) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
