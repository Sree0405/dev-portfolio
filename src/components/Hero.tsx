import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { PortfolioButton } from "@/components/portfolio";
import { HeroFeaturedProject } from "@/components/hero/HeroFeaturedProject";
import {
  heroContent,
  heroCtas,
  heroFlagship,
  heroIdentity,
  heroMeta,
  heroSocialLinks,
} from "@/components/hero/heroData";

const socialIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
} as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const visualReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
  },
};

const ctaScale =
  "transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]";

/**
 * Home hero — name as brand identity; featured project on the right.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const v = (variants: Variants) => (reduce ? undefined : variants);

  return (
    <section
      id="hero"
      aria-label={`${heroContent.name}, ${heroContent.role}`}
      className="relative w-full overflow-hidden"
    >
      <div
        aria-hidden
        className="hero-atmosphere pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-7xl page-hero-pt px-3 pb-16 sm:px-5 sm:pb-20 lg:pb-24">
        <motion.div
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "show"}
          variants={v(container)}
          className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-12"
        >
          <div className="flex min-w-0 flex-col lg:col-span-7">
            <motion.div variants={v(item)}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary sm:text-[0.8125rem]">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.25)]"
                    aria-hidden
                  />
                  {heroContent.availability}
                </span>
                <span className="hidden h-3 w-px bg-primary/30 sm:block" aria-hidden />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary/80 sm:text-[0.8125rem]">
                  {heroIdentity.company.replace(" Solutions Pvt Ltd", "")}
                </span>
              </div>
            </motion.div>

            <motion.div variants={v(item)} className="mt-8 sm:mt-10">
              <p className="text-sm font-medium tracking-normal portfolio-text-muted sm:text-[15px]">
                {heroContent.greeting}
              </p>
              <h1 className="hero-display-name mt-1.5">
                {heroContent.name}
                <span className="hero-name-dot" aria-hidden>
                  .
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={v(item)}
              className="mt-5 max-w-xl text-left font-display text-sm font-semibold leading-snug tracking-[-0.02em] text-foreground sm:mt-6 sm:text-base sm:leading-snug"
            >
              {heroContent.valueLine}
            </motion.p>

            <motion.p
              variants={v(item)}
              className="mt-4 max-w-lg text-left text-sm leading-[1.65] tracking-normal portfolio-text-muted sm:text-[15px]"
            >
              {heroContent.description}
            </motion.p>

            <motion.div
              variants={v(item)}
              className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <PortfolioButton asChild variant="primary" className={ctaScale}>
                <Link to={heroCtas.work.to}>
                  {heroCtas.work.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </PortfolioButton>
              <PortfolioButton asChild variant="secondary" className={ctaScale}>
                <Link to={heroCtas.viewResume.to}>
                  {heroCtas.viewResume.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </PortfolioButton>
              <a
                href={heroCtas.resume.href}
                download={heroCtas.resume.download}
                className="inline-flex min-h-[44px] items-center gap-2 px-1 text-sm font-semibold text-primary transition-colors hover:text-[hsl(var(--primary-light))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Download className="h-4 w-4" aria-hidden />
                {heroCtas.resume.label}
              </a>
            </motion.div>

            <motion.nav
              variants={v(item)}
              aria-label="Social links"
              className="mt-6 flex items-center gap-2 sm:mt-7"
            >
              {heroSocialLinks.map((social) => {
                const Icon = socialIcons[social.label];
                const external = social.href.startsWith("http");
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    className="icon-well inline-flex h-11 w-11 transition-[transform,background,border-color] duration-150 hover:border-primary/45 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                );
              })}
            </motion.nav>

            <motion.div variants={v(item)} className="mt-10 sm:mt-12">
              <hr className="brand-divider mb-7" />
              <ul className="flex flex-wrap items-center gap-x-0 gap-y-3">
                {heroMeta.map((meta, index) => (
                  <li key={meta.label} className="flex items-center text-sm">
                    {index > 0 ? (
                      <span
                        className="mx-3 h-3 w-px shrink-0 bg-primary/25 sm:mx-4"
                        aria-hidden
                      />
                    ) : null}
                    <span className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                        {meta.label}
                      </span>
                    <span className="text-sm font-medium tracking-normal text-foreground sm:text-[15px]">
                      {meta.value}
                    </span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="mx-auto w-full min-w-0 max-w-md lg:col-span-5 lg:mx-0 lg:max-w-none lg:justify-self-end xl:max-w-[28rem]">
            <HeroFeaturedProject
              project={heroFlagship}
              variants={v(visualReveal)}
              compact
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
