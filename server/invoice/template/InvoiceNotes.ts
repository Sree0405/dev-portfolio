import { formatInvoiceDate, formatInvoiceTime } from "../format.js";
import { INVOICE_PDF } from "../config.js";
import type { InvoiceData } from "../types.js";
import type { InvoiceLayoutContext } from "./context.js";

export function drawInvoiceNotes(ctx: InvoiceLayoutContext, data: InvoiceData): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const padding = INVOICE_PDF.cardPadding;

  if (data.notes.length === 0) {
    ctx.ensureSpace(40);
    const emptyY = doc.y;
    ctx.drawCard(margin, emptyY, contentWidth, 36);
    doc.font("Helvetica").fontSize(9).fillColor(colors.muted);
    doc.text("No project notes available.", margin + padding, emptyY + 12);
    doc.y = emptyY + 36 + ctx.sectionGap;
    return;
  }

  data.notes.forEach((note) => {
    const headerText = `${formatInvoiceDate(note.createdAt)}  ·  ${formatInvoiceTime(note.createdAt)}`;
    const contentHeight = ctx.measureWrappedText(note.content, contentWidth - padding * 2, 9.5);
    const cardHeight = padding * 2 + 16 + contentHeight + 12;

    ctx.ensureSpace(cardHeight + 8);
    const y = doc.y;

    ctx.drawCard(margin, y, contentWidth, cardHeight);

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.textSecondary);
    doc.text(headerText, margin + padding, y + padding);

    const dividerY = y + padding + 16;
    doc
      .moveTo(margin + padding, dividerY)
      .lineTo(margin + contentWidth - padding, dividerY)
      .strokeColor(colors.border)
      .lineWidth(0.5)
      .stroke();

    ctx.drawWrappedText(note.content, margin + padding, dividerY + 8, contentWidth - padding * 2, {
      fontSize: 9.5,
      color: colors.text,
      lineGap: 3,
    });

    doc.y = y + cardHeight + 10;
  });

  doc.y += ctx.sectionGap - 10;
}
