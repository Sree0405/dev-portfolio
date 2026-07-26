import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  COMPANY_APPLIED_FILTERS,
  COMPANY_SORT_OPTIONS,
  COMPANY_TYPES,
} from "@/app/lib/jobTracker/constants";
import type { CompanyFilterOptions } from "@/app/lib/jobTracker/types";

export interface CompanyFiltersState {
  search: string;
  applied: (typeof COMPANY_APPLIED_FILTERS)[number];
  location: string;
  category: string;
  companyType: string;
  companySize: string;
  sortBy: (typeof COMPANY_SORT_OPTIONS)[number]["value"];
}

interface CompaniesFilterBarProps {
  filters: CompanyFiltersState;
  filterOptions?: CompanyFilterOptions;
  onSearchChange: (value: string) => void;
  onFilterChange: <K extends keyof CompanyFiltersState>(key: K, value: CompanyFiltersState[K]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount?: number;
  totalCount?: number;
}

function FilterFields({
  filters,
  filterOptions,
  onFilterChange,
  layout = "grid",
}: {
  filters: CompanyFiltersState;
  filterOptions?: CompanyFilterOptions;
  onFilterChange: CompaniesFilterBarProps["onFilterChange"];
  layout?: "grid" | "stack";
}) {
  const containerClass =
    layout === "grid"
      ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      : "flex flex-col gap-3";

  return (
    <div className={containerClass}>
      <Select
        value={filters.location}
        onValueChange={(value) => onFilterChange("location", value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Locations</SelectItem>
          {filterOptions?.locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.companyType}
        onValueChange={(value) => onFilterChange("companyType", value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Types</SelectItem>
          {Array.from(new Set([...COMPANY_TYPES, ...(filterOptions?.companyTypes ?? [])])).map(
            (type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      <Select
        value={filters.category}
        onValueChange={(value) => onFilterChange("category", value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {filterOptions?.categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.companySize}
        onValueChange={(value) => onFilterChange("companySize", value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Company size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Sizes</SelectItem>
          {filterOptions?.companySizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.applied}
        onValueChange={(value) =>
          onFilterChange("applied", value as CompanyFiltersState["applied"])
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Applied status" />
        </SelectTrigger>
        <SelectContent>
          {COMPANY_APPLIED_FILTERS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(value) =>
          onFilterChange("sortBy", value as CompanyFiltersState["sortBy"])
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {COMPANY_SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function CompaniesFilterBar({
  filters,
  filterOptions,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  resultCount,
  totalCount,
}: CompaniesFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Input
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company, location, category..."
            className="h-10"
          />
        </div>

        <div className="flex items-center gap-2 lg:shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters ? (
                  <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                    On
                  </span>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filter Companies</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 pb-6">
                <FilterFields
                  filters={filters}
                  filterOptions={filterOptions}
                  onFilterChange={onFilterChange}
                  layout="stack"
                />
                {hasActiveFilters ? (
                  <Button variant="outline" className="w-full" onClick={onClearFilters}>
                    Clear all filters
                  </Button>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>

          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="shrink-0">
              <X className="mr-1.5 h-4 w-4" />
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      <div className="hidden lg:block">
        <FilterFields
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
          layout="grid"
        />
      </div>

      {resultCount !== undefined ? (
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} of {totalCount ?? resultCount} companies
        </p>
      ) : null}
    </div>
  );
}
