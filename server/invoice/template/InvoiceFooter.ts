import { INVOICE_PDF } from "../config.js";
import type { InvoiceLayoutContext } from "./context.js";

export function drawInvoiceFooter(ctx: InvoiceLayoutContext, generatedDate: string): void {
  const { doc, margin, contentWidth, colors } = ctx;

  ctx.ensureSpace(90);
  const y = doc.y + 8;

  doc
    .moveTo(margin, y)
    .lineTo(margin + contentWidth, y)
    .strokeColor(colors.border)
    .lineWidth(0.75)
    .stroke();

  let textY = y + 16;

  doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.textSecondary);
  doc.text(ctx.branding.footerThankYou, margin, textY, { width: contentWidth, align: "center" });
  textY = doc.y + 8;

  doc.font("Helvetica").fontSize(8.5).fillColor(colors.footer);
  doc.text(ctx.branding.footerGeneratedFrom, margin, textY, {
    width: contentWidth,
    align: "center",
    lineGap: 2,
  });
  textY = doc.y + 8;

  doc.font("Helvetica").fontSize(9).fillColor(colors.accent);
  doc.text(ctx.branding.websiteDisplay, margin, textY, {
    width: contentWidth,
    align: "center",
    link: ctx.branding.website,
    underline: true,
  });
  textY = doc.y + 10;

  doc.font("Helvetica").fontSize(8).fillColor(colors.muted);
  doc.text(`Generated on: ${generatedDate}`, margin, textY, { width: contentWidth, align: "center" });

  doc.y = textY + 20;
}

export function drawPageNumbers(ctx: InvoiceLayoutContext, totalPages: number): void {
  const { doc, margin, contentWidth, colors } = ctx;

  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    const pageLabel = `Page ${i + 1} of ${totalPages}`;
    doc.font("Helvetica").fontSize(8).fillColor(colors.footer);
    doc.text(pageLabel, margin, INVOICE_PDF.page.height - 36, {
      width: contentWidth,
      align: "center",
    });
  }
}
