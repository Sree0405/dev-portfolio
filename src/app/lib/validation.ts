import { z } from "zod";
import { CREDENTIAL_CATEGORIES, PAYMENT_METHODS, PROJECT_STATUSES, PROJECT_TYPES } from "./constants";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientNumber: z.string().optional(),
  projectLinks: z.string().optional(),
  projectType: z.enum(PROJECT_TYPES),
  status: z.enum(PROJECT_STATUSES),
  plannedAmount: z.coerce.number().positive("Total planned amount must be greater than 0"),
});

export const paymentFormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export const noteFormSchema = z.object({
  content: z.string().min(1, "Note content is required"),
});

export const credentialFormSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  websiteUrl: z.string().url("Enter a valid website URL"),
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  category: z.enum(CREDENTIAL_CATEGORIES),
  notes: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
export type NoteFormValues = z.infer<typeof noteFormSchema>;
export type CredentialFormValues = z.infer<typeof credentialFormSchema>;

export const emiFormSchema = z.object({
  name: z.string().min(1, "EMI name is required"),
  totalAmount: z.coerce.number().positive("Total amount must be greater than 0"),
  emiAmount: z.coerce.number().positive("EMI amount must be greater than 0"),
  totalMonths: z.coerce.number().int().positive("Total months must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
  dueDay: z.coerce.number().int().min(1).max(31),
  notes: z.string().optional(),
});

export const rentFormSchema = z.object({
  name: z.string().min(1, "Rent name is required"),
  monthlyAmount: z.coerce.number().positive("Monthly amount must be greater than 0"),
  dueDay: z.coerce.number().int().min(1).max(31),
  notes: z.string().optional(),
});

export const subscriptionFormSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  monthlyCost: z.coerce.number().positive("Cost must be greater than 0"),
  billingCycle: z.enum(["Monthly", "Quarterly", "Half Yearly", "Yearly"]),
  renewalDate: z.string().min(1, "Renewal date is required"),
  autoRenew: z.boolean().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
});

export type EmiFormValues = z.infer<typeof emiFormSchema>;
export type RentFormValues = z.infer<typeof rentFormSchema>;
export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export const markPaidFormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paidDate: z.string().min(1, "Paid date is required"),
  notes: z.string().optional(),
  transactionReference: z.string().optional(),
});

export type MarkPaidFormValues = z.infer<typeof markPaidFormSchema>;

export const budgetCategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  percentage: z.coerce.number().min(0).max(100),
  financeLink: z.string().optional().nullable(),
});

export const budgetSetupFormSchema = z
  .object({
    income: z.coerce.number().positive("Monthly income must be greater than 0"),
    ruleType: z.enum(["50_30_20", "60_20_20", "70_20_10", "custom"]),
    ruleLabel: z.string().min(1),
    notes: z.string().optional(),
    categories: z.array(budgetCategoryFormSchema).min(1),
  })
  .refine(
    (data) => {
      const total = data.categories.reduce((sum, c) => sum + Number(c.percentage), 0);
      return Math.abs(total - 100) < 0.01;
    },
    { message: "Category percentages must total 100%", path: ["categories"] },
  );

export type BudgetSetupFormValues = z.infer<typeof budgetSetupFormSchema>;
