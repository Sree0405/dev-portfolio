import { PrismaClient, DataType } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

const DEMO_TYPE = DataType.Demo;
const DEFAULT_TYPE = DataType.Default;

async function ensureUsers() {
  const adminUsername = process.env.OWNER_USERNAME?.trim() || "Sree";
  const adminPassword = process.env.OWNER_PASSWORD?.trim() || "changeme";
  const demoPassword = process.env.DEMO_PASSWORD?.trim() || "Demo@2026";
  const adminEmail =
    process.env.ADMIN_EMAIL?.trim() || `${adminUsername.toLowerCase()}@sreekanth.local`;

  const adminHash = await bcrypt.hash(adminPassword, 12);
  const demoHash = await bcrypt.hash(demoPassword, 12);

  const admin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {
      role: "admin",
      email: adminEmail,
    },
    create: {
      username: adminUsername,
      email: adminEmail,
      passwordHash: adminHash,
      displayName: adminUsername,
      role: "admin",
    },
  });

  const demo = await prisma.user.upsert({
    where: { username: "Demo" },
    update: { role: "demo" },
    create: {
      username: "Demo",
      email: "demo@sreekanth.local",
      passwordHash: demoHash,
      displayName: "Demo User",
      role: "demo",
    },
  });

  return { admin, demo };
}

async function backfillUserIds(adminId: string, demoId: string) {
  const tables = [
    prisma.project,
    prisma.payment,
    prisma.projectNote,
    prisma.credential,
    prisma.financeRecord,
    prisma.financePaymentHistory,
    prisma.budget,
    prisma.resume,
    prisma.devUtilityFavorite,
    prisma.devUtilityRecent,
    prisma.contactFormSubmission,
    prisma.company,
    prisma.companyContact,
    prisma.jobApplication,
    prisma.jobStatusHistory,
    prisma.interviewSchedule,
    prisma.jobNote,
  ] as const;

  for (const model of tables) {
    await (model as { updateMany: (args: unknown) => Promise<unknown> }).updateMany({
      where: { type: DEFAULT_TYPE, userId: null },
      data: { userId: adminId },
    });
    await (model as { updateMany: (args: unknown) => Promise<unknown> }).updateMany({
      where: { type: DEMO_TYPE, userId: null },
      data: { userId: demoId },
    });
  }
}

const projectsSeed = [
  {
    name: "NovaTech E-Commerce Platform",
    clientName: "NovaTech Solutions",
    clientNumber: "+91 9876543210",
    projectLinks: "https://github.com/demo/novatech, https://novatech-demo.vercel.app",
    projectType: "Web Application",
    status: "In Progress",
    plannedAmount: 85000,
  },
  {
    name: "GreenLeaf Restaurant Website",
    clientName: "GreenLeaf Hospitality",
    clientNumber: "+91 9123456789",
    projectLinks: "https://greenleaf-demo.vercel.app",
    projectType: "Website",
    status: "Completed",
    plannedAmount: 35000,
  },
  {
    name: "FitTrack Mobile App UI",
    clientName: "FitTrack India",
    clientNumber: "+91 9988776655",
    projectType: "Mobile App",
    status: "In Progress",
    plannedAmount: 120000,
  },
  {
    name: "CloudSync Admin Dashboard",
    clientName: "CloudSync Pvt Ltd",
    clientNumber: "+91 9012345678",
    projectLinks: "https://cloudsync-admin.vercel.app, https://docs.cloudsync-demo.io",
    projectType: "Dashboard",
    status: "Planning",
    plannedAmount: 95000,
  },
  {
    name: "EduSpark Learning Portal",
    clientName: "EduSpark Academy",
    clientNumber: "+91 8899001122",
    projectType: "Web Application",
    status: "In Progress",
    plannedAmount: 75000,
  },
  {
    name: "UrbanNest Real Estate Site",
    clientName: "UrbanNest Properties",
    clientNumber: "+91 7766554433",
    projectLinks: "https://urbannest-demo.vercel.app",
    projectType: "Website",
    status: "Completed",
    plannedAmount: 42000,
  },
  {
    name: "MediCare Appointment System",
    clientName: "MediCare Clinic",
    clientNumber: "+91 9345678901",
    projectType: "Web Application",
    status: "On Hold",
    plannedAmount: 68000,
  },
  {
    name: "StyleHub Fashion Store",
    clientName: "StyleHub Retail",
    clientNumber: "+91 8234567890",
    projectLinks: "https://stylehub-store.vercel.app",
    projectType: "E-Commerce",
    status: "In Progress",
    plannedAmount: 110000,
  },
  {
    name: "AutoFleet Fleet Tracker",
    clientName: "AutoFleet Logistics",
    clientNumber: "+91 7654321098",
    projectType: "Dashboard",
    status: "Planning",
    plannedAmount: 145000,
  },
  {
    name: "PixelCraft Portfolio Builder",
    clientName: "PixelCraft Studio",
    clientNumber: "+91 9123987654",
    projectType: "SaaS Tool",
    status: "Completed",
    plannedAmount: 55000,
  },
  {
    name: "FinWise Expense Tracker",
    clientName: "FinWise Technologies",
    clientNumber: "+91 8877665544",
    projectLinks: "https://finwise-demo.vercel.app",
    projectType: "Mobile App",
    status: "In Progress",
    plannedAmount: 98000,
  },
  {
    name: "EventPulse Booking Platform",
    clientName: "EventPulse Events",
    clientNumber: "+91 9900112233",
    projectType: "Web Application",
    status: "Cancelled",
    plannedAmount: 60000,
  },
  {
    name: "AgriGrow Farm Management",
    clientName: "AgriGrow Co-op",
    clientNumber: "+91 8765432109",
    projectType: "Dashboard",
    status: "In Progress",
    plannedAmount: 88000,
  },
  {
    name: "TravelMate Booking Engine",
    clientName: "TravelMate Holidays",
    clientNumber: "+91 9556677889",
    projectLinks: "https://travelmate-demo.vercel.app, https://staging.travelmate.io",
    projectType: "Web Application",
    status: "Completed",
    plannedAmount: 72000,
  },
  {
    name: "SecureVault Auth Module",
    clientName: "SecureVault Systems",
    clientNumber: "+91 9445566778",
    projectType: "API Integration",
    status: "In Progress",
    plannedAmount: 65000,
  },
];

