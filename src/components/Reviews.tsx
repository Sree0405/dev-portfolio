import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, MessageSquareQuote, Send } from "lucide-react";

import { api } from "@/app/lib/api";
import type { PortfolioReview, ReviewRelationship } from "@/app/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PortfolioButton,
  PortfolioCard,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/portfolio";
import { cn } from "@/lib/utils";

const RELATIONSHIPS: { value: ReviewRelationship; label: string }[] = [
  { value: "colleague", label: "Colleague" },
  { value: "client", label: "Client" },
  { value: "manager", label: "Manager" },
  { value: "mentor", label: "Mentor" },
  { value: "other", label: "Other" },
];

const fieldClass =
  "h-11 min-h-[44px] rounded-lg border border-primary/25 bg-[hsl(var(--surface))] px-3.5 text-sm text-foreground shadow-[var(--shadow-glass)] transition-colors placeholder:portfolio-text-muted focus-visible:border-primary/55 focus-visible:ring-2 focus-visible:ring-primary/30";

const textareaClass =
  "min-h-[120px] rounded-lg border border-primary/25 bg-[hsl(var(--surface))] px-3.5 py-3 text-sm text-foreground shadow-[var(--shadow-glass)] transition-colors placeholder:portfolio-text-muted focus-visible:border-primary/55 focus-visible:ring-2 focus-visible:ring-primary/30";

function relationshipLabel(value: string) {
  return RELATIONSHIPS.find((r) => r.value === value)?.label ?? value;
}

function ReviewCard({ review }: { review: PortfolioReview }) {
  const role = review.role?.trim();

  return (
    <PortfolioCard className="flex h-full flex-col items-center p-5 text-center sm:p-6">
      <MessageSquareQuote
        className="mb-3 size-5 text-primary/45"
        aria-hidden
      />
      <p className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{review.message}&rdquo;
      </p>
      <div className="mt-4 w-full border-t border-border/50 pt-3">
        <p className="text-sm font-semibold text-foreground">{review.name}</p>
        {role ? (
          <p className="mt-0.5 text-xs portfolio-text-muted">{role}</p>
        ) : null}
        <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
          {relationshipLabel(review.relationship)}
        </p>
      </div>
    </PortfolioCard>
  );
}

