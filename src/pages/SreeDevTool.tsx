import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const TabbedDocumentationPage = lazy(
  () => import("@/components/projects/documents/tabbed/TabbedDocumentationPage"),
);

function DocsLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
      <Loader2 className="h-8 w-8 animate-spin text-purple-400" aria-label="Loading documentation" />
    </div>
  );
}

export default function SreeDevToolPage() {
  return (
    <Suspense fallback={<DocsLoading />}>
      <TabbedDocumentationPage />
    </Suspense>
  );
}
