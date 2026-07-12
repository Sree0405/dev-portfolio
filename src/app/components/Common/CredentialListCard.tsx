import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Credential } from "@/app/lib/types";
import { getCategoryTypeLabel } from "@/app/lib/constants";
import { formatDate } from "@/app/lib/format";
import { getServiceFavicon, getServiceHostname } from "@/app/lib/serviceLogo";
import { CopyButton } from "@/app/components/Common/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CredentialListCardProps {
  credential: Credential;
  onView: (credential: Credential) => void;
  onEdit: (credential: Credential) => void;
  onDelete: (credential: Credential) => void;
  canDelete?: boolean;
}

function ServiceLogo({ url, name }: { url: string; name: string }) {
  const favicon = getServiceFavicon(url);

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/30">
      {favicon ? (
        <img src={favicon} alt="" className="h-5 w-5 object-contain" loading="lazy" />
      ) : (
        <span className="text-xs font-semibold text-primary">{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

export function CredentialListCard({
  credential,
  onView,
  onEdit,
  onDelete,
  canDelete = true,
}: CredentialListCardProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <article className="dashboard-surface-card rounded-xl p-4">
      <div className="flex items-start gap-3">
        <ServiceLogo url={credential.websiteUrl} name={credential.serviceName} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onView(credential)}
                className="block truncate text-left text-base font-semibold text-foreground transition hover:text-primary"
              >
                {credential.serviceName}
              </button>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {getServiceHostname(credential.websiteUrl)}
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {credential.category}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Type</p>
          <p className="truncate font-medium text-foreground/90">
            {getCategoryTypeLabel(credential.category)}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Username</p>
          <div className="flex items-center gap-1">
            <p className="truncate font-medium text-foreground/90">{credential.username}</p>
            <CopyButton value={credential.username} label="username" />
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border/40 bg-muted/10 px-3 py-2">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Password</p>
        <div className="mt-1 flex items-center gap-1">
          <span className="truncate font-mono text-sm">
            {passwordVisible ? credential.password : "••••••••••••"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setPasswordVisible((v) => !v)}
            title={passwordVisible ? "Hide Password" : "Show Password"}
            aria-label={passwordVisible ? "Hide Password" : "Show Password"}
          >
            {passwordVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
          <CopyButton value={credential.password} label="password" />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Updated {formatDate(credential.updatedAt)}
      </p>

      <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(credential)}>
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          View
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(credential)}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
        {canDelete && (
          <Button variant="outline" size="sm" onClick={() => onDelete(credential)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        )}
      </div>
    </article>
  );
}

export { ServiceLogo };