function ReviewForm({
  onSubmitted,
}: {
  onSubmitted: (items: PortfolioReview[]) => void;
}) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [relationship, setRelationship] =
    useState<ReviewRelationship>("colleague");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Review is required.");
      return;
    }
    if (trimmed.length > 800) {
      setError("Keep reviews under 800 characters.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await api.submitReview({
        name: name.trim(),
        role: role.trim(),
        relationship,
        message: trimmed,
      });
      setName("");
      setRole("");
      setRelationship("colleague");
      setMessage("");
      const data = await api.getPublicReviews();
      onSubmitted(data.items);
      toast({
        title: "Thanks for the review",
        description: "It's published on the reviews page.",
      });
    } catch {
      toast({
        title: "Could not submit",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortfolioCard className="p-5 sm:p-6 md:p-7" id="leave-a-review">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Leave a review
      </h3>
      <p className="mt-2 text-sm portfolio-text-muted">
        A short note if we&apos;ve worked together.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="review-name"
            className="font-mono text-[0.65rem] font-medium uppercase tracking-wide text-foreground"
          >
            Name
          </label>
          <Input
            id="review-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            placeholder="Your name"
            className={fieldClass}
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="review-role"
            className="font-mono text-[0.65rem] font-medium uppercase tracking-wide text-foreground"
          >
            Role
          </label>
          <Input
            id="review-role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            maxLength={120}
            placeholder="Your role or title"
            className={fieldClass}
            autoComplete="organization-title"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="review-relationship"
            className="font-mono text-[0.65rem] font-medium uppercase tracking-wide text-foreground"
          >
            Relationship
          </label>
          <select
            id="review-relationship"
            name="relationship"
            value={relationship}
            onChange={(e) =>
              setRelationship(e.target.value as ReviewRelationship)
            }
            className={cn(fieldClass, "w-full appearance-none")}
          >
            {RELATIONSHIPS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="review-message"
            className="font-mono text-[0.65rem] font-medium uppercase tracking-wide text-foreground"
          >
            Review
          </label>
          <Textarea
            id="review-message"
            name="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            maxLength={800}
            placeholder="A short note about working together…"
            className={textareaClass}
            required
          />
          <div className="flex items-center justify-between gap-2">
            {error ? (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : (
              <span />
            )}
            <p className="font-mono text-[10px] portfolio-text-muted">
              {message.length}/800
            </p>
          </div>
        </div>

        <PortfolioButton
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          <Send className="size-4" aria-hidden />
          {submitting ? "Submitting…" : "Submit review"}
        </PortfolioButton>
      </form>
    </PortfolioCard>
  );
}

function usePublicReviews() {
  const [reviews, setReviews] = useState<PortfolioReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getPublicReviews();
        if (!cancelled) setReviews(data.items);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { reviews, setReviews, loading };
}

/** Homepage strip — two reviews + CTA to full page (Projects pattern). */
function HomeReviewsPreview() {
  const navigate = useNavigate();
  const { reviews, loading } = usePublicReviews();
  const preview = reviews.slice(0, 2);
  const remaining = Math.max(0, reviews.length - 2);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative w-full min-w-0 border-t border-primary/15 page-container-x py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 text-center md:mb-12">
          <p className="section-eyebrow">Social proof</p>
          <h2 id="reviews-heading" className="section-title mt-3">
            <span className="page-title-accent">Reviews</span> from people
            I&apos;ve worked with
          </h2>
          <hr className="brand-divider mx-auto mt-5 max-w-[8rem]" />
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border border-border/50 bg-muted/30"
              />
            ))}
          </div>
        ) : preview.length === 0 ? (
          <Reveal>
            <PortfolioCard className="mx-auto max-w-lg px-5 py-8 text-center sm:px-8">
              <MessageSquareQuote
                className="mx-auto size-8 text-primary/50"
                aria-hidden
              />
              <p className="mt-3 text-sm font-medium text-foreground">
                No public reviews yet
              </p>
              <p className="mt-1.5 text-sm portfolio-text-muted">
                Leave the first note on the reviews page.
              </p>
            </PortfolioCard>
          </Reveal>
        ) : (
          <Stagger
            className="grid gap-5 sm:grid-cols-2"
            stagger={0.06}
            delayChildren={0.04}
          >
            {preview.map((review) => (
              <StaggerItem key={review.id}>
                <button
                  type="button"
                  onClick={() => navigate("/reviews")}
                  className="group flex h-full w-full flex-col items-center rounded-2xl text-center transition-all duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <ReviewCard review={review} />
                  <span className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-medium text-primary opacity-80 transition-opacity group-hover:opacity-100">
                    View all reviews <ArrowUpRight size={14} />
                  </span>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <div className="mt-10 text-center md:mt-12">
          <PortfolioButton type="button" onClick={() => navigate("/reviews")}>
            {remaining > 0
              ? `View all reviews (${reviews.length}) →`
              : "View reviews →"}
          </PortfolioButton>
        </div>
      </div>
    </section>
  );
}

/** Full reviews page body — grid + form. */
export function ReviewsFull() {
  const { reviews, setReviews, loading } = usePublicReviews();

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-list-heading"
      className="page-section-y page-container-x relative w-full min-w-0"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="min-w-0">
            <Reveal>
              <h2
                id="reviews-list-heading"
                className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary"
              >
                {loading
                  ? "Loading reviews"
                  : reviews.length === 0
                    ? "Reviews"
                    : `${reviews.length} public review${reviews.length === 1 ? "" : "s"}`}
              </h2>
            </Reveal>

            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-36 animate-pulse rounded-xl border border-border/50 bg-muted/30"
                  />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <Reveal>
                <PortfolioCard className="px-5 py-8 text-center sm:px-8">
                  <MessageSquareQuote
                    className="mx-auto size-8 text-primary/50"
                    aria-hidden
                  />
                  <p className="mt-3 text-sm font-medium text-foreground">
                    No public reviews yet
                  </p>
                  <p className="mt-1.5 text-sm portfolio-text-muted">
                    Use the form to leave the first one.
                  </p>
                </PortfolioCard>
              </Reveal>
            ) : (
              <Stagger
                className="grid gap-3 sm:grid-cols-2 sm:gap-4"
                stagger={0.05}
                delayChildren={0.04}
              >
                {reviews.map((review) => (
                  <StaggerItem key={review.id}>
                    <ReviewCard review={review} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>

          <Reveal delay={0.08} className="lg:sticky lg:top-24">
            <ReviewForm onSubmitted={setReviews} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function Reviews({ homepage = false }: { homepage?: boolean }) {
  if (homepage) return <HomeReviewsPreview />;
  return <ReviewsFull />;
}
