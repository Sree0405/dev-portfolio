import { z } from "zod";
import { DEV_UTILITY_IDS } from "./devUtilityIds.js";

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

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username may only contain letters, numbers, underscores, and hyphens"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().min(1, "Display name is required").max(100).optional(),
});

export const updateProfileSchema = z.object({
  email: z.string().email("Enter a valid email address").optional(),
  displayName: z.string().min(1, "Display name is required").max(100).optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
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

export const createResumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  latexSource: z.string().optional(),
});

export const updateResumeSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional().nullable(),
  latexSource: z.string().min(1, "LaTeX source is required").optional(),
});

export const saveResumeSchema = updateResumeSchema.extend({
  compiledPdfBase64: z.string().optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type SaveResumeInput = z.infer<typeof saveResumeSchema>;

export const devUtilityIdSchema = z.enum(DEV_UTILITY_IDS);

export const FORM_STATUSES = ["new", "read", "archived"] as const;

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email address").max(200),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
});

export const createFormSubmissionSchema = contactFormSchema.extend({
  source: z.string().min(1).max(80).optional(),
});

export const updateFormSubmissionSchema = z.object({
  status: z.enum(FORM_STATUSES).optional(),
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().max(200).optional(),
  subject: z.string().min(1).max(200).optional(),
  message: z.string().min(1).max(5000).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type CreateFormSubmissionInput = z.infer<typeof createFormSubmissionSchema>;
export type UpdateFormSubmissionInput = z.infer<typeof updateFormSubmissionSchema>;

export const REVIEW_RELATIONSHIPS = [
  "colleague",
  "client",
  "manager",
  "mentor",
  "other",
] as const;

export const publicReviewSchema = z.object({
  name: z.string().max(120).optional().default(""),
  role: z.string().max(120).optional().default(""),
  relationship: z.enum(REVIEW_RELATIONSHIPS),
  message: z.string().min(1, "Review is required").max(800),
});

export const updateReviewSchema = z.object({
  visible: z.boolean().optional(),
  name: z.string().max(120).optional(),
  role: z.string().max(120).nullable().optional(),
  relationship: z.enum(REVIEW_RELATIONSHIPS).optional(),
  message: z.string().min(1).max(800).optional(),
});

export type PublicReviewInput = z.infer<typeof publicReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export const JOB_STATUSES = [
  "Applied",
  "Shortlisted",
  "HR Discussion",
  "Interview Scheduled",
  "Interview Completed",
  "Technical Round",
  "Manager Round",
  "Final Round",
  "Selected",
  "Offer Received",
  "Rejected",
  "Withdrawn",
] as const;

export const INTERVIEW_MODES = ["Online", "Offline"] as const;

export const COMPANY_APPLIED_FILTERS = ["All", "Applied", "Not Applied"] as const;

export const COMPANY_TYPES = [
  "Startup",
  "MNC",
  "Product",
  "Service",
  "Agency",
  "Consulting",
  "Government",
  "Non-Profit",
  "Other",
] as const;

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal("")),
  careersUrl: z.string().url().optional().nullable().or(z.literal("")),
  companyType: z.string().optional().nullable(),
  productCategory: z.string().optional().nullable(),
  companySize: z.string().optional().nullable(),
  headquarters: z.string().optional().nullable(),
  officeLocation: z.string().optional().nullable(),
  applied: z.boolean().optional(),
  hrContact: z.string().optional().nullable(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const createCompanyContactSchema = z.object({
  name: z.string().min(1, "Contact name is required"),
  designation: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateCompanyContactSchema = createCompanyContactSchema.partial();

export const companyImportRowSchema = z.object({
  name: z.string().min(1),
  linkedinUrl: z.string().optional().nullable(),
  careersUrl: z.string().optional().nullable(),
  companyType: z.string().optional().nullable(),
  productCategory: z.string().optional().nullable(),
  companySize: z.string().optional().nullable(),
  headquarters: z.string().optional().nullable(),
  officeLocation: z.string().optional().nullable(),
  applied: z.boolean().optional(),
  hrContact: z.string().optional().nullable(),
});

export const companyImportSchema = z.object({
  rows: z.array(companyImportRowSchema).min(1, "No valid rows to import"),
});

export const createJobApplicationSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  jobId: z.string().optional().nullable(),
  roleName: z.string().min(1, "Role name is required"),
  applicationUrl: z.string().url().optional().nullable().or(z.literal("")),
  appliedThrough: z.string().optional().nullable(),
  mailId: z.string().email().optional().nullable().or(z.literal("")),
  appliedDate: z.string().min(1, "Applied date is required"),
  currentStatus: z.enum(JOB_STATUSES).optional(),
  expectedSalary: z.coerce.number().optional().nullable(),
  currentSalary: z.coerce.number().optional().nullable(),
  negotiatedSalary: z.coerce.number().optional().nullable(),
  offeredSalary: z.coerce.number().optional().nullable(),
  companyStandardSalary: z.coerce.number().optional().nullable(),
});

export const updateJobApplicationSchema = createJobApplicationSchema
  .omit({ companyId: true })
  .partial()
  .extend({
    currentStatus: z.enum(JOB_STATUSES).optional(),
  });

export const updateJobStatusSchema = z.object({
  status: z.enum(JOB_STATUSES),
});

export const updateJobSalariesSchema = z.object({
  expectedSalary: z.coerce.number().optional().nullable(),
  currentSalary: z.coerce.number().optional().nullable(),
  negotiatedSalary: z.coerce.number().optional().nullable(),
  offeredSalary: z.coerce.number().optional().nullable(),
  companyStandardSalary: z.coerce.number().optional().nullable(),
});

export const createInterviewSchema = z.object({
  interviewDate: z.string().min(1, "Interview date is required"),
  interviewTime: z.string().optional().nullable(),
  mode: z.enum(INTERVIEW_MODES),
  location: z.string().optional().nullable(),
  interviewer: z.string().optional().nullable(),
  meetingLink: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateInterviewSchema = createInterviewSchema.partial();

export const createJobNoteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
});

export const updateJobNoteSchema = createJobNoteSchema;

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CreateCompanyContactInput = z.infer<typeof createCompanyContactSchema>;
export type UpdateCompanyContactInput = z.infer<typeof updateCompanyContactSchema>;
export type CompanyImportInput = z.infer<typeof companyImportSchema>;
export type CreateJobApplicationInput = z.infer<typeof createJobApplicationSchema>;
export type UpdateJobApplicationInput = z.infer<typeof updateJobApplicationSchema>;
export type UpdateJobStatusInput = z.infer<typeof updateJobStatusSchema>;
export type UpdateJobSalariesInput = z.infer<typeof updateJobSalariesSchema>;
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
export type CreateJobNoteInput = z.infer<typeof createJobNoteSchema>;
export type UpdateJobNoteInput = z.infer<typeof updateJobNoteSchema>;
