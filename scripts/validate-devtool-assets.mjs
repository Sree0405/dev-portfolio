import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const devtoolDir = path.join(root, "public", "devtool");

const REQUIRED = [
  "login-page.png",
  "dashboard-overview.png",
  "dashboard-charts.png",
  "dashboard-recent-activity.png",
  "projects-list.png",
  "project-details.png",
  "project-payments-notes.png",
  "credentials-grid.png",
  "credentials-view-modal.png",
  "resume-latex-editor.png",
  "dev-utilities-hub.png",
  "dev-utilities-qr-generator.png",
  "playground-javascript.png",
  "playground-typescript.png",
  "finance-overview.png",
  "finance-payment-timeline.png",
  "finance-emi-list.png",
  "finance-emi-detail.png",
  "finance-rent-list.png",
  "finance-rent-detail.png",
  "finance-mark-paid-modal.png",
  "finance-subscriptions-list.png",
  "finance-subscription-detail.png",
  "budget-planner.png",
];

if (!fs.existsSync(devtoolDir)) {
  console.error(`Missing folder: public/devtool (URLs use lowercase /devtool/)`);
  process.exit(1);
}

const missing = REQUIRED.filter((file) => !fs.existsSync(path.join(devtoolDir, file)));

if (missing.length > 0) {
  console.error("Missing devtool screenshots:\n" + missing.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}

console.log(`OK: ${REQUIRED.length} devtool screenshots present at public/devtool/`);
