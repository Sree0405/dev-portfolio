import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  financeNavGroup,
  mobileMoreNavItems,
  mobileNavActions,
  mobilePrimaryNavItems,
} from "./dashboardNavItems";
import { isFinanceRoute } from "@/app/lib/finance/moduleConfig";
import {
  MobileNavLinkItem,
  MobileNavSubmenu,
  MobileNavTrigger,
} from "./MobileNavSubmenu";

type OpenMenu = "finance" | "more" | null;

export function DashboardMobileNav() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const financeActive = isFinanceRoute(location.pathname);
  const moreActive = mobileMoreNavItems.some((item) =>
    item.end
      ? location.pathname === item.to
      : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`),
  );

  const toggleMenu = (menu: OpenMenu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  const FinanceIcon = financeNavGroup.icon;
  const MoreIcon = mobileNavActions.more.icon;

  const financeItems = financeNavGroup.children.map((child) => ({
    label: child.label,
    to: child.to,
    icon: child.icon,
    end: child.end,
  }));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[max(0.375rem,env(safe-area-inset-bottom))] pt-1.5">
        {mobilePrimaryNavItems.map((item) => (
          <MobileNavLinkItem
            key={item.to}
            label={item.label}
            to={item.to}
            icon={item.icon}
            end={"end" in item ? item.end : false}
          />
        ))}

        <div className="relative flex min-w-0 flex-1 justify-center">
          <MobileNavTrigger
            label={financeNavGroup.label}
            icon={FinanceIcon}
            active={financeActive}
            open={openMenu === "finance"}
            onClick={() => toggleMenu("finance")}
          />
          <MobileNavSubmenu
            open={openMenu === "finance"}
            onClose={() => setOpenMenu(null)}
            title={financeNavGroup.label}
            items={financeItems}
          />
        </div>

        <div className="relative flex min-w-0 flex-1 justify-center">
          <MobileNavTrigger
            label={mobileNavActions.more.label}
            icon={MoreIcon}
            active={moreActive}
            open={openMenu === "more"}
            onClick={() => toggleMenu("more")}
          />
          <MobileNavSubmenu
            open={openMenu === "more"}
            onClose={() => setOpenMenu(null)}
            title="More Modules"
            items={mobileMoreNavItems}
          />
        </div>
      </div>
    </nav>
  );
}
