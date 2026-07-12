import { INVOICE_PDF } from "../config.js";
import type { InvoiceData } from "../types.js";
import type { InvoiceLayoutContext } from "./context.js";

export function drawInvoiceClientCard(ctx: InvoiceLayoutContext, data: InvoiceData): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const cardWidth = (contentWidth - 14) / 2;
  const cardX = margin;
  const cardY = doc.y;
  const padding = INVOICE_PDF.cardPadding;

  const clientLines = [
    data.project.clientName,
    data.project.clientNumber ? `Phone: ${data.project.clientNumber}` : null,
    `Project: ${data.project.name}`,
    `Type: ${data.project.projectType}`,
    `Status: ${data.project.status}`,
  ].filter(Boolean) as string[];

  const fromLines = [
    ctx.branding.companyName,
    ctx.branding.email ? `Email: ${ctx.branding.email}` : null,
    ctx.branding.phone ? `Phone: ${ctx.branding.phone}` : null,
    ctx.branding.location ? ctx.branding.location : null,
  ].filter(Boolean) as string[];

  let clientContentH = padding + 14;
  clientLines.forEach((line) => {
    clientContentH += ctx.measureWrappedText(line, cardWidth - padding * 2, 10) + 6;
  });

  let fromContentH = padding + 14;
  fromLines.forEach((line) => {
    fromContentH += ctx.measureWrappedText(line, cardWidth - padding * 2, 9) + 6;
  });

  const cardHeight = Math.max(clientContentH, fromContentH) + padding;

  ctx.ensureSpace(cardHeight + 10);
  const y = doc.y;

  ctx.drawCard(cardX, y, cardWidth, cardHeight);
  ctx.drawCardTitle(cardX + padding, y + padding, "Bill To");

  let textY = y + padding + 16;
  clientLines.forEach((line, index) => {
    const font = index === 0 ? "Helvetica-Bold" : "Helvetica";
    const size = index === 0 ? 11 : 9.5;
    const h = ctx.drawWrappedText(line, cardX + padding, textY, cardWidth - padding * 2, {
      font,
      fontSize: size,
      color: index === 0 ? colors.text : colors.textSecondary,
      lineGap: 2,
    });
    textY += h + 6;
  });

  const fromX = margin + cardWidth + 14;

  ctx.drawCard(fromX, y, cardWidth, cardHeight);
  ctx.drawCardTitle(fromX + padding, y + padding, "From");

  textY = y + padding + 16;
  fromLines.forEach((line, index) => {
    const font = index === 0 ? "Helvetica-Bold" : "Helvetica";
    const size = index === 0 ? 11 : 9;
    const h = ctx.drawWrappedText(line, fromX + padding, textY, cardWidth - padding * 2, {
      font,
      fontSize: size,
      color: index === 0 ? colors.text : colors.textSecondary,
      lineGap: 2,
    });
    textY += h + 6;
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}
