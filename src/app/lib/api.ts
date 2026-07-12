import type { ApiError } from "./types";

class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = data as ApiError;
    throw new ApiClientError(error.error || "Request failed", response.status, error.details);
  }

  return data as T;
}

export const api = {
  login: (body: { username: string; password: string }) =>
    request<{ user: import("./types").SessionUser }>("/api/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    request<{ success: boolean }>("/api/logout", {
      method: "POST",
    }),

  me: () => request<{ user: import("./types").SessionUser }>("/api/me"),

  getDashboard: () => request<import("./types").DashboardAnalytics>("/api/dashboard"),

  getProjects: (params?: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return request<import("./types").PaginatedProjects>(
      `/api/projects${query ? `?${query}` : ""}`,
    );
  },

  getProject: (id: string) => request<import("./types").Project>(`/api/projects/${id}`),

  createProject: (body: unknown) =>
    request<import("./types").Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateProject: (id: string, body: unknown) =>
    request<import("./types").Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteProject: (id: string) =>
    request<{ success: boolean }>(`/api/projects/${id}`, {
      method: "DELETE",
    }),

  getPayments: (projectId: string) =>
    request<import("./types").Payment[]>(`/api/projects/${projectId}/payments`),

  createPayment: (projectId: string, body: unknown) =>
    request<import("./types").PaymentMutationResult>(`/api/projects/${projectId}/payments`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updatePayment: (id: string, body: unknown) =>
    request<import("./types").PaymentMutationResult>(`/api/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deletePayment: (id: string) =>
    request<import("./types").PaymentMutationResult>(`/api/payments/${id}`, {
      method: "DELETE",
    }),

  getNotes: (projectId: string) =>
    request<import("./types").ProjectNote[]>(`/api/projects/${projectId}/notes`),

  createNote: (projectId: string, body: unknown) =>
    request<import("./types").ProjectNote>(`/api/projects/${projectId}/notes`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateNote: (id: string, body: unknown) =>
    request<import("./types").ProjectNote>(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteNote: (id: string) =>
    request<{ success: boolean }>(`/api/notes/${id}`, {
      method: "DELETE",
    }),

  getCredentials: (params?: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return request<import("./types").CredentialsListResponse>(
      `/api/credentials${query ? `?${query}` : ""}`,
    );
  },

  getCredential: (id: string) => request<import("./types").Credential>(`/api/credentials/${id}`),

  createCredential: (body: unknown) =>
    request<import("./types").Credential>("/api/credentials", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateCredential: (id: string, body: unknown) =>
    request<import("./types").Credential>(`/api/credentials/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteCredential: (id: string) =>
    request<{ success: boolean }>(`/api/credentials/${id}`, {
      method: "DELETE",
    }),

  getFinanceNotifications: () =>
    request<import("./finance/types").FinanceNotifications>("/api/finance/notifications"),

  getFinanceOverview: () =>
    request<import("./finance/types").FinanceOverview>("/api/finance/overview"),

  getEmiRecords: (params?: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") q.set(k, String(v));
      });
    }
    const query = q.toString();
    return request<import("./finance/types").FinanceListResponse>(
      `/api/finance/emi${query ? `?${query}` : ""}`,
    );
  },

  getEmiRecord: (id: string) =>
    request<import("./finance/types").FinanceRecord>(`/api/finance/emi/${id}`),

  createEmi: (body: unknown) =>
    request<import("./finance/types").FinanceRecord>("/api/finance/emi", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateEmi: (id: string, body: unknown) =>
    request<import("./finance/types").FinanceRecord>(`/api/finance/emi/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  markEmiPaid: (id: string, body?: unknown) =>
    request<import("./finance/types").FinanceRecord>(`/api/finance/emi/${id}/mark-paid`, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),

  deleteEmi: (id: string) =>
    request<{ success: boolean }>(`/api/finance/emi/${id}`, { method: "DELETE" }),

  getRentRecords: (params?: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") q.set(k, String(v));
      });
    }
    const query = q.toString();
    return request<import("./finance/types").FinanceListResponse>(
      `/api/finance/rent${query ? `?${query}` : ""}`,
    );
  },

  getRentRecord: (id: string) =>
    request<import("./finance/types").FinanceRecord>(`/api/finance/rent/${id}`),

  createRent: (body: unknown) =>
    request<import("./finance/types").FinanceRecord>("/api/finance/rent", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateRent: (id: string, body: unknown) =>
    request<import("./finance/types").FinanceRecord>(`/api/finance/rent/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  markRentPaid: (id: string, body?: unknown) =>
    request<import("./finance/types").FinanceRecord>(`/api/finance/rent/${id}/mark-paid`, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),

  deleteRent: (id: string) =>
    request<{ success: boolean }>(`/api/finance/rent/${id}`, { method: "DELETE" }),

  getSubscriptionRecords: (params?: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") q.set(k, String(v));
      });
    }
    const query = q.toString();
    return request<import("./finance/types").FinanceListResponse>(
      `/api/finance/subscriptions${query ? `?${query}` : ""}`,
    );
  },

  getSubscriptionRecord: (id: string) =>
    request<import("./finance/types").FinanceRecord>(`/api/finance/subscriptions/${id}`),

  createSubscription: (body: unknown) =>
    request<import("./finance/types").FinanceRecord>("/api/finance/subscriptions", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSubscription: (id: string, body: unknown) =>
    request<import("./finance/types").FinanceRecord>(`/api/finance/subscriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  markSubscriptionPaid: (id: string, body?: unknown) =>
    request<import("./finance/types").FinanceRecord>(
      `/api/finance/subscriptions/${id}/mark-paid`,
      { method: "POST", body: JSON.stringify(body ?? {}) },
    ),

  deleteSubscription: (id: string) =>
    request<{ success: boolean }>(`/api/finance/subscriptions/${id}`, {
      method: "DELETE",
    }),

  downloadFinanceModulePdf: async (modulePath: string, params: Record<string, string>) => {
    const q = new URLSearchParams(params);
    const response = await fetch(`/api/finance/${modulePath}/report/pdf?${q}`, {
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiClientError(
        (data as ApiError).error || "Failed to download PDF",
        response.status,
      );
    }
    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="(.+)"/);
    const filename = match?.[1] ?? `Finance_Report_${modulePath}.pdf`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  downloadFinanceRecordPdf: async (
    modulePath: string,
    id: string,
    params?: Record<string, string>,
  ) => {
    const q = params ? `?${new URLSearchParams(params)}` : "";
    const response = await fetch(`/api/finance/${modulePath}/${id}/pdf${q}`, {
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiClientError(
        (data as ApiError).error || "Failed to download PDF",
        response.status,
      );
    }
    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="(.+)"/);
    const filename = match?.[1] ?? `Finance_Detail_${id}.pdf`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  getBudgetRules: () =>
    request<{ rules: import("./budget/types").BudgetRuleTemplate[] }>("/api/budget/rules"),

  getCurrentBudget: () =>
    request<import("./budget/types").Budget | null>("/api/budget/current"),

  getBudgetHistory: () =>
    request<{ items: import("./budget/types").BudgetHistoryItem[] }>("/api/budget/history"),

  getBudget: (id: string) => request<import("./budget/types").Budget>(`/api/budget/${id}`),

  createBudget: (body: unknown) =>
    request<import("./budget/types").Budget>("/api/budget", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  resetBudget: (body: unknown) =>
    request<import("./budget/types").Budget>("/api/budget/reset", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  downloadBudgetPdf: async (id: string) => {
    const response = await fetch(`/api/budget/${id}/pdf`, { credentials: "include" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiClientError(
        (data as ApiError).error || "Failed to download PDF",
        response.status,
      );
    }
    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="(.+)"/);
    const filename = match?.[1] ?? "Budget_Report.pdf";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  downloadInvoice: async (projectId: string) => {
    const response = await fetch(`/api/projects/${projectId}/invoice`, {
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiClientError(
        (data as ApiError).error || "Failed to download invoice",
        response.status,
      );
    }

    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="(.+)"/);
    const filename = match?.[1] ?? `Invoice_${projectId}.pdf`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    return filename;
  },
};

export { ApiClientError };
