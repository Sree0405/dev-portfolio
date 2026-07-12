import { PrismaClient, DataType } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_TYPE = DataType.Demo;

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
  console.log("Clearing existing demo data...");
  await prisma.financePaymentHistory.deleteMany({ where: { type: DEMO_TYPE } });
  await prisma.financeRecord.deleteMany({ where: { type: DEMO_TYPE } });
  await prisma.projectNote.deleteMany({ where: { type: DEMO_TYPE } });
  await prisma.payment.deleteMany({ where: { type: DEMO_TYPE } });
  await prisma.credential.deleteMany({ where: { type: DEMO_TYPE } });
  await prisma.project.deleteMany({ where: { type: DEMO_TYPE } });

  console.log("Creating demo projects...");
  const createdProjects = [];

  for (const seed of projectsSeed) {
    const project = await prisma.project.create({
      data: {
        ...seed,
        type: DEMO_TYPE,
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
          type: DEMO_TYPE,
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
          type: DEMO_TYPE,
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
        type: DEMO_TYPE,
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
        type: DEMO_TYPE,
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
          type: DEMO_TYPE,
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
        type: DEMO_TYPE,
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
          type: DEMO_TYPE,
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
        type: DEMO_TYPE,
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
          type: DEMO_TYPE,
        },
      });
    }
  }

  console.log(
    `Created ${emiSeeds.length} EMIs, ${rentSeeds.length} rent records, ${subscriptionSeeds.length} subscriptions.`,
  );

  await seedBudgetDemo();
}

async function seedBudgetDemo() {
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
      type: DEMO_TYPE,
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
      type: DEMO_TYPE,
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
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
