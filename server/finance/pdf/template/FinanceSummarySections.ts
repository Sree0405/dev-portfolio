import { formatFinanceCurrency } from "../format.js";
import { FINANCE_PDF } from "../config.js";
import type { FinanceLayoutContext } from "./context.js";
import type { FinanceReportSummary } from "../types.js";

export function drawFinanceSummarySection(
  ctx: FinanceLayoutContext,
  summary: FinanceReportSummary,
): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const padding = FINANCE_PDF.cardPadding;
  const cardHeight = 96;

  ctx.ensureSpace(cardHeight + 8);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight);

  const colWidth = (contentWidth - padding * 2) / 3;
  const items = [
    { label: "Total Records", value: String(summary.totalRecords) },
    { label: "Total Paid", value: formatFinanceCurrency(summary.totalPaid) },
    { label: "Pending Payments", value: String(summary.pendingPayments) },
    { label: "Average Payment", value: formatFinanceCurrency(summary.averagePayment) },
    { label: "Highest Payment", value: formatFinanceCurrency(summary.highestPayment) },
    { label: "Lowest Payment", value: formatFinanceCurrency(summary.lowestPayment) },
  ];

  items.forEach((item, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = margin + padding + col * colWidth;
    const itemY = y + 16 + row * 38;

    doc.font("Helvetica").fontSize(8).fillColor(colors.muted);
    doc.text(item.label.toUpperCase(), x, itemY, { width: colWidth - 8, characterSpacing: 0.4 });

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(colors.text)
      .text(item.value, x, itemY + 14, { width: colWidth - 8 });
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}

export function drawFinanceMonthlyBreakdown(
  ctx: FinanceLayoutContext,
  breakdown: { label: string; amount: number }[],
): void {
  if (breakdown.length <= 1) return;

  const { doc, margin, contentWidth, colors } = ctx;
  const rowHeight = 28;
  const cardHeight = 36 + breakdown.length * rowHeight + 40;

  ctx.ensureSpace(cardHeight + 8);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight);

  let rowY = y + 16;
  let grandTotal = 0;

  breakdown.forEach((item) => {
    doc.font("Helvetica").fontSize(10).fillColor(colors.textSecondary);
    doc.text(item.label, margin + 16, rowY, { width: contentWidth * 0.5 });

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(colors.text)
      .text(formatFinanceCurrency(item.amount), margin + 16, rowY, {
        width: contentWidth - 32,
        align: "right",
      });

    grandTotal += item.amount;
    rowY += rowHeight;
  });

  doc
    .moveTo(margin + 16, rowY + 4)
    .lineTo(margin + contentWidth - 16, rowY + 4)
    .strokeColor(colors.border)
    .lineWidth(0.75)
    .stroke();

  rowY += 14;
  doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.accent);
  doc.text("Grand Total", margin + 16, rowY, { width: contentWidth * 0.5 });
  doc.text(formatFinanceCurrency(grandTotal), margin + 16, rowY, {
    width: contentWidth - 32,
    align: "right",
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}

export function drawFinanceFooter(ctx: FinanceLayoutContext, generatedDate: string): void {
  const { doc, margin, contentWidth, colors } = ctx;

  ctx.ensureSpace(100);
  const y = doc.y + 12;

  doc
    .moveTo(margin, y)
    .lineTo(margin + contentWidth, y)
    .strokeColor(colors.border)
    .lineWidth(0.75)
    .stroke();

  let textY = y + 18;

  doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.textSecondary);
  doc.text(ctx.branding.footerThankYou, margin, textY, { width: contentWidth, align: "center" });
  textY = doc.y + 6;

  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.text);
  doc.text(ctx.branding.footerSubtitle, margin, textY, { width: contentWidth, align: "center" });
  textY = doc.y + 6;

  doc.font("Helvetica").fontSize(8.5).fillColor(colors.muted);
  doc.text(ctx.branding.footerSystemLine, margin, textY, {
    width: contentWidth,
    align: "center",
    lineGap: 2,
  });
  textY = doc.y + 10;

  doc.font("Helvetica").fontSize(9).fillColor(colors.accent);
  doc.text(ctx.branding.websiteDisplay, margin, textY, {
    width: contentWidth,
    align: "center",
    link: ctx.branding.website,
    underline: true,
  });
  textY = doc.y + 10;

  doc.font("Helvetica").fontSize(8).fillColor(colors.footer);
  doc.text(`Generated automatically on ${generatedDate}`, margin, textY, {
    width: contentWidth,
    align: "center",
  });

  doc.y = textY + 24;
}

export function drawFinancePageNumbers(ctx: FinanceLayoutContext, totalPages: number): void {
  const { doc, margin, contentWidth, colors } = ctx;

  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    const pageLabel = `Page ${i + 1} of ${totalPages}`;
    doc.font("Helvetica").fontSize(8).fillColor(colors.footer);
    doc.text(pageLabel, margin, FINANCE_PDF.page.height - 36, {
      width: contentWidth,
      align: "center",
    });
  }
}
