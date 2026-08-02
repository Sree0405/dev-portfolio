import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://www.sreekanth.pro";
const DEFAULT_IMAGE = `${SITE}/branding/sreefolio-siteIcon.png`;

type MetaEntry = {
  title: string;
  description: string;
};

const ROUTE_META: Record<string, MetaEntry> = {
  "/": {
    title: "Sreekanth — Frontend-Focused Full-Stack Engineer",
    description:
      "Junior engineer at EWall on the EWall platform — React/Next.js, Node APIs, Linux deploys, plus live client sites and open-source systems.",
  },
  "/projects": {
    title: "Projects — Sreekanth",
    description:
      "Ownership case studies: Sree Dev Tool, Fieldstack, My3DUI, and production client sites — demo, docs, or public code.",
  },
  "/experience": {
    title: "Experience — Sreekanth",
    description:
      "EWall platform modules (Kitchen, Voting, Campaign, Auth) and freelance deliveries live in production.",
  },
  "/skills": {
    title: "Engineering Expertise — Sreekanth",
    description:
      "Stack with Daily / Production / Building depth, plus delivery tooling (Linux, Nginx, PM2) — each capability links to proof.",
  },
  "/contact": {
    title: "Contact — Sreekanth",
    description:
      "Open to full-time frontend / full-stack roles — short note on role and stack; typically replies within 24 hours.",
  },
  "/project/sree-dev-tool": {
    title: "Sree Dev Tool Case Study — Sreekanth",
    description:
      "Ops platform in a scalable portfolio monorepo: multi-tenant-capable modules, session auth, Express/Prisma — demo isolates private ops data.",
  },
  "/project/fieldstack": {
    title: "Fieldstack Case Study — Sreekanth",
    description:
      "Early-stage open-source NestJS + Prisma CMS/admin with JWT/RBAC — public GitHub and demo.",
  },
  "/project/lifeAdmin": {
    title: "LifeAdmin Pro Case Study — Sreekanth",
    description:
      "React Native renewal tracker — architecture and flows while in active development.",
  },
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Per-route document title + description/OG updates for portfolio pages.
 */
export function DocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta =
      ROUTE_META[pathname] ??
      ({
        title: "Sreekanth — Portfolio",
        description:
          "Frontend-focused full-stack engineer — React, Next.js, TypeScript, Node.js.",
      } satisfies MetaEntry);

    document.title = meta.title;
    upsertMeta("name", "description", meta.description);
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:url", `${SITE}${pathname === "/" ? "/" : pathname}`);
    upsertMeta("property", "og:image", DEFAULT_IMAGE);
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", DEFAULT_IMAGE);

    let canonical = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE}${pathname === "/" ? "/" : pathname}`;
  }, [pathname]);

  return null;
}
