import type { DataType } from "../types";

export interface Company {
  id: string;
  name: string;
  linkedinUrl: string | null;
  careersUrl: string | null;
  productCategory: string | null;
  companyType: string | null;
  companySize: string | null;
  headquarters: string | null;
  officeLocation: string | null;
  applied: boolean;
  hrContact: string | null;
  type: DataType;
  jobApplicationCount?: number;
  latestJobStatus?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyContact {
  id: string;
  companyId: string;
  name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDetail extends Company {
  contacts: CompanyContact[];
  jobApplications: {
    id: string;
    roleName: string;
    currentStatus: string;
    appliedDate: string;
  }[];
}

export interface JobApplication {
  id: string;
  companyId: string;
  companyName: string | null;
  jobId: string | null;
  roleName: string;
  applicationUrl: string | null;
  appliedThrough: string | null;
  mailId: string | null;
  appliedDate: string;
  currentStatus: string;
  expectedSalary: number | null;
  currentSalary: number | null;
  negotiatedSalary: number | null;
  offeredSalary: number | null;
  companyStandardSalary: number | null;
  nextInterviewDate: string | null;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export interface JobStatusHistoryEntry {
  id: string;
  jobApplicationId: string;
  status: string;
  type: DataType;
  createdAt: string;
}

export interface InterviewSchedule {
  id: string;
  jobApplicationId: string;
  interviewDate: string;
  interviewTime: string | null;
  mode: string;
  location: string | null;
  interviewer: string | null;
  meetingLink: string | null;
  notes: string | null;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export interface JobNote {
  id: string;
  jobApplicationId: string;
  content: string;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export interface JobDetail extends JobApplication {
  statusHistory: JobStatusHistoryEntry[];
  interviews: InterviewSchedule[];
  notes: JobNote[];
}

export interface CompanyFilterOptions {
  locations: string[];
  categories: string[];
  companySizes: string[];
  companyTypes: string[];
}

export interface PaginatedCompanies {
  items: Company[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginatedJobs {
  items: JobApplication[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CompanyImportSummary {
  imported: number;
  skipped: number;
  duplicates: number;
}

export interface JobTrackerDashboardStats {
  totalCompanies: number;
  appliedCompanies: number;
  totalJobApplications: number;
  offersReceived: number;
  rejectedJobs: number;
  upcomingInterviews: {
    id: string;
    interviewDate: string;
    interviewTime: string | null;
    mode: string;
    jobId: string;
    roleName: string;
    companyId: string;
    companyName: string;
  }[];
  latestJobActivities: {
    id: string;
    status: string;
    createdAt: string;
    jobId: string;
    roleName: string;
    companyId: string;
    companyName: string;
  }[];
}

export interface FeatureFlags {
  jobTracker: boolean;
}