const noteTemplates = [
  "Client approved first milestone.",
  "Landing page completed.",
  "Awaiting payment confirmation.",
  "Invoice shared with client.",
  "Scope updated after discussion.",
  "Mobile responsiveness completed.",
  "API integration completed.",
  "Deployment scheduled for next week.",
  "Design review feedback incorporated.",
  "Payment gateway integration in progress.",
  "Client requested additional feature — quoted separately.",
  "UAT session completed successfully.",
  "Bug fixes from QA round addressed.",
  "Database migration completed.",
  "Performance optimization done — Lighthouse score improved.",
  "Staging environment deployed for client review.",
  "Final invoice prepared and sent.",
  "Project kickoff meeting completed.",
  "Wireframes approved by client.",
  "Backend API documentation shared.",
  "Sprint 2 deliverables completed on time.",
  "Client confirmed color palette and typography.",
  "Third-party API keys configured.",
  "Security audit recommendations implemented.",
  "Handover documentation prepared.",
  "Retainer discussion scheduled for next month.",
  "Client requested dark mode — added to scope.",
  "Payment reminder sent via email.",
  "Demo walkthrough completed with stakeholders.",
  "Production deployment successful.",
  "Post-launch support period started.",
  "Analytics dashboard widgets configured.",
];

const paymentMethods = ["UPI", "Bank Transfer", "Cash", "Cheque"] as const;

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 500) * 500;
}

function monthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(Math.floor(Math.random() * 28) + 1);
  return d;
}

