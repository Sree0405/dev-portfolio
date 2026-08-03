import My3DUIImage from "@/assets/3dUi.png";
import My3DUIVideo from "@/assets/videos/my3dui.mp4";
import FieldstackImage from "@/assets/Dashboard.png";
import FieldstackVideo from "@/assets/videos/fieldstack.mp4";
import EVPortalImage from "@/assets/evpic.png";
import EVPortalVideo from "@/assets/videos/evPortal.mp4";
import LifeAdminImage from "@/assets/LifeAdminMain.png";
import GBFitnessVideo from "@/assets/videos/gbFitness.mp4";
import GBFitnessImage from "@/assets/gbFitnessimage.png";
import SriThanigaiImage from "@/assets/srithanigaiGarments.png";
import FahisBrownieImage from "@/assets/FahisBrownie.jpg";
import FahisBrownieVideo from "@/assets/videos/FaahisBrownie.mp4";
import BootCampImage from "@/assets/BootCamp.jpg";
import BootCampVideo from "@/assets/videos/BootCamp.mp4";

const SREE_DEV_TOOL_POSTER = "/devtool/dashboard-overview.png";
const SREE_DEV_TOOL_VIDEO = "/videos/SreeDevToolPortfolio.mp4";

export type ProjectCaseStudy = {
  problem: string;
  solution: string;
  role: string;
  challenges: string;
  decisions: string;
  architecture: string;
  tradeoffs: string;
  outcome: string;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  featured?: boolean;
  summary: string;
  highlights: [string, string, string];
  caseStudy: ProjectCaseStudy;
  tech: string[];
  image: string | { default: string };
  video?: string | { default: string };
  live?: string;
  github?: string;
  docs?: string;
  /** When set, Projects CTAs show an honest private-source signal instead of a missing Code button. */
  sourcePolicy?: "private";
};

