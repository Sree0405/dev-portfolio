/**
 * Screenshot paths for Sree Dev Tool docs.
 * Loaded only when /project/sree-dev-tool is visited (dynamic import).
 * Images live in /public/devtool — never bundled by Vite.
 */
const BASE = "/devtool";

export const DEV_TOOL_SCREENSHOTS = {
  login: `${BASE}/login-page.png`,
  dashboard: {
    overview: `${BASE}/dashboard-overview.png`,
    charts: `${BASE}/dashboard-charts.png`,
    recentActivity: `${BASE}/dashboard-recent-activity.png`,
  },
  projects: {
    list: `${BASE}/projects-list.png`,
    details: `${BASE}/project-details.png`,
    paymentsNotes: `${BASE}/project-payments-notes.png`,
  },
  credentials: {
    grid: `${BASE}/credentials-grid.png`,
    viewModal: `${BASE}/credentials-view-modal.png`,
  },
  resume: {
    editor: `${BASE}/resume-latex-editor.png`,
  },
  devUtilities: {
    hub: `${BASE}/dev-utilities-hub.png`,
    qrGenerator: `${BASE}/dev-utilities-qr-generator.png`,
  },
  playground: {
    javascript: `${BASE}/playground-javascript.png`,
    typescript: `${BASE}/playground-typescript.png`,
  },
  finance: {
    overview: `${BASE}/finance-overview.png`,
    paymentTimeline: `${BASE}/finance-payment-timeline.png`,
    emiList: `${BASE}/finance-emi-list.png`,
    emiDetail: `${BASE}/finance-emi-detail.png`,
    rentList: `${BASE}/finance-rent-list.png`,
    rentDetail: `${BASE}/finance-rent-detail.png`,
    markPaidModal: `${BASE}/finance-mark-paid-modal.png`,
    subscriptionsList: `${BASE}/finance-subscriptions-list.png`,
    subscriptionDetail: `${BASE}/finance-subscription-detail.png`,
  },
  budget: {
    planner: `${BASE}/budget-planner.png`,
  },
} as const;

/** Merge screenshot src paths into documentation JSON at runtime. */
export function applyDevToolScreenshots<T extends { overview?: { heroImage?: string }; modules: { id: string; screenshots: { id: string; src: string }[] }[] }>(
  data: T,
): T {
  const s = DEV_TOOL_SCREENSHOTS;

  const srcByModuleShot: Record<string, Record<string, string>> = {
    dashboard: {
      "dash-overview": s.dashboard.overview,
      "dash-charts": s.dashboard.charts,
      "dash-recent": s.dashboard.recentActivity,
    },
    projects: {
      "proj-list": s.projects.list,
      "proj-detail": s.projects.details,
      "proj-payments": s.projects.paymentsNotes,
    },
    credentials: {
      "cred-grid": s.credentials.grid,
      "cred-modal": s.credentials.viewModal,
    },
    resume: {
      "resume-list": s.resume.editor,
      "resume-editor": s.resume.editor,
      "resume-preview": s.resume.editor,
    },
    "dev-utilities": {
      "util-hub": s.devUtilities.hub,
      "util-tool": s.devUtilities.qrGenerator,
    },
    playground: {
      "play-ide": s.playground.javascript,
      "play-console": s.playground.typescript,
    },
    "finance-hub": {
      "fin-overview": s.finance.overview,
      "fin-timeline": s.finance.paymentTimeline,
      "fin-emi": s.finance.emiList,
      "fin-emi-detail": s.finance.emiDetail,
      "fin-rent": s.finance.rentList,
      "fin-rent-detail": s.finance.rentDetail,
      "fin-mark-paid": s.finance.markPaidModal,
      "fin-subscriptions": s.finance.subscriptionsList,
      "fin-subscription-detail": s.finance.subscriptionDetail,
    },
    "budget-planner": {
      "budget-main": s.budget.planner,
    },
  };

  return {
    ...data,
    overview: data.overview
      ? { ...data.overview, heroImage: s.login }
      : data.overview,
    modules: data.modules.map((mod) => ({
      ...mod,
      screenshots: mod.screenshots.map((shot) => ({
        ...shot,
        src: srcByModuleShot[mod.id]?.[shot.id] ?? shot.src,
      })),
    })),
  };
}
