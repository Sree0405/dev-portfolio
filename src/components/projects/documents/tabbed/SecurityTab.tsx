import { Lock, Shield } from "lucide-react";
import DocSection from "./DocSection";
import type { SecurityContent } from "./types";

interface SecurityTabProps {
  security: SecurityContent;
}

export default function SecurityTab({ security }: SecurityTabProps) {
  return (
    <div>
      <DocSection icon={Shield} title="Security Overview">
        <p className="text-base leading-relaxed text-foreground/80">{security.summary}</p>
      </DocSection>

      <DocSection icon={Lock} title="Authentication">
        <ul className="space-y-3">
          {security.authentication.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
              <span className="text-primary">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={Shield} title="Data Isolation">
        <ul className="space-y-3">
          {security.dataIsolation.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
              <span className="text-primary">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={Lock} title="Security Practices">
        <div className="grid gap-3 sm:grid-cols-2">
          {security.practices.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-primary/15 bg-primary/10 px-4 py-3 text-sm text-foreground/80"
            >
              {item}
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  );
}
