import { formatInvoiceCurrency, formatInvoiceDate } from "../format.js";
import { INVOICE_PDF } from "../config.js";
import type { InvoiceData } from "../types.js";
import type { InvoiceLayoutContext } from "./context.js";

export function drawInvoiceProjectCard(ctx: InvoiceLayoutContext, data: InvoiceData): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const padding = INVOICE_PDF.cardPadding;
  const colWidth = (contentWidth - padding * 2 - 12) / 2;

  const leftFields: [string, string][] = [
    ["Project Name", data.project.name],
    ["Project Type", data.project.projectType],
    ["Status", data.project.status],
    ["Planned Amount", formatInvoiceCurrency(data.project.plannedAmount)],
  ];

  const rightFields: [string, string][] = [
    ["Total Paid", formatInvoiceCurrency(data.project.totalPaid)],
    ["Remaining Amount", formatInvoiceCurrency(data.project.remainingAmount)],
    ["Created", formatInvoiceDate(data.project.createdAt)],
    ["Last Updated", formatInvoiceDate(data.project.updatedAt)],
  ];

  let maxColHeight = 0;
  leftFields.forEach(([label, value]) => {
    const h =
      doc.heightOfString(label, { width: colWidth }) +
      4 +
      doc.heightOfString(value, { width: colWidth, lineGap: 2 });
    maxColHeight = Math.max(maxColHeight, h + 10);
  });

  const rows = Math.max(leftFields.length, rightFields.length);
  const cardHeight = padding * 2 + 16 + rows * 34;

  ctx.ensureSpace(cardHeight + 10);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight);
  ctx.drawCardTitle(margin + padding, y + padding, "Project Summary");

  const contentY = y + padding + 18;
  leftFields.forEach(([label, value], index) => {
    const fieldY = contentY + index * 34;
    ctx.drawFieldBlock(margin + padding, fieldY, colWidth, label, value, {
      bold: label === "Project Name" || label === "Remaining Amount",
      color: label === "Remaining Amount" ? colors.remaining : colors.text,
    });
  });

  rightFields.forEach(([label, value], index) => {
    const fieldY = contentY + index * 34;
    ctx.drawFieldBlock(margin + padding + colWidth + 12, fieldY, colWidth, label, value, {
      bold: label === "Remaining Amount",
      color: label === "Remaining Amount" ? colors.remaining : colors.text,
      fontSize: label === "Remaining Amount" ? 11 : 10,
    });
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}
