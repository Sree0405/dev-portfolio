import { z } from "zod";
import { CREDENTIAL_CATEGORIES, PAYMENT_METHODS, PROJECT_STATUSES, PROJECT_TYPES } from "./constants";
import { INTERVIEW_MODES, JOB_STATUSES } from "./jobTracker/constants";

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

export const profileFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100),
  email: z.string().email("Enter a valid email address"),
});

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
export type NoteFormValues = z.infer<typeof noteFormSchema>;
export type CredentialFormValues = z.infer<typeof credentialFormSchema>;

export const formSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email address").max(200),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
});

export type FormSubmissionFormValues = z.infer<typeof formSubmissionSchema>;

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

export const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  careersUrl: z.string().url().optional().or(z.literal("")),
  companyType: z.string().optional(),
  productCategory: z.string().optional(),
  companySize: z.string().optional(),
  headquarters: z.string().optional(),
  officeLocation: z.string().optional(),
  applied: z.boolean().optional(),
  hrContact: z.string().optional(),
});

export const companyContactFormSchema = z.object({
  name: z.string().min(1, "Contact name is required"),
  designation: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const jobApplicationFormSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  jobId: z.string().optional(),
  roleName: z.string().min(1, "Role name is required"),
  applicationUrl: z.string().url().optional().or(z.literal("")),
  appliedThrough: z.string().optional(),
  mailId: z.string().email().optional().or(z.literal("")),
  appliedDate: z.string().min(1, "Applied date is required"),
  currentStatus: z.enum(JOB_STATUSES).optional(),
  expectedSalary: z.coerce.number().optional(),
  currentSalary: z.coerce.number().optional(),
});

export const jobStatusFormSchema = z.object({
  status: z.enum(JOB_STATUSES),
});

export const jobSalariesFormSchema = z.object({
  expectedSalary: z.coerce.number().optional().nullable(),
  currentSalary: z.coerce.number().optional().nullable(),
  negotiatedSalary: z.coerce.number().optional().nullable(),
  offeredSalary: z.coerce.number().optional().nullable(),
  companyStandardSalary: z.coerce.number().optional().nullable(),
});

export const interviewFormSchema = z.object({
  interviewDate: z.string().min(1, "Interview date is required"),
  interviewTime: z.string().optional(),
  mode: z.enum(INTERVIEW_MODES),
  location: z.string().optional(),
  interviewer: z.string().optional(),
  meetingLink: z.string().optional(),
  notes: z.string().optional(),
});

export const jobNoteFormSchema = z.object({
  content: z.string().min(1, "Note content is required"),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
export type CompanyContactFormValues = z.infer<typeof companyContactFormSchema>;
export type JobApplicationFormValues = z.infer<typeof jobApplicationFormSchema>;
export type JobStatusFormValues = z.infer<typeof jobStatusFormSchema>;
export type JobSalariesFormValues = z.infer<typeof jobSalariesFormSchema>;
export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
export type JobNoteFormValues = z.infer<typeof jobNoteFormSchema>;
