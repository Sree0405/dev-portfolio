import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY_SIZES, COMPANY_TYPES, PRODUCT_CATEGORIES } from "@/app/lib/jobTracker/constants";
import { companyFormSchema, type CompanyFormValues } from "@/app/lib/validation";

interface CompanyFormProps {
  defaultValues?: Partial<CompanyFormValues>;
  categoryOptions?: string[];
  typeOptions?: string[];
  sizeOptions?: string[];
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

const defaults: CompanyFormValues = {
  name: "",
  linkedinUrl: "",
  careersUrl: "",
  productCategory: "",
  companyType: "",
  companySize: "",
  headquarters: "",
  officeLocation: "",
  applied: false,
  hrContact: "",
};

const CUSTOM_CATEGORY = "__custom__";

export function CompanyForm({
  defaultValues,
  categoryOptions = [],
  typeOptions = [],
  sizeOptions = [],
  onSubmit,
  loading,
  submitLabel = "Save Company",
}: CompanyFormProps) {
  const mergedTypes = useMemo(() => {
    const set = new Set<string>([...COMPANY_TYPES, ...typeOptions]);
    if (defaultValues?.companyType) set.add(defaultValues.companyType);
    return Array.from(set).sort();
  }, [typeOptions, defaultValues?.companyType]);

  const mergedCategories = useMemo(() => {
    const set = new Set<string>([...PRODUCT_CATEGORIES, ...categoryOptions]);
    if (defaultValues?.productCategory) set.add(defaultValues.productCategory);
    return Array.from(set).filter((item) => item !== "Other").sort();
  }, [categoryOptions, defaultValues?.productCategory]);

  const mergedSizes = useMemo(() => {
    const set = new Set<string>([...COMPANY_SIZES, ...sizeOptions]);
    if (defaultValues?.companySize) set.add(defaultValues.companySize);
    return Array.from(set).sort();
  }, [sizeOptions, defaultValues?.companySize]);

  const initialCategory = defaultValues?.productCategory ?? "";
  const isPresetCategory = !initialCategory || mergedCategories.includes(initialCategory);

  const [customCategory, setCustomCategory] = useState(
    isPresetCategory ? "" : initialCategory,
  );
  const [categoryMode, setCategoryMode] = useState<"preset" | "custom">(
    isPresetCategory ? "preset" : "custom",
  );

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: { ...defaults, ...defaultValues },
  });

  const handleSubmit = async (values: CompanyFormValues) => {
    const productCategory =
      categoryMode === "custom"
        ? customCategory.trim()
        : values.productCategory === CUSTOM_CATEGORY
          ? customCategory.trim()
          : values.productCategory;

    await onSubmit({
      ...values,
      productCategory: productCategory || undefined,
      linkedinUrl: values.linkedinUrl?.trim() || "",
      careersUrl: values.careersUrl?.trim() || "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3 rounded-xl border border-border/50 bg-muted/10 p-4">
          <p className="text-sm font-medium">Links & online presence</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/company/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="careersUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Careers Page URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://company.com/careers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Startup, MNC, Product..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mergedTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Startup, MNC, Product, Service, etc.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Product Category</FormLabel>
            <Select
              value={categoryMode === "custom" ? CUSTOM_CATEGORY : form.watch("productCategory") || ""}
              onValueChange={(value) => {
                if (value === CUSTOM_CATEGORY) {
                  setCategoryMode("custom");
                  form.setValue("productCategory", customCategory);
                  return;
                }
                setCategoryMode("preset");
                form.setValue("productCategory", value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mergedCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value={CUSTOM_CATEGORY}>Custom category</SelectItem>
              </SelectContent>
            </Select>
            {categoryMode === "custom" ? (
              <Input
                className="mt-2"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  form.setValue("productCategory", e.target.value);
                }}
              />
            ) : null}
          </FormItem>

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mergedSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headquarters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headquarters</FormLabel>
                <FormControl>
                  <Input placeholder="Bangalore" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officeLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Location</FormLabel>
                <FormControl>
                  <Input placeholder="Bangalore, Karnataka" {...field} />
                </FormControl>
                <FormDescription>Used for location filtering.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hrContact"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>HR Number / Email</FormLabel>
                <FormControl>
                  <Input placeholder="hr@company.com or +91..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="applied"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 rounded-lg border border-border/50 bg-muted/10 p-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="!mt-0">Applied to this company</FormLabel>
                <FormDescription>Mark when you have submitted an application.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
