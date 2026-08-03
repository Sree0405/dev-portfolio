/**
 * Public HTML resume content — keep aligned with
 * server/resume/defaultTemplate.ts and src/app/lib/resume/defaultTemplate.ts.
 * No invented metrics or claims.
 */

export const publicResume = {
  name: "Sreekanth S H",
  headline: "Frontend SDE | React & Next.js | Full Stack Developer",
  links: [
    { label: "github.com/sree0405", href: "https://github.com/Sree0405" },
    {
      label: "linkedin.com/in/sreekanth04052005",
      href: "https://linkedin.com/in/sreekanth04052005",
    },
    { label: "www.sreekanth.pro", href: "https://www.sreekanth.pro" },
    {
      label: "sreekanth04052005@gmail.com",
      href: "mailto:sreekanth04052005@gmail.com",
    },
    { label: "+91-9363965927", href: "tel:+919363965927" },
  ],
  summary:
    "Frontend-focused full-stack engineer. Junior Full-Stack Engineer at EWall on a ~8-engineer team — own features from requirements through deployment and production support, with technical mentoring (not people management). React + Directus platform work plus named client sites and open-source systems.",
  skills: [
    {
      label: "Frontend",
      value: "React, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS",
    },
    {
      label: "Backend",
      value:
        "Directus, PostgreSQL, Node.js, Express.js, Prisma, NestJS (building), REST APIs",
    },
    {
      label: "Tools & Deployment",
      value: "Git, Vercel, Docker",
    },
  ],
  skillsNote:
    "Depth labels on portfolio skills page: Daily / Production / Building.",
  experience: [
    {
      title: "Junior Full-Stack Engineer",
      company: "EWall Solutions Pvt. Ltd.",
      dates: "Aug 2025 – Present",
      bullets: [
        "Own larger features end to end: clarify requirements, plan/estimate, design frontend & backend, build, test, deploy, and post-release fixes",
        "One of three engineers on a ~600-hour client delivery with a fixed deadline — parallel task planning, dependency mapping, PR/integration review, merge conflict resolution; shipped on timeline (collaborative role, not PM)",
        "Technical mentoring on a ~8-engineer team — task breakdown for newer developers, PR reviews, verify work before deploy (not people management)",
        "Built auth flows (password reset/expiry, Microsoft Auth), Station/Banner config modules, and Directus deploy/backup tooling (~80% / ~70% effort cuts)",
      ],
    },
    {
      title: "Software Developer Intern",
      company: "EWall Solutions Pvt. Ltd.",
      dates: "May 2025 – Aug 2025",
      bullets: [
        "Joined with prior React experience from client projects; focused on learning the product domain and Directus-backed platform",
        "Contributed to React platform work under review while ramping toward Junior ownership",
      ],
    },
    {
      title: "Full Stack Developer (Part-time)",
      company: "Client work",
      dates: "Nov 2024 – Present",
      bullets: [
        "Delivered two named production sites — Sri Thanigai Garments (CMS-backed company site) and GB Fitness (Vercel deploy)",
        "Building Fahis Brownie Bee (in progress, free portfolio engagement) — product/combo storefront, WhatsApp order handoff, admin Order IDs + address forms + parcel PDFs",
        "Owned discovery through deploy and post-launch fixes for completed clients",
      ],
    },
  ],
  projectsIntro: {
    label: "Case studies",
    href: "https://www.sreekanth.pro/projects",
  },
  projects: [
    {
      title: "Sree Dev Tool — Personal ops platform",
      links: [
        {
          label: "Docs",
          href: "https://www.sreekanth.pro/project/sree-dev-tool",
        },
        {
          label: "GitHub",
          href: "https://github.com/Sree0405/dev-portfolio",
        },
      ],
      bullets: [
        "Sole owner — React UI, Express APIs, Prisma/PostgreSQL, session auth, modular domains",
        "Built into a portfolio monorepo designed to scale from day one — multi-tenant-capable modules without a second stack; demo isolates private ops data",
      ],
    },
    {
      title: "My3DUI — Open-source 3D UI library",
      links: [
        { label: "Live", href: "https://my3dui.vercel.app/" },
        { label: "GitHub", href: "https://github.com/Sree0405/my3dui" },
      ],
      bullets: [
        "TypeScript-first React Three Fiber primitives with public playground and docs",
        "Tree-shakable library entry separate from the docs/playground app",
      ],
    },
    {
      title: "Fieldstack — Open-source CMS/admin",
      links: [
        { label: "Demo", href: "https://fieldstack.onrender.com/" },
        {
          label: "GitHub",
          href: "https://github.com/Sree0405/fieldstack",
        },
      ],
      bullets: [
        "NestJS + Prisma with JWT/RBAC and collection-driven REST; early-stage open source, honest demo scale",
      ],
    },
    {
      title: "Fahis Brownie Bee — Cloud kitchen storefront (WIP)",
      links: [
        {
          label: "Live",
          href: "https://fahis-brownie-bee-eta.vercel.app/",
        },
      ],
      bullets: [
        "Free portfolio engagement — brownie/combo listings and WhatsApp order redirect with selected item",
        "Admin Order module in progress: Order ID + customer address form + today’s/selected/date parcel PDFs vs chat/sheet/screenshot matching",
      ],
    },
    {
      title: "SkillCamp — Bootcamp platform (exploratory)",
      links: [
        {
          label: "Live",
          href: "https://bootcamp-platform-seven.vercel.app/",
        },
        {
          label: "GitHub",
          href: "https://github.com/Sree0405/bootcamp-platform",
        },
      ],
      bullets: [
        "Upcoming bootcamp listings with online/offline apply flows, image URLs, and admin CRUD (static-password login)",
        "Enrollments linked per camp — Razorpay payments, SMTP completion mail, and WhatsApp API; exploratory after venture handoff",
      ],
    },
  ],
  education: {
    degree: "B.Sc. Computer Science",
    school: "S.A. College of Arts & Science",
    dates: "2022 – 2025",
  },
} as const;
