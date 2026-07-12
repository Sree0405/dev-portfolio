import fs from "fs";
import { getInvoiceLogoPath } from "../../../invoice/assets.js";
import { FINANCE_PDF, FINANCE_STATUS_STYLES } from "../config.js";
import type { FinanceLayoutContext } from "./context.js";
import type { FinanceReportTemplateInput } from "../types.js";

export function drawStatusBadge(
  ctx: FinanceLayoutContext,
  status: string,
  x: number,
  y: number,
  maxWidth = 96,
): number {
  const { doc } = ctx;
  const style = FINANCE_STATUS_STYLES[status] ?? FINANCE_STATUS_STYLES.Pending;
  const label = style.label;
  const badgeHeight = 20;
  const badgeWidth = Math.min(maxWidth, 88);

  doc.roundedRect(x, y, badgeWidth, badgeHeight, 10).fill(style.bg);

  doc.circle(x + 10, y + badgeHeight / 2, 3).fill(style.dot);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(style.text)
    .text(label, x + 16, y + 5, { width: badgeWidth - 20 });

  return badgeHeight;
}

export function drawFinanceReportHeader(
  ctx: FinanceLayoutContext,
  data: FinanceReportTemplateInput,
): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const startY = margin;
  const heroHeight = FINANCE_PDF.heroHeight;
  const leftWidth = contentWidth * 0.52;
  const rightWidth = contentWidth * 0.42;
  const rightX = margin + contentWidth - rightWidth;

  ctx.drawCard(margin, startY, contentWidth, heroHeight, {
    fill: colors.heroBg,
    stroke: colors.border,
  });

  let leftY = startY + 16;
  const logoPath = getInvoiceLogoPath();

  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, margin + 16, leftY, { height: FINANCE_PDF.logoHeight });
      leftY += FINANCE_PDF.logoHeight + 8;
    } catch {
      leftY = startY + 16;
    }
  } else {
    leftY = startY + 16;
  }

  doc.font("Helvetica-Bold").fontSize(20).fillColor(colors.text);
  doc.text(ctx.branding.companyName, margin + 16, leftY, { width: leftWidth });
  leftY = doc.y + 2;

  doc.font("Helvetica-Bold").fontSize(13).fillColor(colors.accent);
  doc.text("Finance Report", margin + 16, leftY, { width: leftWidth });
  leftY = doc.y + 2;

  doc.font("Helvetica").fontSize(10).fillColor(colors.textSecondary);
  doc.text(ctx.branding.dashboardTagline, margin + 16, leftY, { width: leftWidth });
  leftY = doc.y + 4;

  ctx.drawLink(
    ctx.branding.website,
    ctx.branding.websiteDisplay,
    margin + 16,
    leftY,
    leftWidth,
  );

  let rightY = startY + 16;
  const metaFields: [string, string][] = [
    ["Report ID", data.reportId],
    ["Generated Date", data.generatedDate],
    ["Generated Time", data.generatedTime],
    ["Module", data.module],
    ["Selected Period", data.periodLabel],
  ];

  metaFields.forEach(([label, value]) => {
    doc.font("Helvetica").fontSize(8).fillColor(colors.muted);
    doc.text(label, rightX, rightY, { width: rightWidth, align: "right" });
    const labelH = doc.heightOfString(label, { width: rightWidth });
    doc
      .font("Helvetica-Bold")
      .fontSize(value.length > 28 ? 8.5 : 10)
      .fillColor(colors.text)
      .text(value, rightX, rightY + labelH + 2, { width: rightWidth, align: "right" });
    rightY += labelH + 2 + doc.heightOfString(value, { width: rightWidth }) + 6;
  });

  doc.y = startY + heroHeight + ctx.sectionGap;
}

