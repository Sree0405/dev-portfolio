import { useEffect, useState } from "react";
import { MessageSquareQuote, Send } from "lucide-react";

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

export default function Reviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<PortfolioReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<ReviewRelationship>("colleague");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

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
        relationship,
        message: trimmed,
      });
      setName("");
      setRelationship("colleague");
      setMessage("");
      const data = await api.getPublicReviews();
      setReviews(data.items);
      toast({
        title: "Thanks for the review",
        description: "It's live on the site now.",
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
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="page-section-y page-container-x relative w-full min-w-0 border-t border-primary/10"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <Reveal>
          <div className="mb-8 md:mb-10">
            <p className="section-eyebrow mb-2">Social proof</p>
            <h2 id="reviews-heading" className="section-title">
              <span className="page-title-accent">Reviews</span> from people
              I&apos;ve worked with
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed portfolio-text-muted sm:text-[15px]">
              Leave a short note if we&apos;ve worked together. New reviews show
              up here right after you submit.
            </p>
          </div>
        </Reveal>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="min-w-0">
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
                    Be the first — use the form and it will show up here.
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
                    <PortfolioCard className="flex h-full flex-col p-5 text-left">
                      <p className="text-sm leading-relaxed text-foreground">
                        &ldquo;{review.message}&rdquo;
                      </p>
                      <div className="mt-4 border-t border-border/50 pt-3">
                        <p className="text-sm font-semibold text-foreground">
                          {review.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
                          {relationshipLabel(review.relationship)}
                        </p>
                      </div>
                    </PortfolioCard>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>

          <Reveal delay={0.08}>
            <PortfolioCard className="p-5 sm:p-6 md:p-7">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Leave a review
              </h3>
              <p className="mt-2 text-sm portfolio-text-muted">
                Name is optional — blank becomes Anonymous.
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
                    placeholder="Your name (optional)"
                    className={fieldClass}
                    autoComplete="name"
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
