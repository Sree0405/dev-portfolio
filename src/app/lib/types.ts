export type UserRole = "admin" | "user" | "demo";
export type DataType = "Default" | "Demo";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  role: UserRole;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  items: UserAccount[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientNumber: string | null;
  projectLinks: string | null;
  projectType: string;
  status: string;
  plannedAmount: number;
  totalPaid: number;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  projectId: string;
  amount: number;
  paymentMethod: string;
  reference: string | null;
  notes: string | null;
  paymentDate: string;
  createdAt: string;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  id: string;
  serviceName: string;
  websiteUrl: string;
  username: string;
  password: string;
  category: string;
  notes: string | null;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialsListResponse {
  items: Credential[];
}

export interface PaginatedProjects {
  items: Project[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  status: string;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedFormSubmissions {
  items: FormSubmission[];
  total: number;
  page: number;
  pageSize: number;
}

export type ReviewRelationship =
  | "colleague"
  | "client"
  | "manager"
  | "mentor"
  | "other";

export interface PortfolioReview {
  id: string;
  name: string;
  relationship: ReviewRelationship | string;
  message: string;
  visible: boolean;
  source: string;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPortfolioReviews {
  items: PortfolioReview[];
  total: number;
  page: number;
  pageSize: number;
}

export const DEMO_REVIEW_DELETE_MESSAGE = "Deleting demo reviews is disabled.";

export interface PaymentMutationResult {
  payment?: Payment;
  project: Project | null;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface DashboardAnalytics {
  totalProjects: number;
  totalCredentials: number;
  totalPlannedAmount: number;
  totalPaidAmount: number;
  totalRemainingAmount: number;
  completedProjects: number;
  activeProjects: number;
  planningProjects: number;
  onHoldProjects: number;
  cancelledProjects: number;
  receivableProjectCount: number;
  collectionRate: number;
  averageProjectValue: number;
  averagePayment: number;
  highestPayingProject: { id: string; name: string; amount: number } | null;
  highestRemainingProject: { id: string; name: string; amount: number } | null;
  recentPayments: {
    id: string;
    date: string;
    projectId: string;
    projectName: string;
    clientName: string;
    amount: number;
    paymentMethod: string;
  }[];
  recentNotes: {
    id: string;
    projectId: string;
    projectName: string;
    createdAt: string;
    preview: string;
  }[];
  latestProjects: {
    id: string;
    name: string;
    clientName: string;
    status: string;
    plannedAmount: number;
    totalPaid: number;
    remainingAmount: number;
    progress: number;
  }[];
  projectStatusDistribution: { status: string; count: number }[];
  revenueByProject: { projectId: string; projectName: string; amount: number }[];
  monthlyPayments: { month: string; label: string; amount: number }[];
  financialOverview: {
    received: number;
    pending: number;
    receivedPercent: number;
    pendingPercent: number;
  };
  jobTracker: import("./jobTracker/types").JobTrackerDashboardStats | null;
}

export interface MeResponse {
  user: SessionUser;
  features: import("./jobTracker/types").FeatureFlags;
}

export const DEMO_CREDENTIALS = {
  username: "Demo",
  password: "Demo@2026",
} as const;

export const DEMO_DELETE_MESSAGE =
  "Deleting demo data is disabled. This dashboard is intended for showcasing the application's capabilities.";

export const DEMO_CREDENTIAL_DELETE_MESSAGE = "Deleting demo credentials is disabled.";

export const DEMO_FORM_DELETE_MESSAGE = "Deleting demo form submissions is disabled.";

export const DEMO_COMPANY_WRITE_MESSAGE =
  "Company changes are disabled for the Demo account. Explore the showcase data in read-only mode.";
