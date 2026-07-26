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

export const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
] as const;

export const PRODUCT_CATEGORIES = [
  "SaaS",
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-Commerce",
  "Cloud Infrastructure",
  "Cybersecurity",
  "Artificial Intelligence",
  "Data Analytics",
  "DevTools",
  "Gaming",
  "Media",
  "Logistics",
  "PropTech",
  "InsurTech",
  "AgriTech",
  "CleanTech",
  "IoT",
  "Banking",
  "Software Services",
  "Other",
] as const;

export const COMPANY_SORT_OPTIONS = [
  { value: "name", label: "Company Name" },
  { value: "recent", label: "Recently Added" },
  { value: "location", label: "Location" },
] as const;

export const DEMO_COMPANY_WRITE_MESSAGE =
  "Company changes are disabled for the Demo account. Explore the showcase data in read-only mode.";

export const EXCEL_IMPORT_HEADERS = [
  "Company Name",
  "LinkedIn Company URL",
  "Careers Page URL",
  "Type",
  "Product Category",
  "Company Size",
  "Headquarters",
  "Office Location",
  "Applied",
  "HR Number / Email",
] as const;

export const HEADER_TO_FIELD: Record<string, string> = {
  "Company Name": "name",
  "LinkedIn Company URL": "linkedinUrl",
  "Careers Page URL": "careersUrl",
  Type: "companyType",
  "Product Category": "productCategory",
  "Company Size": "companySize",
  Headquarters: "headquarters",
  "Office Location": "officeLocation",
  Applied: "applied",
  "HR Number / Email": "hrContact",
};
