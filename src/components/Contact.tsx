import { PageTitle } from "@/components/ui/page-title";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/app/lib/api";
import { cn } from "@/lib/utils";
import {
  PortfolioButton,
  PortfolioCard,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/portfolio";

const interviewPath = [
  {
    label: "Ownership",
    detail: "Platform modules at EWall — UI through Linux release",
    to: "/experience",
  },
  {
    label: "Proof",
    detail: "Case studies, demos, and public GitHub (My3DUI, Fieldstack)",
    to: "/projects",
  },
  {
    label: "Stack depth",
    detail: "Daily / Production / Building — not a bingo card",
    to: "/skills",
  },
] as const;

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactChannel = {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
};

const contactChannels: ContactChannel[] = [
  {
    icon: Mail,
    label: "Email",
    value: "sreekanth04052005@gmail.com",
    href: "mailto:sreekanth04052005@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 93639 65927",
    href: "tel:+919363965927",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "India",
  },
];

const fieldClass =
  "h-11 min-h-[44px] rounded-lg border border-primary/25 bg-[hsl(var(--surface))] px-3.5 text-sm text-foreground shadow-[var(--shadow-glass)] transition-colors placeholder:portfolio-text-muted focus-visible:border-primary/55 focus-visible:ring-2 focus-visible:ring-primary/30 md:h-11 md:min-h-0";

const textareaClass =
  "min-h-[128px] rounded-lg border border-primary/25 bg-[hsl(var(--surface))] px-3.5 py-3 text-sm text-foreground shadow-[var(--shadow-glass)] transition-colors placeholder:portfolio-text-muted focus-visible:border-primary/55 focus-visible:ring-2 focus-visible:ring-primary/30 md:min-h-[128px]";

/** WhatsApp wa.me expects country code + number, no + or spaces */
const WHATSAPP_WA_ME = "919363965927";

const WHATSAPP_INTRO = "Hey, I have seen your portfolio.";

function buildWhatsAppBody(parts: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return [
    WHATSAPP_INTRO,
    "",
    `Name: ${parts.name}`,
    `Email: ${parts.email}`,
    `Subject: ${parts.subject}`,
    "",
    parts.message,
  ].join("\n");
}

function ChannelCard({ item }: { item: ContactChannel }) {
  const inner = (
    <>
      <div
        className={cn(
          "icon-well size-11 shrink-0 transition-colors",
          item.href && "group-hover:border-primary/55 group-hover:bg-primary/18",
        )}
      >
        <item.icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] portfolio-text-muted">
          {item.label}
        </p>
        <p
          className={cn(
            "mt-0.5 break-words text-sm font-semibold text-foreground",
            item.href && "transition-colors group-hover:text-primary",
          )}
        >
          {item.value}
        </p>
      </div>
      {item.href ? (
        <ArrowUpRight
          className="size-4 shrink-0 text-primary/40 opacity-0 transition group-hover:opacity-100 group-hover:text-primary"
          aria-hidden
        />
      ) : null}
    </>
  );

  if (item.href) {
    return (
      <a href={item.href} className="group block no-underline">
        <PortfolioCard
          interactive
          className="flex w-full items-center gap-3 sm:gap-4"
        >
          {inner}
        </PortfolioCard>
      </a>
    );
  }

  return (
    <PortfolioCard className="flex w-full items-center gap-3 sm:gap-4">
      {inner}
    </PortfolioCard>
  );
}

type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

