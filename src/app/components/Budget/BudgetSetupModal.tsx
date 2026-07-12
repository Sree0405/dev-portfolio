import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { formatCurrency } from "@/app/lib/format";
import { budgetSetupFormSchema, type BudgetSetupFormValues } from "@/app/lib/validation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BudgetSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "reset";
  loading?: boolean;
  initialValues?: Partial<BudgetSetupFormValues>;
  onSubmit: (values: BudgetSetupFormValues) => Promise<void>;
}

export function BudgetSetupModal({
  open,
  onOpenChange,
  mode,
  loading,
  initialValues,
  onSubmit,
}: BudgetSetupModalProps) {
  const { data: rulesData } = useQuery({
    queryKey: ["budget", "rules"],
    queryFn: api.getBudgetRules,
    enabled: open,
  });

  const form = useForm<BudgetSetupFormValues>({
    resolver: zodResolver(budgetSetupFormSchema),
    defaultValues: {
      income: 75000,
      ruleType: "50_30_20",
      ruleLabel: "50 / 30 / 20",
      notes: "",
      categories: [],
      ...initialValues,
    },
  });

  const { fields, replace, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const ruleType = form.watch("ruleType");
  const income = form.watch("income");
  const categories = form.watch("categories");
  const totalPct = categories.reduce((s, c) => s + Number(c.percentage || 0), 0);

  useEffect(() => {
    if (!open || !rulesData) return;
    if (initialValues?.categories?.length) {
      form.reset({ ...form.getValues(), ...initialValues });
      return;
    }
    applyRuleTemplate("50_30_20");
  }, [open, rulesData]);

  const applyRuleTemplate = (ruleId: string) => {
    const rule = rulesData?.rules.find((r) => r.id === ruleId);
    if (!rule) return;
    form.setValue("ruleType", ruleId as BudgetSetupFormValues["ruleType"]);
    form.setValue("ruleLabel", rule.label);
    replace(
      rule.categories.map((c) => ({
        name: c.name,
        percentage: c.percentage,
        financeLink: c.financeLink,
      })),
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Start New Budget" : "Reset Budget"}
      description="Allocate your monthly income across categories. Total must equal 100%."
      className="sm:max-w-2xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ruleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Rule</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      if (v !== "custom") applyRuleTemplate(v);
                      else {
                        field.onChange(v);
                        form.setValue("ruleLabel", "Custom Rule");
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rulesData?.rules.map((rule) => (
                        <SelectItem key={rule.id} value={rule.id}>
                          {rule.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Rule</SelectItem>
                    </SelectContent>
                  </Select>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Budget Categories</p>
              <p
                className={cn(
                  "text-xs font-semibold",
                  Math.abs(totalPct - 100) < 0.01 ? "text-emerald-400" : "text-red-400",
                )}
              >
                Total: {totalPct.toFixed(1)}%
              </p>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border/60 p-3">
              {fields.map((field, index) => {
                const pct = Number(categories[index]?.percentage || 0);
                const amount = (Number(income) * pct) / 100;
                return (
                  <div key={field.id} className="grid grid-cols-[1fr_80px_100px_auto] gap-2">
                    <FormField
                      control={form.control}
                      name={`categories.${index}.name`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Category" {...f} disabled={ruleType !== "custom"} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`categories.${index}.percentage`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" step="0.01" {...f} disabled={ruleType !== "custom"} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center text-xs text-muted-foreground">
                      {formatCurrency(amount || 0)}
                    </div>
                    {ruleType === "custom" && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {ruleType === "custom" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", percentage: 0, financeLink: null })}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Category
              </Button>
            )}
          </div>

          <Button type="submit" variant="sreeDev" className="w-full" disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Start Budget" : "Reset & Start Fresh"}
          </Button>
        </form>
      </Form>
    </AppModal>
  );
}
