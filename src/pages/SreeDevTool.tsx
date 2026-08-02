import { lazy, Suspense } from "react";

const TabbedDocumentationPage = lazy(
  () => import("@/components/projects/documents/tabbed/TabbedDocumentationPage"),
);

function DocsLoading() {
  return (
    <div className="min-h-[60vh] animate-pulse" aria-busy="true" aria-label="Loading documentation">
      <div className="page-container-x py-24 sm:py-28">
        <div className="mx-auto mb-6 h-3 w-24 rounded bg-border/40" />
        <div className="mx-auto mb-4 h-10 w-full max-w-md rounded-xl bg-border/30" />
        <div className="mx-auto mb-10 h-4 w-full max-w-sm rounded bg-border/20" />
        <div className="mx-auto mt-12 max-w-4xl space-y-4">
          <div className="h-32 rounded-xl bg-border/20" />
          <div className="h-48 rounded-xl bg-border/15" />
        </div>
      </div>
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