async function main() {
  console.log("Ensuring admin and demo users...");
  const { admin: adminUser, demo: demoUser } = await ensureUsers();
  await backfillUserIds(adminUser.id, demoUser.id);
  const demoUserId = demoUser.id;

  console.log("Clearing existing demo data...");
  await prisma.financePaymentHistory.deleteMany({ where: { userId: demoUserId } });
  await prisma.financeRecord.deleteMany({ where: { userId: demoUserId } });
  await prisma.projectNote.deleteMany({ where: { userId: demoUserId } });
  await prisma.payment.deleteMany({ where: { userId: demoUserId } });
  await prisma.credential.deleteMany({ where: { userId: demoUserId } });
  await prisma.contactFormSubmission.deleteMany({ where: { userId: demoUserId } });
  await prisma.resume.deleteMany({ where: { userId: demoUserId } });
  await prisma.jobNote.deleteMany({ where: { userId: demoUserId } });
  await prisma.interviewSchedule.deleteMany({ where: { userId: demoUserId } });
  await prisma.jobStatusHistory.deleteMany({ where: { userId: demoUserId } });
  await prisma.jobApplication.deleteMany({ where: { userId: demoUserId } });
  await prisma.companyContact.deleteMany({ where: { userId: demoUserId } });
  await prisma.company.deleteMany({ where: { userId: demoUserId } });
  await prisma.project.deleteMany({ where: { userId: demoUserId } });
  await prisma.budget.deleteMany({ where: { userId: demoUserId } });

  console.log("Creating demo projects...");
  const createdProjects = [];

  for (const seed of projectsSeed) {
    const project = await prisma.project.create({
      data: {
        ...seed,
        type: DEMO_TYPE, userId: demoUserId,
        totalPaid: 0,
      },
    });
    createdProjects.push(project);
  }

  console.log("Creating demo payments...");
  let paymentCount = 0;
  const targetPayments = 42;

  for (const project of createdProjects) {
    const planned = Number(project.plannedAmount);
    const numPayments = Math.floor(Math.random() * 4) + 1;
    let projectPaid = 0;

    for (let i = 0; i < numPayments && paymentCount < targetPayments; i++) {
      const isLast = i === numPayments - 1 || paymentCount === targetPayments - 1;
      const remaining = planned - projectPaid;
      if (remaining <= 0) break;

      const amount = isLast
        ? Math.min(remaining, randomAmount(5000, Math.max(remaining, 10000)))
        : randomAmount(3000, Math.min(25000, remaining));

      const method = randomItem(paymentMethods);
      const monthsBack = Math.floor(Math.random() * 10);

      await prisma.payment.create({
        data: {
          projectId: project.id,
          amount,
          paymentMethod: method,
          reference:
            method === "UPI"
              ? `UPI${Math.floor(Math.random() * 900000000 + 100000000)}`
              : method === "Bank Transfer"
                ? `TXN${Math.floor(Math.random() * 900000 + 100000)}`
                : method === "Cheque"
                  ? `CHQ${Math.floor(Math.random() * 9000 + 1000)}`
                  : null,
          notes:
            method === "Cash"
              ? "Cash payment received in person"
              : method === "Cheque"
                ? "Cheque cleared successfully"
                : `Payment via ${method}`,
          paymentDate: monthsAgo(monthsBack),
          type: DEMO_TYPE, userId: demoUserId,
        },
      });

      projectPaid += amount;
      paymentCount++;
    }

    await prisma.project.update({
      where: { id: project.id },
      data: { totalPaid: projectPaid },
    });
  }

  console.log("Creating demo notes...");
  let noteCount = 0;
  const targetNotes = 35;

  for (const project of createdProjects) {
    const numNotes = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < numNotes && noteCount < targetNotes; i++) {
      const content = noteTemplates[noteCount % noteTemplates.length];
      const createdAt = monthsAgo(Math.floor(Math.random() * 8));

      await prisma.projectNote.create({
        data: {
          projectId: project.id,
          content,
          type: DEMO_TYPE, userId: demoUserId,
          createdAt,
          updatedAt: createdAt,
        },
      });
      noteCount++;
    }
  }

  console.log(
    `Demo seed complete: ${createdProjects.length} projects, ${paymentCount} payments, ${noteCount} notes.`,
  );

  console.log("Creating demo credentials...");
  const credentialsSeed = [
    { serviceName: "Vercel", websiteUrl: "https://vercel.com", username: "demo@vercel.com", password: "DemoPassword@2026", category: "Hosting" },
    { serviceName: "Render", websiteUrl: "https://render.com", username: "demo@render.com", password: "DemoPassword@2026", category: "Hosting" },
    { serviceName: "Neon", websiteUrl: "https://neon.tech", username: "demo@neon.tech", password: "DemoPassword@2026", category: "Database" },
    { serviceName: "GitHub", websiteUrl: "https://github.com", username: "demo@github.com", password: "DemoPassword@2026", category: "Development" },
    { serviceName: "Cloudflare", websiteUrl: "https://cloudflare.com", username: "demo@cloudflare.com", password: "DemoPassword@2026", category: "Cloud" },
    { serviceName: "Railway", websiteUrl: "https://railway.app", username: "demo@railway.app", password: "DemoPassword@2026", category: "Hosting" },
    { serviceName: "Firebase", websiteUrl: "https://firebase.google.com", username: "demo@firebase.com", password: "DemoPassword@2026", category: "Cloud" },
    { serviceName: "Supabase", websiteUrl: "https://supabase.com", username: "demo@supabase.com", password: "DemoPassword@2026", category: "Database" },
    { serviceName: "Docker Hub", websiteUrl: "https://hub.docker.com", username: "demo@docker.com", password: "DemoPassword@2026", category: "Development" },
    { serviceName: "DigitalOcean", websiteUrl: "https://digitalocean.com", username: "demo@digitalocean.com", password: "DemoPassword@2026", category: "Cloud" },
    { serviceName: "AWS Console", websiteUrl: "https://aws.amazon.com", username: "demo@aws.com", password: "DemoPassword@2026", category: "Cloud" },
    { serviceName: "Azure Portal", websiteUrl: "https://portal.azure.com", username: "demo@azure.com", password: "DemoPassword@2026", category: "Cloud" },
  ];

  for (const seed of credentialsSeed) {
    await prisma.credential.create({
      data: {
        ...seed,
        notes: "Fictional demo credential for showcase purposes only.",
        type: DEMO_TYPE, userId: demoUserId,
      },
    });
  }

  console.log(`Created ${credentialsSeed.length} demo credentials.`);

  console.log("Creating demo finance records...");

  const emiSeeds = [
    { name: "MacBook Pro EMI", totalAmount: 120000, emiAmount: 10000, totalMonths: 12, dueDay: 5 },
    { name: "Bike Loan", totalAmount: 85000, emiAmount: 7083, totalMonths: 12, dueDay: 10 },
    { name: "iPhone EMI", totalAmount: 96000, emiAmount: 8000, totalMonths: 12, dueDay: 15 },
    { name: "Personal Loan", totalAmount: 200000, emiAmount: 16667, totalMonths: 12, dueDay: 1 },
    { name: "Office Laptop EMI", totalAmount: 75000, emiAmount: 6250, totalMonths: 12, dueDay: 20 },
  ];

  for (const [index, emi] of emiSeeds.entries()) {
    const startDate = monthsAgo(6 - index);
    const record = await prisma.financeRecord.create({
      data: {
        moduleType: "EMI",
        name: emi.name,
        amount: emi.emiAmount,
        totalAmount: emi.totalAmount,
        dueDay: emi.dueDay,
        totalMonths: emi.totalMonths,
        remainingMonths: emi.totalMonths - 4,
        currentInstallment: 5,
        startDate,
        notes: "Demo EMI for showcase only.",
        type: DEMO_TYPE, userId: demoUserId,
      },
    });

    for (let i = 0; i < emi.totalMonths; i++) {
      const due = new Date(startDate);
      due.setMonth(due.getMonth() + i);
      due.setDate(Math.min(emi.dueDay, 28));
      const isPaid = i < 4;
      await prisma.financePaymentHistory.create({
        data: {
          recordId: record.id,
          amount: emi.emiAmount,
          dueDate: due,
          paidDate: isPaid ? due : null,
          status: isPaid ? "Paid" : i === 4 ? "Pending" : "Pending",
          periodLabel: `Installment ${i + 1}`,
          installmentNumber: i + 1,
          type: DEMO_TYPE, userId: demoUserId,
        },
      });
    }
  }

  const rentSeeds = [
    { name: "House Rent", monthlyAmount: 18000, dueDay: 1 },
    { name: "Office Rent", monthlyAmount: 12000, dueDay: 5 },
    { name: "Shop Rent", monthlyAmount: 8000, dueDay: 10 },
    { name: "Studio Rent", monthlyAmount: 9500, dueDay: 7 },
    { name: "Co-working Desk", monthlyAmount: 4500, dueDay: 15 },
  ];

  for (const [index, rent] of rentSeeds.entries()) {
    const record = await prisma.financeRecord.create({
      data: {
        moduleType: "Rent",
        name: rent.name,
        amount: rent.monthlyAmount,
        dueDay: rent.dueDay,
        notes: "Demo rent record.",
        type: DEMO_TYPE, userId: demoUserId,
      },
    });

    for (let m = 0; m < 4; m++) {
      const due = monthsAgo(3 - m);
      due.setDate(Math.min(rent.dueDay, 28));
      const isPaid = m < 3;
      await prisma.financePaymentHistory.create({
        data: {
          recordId: record.id,
          amount: rent.monthlyAmount,
          dueDate: due,
          paidDate: isPaid ? due : null,
          status: isPaid ? "Paid" : "Pending",
          periodLabel: due.toLocaleString("en-IN", { month: "long", year: "numeric" }),
          type: DEMO_TYPE, userId: demoUserId,
        },
      });
    }
  }

  const subscriptionSeeds = [
    { name: "Cursor", websiteUrl: "https://cursor.com", amount: 2000, billingCycle: "Monthly", category: "Development", dueDay: 5 },
    { name: "ChatGPT Plus", websiteUrl: "https://chat.openai.com", amount: 1999, billingCycle: "Monthly", category: "Productivity", dueDay: 10 },
    { name: "Claude Pro", websiteUrl: "https://claude.ai", amount: 1800, billingCycle: "Monthly", category: "Productivity", dueDay: 15 },
    { name: "Vercel Pro", websiteUrl: "https://vercel.com", amount: 2000, billingCycle: "Monthly", category: "Hosting", dueDay: 2 },
    { name: "DigitalOcean", websiteUrl: "https://digitalocean.com", amount: 1200, billingCycle: "Monthly", category: "Cloud", dueDay: 8 },
    { name: "AWS", websiteUrl: "https://aws.amazon.com", amount: 3500, billingCycle: "Monthly", category: "Cloud", dueDay: 12 },
    { name: "Figma", websiteUrl: "https://figma.com", amount: 1200, billingCycle: "Monthly", category: "Design", dueDay: 18 },
    { name: "Netflix", websiteUrl: "https://netflix.com", amount: 649, billingCycle: "Monthly", category: "Entertainment", dueDay: 22 },
    { name: "Spotify", websiteUrl: "https://spotify.com", amount: 119, billingCycle: "Monthly", category: "Entertainment", dueDay: 25 },
    { name: "GitHub Copilot", websiteUrl: "https://github.com", amount: 1000, billingCycle: "Monthly", category: "Development", dueDay: 3 },
  ];

  for (const [index, sub] of subscriptionSeeds.entries()) {
    const renewalDate = new Date();
    renewalDate.setDate(sub.dueDay);
    if (renewalDate < new Date()) renewalDate.setMonth(renewalDate.getMonth() + 1);
    renewalDate.setDate(sub.dueDay);

    const record = await prisma.financeRecord.create({
      data: {
        moduleType: "Subscription",
        name: sub.name,
        amount: sub.amount,
        websiteUrl: sub.websiteUrl,
        billingCycle: sub.billingCycle,
        renewalDate,
        autoRenew: true,
        category: sub.category,
        notes: "Demo subscription.",
        type: DEMO_TYPE, userId: demoUserId,
      },
    });

    for (let m = 0; m < 3; m++) {
      const due = new Date(renewalDate);
      due.setMonth(due.getMonth() - (2 - m));
      const isPaid = m < 2;
      await prisma.financePaymentHistory.create({
        data: {
          recordId: record.id,
          amount: sub.amount,
          dueDate: due,
          paidDate: isPaid ? due : null,
          status: isPaid ? "Paid" : "Pending",
          periodLabel: due.toLocaleString("en-IN", { month: "long", year: "numeric" }),
          type: DEMO_TYPE, userId: demoUserId,
        },
      });
    }
  }

  console.log(
    `Created ${emiSeeds.length} EMIs, ${rentSeeds.length} rent records, ${subscriptionSeeds.length} subscriptions.`,
  );

  await seedBudgetDemo(demoUserId);
}

