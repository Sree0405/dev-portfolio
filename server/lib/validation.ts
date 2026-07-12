import { z } from "zod";

export const PROJECT_STATUSES = [
  "Planning",
  "In Progress",
  "Completed",
  "On Hold",
  "Cancelled",
] as const;

export const PROJECT_TYPES = [
  "Fixed Cost",
  "Hourly",
  "Maintenance",
  "Internal",
  "Other",
] as const;

export const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "UPI",
  "Cheque",
  "Other",
] as const;

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientNumber: z.string().optional().nullable(),
  projectLinks: z.string().optional().nullable(),
  projectType: z.enum(PROJECT_TYPES),
  status: z.enum(PROJECT_STATUSES),
  plannedAmount: z.coerce.number().positive("Planned amount must be greater than 0"),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createPaymentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updatePaymentSchema = createPaymentSchema.partial();

export const createNoteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
});

export const updateNoteSchema = createNoteSchema;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const CREDENTIAL_CATEGORIES = [
  "Development",
  "Hosting",
  "Database",
  "Server",
  "Domain",
  "Email",
  "Cloud",
  "API",
  "Personal",
  "Finance",
  "Social",
  "Payment Gateway",
  "Analytics",
  "Other",
] as const;

export const createCredentialSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  websiteUrl: z.string().url("Enter a valid website URL"),
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  category: z.enum(CREDENTIAL_CATEGORIES),
  notes: z.string().optional().nullable(),
});

export const updateCredentialSchema = createCredentialSchema.partial();

export const BILLING_CYCLES = ["Monthly", "Quarterly", "Half Yearly", "Yearly"] as const;

export const createEmiSchema = z.object({
  name: z.string().min(1, "EMI name is required"),
  totalAmount: z.coerce.number().positive("Total amount must be greater than 0"),
  emiAmount: z.coerce.number().positive("EMI amount must be greater than 0"),
  totalMonths: z.coerce.number().int().positive("Total months must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
  dueDay: z.coerce.number().int().min(1).max(31),
  notes: z.string().optional().nullable(),
});

export const createRentSchema = z.object({
  name: z.string().min(1, "Rent name is required"),
  monthlyAmount: z.coerce.number().positive("Monthly amount must be greater than 0"),
  dueDay: z.coerce.number().int().min(1).max(31),
  notes: z.string().optional().nullable(),
});

export const createSubscriptionSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
  monthlyCost: z.coerce.number().positive("Cost must be greater than 0"),
  billingCycle: z.enum(BILLING_CYCLES),
  renewalDate: z.string().min(1, "Renewal date is required"),
  autoRenew: z.boolean().optional(),
  category: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type CreateCredentialInput = z.infer<typeof createCredentialSchema>;
export type UpdateCredentialInput = z.infer<typeof updateCredentialSchema>;
export type CreateEmiInput = z.infer<typeof createEmiSchema>;
export type CreateRentInput = z.infer<typeof createRentSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export const markPaidSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  paidDate: z.string().optional(),
  notes: z.string().optional().nullable(),
  transactionReference: z.string().optional().nullable(),
});

export const financeReportQuerySchema = z.object({
  range: z.enum([
    "current_month",
    "last_2",
    "last_3",
    "last_6",
    "last_12",
    "custom_month",
    "custom_range",
  ]),
  month: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const budgetCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  percentage: z.coerce.number().min(0).max(100),
  financeLink: z.string().optional().nullable(),
});

export const createBudgetSchema = z
  .object({
    income: z.coerce.number().positive("Monthly income must be greater than 0"),
    ruleType: z.enum(["50_30_20", "60_20_20", "70_20_10", "custom"]),
    ruleLabel: z.string().min(1),
    notes: z.string().optional().nullable(),
    categories: z.array(budgetCategorySchema).min(1, "Add at least one category"),
  })
  .refine(
    (data) => {
      const total = data.categories.reduce((sum, c) => sum + c.percentage, 0);
      return Math.abs(total - 100) < 0.01;
    },
    { message: "Category percentages must total 100%", path: ["categories"] },
  );

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
