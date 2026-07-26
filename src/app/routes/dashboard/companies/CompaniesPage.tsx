import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { DEMO_COMPANY_WRITE_MESSAGE } from "@/app/lib/types";
import type { Company } from "@/app/lib/jobTracker/types";
import type { CompanyFormValues } from "@/app/lib/validation";
import { parseExcelFile } from "@/app/lib/jobTracker/excelImport";
import {
  CompaniesFilterBar,
  type CompanyFiltersState,
} from "@/app/components/JobTracker/CompaniesFilterBar";
import { CompanyListCard } from "@/app/components/JobTracker/CompanyListCard";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { CompanyForm } from "@/app/components/Forms/CompanyForm";
import { AppModal } from "@/app/components/Modal/AppModal";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 15;

const DEFAULT_FILTERS: CompanyFiltersState = {
  search: "",
  applied: "All",
  location: "All",
  category: "All",
  companyType: "All",
  companySize: "All",
  sortBy: "name",
};

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const { canWriteCompanies, isDemo } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<CompanyFiltersState>(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [deleteCompany, setDeleteCompany] = useState<Company | null>(null);
  const [importing, setImporting] = useState(false);

  const handleSearchChange = (value: string) => {
    setFilters((current) => ({ ...current, search: value }));
    setPage(1);
    window.clearTimeout((window as unknown as { __companySearchTimer?: number }).__companySearchTimer);
    (window as unknown as { __companySearchTimer?: number }).__companySearchTimer = window.setTimeout(
      () => setDebouncedSearch(value),
      300,
    );
  };

  const handleFilterChange = <K extends keyof CompanyFiltersState>(
    key: K,
    value: CompanyFiltersState[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch.length > 0 ||
    filters.applied !== "All" ||
    filters.location !== "All" ||
    filters.category !== "All" ||
    filters.companyType !== "All" ||
    filters.companySize !== "All";

  const { data: filterOptions } = useQuery({
    queryKey: ["company-filters"],
    queryFn: api.getCompanyFilters,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "companies",
      debouncedSearch,
      filters.applied,
      filters.location,
      filters.category,
      filters.companyType,
      filters.companySize,
      filters.sortBy,
      page,
    ],
    queryFn: () =>
      api.getCompanies({
        search: debouncedSearch,
        applied: filters.applied === "All" ? undefined : filters.applied,
        location: filters.location === "All" ? undefined : filters.location,
        category: filters.category === "All" ? undefined : filters.category,
        companyType: filters.companyType === "All" ? undefined : filters.companyType,
        companySize: filters.companySize === "All" ? undefined : filters.companySize,
        sortBy: filters.sortBy,
        sortOrder: filters.sortBy === "recent" ? "desc" : "asc",
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["companies"] });
    queryClient.invalidateQueries({ queryKey: ["company-filters"] });
  };

  const handleWriteError = (error: Error) => {
    if (error instanceof ApiClientError && error.status === 403) {
      toast.error(DEMO_COMPANY_WRITE_MESSAGE);
      return;
    }
    toast.error(error.message);
  };

  const createMutation = useMutation({
    mutationFn: api.createCompany,
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      toast.success("Company created");
    },
    onError: handleWriteError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CompanyFormValues }) =>
      api.updateCompany(id, values),
    onSuccess: () => {
      invalidate();
      setEditCompany(null);
      toast.success("Company updated");
    },
    onError: handleWriteError,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCompany,
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setDeleteCompany(null);
      toast.success("Company deleted");
    },
    onError: handleWriteError,
  });

  const importMutation = useMutation({
    mutationFn: api.importCompanies,
    onSuccess: (summary) => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(
        `Imported ${summary.imported}, skipped ${summary.skipped}, duplicates ${summary.duplicates}`,
      );
    },
    onError: handleWriteError,
  });

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const rows = await parseExcelFile(file);
      await importMutation.mutateAsync({ rows });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import failed");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const companies = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <>
      <DashboardHeader
        title="Companies"
        description="Maintain your master company database before applying."
        actions={
          canWriteCompanies ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImport(file);
                }}
              />
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing || importMutation.isPending}
              >
                <Upload className="mr-2 h-4 w-4" />
                {importing ? "Importing..." : "Import Excel"}
              </Button>
              <Button className="w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </div>
          ) : undefined
        }
      />

      <main className="min-w-0 flex-1 space-y-4 p-4 md:space-y-6 md:p-8">
        {isDemo ? (
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Demo mode: company data is read-only. Use Job Tracker for full CRUD on demo applications.
            </p>
          </div>
        ) : null}

        <CompaniesFilterBar
          filters={filters}
          filterOptions={filterOptions}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onClearFilters={() => {
            setFilters(DEFAULT_FILTERS);
            setDebouncedSearch("");
            setPage(1);
          }}
          hasActiveFilters={hasActiveFilters}
          resultCount={companies.length}
          totalCount={data?.total}
        />

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="dashboard-surface-card h-44 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? "No companies found" : "No companies yet"}
            description={
              hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Import from Excel or add your first company."
            }
            actionLabel={canWriteCompanies ? "Add Company" : undefined}
            onAction={canWriteCompanies ? () => setCreateOpen(true) : undefined}
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => (
                <CompanyListCard
                  key={company.id}
                  company={company}
                  canWrite={canWriteCompanies}
                  onEdit={setEditCompany}
                  onDelete={setDeleteCompany}
                />
              ))}
            </div>
            {totalPages > 1 ? (
              <Pagination className="overflow-x-auto">
                <PaginationContent className="flex-wrap justify-center">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </>
        )}
      </main>

      <AppModal open={createOpen} onOpenChange={setCreateOpen} title="Add Company">
        <CompanyForm
          categoryOptions={filterOptions?.categories}
          typeOptions={filterOptions?.companyTypes}
          sizeOptions={filterOptions?.companySizes}
          loading={createMutation.isPending}
          onSubmit={async (values) => createMutation.mutateAsync(values)}
        />
      </AppModal>

      <AppModal open={Boolean(editCompany)} onOpenChange={() => setEditCompany(null)} title="Edit Company">
        {editCompany ? (
          <CompanyForm
            categoryOptions={filterOptions?.categories}
            typeOptions={filterOptions?.companyTypes}
            sizeOptions={filterOptions?.companySizes}
            defaultValues={{
              name: editCompany.name,
              linkedinUrl: editCompany.linkedinUrl ?? "",
              careersUrl: editCompany.careersUrl ?? "",
              companyType: editCompany.companyType ?? "",
              productCategory: editCompany.productCategory ?? "",
              companySize: editCompany.companySize ?? "",
              headquarters: editCompany.headquarters ?? "",
              officeLocation: editCompany.officeLocation ?? "",
              applied: editCompany.applied,
              hrContact: editCompany.hrContact ?? "",
            }}
            loading={updateMutation.isPending}
            onSubmit={async (values) =>
              updateMutation.mutateAsync({ id: editCompany.id, values })
            }
            submitLabel="Update Company"
          />
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={Boolean(deleteCompany)}
        onOpenChange={() => setDeleteCompany(null)}
        title="Delete company?"
        description="This will permanently delete the company and all related job applications."
        confirmLabel="Delete"
        onConfirm={() => deleteCompany && deleteMutation.mutate(deleteCompany.id)}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