export const projects: Project[] = [
  {
    id: "sree-dev-tool",
    title: "Sree Dev Tool",
    subtitle: "Personal operations platform",
    type: "Full-Stack Dashboard",
    featured: true,
    summary:
      "A session-authenticated ops dashboard in the same scalable portfolio monorepo — finance, credentials, notes, and developer utilities I run daily, with room to grow modules without a separate product repo.",
    highlights: [
      "Sole owner — UI, Express APIs, Prisma/PostgreSQL, auth, deploy",
      "Eight modular domains under one multi-tenant-capable session model",
      "Built into a scalable portfolio monorepo — add features without a rewrite",
    ],
    caseStudy: {
      problem:
        "Ops work was split across finance trackers, password notes, scratch pads, and ad-hoc scripts — context-switching cost more than the work. A separate product repo would have duplicated deploy, auth, and scaling work the portfolio already needed.",
      solution:
        "From day one the portfolio repo was structured to scale — so a modular, multi-tenant-capable Dev Tool (session isolation, domain routers, shared deploy) could ship in the same codebase as the public site.",
      role:
        "Sole owner of product scope, React UI, Express APIs, schema, auth, and production hosting.",
      challenges:
        "Keeping eight domains coherent under one auth model without a monolith; shipping a reviewable demo mode that never exposes private ops data; growing features without compromising structure or performance habits.",
      decisions:
        "Design the monorepo for scale first (layered server, modular UI, shared session). Prisma + PostgreSQL; Express routers per domain; owner/demo DataType isolation like a multi-tenant boundary; PDF invoices inside finance instead of a separate tool.",
      architecture:
        "Domain routers over a shared session layer; typed Prisma models; UI modules that only talk to their own API surface — same Express/Vite process as the public site. New modules plug in without forking the app.",
      tradeoffs:
        "One monorepo (dev-portfolio) for site + Dev Tool: one deploy, one scaling story, faster feature adds. Cost is discipline — domains must stay isolated so growth does not tank performance. Ops data stays private via owner/demo isolation; reviewers get Code on the monorepo, demo, and docs.",
      outcome:
        "I run real ops from one app that proves the portfolio architecture can absorb a full product surface. Source: github.com/Sree0405/dev-portfolio. Pattern I market across my work: scalable foundations so features grow without compromising structure or performance.",
    },
    tech: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL", "Monaco Editor"],
    image: SREE_DEV_TOOL_POSTER,
    video: SREE_DEV_TOOL_VIDEO,
    live: "/login",
    github: "https://github.com/Sree0405/dev-portfolio",
    docs: "/project/sree-dev-tool",
  },
  {
    id: "my3dui",
    title: "My3DUI",
    subtitle: "3D Component Library",
    type: "Open Source UI System",
    featured: true,
    summary:
      "An open-source React Three Fiber library of composable, TypeScript-first 3D UI primitives with a public playground.",
    highlights: [
      "Designed the package API and reusable primitives",
      "Tree-shakable library separate from docs/playground",
      "Public demo, docs, and GitHub for review",
    ],
    caseStudy: {
      problem:
        "Most 3D web UIs are one-off scenes — hard to reuse, poorly typed, and difficult for other engineers to adopt.",
      solution:
        "Composable TypeScript-first primitives with a playground and docs site.",
      role:
        "Designed the package API, built primitives and playground, and maintain the public docs/demo.",
      challenges:
        "Balancing expressive 3D APIs with tree-shakable boundaries; keeping docs in sync with the published surface.",
      decisions:
        "TypeScript-first exports over demo-only scenes; Next.js docs/playground separated from the library entry.",
      architecture:
        "Installable library entry + independent Next.js docs/playground consumer.",
      tradeoffs:
        "Library vs playground split: expressive demos stay out of the published entry so installs stay tree-shakable — reviewers must open the playground for the flashiest scenes, not the npm package alone. TypeScript-first APIs slow early iteration vs demo-only scenes, but they are what makes the kit adoptable.",
      outcome:
        "Reusable 3D UI primitives others can install and compose — live demo and source available.",
    },
    tech: ["Next.js", "React", "TypeScript", "Three.js", "Tailwind"],
    image: My3DUIImage,
    video: My3DUIVideo,
    live: "https://my3dui.vercel.app/",
    github: "https://github.com/Sree0405/my3dui",
    docs: "https://my3dui.vercel.app/docs",
  },
  {
    id: "fieldstack",
    title: "Fieldstack",
    subtitle: "Headless CMS & admin framework",
    type: "Open Source Backend System",
    summary:
      "A self-hosted NestJS + Prisma CMS/admin stack with JWT/RBAC, collection-driven REST APIs, and a React admin — early open-source, honest demo scale.",
    highlights: [
      "Architected NestJS services, auth/RBAC, and Prisma schema",
      "Auto-generated REST from collections with enforceable permissions",
      "Public GitHub + demo — early-stage, not production SaaS scale",
    ],
    caseStudy: {
      problem:
        "Teams need a self-hosted content/admin layer without locking into a black-box CMS they cannot extend.",
      solution:
        "NestJS + Prisma backend with JWT/RBAC, collection-driven REST, and a React admin for schema, media, and roles.",
      role:
        "Architected modular NestJS services, auth/RBAC, Prisma schema, and the admin UI that exercises the APIs.",
      challenges:
        "Generating stable REST surfaces from collections while keeping permissions enforceable; packaging a Docker-friendly deploy.",
      decisions:
        "NestJS modules for service boundaries; Prisma migrations; JWT + role checks at the API edge; React admin as a first-class API consumer.",
      architecture:
        "Modular NestJS domain services → Prisma → JWT/RBAC gateway → React admin against the same contracts.",
      tradeoffs:
        "Collection-driven REST wins schema-change speed and loses the polish of handcrafted endpoints — fine for CMS-shaped data, wrong for bespoke workflows. NestJS modules add ceremony vs a thin Express app; the pay-off is clear auth/RBAC boundaries. Public demo on a free host means cold starts — I label that honestly instead of implying production SaaS scale.",
      outcome:
        "Open-source CMS/admin stack with live demo and GitHub for code review — architecture proof, not a scaled product claim.",
    },
    tech: ["NestJS", "React", "TypeScript", "Prisma", "PostgreSQL", "Docker"],
    image: FieldstackImage,
    video: FieldstackVideo,
    live: "https://fieldstack.onrender.com/",
    github: "https://github.com/Sree0405/fieldstack",
    docs: "/project/fieldstack",
  },
  {
    id: "sri-thanigai",
    title: "Sri Thanigai Garments",
    subtitle: "Client garments site",
    type: "Client Production Site",
    summary:
      "CMS-backed marketing and manufacturing pages for a garments business — live on the company domain.",
    highlights: [
      "Owned discovery through production deploy",
      "CMS so content updates do not need engineering",
      "Live at srithanigaigarments.com",
    ],
    caseStudy: {
      problem:
        "The business needed a public site marketing and ops could update without an engineering ticket for every copy change.",
      solution:
        "CMS-backed marketing and manufacturing pages with product showcases on a production domain.",
      role:
        "Owned discovery through deploy: information architecture, Next.js front end, CMS integration, and handoff.",
      challenges:
        "Mapping products and manufacturing story into a maintainable CMS model; shipping a production URL the client could trust day one.",
      decisions:
        "CMS-driven content for non-engineering updates; Next.js for SEO-friendly pages; Express where server-backed content was required.",
      architecture:
        "Next.js marketing surfaces over a CMS content model, with Express only where the brief needed server-backed data.",
      tradeoffs:
        "Favored editorial independence for the client over a fully custom admin that would need ongoing engineering.",
      outcome:
        "Live production site — the business publishes updates through CMS instead of waiting on developers.",
    },
    tech: ["React", "Next.js", "TypeScript", "Node.js", "Express"],
    image: SriThanigaiImage,
    live: "https://www.srithanigaigarments.com/",
  },
  {
    id: "gb-fitness",
    title: "GB Fitness",
    subtitle: "Gym marketing site",
    type: "Client Production Site",
    summary:
      "A focused marketing site for GB Fitness Studio (Avadi) with clear program and membership conversion paths.",
    highlights: [
      "Sole delivery — scope, build, post-launch fixes",
      "Motion-led responsive UI without burying CTAs",
      "Production Vercel URL the gym can share",
    ],
    caseStudy: {
      problem:
        "The gym needed a clear public site for programs and memberships — not a template that buried conversion.",
      solution:
        "Program, equipment, transformation, and membership sections on a production Vercel deploy.",
      role:
        "Sole delivery owner: client scope, React/Vite build, motion-led UI, and post-launch fixes.",
      challenges:
        "Keeping visual energy without hurting load performance; keeping membership CTAs obvious on mobile.",
      decisions:
        "Vite + React Router for a lean SPA; Framer Motion for intentional presence; Vercel for a stable public URL.",
      architecture:
        "Marketing SPA with section-driven routes and lightweight motion — no unnecessary backend for a brochure conversion site.",
      tradeoffs:
        "Skipped a heavy CMS; content changes go through a short engineering pass in exchange for speed and performance.",
      outcome:
        "Live client site with clear program/membership paths — paid delivery still maintained in production.",
    },
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "React Router",
    ],
    image: GBFitnessImage,
    video: GBFitnessVideo,
    live: "https://gbfitness-eta.vercel.app/",
  },
  {
    id: "fahis-brownie-bee",
    title: "Fahis Brownie Bee",
    subtitle: "Cloud kitchen storefront · in progress",
    type: "Client Production Site",
    summary:
      "In-progress free portfolio engagement for a brownie cloud kitchen (~20-person team) — product and combo listings, WhatsApp order handoff, and an admin Order module aimed at 100+/day chat-and-sheet chaos. Live storefront; ops tooling still shipping.",
    highlights: [
      "Free portfolio build — honest WIP, not a finished product claim",
      "WhatsApp redirect carries the selected brownie or combo",
      "Admin Order IDs + address forms + parcel PDFs vs chat screenshots",
    ],
    caseStudy: {
      problem:
        "Orders arrived on WhatsApp and Instagram. Staff logged chat IDs into Google Sheets, asked customers to paste name/address in a template, and kept screenshots of threads — hard to match parcels when volume hit 100+ orders a day.",
      solution:
        "A public storefront for brownies and sized combo boxes with pricing, plus WhatsApp deep-links that carry the selected item. In admin: create order → Order ID + address-form URL (ID goes in the sheet; form goes to the customer); search by Order ID; print today’s / selected / date-filtered parcel PDFs.",
      role:
        "Sole builder for this free portfolio engagement — storefront, combo listing, WhatsApp handoff, and the Order module while the product is still in progress.",
      challenges:
        "Fitting a real Order ID workflow into a team that still lives in Sheets; keeping parcel print templates usable on a packing line; shipping storefront and ops tooling without pretending the engagement is finished.",
      decisions:
        "Keep Sheets in the loop via Order ID so packing habits do not break overnight; give customers a dedicated address form instead of chat templates; generate printable parcel PDFs keyed to Order ID for the box.",
      architecture:
        "Marketing/storefront surfaces for products and combos; WhatsApp as the order channel with item context; admin Order create/search plus PDF export for today, manual selection, or a chosen date.",
      tradeoffs:
        "Sheets stay as the packing source of truth for now — Order ID bridges systems instead of a full POS replacement. Free WIP scope prioritizes listing + order identity over a complete commerce stack.",
      outcome:
        "Live Vercel storefront for browsing and WhatsApp ordering; Order module in progress to cut screenshot/ID ambiguity — still shipping, not a completed delivery claim.",
    },
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    image: FahisBrownieImage,
    video: FahisBrownieVideo,
    live: "https://fahis-brownie-bee-eta.vercel.app/",
    sourcePolicy: "private",
  },
  {
    id: "lifeadmin",
    title: "LifeAdmin Pro",
    subtitle: "Finance & renewal tracker",
    type: "Mobile Application",
    summary:
      "A React Native app for renewals and subscriptions with offline-first storage and reminder workflows — actively in development.",
    highlights: [
      "Offline-first data model and reminder flows",
      "Architecture documented while shipping",
      "Honest WIP with public repo and docs",
    ],
    caseStudy: {
      problem:
        "Renewal dates are easy to miss when they live in scattered reminders — especially offline or on the go.",
      solution:
        "React Native app for renewals/subscriptions with local persistence and reminder workflows.",
      role:
        "Designing the offline-first data model, core screens, and reminder flows; documenting architecture as it evolves.",
      challenges:
        "Reliable offline storage and reminder timing on device; keeping Firebase optional where local state is enough.",
      decisions:
        "Expo + React Native for cross-platform delivery; AsyncStorage/Context for offline-first state; Firebase only where sync or push justifies it.",
      architecture:
        "Local-first state with Context/AsyncStorage; optional Firebase for sync/push when the flow needs it.",
      tradeoffs:
        "Shipped architecture docs before a store listing — transparency over pretending the product is finished.",
      outcome:
        "Actively in development with public repo and architecture docs — honest WIP, not a finished store listing.",
    },
    tech: [
      "React Native",
      "Expo",
      "TypeScript",
      "Context API",
      "AsyncStorage",
      "Firebase",
    ],
    image: LifeAdminImage,
    live: "https://drive.google.com/drive/u/1/folders/11vPn0NE1w-0qGiIQ7Mc9iVHhQ7SWEyXO/",
    github: "https://github.com/Sree0405/lifeadmin-pro",
    docs: "/project/lifeAdmin",
  },
  {
    id: "ev-portal",
    title: "EV Portal",
    subtitle: "Interactive EV showcase",
    type: "3D Web Application",
    summary:
      "A Next.js + Three.js EV discovery experience with interactive vehicle views and filtering.",
    highlights: [
      "Built 3D vehicle views and filter UX end to end",
      "Performance-conscious rendering path",
      "Public demo and GitHub source",
    ],
    caseStudy: {
      problem:
        "EV product pages often flatten vehicles into static photography — weak for exploration and hard to extend with filters.",
      solution:
        "Next.js front end with Three.js vehicle views and filtering focused on discovery.",
      role:
        "Built the interactive 3D experience, filter UX, and performance-conscious rendering path; published demo and source.",
      challenges:
        "Keeping 3D scenes responsive under filter changes; avoiding a heavyweight bundle that kills first paint.",
      decisions:
        "Next.js for routing/deploy; Three.js for visualization; filter state on the front end so exploration stays instant.",
      architecture:
        "Client-driven filter state + Three.js scene layer on a Next.js deploy surface.",
      tradeoffs:
        "Front-end filter state favors instant exploration over server-driven catalog complexity.",
      outcome:
        "Public demo and GitHub — a front-end systems experiment in 3D product storytelling, not a tutorial clone.",
    },
    tech: ["Next.js", "React", "Three.js", "Tailwind"],
    image: EVPortalImage,
    video: EVPortalVideo,
    live: "https://ev-portal.vercel.app/",
    github: "https://github.com/Sree0405/ev-portal",
  },
  {
    id: "bootcamp",
    title: "SkillCamp",
    subtitle: "Bootcamp platform · exploratory",
    type: "Full-Stack Web Application",
    summary:
      "Exploratory full-stack bootcamp platform — upcoming listings, online/offline apply flows, admin CRUD, enrollments with Razorpay, SMTP mail, and WhatsApp. Built for a planned venture that moved on after handoff; public demo and source for review.",
    highlights: [
      "Online vs offline bootcamps with mode-specific fields and trainer details",
      "Admin CRUD (static-password login) plus enrollments linked per bootcamp",
      "Razorpay payments, SMTP completion mail, and WhatsApp API wired",
    ],
    caseStudy: {
      problem:
        "A planned bootcamp product needed public listings and applications, different data for online vs offline (venue, trainer, and related fields), admin management of camps and pricing, and a way to see who enrolled — with payment and notification paths.",
      solution:
        "Public upcoming-bootcamp list and apply flow; backend fields that change by online/offline mode; image URLs instead of uploads; admin login with a static password to create/edit/delete camps and pricing; enrollments related to each bootcamp; Razorpay on enrollment; SMTP for notification and enrollment-completed mail; WhatsApp API configured.",
      role:
        "Sole full-stack builder — then the venture held the project and moved to the next idea. I keep the exploratory build public for demo and code review.",
      challenges:
        "Modeling online vs offline field sets cleanly; tying enrollments to camps for an admin view; wiring payment plus email and WhatsApp without overbuilding a product that would be handed off.",
      decisions:
        "Image URLs over upload infrastructure; static-password admin for a small ops surface; Razorpay for enrollment payment; SMTP and WhatsApp for completion/notification paths.",
      architecture:
        "Public listing/apply surfaces; mode-aware bootcamp records (online fields vs offline venue/trainer); admin CRUD; enrollment records related to bootcamps; Razorpay + SMTP + WhatsApp on the enrollment path.",
      tradeoffs:
        "Static admin password favors a simple ops surface over production-grade auth. URL-based images skip media hosting complexity. After handoff this is exploratory portfolio work — not an active commercial product claim.",
      outcome:
        "Live demo and public GitHub — an exploratory full-stack bootcamp platform reviewers can open.",
    },
    tech: ["React", "Node.js", "Razorpay", "SMTP", "WhatsApp API"],
    image: BootCampImage,
    video: BootCampVideo,
    live: "https://bootcamp-platform-seven.vercel.app/",
    github: "https://github.com/Sree0405/bootcamp-platform",
  },
];

export const getProjectById = (id: string) =>
  projects.find((p) => p.id === id);
