import fs from "fs";
import { INVOICE_PDF } from "../config.js";
import { getInvoiceLogoPath } from "../assets.js";
import type { InvoiceData } from "../types.js";
import type { InvoiceLayoutContext } from "./context.js";

function drawStatusBadge(
  ctx: InvoiceLayoutContext,
  status: InvoiceData["paymentStatus"],
  x: number,
  y: number,
): number {
  const { doc, colors } = ctx;
  const isPaid = status === "Paid";
  const textColor = isPaid ? colors.paid : colors.partial;
  const bgColor = isPaid ? colors.paidBg : colors.partialBg;
  const label = status.toUpperCase();
  const badgeWidth = 108;
  const badgeHeight = 22;

  doc.roundedRect(x, y, badgeWidth, badgeHeight, 11).fill(bgColor);
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(textColor)
    .text(label, x, y + 6, { width: badgeWidth, align: "center", characterSpacing: 0.5 });

  return badgeHeight;
}

export function drawInvoiceHeader(ctx: InvoiceLayoutContext, data: InvoiceData): number {
  const { doc, margin, contentWidth, colors } = ctx;
  const startY = margin;
  const leftWidth = contentWidth * 0.55;
  const rightWidth = contentWidth * 0.4;
  const rightX = margin + contentWidth - rightWidth;

  let leftY = startY;
  const logoPath = getInvoiceLogoPath();

  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, margin, leftY, { height: INVOICE_PDF.logoHeight });
      leftY += INVOICE_PDF.logoHeight + 10;
    } catch {
      leftY = startY;
    }
  }

  doc.font("Helvetica-Bold").fontSize(20).fillColor(colors.text);
  doc.text(ctx.branding.companyName, margin, leftY, { width: leftWidth });
  leftY = doc.y + 4;

  doc.font("Helvetica").fontSize(10).fillColor(colors.textSecondary);
  doc.text(ctx.branding.tagline, margin, leftY, { width: leftWidth, lineGap: 2 });
  leftY = doc.y + 6;

  ctx.drawLink(ctx.branding.website, ctx.branding.websiteDisplay, margin, leftY, leftWidth);
  leftY = doc.y + 4;

  let rightY = startY;
  const metaFields: [string, string][] = [
    ["Invoice Number", data.invoiceNumber],
    ["Invoice Date", data.invoiceDate],
    ["Generated Date", data.generatedDate],
  ];

  metaFields.forEach(([label, value]) => {
    doc.font("Helvetica").fontSize(8).fillColor(colors.muted);
    doc.text(label, rightX, rightY, { width: rightWidth, align: "right" });
    const labelH = doc.heightOfString(label, { width: rightWidth });
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(colors.text)
      .text(value, rightX, rightY + labelH + 3, { width: rightWidth, align: "right" });
    rightY += labelH + 3 + doc.heightOfString(value, { width: rightWidth }) + 10;
  });

  doc.font("Helvetica").fontSize(8).fillColor(colors.muted);
  doc.text("Payment Status", rightX, rightY, { width: rightWidth, align: "right" });
  rightY += 14;
  drawStatusBadge(ctx, data.paymentStatus, rightX + rightWidth - 108, rightY);
  rightY += 30;

  const headerBottom = Math.max(leftY, rightY) + 8;

  doc
    .moveTo(margin, headerBottom)
    .lineTo(margin + contentWidth, headerBottom)
    .strokeColor(colors.border)
    .lineWidth(1)
    .stroke();

  doc.y = headerBottom + ctx.sectionGap;
  return doc.y;
}
