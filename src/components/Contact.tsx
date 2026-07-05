import { motion, useInView } from "framer-motion";
import { PageTitle } from "@/components/ui/page-title";
import { useRef } from "react";
import { ArrowUpRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
    value: "+91-9363965927",
    href: "tel:+919363965927",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "India",
  },
];

const fieldClass =
  "h-12 min-h-[48px] rounded-xl border-border/60 bg-background/50 px-4 text-base backdrop-blur-sm transition-colors placeholder:text-muted-foreground/80 focus-visible:border-primary/50 focus-visible:ring-primary/25 md:h-11 md:min-h-0 md:text-sm";

const textareaClass =
  "min-h-[140px] rounded-xl border-border/60 bg-background/50 px-4 py-3 text-base backdrop-blur-sm transition-colors placeholder:text-muted-foreground/80 focus-visible:border-primary/50 focus-visible:ring-primary/25 md:min-h-[120px] md:text-sm";

/** WhatsApp wa.me expects country code + number, no + or spaces (+91 9363965927) */
const WHATSAPP_WA_ME = "919363965927";

const WHATSAPP_INTRO =
  "Hey, I have seen your portfolio.";

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

function ChannelCard({
  item,
  index,
  isInView,
}: {
  item: ContactChannel;
  index: number;
  isInView: boolean;
}) {
  const inner = (
    <>
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 transition-colors",
          item.href &&
            "group-hover:border-primary/40 group-hover:bg-primary/[0.15]",
        )}
      >
        <item.icon className="size-5 text-primary" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
          {item.label}
        </p>
        <p
          className={cn(
            "mt-1 break-words font-semibold text-foreground sm:text-base",
            item.href && "transition-colors group-hover:text-primary",
          )}
        >
          {item.value}
        </p>
      </div>
      {item.href ? (
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100 group-hover:text-primary"
          aria-hidden
        />
      ) : null}
    </>
  );

  const motionProps = {
    initial: { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.5, delay: 0.15 + index * 0.06 },
  };

  const className = cn(
    "group flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/30 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:border-primary/35 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-4 sm:p-5",
    item.href && "cursor-pointer active:scale-[0.99]",
  );

  if (item.href) {
    return (
      <motion.a href={item.href} className={className} {...motionProps}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div className={className} {...motionProps}>
      {inner}
    </motion.div>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) return;

    const text = buildWhatsAppBody({ name, email, subject, message });
    const url = `https://wa.me/${WHATSAPP_WA_ME}?text=${encodeURIComponent(text)}`;

    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;

    toast({
      title: "Opening WhatsApp",
      description: "Continue the conversation in WhatsApp with your message prefilled.",
    });

    form.reset();
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="page-hero-pt relative overflow-hidden border-t border-border/30 bg-transparent pb-16 sm:pb-20 md:pb-28 lg:pb-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="particle-bg absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent_55%)]" />
      </div>

      <div className="page-container-x relative">
        <div className="mx-auto max-w-6xl">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center sm:mb-14 md:mb-16 lg:mb-20"
          >
            <PageTitle
              eyebrow="Contact"
              accent="Let's connect"
              titleClassName="mb-4 sm:mb-5"
            />
            <p className="mx-auto max-w-2xl px-1 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether you&apos;re building a product, exploring an idea, or
              looking for engineering collaboration—I&apos;m open to thoughtful
              conversations.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 lg:items-center xl:gap-14">
            {/* Form first on mobile for quicker reach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="order-1 lg:order-2"
            >
              <form
                onSubmit={handleSubmit}
                className="glass-panel rounded-2xl border border-border/60 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.2)] sm:p-7 md:p-8"
              >
                <div className="mb-6 border-b border-border/50 pb-5 sm:mb-8 sm:pb-6">
                  <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Send a message
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Submit opens WhatsApp to{" "}
                    <span className="font-mono text-foreground/90">
                      +91 9363965927
                    </span>{" "}
                    with an intro line and your details filled in.
                  </p>
                  <p className="mt-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                    <span className="text-foreground/80">Template:</span>{" "}
                    &quot;{WHATSAPP_INTRO}&quot; — then your name, email,
                    subject, and message.
                  </p>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-name"
                        className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        Name
                      </label>
                      <Input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className={fieldClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-email"
                        className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        Email
                      </label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@company.com"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-subject"
                      className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Subject
                    </label>
                    <Input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="What’s this about?"
                      className={fieldClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Message
                    </label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project, timeline, and stack…"
                      className={cn(textareaClass, "resize-y")}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-2 h-12 w-full font-mono text-sm uppercase tracking-wider"
                  >
                    <>
                      <Send className="size-5" />
                      Continue in WhatsApp
                    </>
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Channels + terminal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="order-2 flex flex-col gap-6 sm:gap-8 lg:order-1"
            >
              <div className="glass-panel rounded-2xl border border-border/60 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.2)] sm:p-7 md:p-8">
                <h2 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Direct channels
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:mb-8">
                  Prefer email or a quick call? Tap a row below—everything is
                  sized for thumbs on mobile.
                </p>

                <div className="flex flex-col gap-3 sm:gap-4">
                  {contactChannels.map((item, index) => (
                    <ChannelCard
                      key={item.label}
                      item={item}
                      index={index}
                      isInView={isInView}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="glass-panel overflow-hidden rounded-2xl border border-border/60 font-mono text-xs shadow-[0_8px_40px_rgba(0,0,0,0.2)] sm:text-sm"
              >
                <div className="flex items-center gap-2 border-b border-border/50 bg-background/40 px-4 py-3 sm:px-5">
                  <span className="size-2.5 rounded-full bg-destructive/90 ring-2 ring-background" />
                  <span className="size-2.5 rounded-full bg-amber-400/90 ring-2 ring-background" />
                  <span className="size-2.5 rounded-full bg-emerald-500/90 ring-2 ring-background" />
                  <span className="ml-2 truncate text-[10px] text-muted-foreground sm:text-xs">
                    availability.sh
                  </span>
                </div>
                <div className="overflow-x-auto p-4 text-primary sm:p-5">
                  <div className="min-w-0 space-y-2 whitespace-pre-wrap text-[11px] leading-relaxed sm:text-sm sm:leading-relaxed">
                    <p>
                      <span className="text-muted-foreground">$</span> location
                      --current
                    </p>
                    <p className="text-foreground">India</p>
                    <p>
                      <span className="text-muted-foreground">$</span>{" "}
                      response --sla
                    </p>
                    <p className="text-foreground">
                      Typically within 24 hours
                    </p>
                    <p className="animate-pulse text-muted-foreground">▌</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
