import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { FINANCE_REPORT_RANGES, type FinanceReportRange } from "@/app/lib/finance/moduleConfig";
import { AppModal } from "@/app/components/Modal/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FinancePrintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modulePath: string;
  title: string;
}

export function FinancePrintModal({
  open,
  onOpenChange,
  modulePath,
  title,
}: FinancePrintModalProps) {
  const [range, setRange] = useState<FinanceReportRange>("current_month");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { range };
      if (range === "custom_month") params.month = month;
      if (range === "custom_range") {
        if (!from || !to) {
          toast.error("Select both start and end dates");
          return;
        }
        params.from = from;
        params.to = to;
      }
      await api.downloadFinanceModulePdf(modulePath, params);
      toast.success("PDF downloaded");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal open={open} onOpenChange={onOpenChange} title={title} description="Choose a reporting period.">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Period</Label>
          <Select value={range} onValueChange={(v) => setRange(v as FinanceReportRange)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FINANCE_REPORT_RANGES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {range === "custom_month" && (
          <div className="space-y-2">
            <Label>Month</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
        )}

        {range === "custom_range" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>From</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        )}

        <Button variant="sreeDev" className="w-full" onClick={handlePrint} disabled={loading}>
          {loading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </AppModal>
  );
}
