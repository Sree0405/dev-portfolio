import { formatInvoiceCurrency } from "../format.js";
import { INVOICE_PDF } from "../config.js";
import type { InvoiceData } from "../types.js";
import type { InvoiceLayoutContext } from "./context.js";

export function drawInvoiceSummary(ctx: InvoiceLayoutContext, data: InvoiceData): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const padding = INVOICE_PDF.cardPadding;
  const cardHeight = 112;

  ctx.ensureSpace(cardHeight + 10);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight, {
    fill: colors.remainingBg,
    stroke: "#BFDBFE",
  });

  ctx.drawCardTitle(margin + padding, y + padding, "Invoice Summary");

  const rows: { label: string; value: string; highlight?: boolean }[] = [
    { label: "Project Cost", value: formatInvoiceCurrency(data.project.plannedAmount) },
    { label: "Amount Paid", value: formatInvoiceCurrency(data.project.totalPaid) },
    {
      label: "Remaining Amount",
      value: formatInvoiceCurrency(data.project.remainingAmount),
      highlight: true,
    },
  ];

  rows.forEach((row, index) => {
    const rowY = y + padding + 22 + index * 28;

    doc.font("Helvetica").fontSize(10).fillColor(colors.textSecondary);
    doc.text(row.label, margin + padding, rowY);

    doc
      .font(row.highlight ? "Helvetica-Bold" : "Helvetica-Bold")
      .fontSize(row.highlight ? 14 : 11)
      .fillColor(row.highlight ? colors.remaining : colors.text)
      .text(row.value, margin + padding, rowY, {
        width: contentWidth - padding * 2,
        align: "right",
      });

    if (index < rows.length - 1) {
      doc
        .moveTo(margin + padding, rowY + 20)
        .lineTo(margin + contentWidth - padding, rowY + 20)
        .strokeColor(colors.border)
        .lineWidth(0.5)
        .stroke();
    }
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}
