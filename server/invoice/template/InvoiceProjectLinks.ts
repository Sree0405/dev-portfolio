import { ensureUrl } from "../../lib/projectLinks.js";
import { INVOICE_PDF } from "../config.js";
import type { InvoiceData } from "../types.js";
import type { InvoiceLayoutContext } from "./context.js";

export function drawInvoiceProjectLinks(ctx: InvoiceLayoutContext, data: InvoiceData): void {
  const links = data.project.projectLinks;
  if (!links.length) return;

  const { doc, margin, contentWidth, colors } = ctx;
  const padding = INVOICE_PDF.cardPadding;

  let contentHeight = padding + 14;
  links.forEach((link) => {
    contentHeight += ctx.measureWrappedText(link, contentWidth - padding * 2, 9) + 8;
  });
  const cardHeight = contentHeight + padding;

  ctx.ensureSpace(cardHeight + 10);
  const y = doc.y;

  ctx.drawCard(margin, y, contentWidth, cardHeight);
  ctx.drawCardTitle(margin + padding, y + padding, "Project Links");

  let linkY = y + padding + 18;
  links.forEach((link) => {
    const url = ensureUrl(link);
    doc.font("Helvetica").fontSize(9).fillColor(colors.accent);
    const label = `• ${link}`;
    const height = doc.heightOfString(label, { width: contentWidth - padding * 2, lineGap: 2 });
    doc.text(label, margin + padding, linkY, {
      width: contentWidth - padding * 2,
      link: url,
      underline: true,
      lineGap: 2,
    });
    linkY += height + 8;
  });

  doc.y = y + cardHeight + ctx.sectionGap;
}
