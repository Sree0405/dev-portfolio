import { formatInvoiceCurrency } from "../format.js";
import { INVOICE_PDF } from "../config.js";
import type { InvoiceData } from "../types.js";
import type { InvoiceLayoutContext } from "./context.js";

export function drawInvoiceFinancialSummary(ctx: InvoiceLayoutContext, data: InvoiceData): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const cardHeight = 88;
  const padding = INVOICE_PDF.cardPadding;

  ctx.ensureSpace(cardHeight + 10);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight, {
    fill: colors.accentLight,
    stroke: "#BFDBFE",
  });

  const colWidth = (contentWidth - padding * 2) / 3;
  const items = [
    { label: "Total Planned", value: formatInvoiceCurrency(data.project.plannedAmount), accent: false },
    { label: "Total Paid", value: formatInvoiceCurrency(data.project.totalPaid), accent: false },
    {
      label: "Remaining Amount",
      value: formatInvoiceCurrency(data.project.remainingAmount),
      accent: true,
    },
  ];

  items.forEach((item, index) => {
    const x = margin + padding + index * colWidth;
    doc.font("Helvetica").fontSize(8).fillColor(colors.muted);
    doc.text(item.label.toUpperCase(), x, y + 20, { width: colWidth - 8, characterSpacing: 0.6 });

    doc
      .font("Helvetica-Bold")
      .fontSize(item.accent ? 16 : 14)
      .fillColor(item.accent ? colors.remaining : colors.text)
      .text(item.value, x, y + 38, { width: colWidth - 8 });
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}
