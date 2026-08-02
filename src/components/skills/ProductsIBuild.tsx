import { Link } from "react-router-dom";
import {
  BarChart3,
  Building2,
  FileStack,
  KeyRound,
  LayoutDashboard,
  Link2,
  Network,
  Plug,
  Rocket,
  Workflow,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import { SectionTitle } from "@/components/ui/page-title";
import {
  PortfolioCard,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/portfolio";
import { productsIBuild } from "./skillsData";

const productIcons: Record<string, LucideIcon> = {
  "Admin Dashboards": LayoutDashboard,
  "CMS Platforms": FileStack,
  "Client Marketing Sites": Rocket,
  "Open-Source UI Kits": Network,
  "Authentication Systems": KeyRound,
  "API Integrations": Plug,
  "Internal Business Tools": Building2,
  "Business Automation": Workflow,
  "Analytics Platforms": BarChart3,
};

export default function ProductsIBuild() {
  return (
    <section className="py-10 sm:py-12 border-t border-primary/10">
      <div className="page-container-x">
        <Reveal>
          <SectionTitle
            eyebrow="Delivery"
            accent="Products"
            rest="I build"
            className="mb-3 text-center md:mb-4 [&_h2]:text-center"
          />
          <p className="mx-auto mb-6 max-w-xl text-center text-sm portfolio-text-muted md:mb-8">
            Application types I can own — each tied to a real project or chapter.
          </p>
        </Reveal>

        <Stagger
          className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          stagger={0.05}
          delayChildren={0.06}
        >
          {productsIBuild.map((product) => {
            const Icon = productIcons[product.title] ?? Link2;
            const external = product.proof.href.startsWith("http");
            return (
              <StaggerItem key={product.title} className="h-full">
                <PortfolioCard className="flex h-full flex-col text-left">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="icon-well mt-0.5 size-9 shrink-0">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <h3 className="page-title-accent pt-1.5 text-sm font-semibold leading-snug sm:text-[15px]">
                      {product.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed portfolio-text-muted">
                    {product.description}
                  </p>
                  {external ? (
                    <a
                      href={product.proof.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary"
                    >
                      {product.proof.label}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  ) : (
                    <Link
                      to={product.proof.href}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary"
                    >
                      {product.proof.label}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                  )}
                </PortfolioCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
