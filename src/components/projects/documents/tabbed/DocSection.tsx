import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface DocSectionProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function DocSection({ icon: Icon, title, description, children, className = "" }: DocSectionProps) {
  return (
    <section className={`mb-10 ${className}`}>
      <div className="mb-5 flex items-start gap-3">
        <Icon className="mt-1 h-7 w-7 shrink-0 text-purple-400" aria-hidden />
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="rounded-2xl border border-purple-500/20 bg-gray-900/50 p-5 sm:p-8">{children}</div>
    </section>
  );
}
