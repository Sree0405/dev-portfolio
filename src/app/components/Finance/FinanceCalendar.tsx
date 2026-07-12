import { formatCurrency, formatDate } from "@/app/lib/format";
import { FinanceUrgencyBadge } from "@/app/components/Finance/FinanceUrgencyBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarItem {
  id: string;
  recordName: string;
  moduleType: string;
  amount: number;
  dueDate: string;
  status: string;
  urgency: import("@/app/lib/finance/constants").UrgencyLevel;
}

interface FinanceCalendarProps {
  days: Array<{ day: number; items: CalendarItem[] }>;
  monthLabel?: string;
}

export function FinanceCalendar({ days, monthLabel }: FinanceCalendarProps) {
  const now = new Date();
  const label =
    monthLabel ??
    new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(now);

  const sortedDays = [...days].sort((a, b) => a.day - b.day);

  return (
    <Card className="dashboard-surface-card">
      <CardHeader>
        <CardTitle className="text-base">Payment Calendar — {label}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDays.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No upcoming payments this month.</p>
        ) : (
          <div className="space-y-4">
            {sortedDays.map(({ day, items }) => (
              <div key={day} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-lg font-bold leading-none">{day}</span>
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/10 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.recordName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.moduleType} · {formatDate(item.dueDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
                        <FinanceUrgencyBadge urgency={item.urgency} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