export function drawReportInformation(ctx: FinanceLayoutContext, data: FinanceReportTemplateInput): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const cardHeight = 72;
  const padding = FINANCE_PDF.cardPadding;

  ctx.ensureSpace(cardHeight + 8);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight);

  doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.muted);
  doc.text("REPORT TITLE", margin + padding, y + 14, { characterSpacing: 0.6 });
  doc.font("Helvetica-Bold").fontSize(14).fillColor(colors.text);
  doc.text(data.title, margin + padding, y + 28, { width: contentWidth - padding * 2 });

  const colWidth = (contentWidth - padding * 2) / 2;
  const rowY = y + 48;
  doc.font("Helvetica").fontSize(9).fillColor(colors.muted);
  doc.text("Period Range", margin + padding, rowY, { width: colWidth });
  doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.text);
  doc.text(`${data.from}  →  ${data.to}`, margin + padding, rowY + 12, { width: colWidth });

  doc.font("Helvetica").fontSize(9).fillColor(colors.muted);
  doc.text("Report Type", margin + padding + colWidth, rowY, { width: colWidth, align: "right" });
  doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.text);
  doc.text(data.detailInfo ? "Record Detail Report" : "Module Report", margin + padding, rowY + 12, {
    width: contentWidth - padding * 2,
    align: "right",
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}

export function drawFinancialSummaryCard(
  ctx: FinanceLayoutContext,
  data: FinanceReportTemplateInput,
): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const cardHeight = 88;
  const padding = FINANCE_PDF.cardPadding;

  ctx.ensureSpace(cardHeight + 8);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight, {
    fill: colors.accentLight,
    stroke: "#BFDBFE",
  });

  const colWidth = (contentWidth - padding * 2) / 4;
  const items = data.detailInfo
    ? [
        { label: "Monthly Amount", value: data.detailInfo.amount },
        { label: "Total Paid", value: data.detailInfo.totalPaid },
        { label: "Remaining", value: data.detailInfo.totalRemaining },
        { label: "Current Status", value: null, status: data.detailInfo.status },
      ]
    : [
        { label: "Total Records", value: data.summary.totalRecords, isCount: true },
        { label: "Total Paid", value: data.summary.totalPaid },
        { label: "Pending", value: data.summary.pendingPayments, isCount: true },
        { label: "Average", value: data.summary.averagePayment },
      ];

  items.forEach((item, index) => {
    const x = margin + padding + index * colWidth;
    doc.font("Helvetica").fontSize(8).fillColor(colors.muted);
    doc.text(item.label.toUpperCase(), x, y + 18, { width: colWidth - 6, characterSpacing: 0.5 });

    if ("status" in item && item.status) {
      drawStatusBadge(ctx, item.status, x, y + 38, colWidth - 8);
      return;
    }

    const display =
      "isCount" in item && item.isCount
        ? String(item.value)
        : typeof item.value === "number"
          ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.value)
          : String(item.value);

    doc
      .font("Helvetica-Bold")
      .fontSize(index === 3 && !data.detailInfo ? 12 : 14)
      .fillColor(colors.text)
      .text(display, x, y + 38, { width: colWidth - 6 });
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}

export function drawRecordDetailCard(
  ctx: FinanceLayoutContext,
  detail: NonNullable<FinanceReportTemplateInput["detailInfo"]>,
  module: string,
): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const padding = FINANCE_PDF.cardPadding;
  const colWidth = (contentWidth - padding * 2 - 12) / 2;
  const col1X = margin + padding;
  const col2X = margin + padding + colWidth + 12;

  const gridFields: [string, string][] = [
    ["Name", detail.name],
    [
      "Monthly Amount",
      new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(detail.amount),
    ],
    ["Due Day", detail.dueDay ? String(detail.dueDay) : "—"],
    ["Due Date", detail.dueDate ?? "—"],
    ["Category", detail.category ?? module],
    ["Created Date", detail.createdAt ?? "—"],
    ["Last Updated", detail.updatedAt ?? "—"],
  ];

  const notesHeight = detail.notes ? ctx.measureWrappedText(detail.notes, contentWidth - padding * 2) + 28 : 0;
  const cardHeight = 40 + Math.ceil(gridFields.length / 2) * 40 + notesHeight;

  ctx.ensureSpace(cardHeight + 8);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight);

  doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.text);
  doc.text(`${module} Information`, margin + padding, y + 14, { width: contentWidth - padding * 2 });

  let fieldY = y + 36;
  gridFields.forEach(([label, value], index) => {
    const x = index % 2 === 0 ? col1X : col2X;
    if (index > 0 && index % 2 === 0) fieldY += 40;
    ctx.drawFieldBlock(x, fieldY, colWidth, label, value, { bold: label === "Name" });
  });

  fieldY += 40;
  doc.font("Helvetica").fontSize(9).fillColor(colors.muted);
  doc.text("Status", col1X, fieldY, { width: colWidth });
  drawStatusBadge(ctx, detail.status, col1X, fieldY + 14, colWidth);

  if (detail.notes) {
    fieldY += 40;
    doc.font("Helvetica").fontSize(9).fillColor(colors.muted);
    doc.text("Notes", col1X, fieldY, { width: contentWidth - padding * 2 });
    doc.font("Helvetica").fontSize(10).fillColor(colors.textSecondary);
    doc.text(detail.notes, col1X, fieldY + 14, {
      width: contentWidth - padding * 2,
      lineGap: 3,
    });
  }

  doc.y = y + cardHeight + ctx.sectionGap;
}