export default function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pendingPayload, setPendingPayload] = useState<ContactPayload | null>(
    null,
  );

  const openWhatsApp = (payload: ContactPayload) => {
    const text = buildWhatsAppBody(payload);
    const url = `https://wa.me/${WHATSAPP_WA_ME}?text=${encodeURIComponent(text)}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    const errors: FieldErrors = {};
    if (!name) errors.name = "Name is required.";
    if (!email) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!subject) errors.subject = "Subject is required.";
    if (!message) errors.message = "Message is required.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload: ContactPayload = { name, email, subject, message };
    setSubmitting(true);

    try {
      await api.submitContactForm(payload);
      setPendingPayload(payload);
      setConfirmOpen(true);
      setFieldErrors({});
      form.reset();
      toast({
        title: "Form submitted",
        description: "Your message was saved successfully.",
      });
    } catch {
      toast({
        title: "Submission failed",
        description:
          "Could not save your message. Please try again or reach out via email.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickChat = () => {
    if (pendingPayload) openWhatsApp(pendingPayload);
    setConfirmOpen(false);
    setPendingPayload(null);
  };

  const handleSkipChat = () => {
    setConfirmOpen(false);
    setPendingPayload(null);
  };

  return (
    <section
      id="contact"
      className="page-hero-pt relative overflow-hidden border-t border-border/30 bg-transparent pb-16 sm:pb-20 md:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,hsl(var(--primary)/0.14),transparent_55%)]" />
      </div>

      <div className="page-container-x relative">
        <div className="mx-auto max-w-6xl">
          <Reveal as="header" className="mb-10 text-center sm:mb-12 md:mb-14">
            <PageTitle
              eyebrow="Contact"
              accent="Hiring"
              rest="or collaboration"
              titleClassName="mb-4"
            />
            <p className="mx-auto max-w-2xl text-sm leading-relaxed portfolio-text-muted">
              Open to full-time frontend / full-stack roles and focused
              collaboration. Best path: a short note on role, stack, and why my
              EWall platform or open-source work is relevant — I reply within a day.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 items-stretch gap-8 text-left lg:grid-cols-2 lg:gap-10 xl:gap-12">
            {/* Left — channels + interview path */}
            <div className="flex h-full flex-col gap-6 sm:gap-7">
              <Reveal delay={0.08} className="min-h-0">
                <PortfolioCard className="p-5 sm:p-6 md:p-7">
                  <h2 className="mb-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Direct channels
                  </h2>
                  <p className="mb-5 text-sm leading-relaxed portfolio-text-muted sm:mb-6">
                    Prefer email or a quick call? Tap a row below. For roles:
                    mention stack + why EWall, My3DUI, or Fieldstack is
                    relevant.
                  </p>

                  <Stagger className="flex flex-col gap-3">
                    {contactChannels.map((item) => (
                      <StaggerItem key={item.label}>
                        <ChannelCard item={item} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </PortfolioCard>
              </Reveal>

              <Reveal delay={0.14} className="min-h-0 flex-1">
                <PortfolioCard className="flex h-full flex-col p-5 sm:p-6">
                  <h2 className="mb-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Before we talk
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed portfolio-text-muted">
                    Three links that match what I will walk through in an
                    interview — plus the resume download.
                  </p>
                  <ul className="space-y-3">
                    {interviewPath.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="group flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-[hsl(var(--surface-2)/0.5)] px-3.5 py-3 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span>
                            <span className="text-sm font-semibold text-foreground">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-relaxed portfolio-text-muted">
                              {item.detail}
                            </span>
                          </span>
                          <ArrowUpRight
                            className="mt-0.5 size-4 shrink-0 text-primary/50 transition group-hover:text-primary"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/resume/Sreekanth_SDE.pdf"
                    download="Sreekanth_SDE.pdf"
                    className="mt-auto inline-flex min-h-[44px] items-center gap-2 pt-4 text-sm font-semibold text-primary transition-colors hover:text-[hsl(var(--primary-light))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FileDown className="size-4" aria-hidden />
                    Download resume
                  </a>
                </PortfolioCard>
              </Reveal>
            </div>

            {/* Right — form + availability (fills column height) */}
            <Reveal delay={0.12} className="flex h-full min-h-0 flex-col">
              <PortfolioCard className="flex h-full min-h-0 flex-col overflow-hidden p-0">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex min-h-0 flex-1 flex-col p-5 sm:p-6 md:p-8"
                >
                  <div className="mb-6 shrink-0 border-b border-border/50 pb-5">
                    <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Send a message
                    </h2>
                    <p className="mt-2 text-sm portfolio-text-muted">
                      Include role, location/timezone, and a link if useful.
                      After submit you can continue on WhatsApp for a quick chat.
                    </p>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col space-y-4 sm:space-y-5">
                    <div className="grid shrink-0 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-name"
                          className="font-mono text-[0.65rem] font-medium uppercase tracking-wide text-foreground"
                        >
                          Name <span className="text-primary">*</span>
                        </label>
                        <Input
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          aria-invalid={Boolean(fieldErrors.name)}
                          aria-describedby={
                            fieldErrors.name ? "contact-name-error" : undefined
                          }
                          className={fieldClass}
                        />
                        {fieldErrors.name ? (
                          <p
                            id="contact-name-error"
                            role="alert"
                            className="text-xs text-destructive"
                          >
                            {fieldErrors.name}
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-email"
                          className="font-mono text-[0.65rem] font-medium uppercase tracking-wide text-foreground"
                        >
                          Email <span className="text-primary">*</span>
                        </label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="you@company.com"
                          aria-invalid={Boolean(fieldErrors.email)}
                          aria-describedby={
                            fieldErrors.email ? "contact-email-error" : undefined
                          }
                          className={fieldClass}
                        />
                        {fieldErrors.email ? (
                          <p
                            id="contact-email-error"
                            role="alert"
                            className="text-xs text-destructive"
                          >
                            {fieldErrors.email}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="shrink-0 space-y-1.5">
                      <label
                        htmlFor="contact-subject"
                        className="font-mono text-[0.65rem] font-medium uppercase tracking-wide text-foreground"
                      >
                        Subject <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        placeholder="What's this about?"
                        aria-invalid={Boolean(fieldErrors.subject)}
                        aria-describedby={
                          fieldErrors.subject
                            ? "contact-subject-error"
                            : undefined
                        }
                        className={fieldClass}
                      />
                      {fieldErrors.subject ? (
                        <p
                          id="contact-subject-error"
                          role="alert"
                          className="text-xs text-destructive"
                        >
                          {fieldErrors.subject}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col space-y-1.5">
                      <label
                        htmlFor="contact-message"
                        className="font-mono text-[0.65rem] font-medium uppercase tracking-wide text-foreground"
                      >
                        Message <span className="text-primary">*</span>
                      </label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        placeholder="Tell me about your project, timeline, and stack…"
                        aria-invalid={Boolean(fieldErrors.message)}
                        aria-describedby={
                          fieldErrors.message
                            ? "contact-message-error"
                            : undefined
                        }
                        className={cn(
                          textareaClass,
                          "min-h-[140px] flex-1 resize-y lg:min-h-[180px]",
                        )}
                      />
                      {fieldErrors.message ? (
                        <p
                          id="contact-message-error"
                          role="alert"
                          className="text-xs text-destructive"
                        >
                          {fieldErrors.message}
                        </p>
                      ) : null}
                    </div>

                    <PortfolioButton
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={submitting}
                      className="mt-auto shrink-0 font-mono text-xs uppercase tracking-wider"
                    >
                      <Send className="size-4" />
                      {submitting ? "Submitting..." : "Send message"}
                    </PortfolioButton>
                  </div>
                </form>

                <div className="shrink-0 border-t border-border/50">
                  <div className="flex items-center gap-2 border-b border-border/40 bg-[hsl(var(--surface-2))] px-4 py-3 sm:px-5">
                    <span className="size-2.5 rounded-full bg-destructive/90" />
                    <span className="size-2.5 rounded-full bg-amber-400/90" />
                    <span className="size-2.5 rounded-full bg-emerald-500/90" />
                    <span className="ml-2 font-mono text-[10px] portfolio-text-muted sm:text-xs">
                      availability.sh
                    </span>
                  </div>
                  <div className="grid gap-4 p-4 font-mono text-xs sm:grid-cols-2 sm:gap-6 sm:p-5 sm:text-sm">
                    <div>
                      <p className="portfolio-text-muted">
                        <span className="text-primary">$</span> location
                        --current
                      </p>
                      <p className="mt-1 font-semibold text-foreground">India</p>
                    </div>
                    <div>
                      <p className="portfolio-text-muted">
                        <span className="text-primary">$</span> response --sla
                      </p>
                      <p className="mt-1 inline-flex items-center gap-2 font-semibold text-foreground">
                        <Clock className="size-3.5 text-primary" aria-hidden />
                        Typically within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </PortfolioCard>
            </Reveal>
          </div>
        </div>
      </div>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setPendingPayload(null);
        }}
      >
        <AlertDialogContent className="portfolio-theme-scope border-primary/25 bg-[hsl(var(--surface))] text-foreground sm:rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary sm:mx-0">
              <CheckCircle2 className="size-6" aria-hidden />
            </div>
            <AlertDialogTitle className="font-display text-xl tracking-tight">
              Form submitted
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed portfolio-text-muted">
              Thanks—your message was saved successfully. Do you need a quick
              chat? I can open WhatsApp with your details prefilled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel
              onClick={handleSkipChat}
              className="rounded-xl border-border bg-transparent"
            >
              No, thanks
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleQuickChat}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-light))]"
            >
              <MessageCircle className="mr-2 size-4" aria-hidden />
              Yes, open WhatsApp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
