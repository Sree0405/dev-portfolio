import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TOOL_NAME } from "@/app/lib/brand";
import { dashboardNavItems, financeNavGroup } from "./dashboardNavItems";
import { PieChart } from "lucide-react";

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const FinanceIcon = financeNavGroup.icon;

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-surface/80 backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{TOOL_NAME}</p>
        <h1 className="mt-1 text-lg font-semibold text-foreground">Developer Hub</h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : false}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="my-3 border-t border-border/50" />

        <div className="px-3 py-1.5">
          <div className="flex items-center gap-3 text-sm font-medium text-foreground/90">
            <FinanceIcon className="h-4 w-4 text-primary" />
            <span>{financeNavGroup.label}</span>
          </div>
        </div>

        <div className="ml-3 space-y-0.5 border-l border-border/40 pl-3">
          {financeNavGroup.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.end}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg py-2 pl-3 pr-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>

        <div className="my-3 border-t border-border/50" />

        <NavLink
          to="/dashboard/budget-planner"
          end
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )
          }
        >
          <PieChart className="h-4 w-4" />
          <span>Budget Planner</span>
        </NavLink>
      </nav>

      <div className="border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
        Modular dashboard ready for future modules
      </div>
    </aside>
  );
}
