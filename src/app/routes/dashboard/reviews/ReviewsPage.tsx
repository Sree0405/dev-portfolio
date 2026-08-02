import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, MessageSquareQuote, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { formatDate } from "@/app/lib/format";
import {
  DEMO_REVIEW_DELETE_MESSAGE,
  type PortfolioReview,
} from "@/app/lib/types";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { AppModal } from "@/app/components/Modal/AppModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
const VISIBILITY_OPTIONS = ["All", "Visible", "Hidden"] as const;
const GLASS_MODAL_CLASS =
  "sm:max-w-xl border border-white/10 bg-background/75 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

const RELATIONSHIP_LABELS: Record<string, string> = {
  colleague: "Colleague",
  client: "Client",
  manager: "Manager",
  mentor: "Mentor",
  other: "Other",
};

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const { canDelete, isDemo } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibility, setVisibility] =
    useState<(typeof VISIBILITY_OPTIONS)[number]>("All");
  const [page, setPage] = useState(1);
  const [viewReview, setViewReview] = useState<PortfolioReview | null>(null);
  const [deleteReview, setDeleteReview] = useState<PortfolioReview | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    window.clearTimeout(
      (window as unknown as { __reviewsSearchTimer?: number }).__reviewsSearchTimer,
    );
    (window as unknown as { __reviewsSearchTimer?: number }).__reviewsSearchTimer =
      window.setTimeout(() => setDebouncedSearch(value), 300);
  };

  const visibleParam =
    visibility === "Visible" ? true : visibility === "Hidden" ? false : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", debouncedSearch, visibility, page],
    queryFn: () =>
      api.getReviews({
        search: debouncedSearch,
        visible: visibleParam,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  };

  const toggleMutation = useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      api.updateReview(id, { visible }),
    onSuccess: (review) => {
      invalidate();
      setViewReview((current) =>
        current?.id === review.id ? review : current,
      );
      toast.success(review.visible ? "Review is now public" : "Review hidden");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteReview,
    onSuccess: () => {
      invalidate();
      setDeleteReview(null);
      setViewReview(null);
      toast.success("Review deleted");
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 403) {
        toast.error(DEMO_REVIEW_DELETE_MESSAGE);
        return;
      }
      toast.error(error.message);
    },
  });

  const reviews = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <>
      <DashboardHeader
        title="Reviews"
        description="Portfolio testimonials go live on submit. Hide spam or delete anytime."
      />

      <main className="min-w-0 flex-1 space-y-4 p-4 md:space-y-6 md:p-8">
        {isDemo && (
          <div className="flex gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
            <MessageSquareQuote className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Demo reviews</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Delete is disabled for the demo account. Visibility toggles are
                for exploration only.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
          <div className="relative min-w-0 sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by name, relationship, or message..."
              className="pl-9"
            />
          </div>
          <Select
            value={visibility}
            onValueChange={(value: (typeof VISIBILITY_OPTIONS)[number]) => {
              setVisibility(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter visibility" />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "All" ? "All reviews" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="dashboard-surface-card h-52 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description={
              debouncedSearch || visibility !== "All"
                ? "No reviews match your search or filter."
                : "Submissions from the portfolio Reviews section appear here."
            }
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="dashboard-surface-card flex h-full flex-col rounded-xl border border-border/60 p-4 transition hover:border-primary/30"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={review.visible ? "default" : "secondary"}>
                      {review.visible ? "Visible" : "Hidden"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {RELATIONSHIP_LABELS[review.relationship] ??
                        review.relationship}
                    </Badge>
                  </div>
                  <h3 className="mt-3 truncate text-base font-semibold">
                    {review.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {review.message}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                    <span className="truncate text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={toggleMutation.isPending}
                        onClick={() =>
                          toggleMutation.mutate({
                            id: review.id,
                            visible: !review.visible,
                          })
                        }
                      >
                        {review.visible ? (
                          <>
                            <EyeOff className="mr-1.5 h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="mr-1.5 h-4 w-4" />
                            Show
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewReview(review)}
                      >
                        View
                      </Button>
                      {canDelete ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 text-destructive hover:text-destructive",
                          )}
                          onClick={() => setDeleteReview(review)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="overflow-x-auto">
                <PaginationContent className="flex-wrap justify-center gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((current) => Math.max(1, current - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === page}
                          onClick={(event) => {
                            event.preventDefault();
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((current) => Math.min(totalPages, current + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </main>

      <AppModal
        open={!!viewReview}
        onOpenChange={(open) => !open && setViewReview(null)}
        title={viewReview?.name ?? "Review"}
        description={
          viewReview
            ? RELATIONSHIP_LABELS[viewReview.relationship] ??
              viewReview.relationship
            : undefined
        }
        className={GLASS_MODAL_CLASS}
      >
        {viewReview ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground">
              {viewReview.message}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant={viewReview.visible ? "default" : "secondary"}>
                {viewReview.visible ? "Visible" : "Hidden"}
              </Badge>
              <span>{formatDate(viewReview.createdAt)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="sreeDev"
                disabled={toggleMutation.isPending}
                onClick={() =>
                  toggleMutation.mutate({
                    id: viewReview.id,
                    visible: !viewReview.visible,
                  })
                }
              >
                {viewReview.visible ? "Hide on site" : "Show on site"}
              </Button>
              {canDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteReview(viewReview)}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={!!deleteReview}
        onOpenChange={(open) => !open && setDeleteReview(null)}
        title="Delete review?"
        description="This permanently removes the review. This cannot be undone."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteReview) deleteMutation.mutate(deleteReview.id);
        }}
      />
    </>
  );
}
