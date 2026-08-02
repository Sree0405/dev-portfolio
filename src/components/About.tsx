import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  Layers,
  Briefcase,
  MapPin,
  Server,
  PackageCheck,
} from "lucide-react";

import { SectionTitle } from "@/components/ui/page-title";
import { ImpactList } from "@/components/ui/impact-list";
import {
  PortfolioCard,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/portfolio";

import devImg from "@/assets/sree_img.jpg";

const aboutContent = {
  name: "Sreekanth",
  role: "Junior Full-Stack Engineer · EWall",
  company: "EWall Solutions Pvt Ltd",
  location: "India",

  intro: [
    "At EWall I work on a resort and restaurant management platform (React + Directus) across multiple client deployments. As a Junior Full-Stack Engineer on a ~8-engineer team I grew into owning features end to end — clarifying requirements, planning and estimating, building, reviewing, deploying, and supporting production — plus technical mentoring for newer developers. I also own auth flows, admin configuration, and Directus deploy/backup tooling. Outside work I ship named client sites and open-source systems reviewers can open on GitHub.",
  ],
};

const focusAreas = [
  "Feature lifecycle: plan → task breakdown → parallel build → review → integrate → deploy",
  "Deadline delivery with a 3-engineer team on ~600h client work (collaborative, not solo)",
  "Auth, station/banner config, and Directus deploy automation (~80% / ~70% effort cuts)",
];

const capabilities = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    description: "Production React admin UIs on a multi-deployment platform.",
  },
  {
    icon: Layers,
    title: "UI Systems",
    description: "Reusable patterns — including My3DUI primitives others can install.",
  },
  {
    icon: Server,
    title: "Full-Stack Delivery",
    description: "Directus + PostgreSQL at work; Express/Prisma on personal systems.",
  },
  {
    icon: PackageCheck,
    title: "Feature ownership",
    description:
      "Plan through deploy for features I own — plus technical mentoring, not a lead title.",
  },
];

function ProfileImage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative mx-auto size-28 overflow-hidden rounded-2xl border border-border sm:size-32"
    >
      {reduce ? (
        <img
          src={devImg}
          alt="Sreekanth"
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <motion.div
          className="h-full w-full"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={
            isInView ? { clipPath: "inset(0 0 0 0)" } : { clipPath: "inset(100% 0 0 0)" }
          }
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        >
          <img
            src={devImg}
            alt="Sreekanth"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      )}
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-primary/15 bg-transparent page-section-y scroll-mt-24"
    >
      <div className="page-container-x">
        <Reveal className="mb-10 text-center md:mb-12">
          <SectionTitle
            eyebrow="Profile"
            accent="About"
            rest="me"
            className="mb-3 text-center md:mb-4 [&_h2]:text-center"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <PortfolioCard spacious className="rounded-2xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <aside className="flex shrink-0 flex-col items-center gap-4 text-center lg:w-48 xl:w-52">
                <ProfileImage />

                <div className="space-y-2">
                  <h3 className="page-title-accent text-base font-bold sm:text-lg">
                    {aboutContent.name}
                  </h3>
                  <p className="font-mono text-sm text-primary sm:text-[15px]">
                    {aboutContent.role}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 text-sm portfolio-text-muted sm:flex-row sm:flex-wrap sm:justify-center">
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <Briefcase
                      size={14}
                      className="shrink-0 text-primary/80"
                      aria-hidden
                    />
                    <span className="text-center">{aboutContent.company}</span>
                  </div>
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <MapPin
                      size={14}
                      className="shrink-0 text-primary/80"
                      aria-hidden
                    />
                    {aboutContent.location}
                  </div>
                </div>
              </aside>

              <div className="min-w-0 flex-1 space-y-8 border-t border-border/40 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <div className="max-w-2xl space-y-5 text-left">
                  {aboutContent.intro.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-left text-sm leading-[1.65] portfolio-text-muted sm:text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-primary">
                    <Layers size={18} aria-hidden />
                    Current Focus
                  </div>
                  <ImpactList items={focusAreas} columns={false} />
                </div>
              </div>
            </div>
          </PortfolioCard>
        </Reveal>

        <Stagger
          className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5"
          stagger={0.06}
          delayChildren={0.1}
        >
          {capabilities.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <PortfolioCard className="flex h-full flex-col text-left">
                <div className="icon-well mb-4 h-11 w-11 shrink-0">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <h4 className="page-title-accent mb-2 min-h-[2.5rem] text-sm font-semibold leading-snug sm:text-[15px]">
                  {item.title}
                </h4>
                <p className="mt-auto text-left text-sm leading-relaxed portfolio-text-muted">
                  {item.description}
                </p>
              </PortfolioCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