async function seedBudgetDemo(demoUserId: string) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const income = 75000;

  const demoCategories = [
    { name: "Rent", percentage: 16, planned: 12000, actual: 12000, financeLink: "Rent" },
    { name: "Food", percentage: 10.67, planned: 8000, actual: 10350, financeLink: null },
    { name: "Travel", percentage: 6.67, planned: 5000, actual: 4000, financeLink: null },
    { name: "Subscriptions", percentage: 4, planned: 3000, actual: 3500, financeLink: "Subscription" },
    { name: "Shopping", percentage: 8, planned: 6000, actual: 4800, financeLink: null },
    { name: "Savings", percentage: 20, planned: 15000, actual: 12000, financeLink: null },
    { name: "Investment", percentage: 10.67, planned: 8000, actual: 8000, financeLink: null },
  ];

  const active = await prisma.budget.create({
    data: {
      month,
      year,
      income,
      ruleType: "50_30_20",
      ruleLabel: "50 / 30 / 20",
      notes: "Demo budget for July — explore safe, warning, and exceeded categories.",
      status: "Active",
      type: DEMO_TYPE, userId: demoUserId,
      categories: {
        create: demoCategories.map((c, i) => ({
          name: c.name,
          percentage: c.percentage,
          plannedAmount: c.planned,
          actualAmount: c.actual,
          financeLink: c.financeLink,
          sortOrder: i,
        })),
      },
    },
  });

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  await prisma.budget.create({
    data: {
      month: prevMonth,
      year: prevYear,
      income: 72000,
      ruleType: "50_30_20",
      ruleLabel: "50 / 30 / 20",
      notes: "Archived demo budget.",
      status: "Archived",
      type: DEMO_TYPE, userId: demoUserId,
      categories: {
        create: [
          { name: "Rent", percentage: 16, plannedAmount: 11500, actualAmount: 11500, sortOrder: 0 },
          { name: "Food", percentage: 12, plannedAmount: 8600, actualAmount: 7800, sortOrder: 1 },
          { name: "Savings", percentage: 20, plannedAmount: 14400, actualAmount: 14400, sortOrder: 2 },
        ],
      },
    },
  });

  console.log(`Created demo budget ${active.id} with ${demoCategories.length} categories.`);

  console.log("Creating demo form submissions...");
  const formsSeed = [
    {
      name: "Priya Sharma",
      email: "priya.sharma@novatech-demo.com",
      subject: "E-commerce platform inquiry",
      message:
        "Hi, we are planning a multi-vendor marketplace and liked your portfolio. Can we discuss timeline and pricing for a React + Node build?",
      status: "new",
      source: "contact_page",
    },
    {
      name: "Rahul Mehta",
      email: "rahul@greenleaf-demo.io",
      subject: "Restaurant website redesign",
      message:
        "Looking for a modern responsive website with online reservations and menu management. Please share your availability.",
      status: "read",
      source: "contact_page",
    },
    {
      name: "Ananya Iyer",
      email: "ananya@fittrack-demo.app",
      subject: "Mobile app UI collaboration",
      message:
        "We need a designer-developer for fitness app screens and a React Native prototype over the next 6 weeks.",
      status: "new",
      source: "dashboard",
    },
    {
      name: "Vikram Desai",
      email: "vikram@cloudsync-demo.com",
      subject: "Admin dashboard MVP",
      message:
        "Interested in a SaaS admin dashboard with role-based access, charts, and billing integration. Is this something you can take on?",
      status: "read",
      source: "contact_page",
    },
    {
      name: "Sneha Patel",
      email: "sneha@eduspark-demo.org",
      subject: "Learning portal maintenance",
      message:
        "We already have a portal built and need ongoing maintenance plus feature work for quizzes and student progress tracking.",
      status: "archived",
      source: "contact_page",
    },
    {
      name: "Arjun Nair",
      email: "arjun@urbannest-demo.in",
      subject: "Real estate listing site",
      message:
        "Need a property listing website with map search, lead forms, and an admin panel for agents. Please share a rough estimate.",
      status: "new",
      source: "contact_page",
    },
    {
      name: "Meera Krishnan",
      email: "meera@medicare-demo.health",
      subject: "Appointment booking system",
      message:
        "Clinic wants online appointment booking with SMS reminders. Would like to understand stack recommendations and delivery timeline.",
      status: "read",
      source: "dashboard",
    },
    {
      name: "Karthik Reddy",
      email: "karthik@stylehub-demo.shop",
      subject: "Shopify + custom storefront",
      message:
        "Exploring headless commerce with a custom React storefront. Do you have experience integrating Shopify APIs?",
      status: "new",
      source: "contact_page",
    },
    {
      name: "Divya Menon",
      email: "divya@autofleet-demo.io",
      subject: "Fleet tracking dashboard",
      message:
        "We are building a logistics dashboard with live vehicle tracking. Looking for a frontend engineer for 3 months.",
      status: "read",
      source: "contact_page",
    },
    {
      name: "Harish Kumar",
      email: "harish@pixelcraft-demo.studio",
      subject: "Portfolio builder SaaS",
      message:
        "Interested in discussing architecture for a no-code portfolio builder with templates and custom domains.",
      status: "archived",
      source: "dashboard",
    },
    {
      name: "Lakshmi Venkat",
      email: "lakshmi@finwise-demo.tech",
      subject: "Expense tracker app",
      message:
        "Need help shipping v1 of a personal finance app with budgets, recurring expenses, and export to CSV.",
      status: "new",
      source: "contact_page",
    },
    {
      name: "Aditya Bose",
      email: "aditya@demo-startup.io",
      subject: "Full-stack freelancer availability",
      message:
        "Early-stage startup looking for part-time full-stack support on a Next.js product. Are you open to retainer work?",
      status: "read",
      source: "contact_page",
    },
  ];

  for (const seed of formsSeed) {
    await prisma.contactFormSubmission.create({
      data: {
        ...seed,
        type: DEMO_TYPE, userId: demoUserId,
      },
    });
  }

  console.log(`Created ${formsSeed.length} demo form submissions.`);

  console.log("Creating demo resume...");
  const { DEMO_RESUME_LATEX } = await import("../server/resume/defaultTemplate.js");
  await prisma.resume.create({
    data: {
      title: "Alex Developer — Demo Resume",
      description: "Showcase LaTeX resume for the demo account.",
      latexSource: DEMO_RESUME_LATEX,
      compileStatus: "idle",
      type: DEMO_TYPE, userId: demoUserId,
    },
  });
  console.log("Created demo resume.");

  await seedJobTrackerDemo(demoUserId);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function seedJobTrackerDemo(demoUserId: string) {
  console.log("Creating demo companies and job tracker data...");

  const companiesSeed = [
    { name: "TechNova Solutions", linkedinUrl: "https://linkedin.com/company/technova-demo", careersUrl: "https://technova-demo.com/careers", productCategory: "SaaS", companySize: "201-500", headquarters: "Bangalore", officeLocation: "Bangalore, Karnataka", applied: true },
    { name: "CloudPeak Systems", linkedinUrl: "https://linkedin.com/company/cloudpeak-demo", careersUrl: "https://cloudpeak-demo.io/jobs", productCategory: "Cloud Infrastructure", companySize: "501-1000", headquarters: "Hyderabad", officeLocation: "Hyderabad, Telangana", applied: true },
    { name: "DataForge Analytics", productCategory: "Data Analytics", companySize: "51-200", headquarters: "Pune", officeLocation: "Pune, Maharashtra", applied: false },
    { name: "FinEdge Technologies", linkedinUrl: "https://linkedin.com/company/finedge-demo", productCategory: "FinTech", companySize: "201-500", headquarters: "Mumbai", officeLocation: "Mumbai, Maharashtra", applied: true },
    { name: "HealthSync Digital", careersUrl: "https://healthsync-demo.com/careers", productCategory: "HealthTech", companySize: "101-200", headquarters: "Chennai", officeLocation: "Chennai, Tamil Nadu", applied: false },
    { name: "RetailPulse Commerce", productCategory: "E-Commerce", companySize: "501-1000", headquarters: "Delhi", officeLocation: "Gurgaon, Haryana", applied: true },
    { name: "SecureNet Cyber", linkedinUrl: "https://linkedin.com/company/securenet-demo", productCategory: "Cybersecurity", companySize: "51-200", headquarters: "Bangalore", officeLocation: "Bangalore, Karnataka", applied: true },
    { name: "EduLeap Learning", productCategory: "EdTech", companySize: "201-500", headquarters: "Pune", officeLocation: "Pune, Maharashtra", applied: false },
    { name: "LogiTrack Mobility", careersUrl: "https://logitrack-demo.com/jobs", productCategory: "Logistics", companySize: "1001-5000", headquarters: "Mumbai", officeLocation: "Mumbai, Maharashtra", applied: true },
    { name: "GreenEnergy Labs", productCategory: "CleanTech", companySize: "51-200", headquarters: "Ahmedabad", officeLocation: "Ahmedabad, Gujarat", applied: false },
    { name: "MediaStream Studios", linkedinUrl: "https://linkedin.com/company/mediastream-demo", productCategory: "Media", companySize: "201-500", headquarters: "Mumbai", officeLocation: "Mumbai, Maharashtra", applied: true },
    { name: "AI Horizon Labs", careersUrl: "https://aihorizon-demo.ai/careers", productCategory: "Artificial Intelligence", companySize: "101-200", headquarters: "Bangalore", officeLocation: "Bangalore, Karnataka", applied: true },
    { name: "PropTech India", productCategory: "PropTech", companySize: "51-200", headquarters: "Hyderabad", officeLocation: "Hyderabad, Telangana", applied: false },
    { name: "GameForge Interactive", productCategory: "Gaming", companySize: "201-500", headquarters: "Pune", officeLocation: "Pune, Maharashtra", applied: true },
    { name: "InsureTech Global", linkedinUrl: "https://linkedin.com/company/insuretech-demo", productCategory: "InsurTech", companySize: "501-1000", headquarters: "Bangalore", officeLocation: "Bangalore, Karnataka", applied: false },
    { name: "TravelNest Platform", productCategory: "Travel", companySize: "201-500", headquarters: "Delhi", officeLocation: "Delhi NCR", applied: true },
    { name: "AgriSmart Systems", productCategory: "AgriTech", companySize: "51-200", headquarters: "Chennai", officeLocation: "Chennai, Tamil Nadu", applied: false },
    { name: "DevOps Matrix", careersUrl: "https://devopsmatrix-demo.com/jobs", productCategory: "DevTools", companySize: "101-200", headquarters: "Bangalore", officeLocation: "Remote", applied: true },
    { name: "QuantumPay Solutions", productCategory: "Payments", companySize: "501-1000", headquarters: "Mumbai", officeLocation: "Mumbai, Maharashtra", applied: true },
    { name: "NeoBank Digital", linkedinUrl: "https://linkedin.com/company/neobank-demo", productCategory: "Banking", companySize: "1001-5000", headquarters: "Bangalore", officeLocation: "Bangalore, Karnataka", applied: false },
    { name: "SmartHome IoT", productCategory: "IoT", companySize: "201-500", headquarters: "Hyderabad", officeLocation: "Hyderabad, Telangana", applied: true },
    { name: "CodeCraft Studios", productCategory: "Software Services", companySize: "51-200", headquarters: "Pune", officeLocation: "Pune, Maharashtra", applied: false },
  ];

  const companyTypes = ["Startup", "MNC", "Product", "Service", "Agency", "Consulting"] as const;

  const createdCompanies = [];
  for (const [index, seed] of companiesSeed.entries()) {
    const company = await prisma.company.create({
      data: {
        ...seed,
        companyType: companyTypes[index % companyTypes.length],
        type: DEMO_TYPE, userId: demoUserId,
      },
    });
    createdCompanies.push(company);
  }

  const contactNames = [
    { name: "Priya Sharma", designation: "HR Manager", email: "priya.sharma@demo.com", phone: "+91 9876543210" },
    { name: "Rahul Mehta", designation: "Talent Acquisition", email: "rahul.mehta@demo.com", phone: "+91 9123456789" },
    { name: "Ananya Iyer", designation: "Recruiter", email: "ananya.iyer@demo.com", phone: "+91 9988776655" },
  ];

  for (const company of createdCompanies.slice(0, 15)) {
    const contact = contactNames[Math.floor(Math.random() * contactNames.length)];
    await prisma.companyContact.create({
      data: {
        companyId: company.id,
        name: contact.name,
        designation: contact.designation,
        email: contact.email,
        phone: contact.phone,
        notes: "Demo HR contact for showcase.",
        type: DEMO_TYPE, userId: demoUserId,
      },
    });
  }

  const jobStatuses = [
    "Applied", "Shortlisted", "HR Discussion", "Interview Scheduled",
    "Interview Completed", "Technical Round", "Manager Round", "Final Round",
    "Selected", "Offer Received", "Rejected", "Withdrawn",
  ] as const;

  const roles = [
    "Senior Full Stack Developer", "React Developer", "Node.js Engineer",
    "Frontend Engineer", "Backend Developer", "Software Engineer II",
    "Full Stack Engineer", "Lead Developer", "TypeScript Developer",
  ];

  let jobCount = 0;
  for (const company of createdCompanies.filter((c) => c.applied)) {
    const numJobs = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < numJobs && jobCount < 24; j++) {
      const statusIndex = Math.floor(Math.random() * jobStatuses.length);
      const status = jobStatuses[statusIndex];
      const appliedDaysAgo = Math.floor(Math.random() * 60) + 5;

      const job = await prisma.jobApplication.create({
        data: {
          companyId: company.id,
          jobId: `JOB-${1000 + jobCount}`,
          roleName: roles[jobCount % roles.length],
          applicationUrl: company.careersUrl ?? "https://example.com/apply",
          appliedThrough: Math.random() > 0.5 ? "LinkedIn" : "Company Website",
          mailId: "demo.applicant@example.com",
          appliedDate: daysAgo(appliedDaysAgo),
          currentStatus: status,
          expectedSalary: 1800000 + Math.floor(Math.random() * 1200000),
          currentSalary: 1200000 + Math.floor(Math.random() * 800000),
          negotiatedSalary: status === "Offer Received" ? 2200000 + Math.floor(Math.random() * 500000) : null,
          offeredSalary: status === "Offer Received" ? 2400000 + Math.floor(Math.random() * 400000) : null,
          companyStandardSalary: 2000000 + Math.floor(Math.random() * 600000),
          type: DEMO_TYPE, userId: demoUserId,
        },
      });

      const timelineStatuses = jobStatuses.slice(0, statusIndex + 1);
      for (let s = 0; s < timelineStatuses.length; s++) {
        await prisma.jobStatusHistory.create({
          data: {
            jobApplicationId: job.id,
            status: timelineStatuses[s],
            type: DEMO_TYPE, userId: demoUserId,
            createdAt: daysAgo(appliedDaysAgo - s * 3),
          },
        });
      }

      if (["Interview Scheduled", "Technical Round", "Manager Round", "Final Round"].includes(status)) {
        await prisma.interviewSchedule.create({
          data: {
            jobApplicationId: job.id,
            interviewDate: daysFromNow(Math.floor(Math.random() * 14) + 1),
            interviewTime: "10:30 AM",
            mode: Math.random() > 0.4 ? "Online" : "Offline",
            location: "Bangalore Office",
            interviewer: "Panel Lead",
            meetingLink: "https://meet.demo.com/interview",
            notes: "Demo interview schedule.",
            type: DEMO_TYPE, userId: demoUserId,
          },
        });
      }

      const noteSamples = [
        "HR requested current CTC breakdown.",
        "Need to prepare DSA — focus on arrays and trees.",
        "Interview panel has 3 members.",
        "Follow-up after 2 days if no response.",
      ];
      await prisma.jobNote.create({
        data: {
          jobApplicationId: job.id,
          content: noteSamples[jobCount % noteSamples.length],
          type: DEMO_TYPE, userId: demoUserId,
        },
      });

      jobCount++;
    }
  }

  console.log(`Created ${createdCompanies.length} demo companies and ${jobCount} job applications.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
