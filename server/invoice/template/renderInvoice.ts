import PDFDocument from "pdfkit";
import { getInvoiceBranding, INVOICE_PDF } from "../config.js";
import type { DataType } from "../../auth/config.js";
import type { InvoiceData } from "../types.js";
import { InvoiceLayoutContext } from "./context.js";
import { drawInvoiceHeader } from "./InvoiceHeader.js";
import { drawInvoiceClientCard } from "./InvoiceClientCard.js";
import { drawInvoiceProjectCard } from "./InvoiceProjectCard.js";
import { drawInvoiceProjectLinks } from "./InvoiceProjectLinks.js";
import { drawInvoiceFinancialSummary } from "./InvoiceFinancialSummary.js";
import { drawInvoicePaymentsTable } from "./InvoicePaymentsTable.js";
import { drawInvoiceNotes } from "./InvoiceNotes.js";
import { drawInvoiceSummary } from "./InvoiceSummary.js";
import { drawInvoiceFooter, drawPageNumbers } from "./InvoiceFooter.js";

export function renderInvoicePdf(data: InvoiceData, dataType: DataType): Promise<Buffer> {
  const branding = getInvoiceBranding(dataType);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: INVOICE_PDF.margin,
        bottom: INVOICE_PDF.margin + 24,
        left: INVOICE_PDF.margin,
        right: INVOICE_PDF.margin,
      },
      bufferPages: true,
      info: {
        Title: `Invoice ${data.invoiceNumber}`,
        Author: branding.companyName,
        Subject: `Project Invoice - ${data.project.name}`,
        Creator: branding.companyName,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const ctx = new InvoiceLayoutContext(doc, branding);
    ctx.drawWatermark();

    drawInvoiceHeader(ctx, data);

    ctx.drawSectionHeader("Client Information");
    drawInvoiceClientCard(ctx, data);

    ctx.drawSectionHeader("Project Summary");
    drawInvoiceProjectCard(ctx, data);
    drawInvoiceProjectLinks(ctx, data);

    ctx.drawSectionHeader("Financial Summary");
    drawInvoiceFinancialSummary(ctx, data);

    ctx.drawSectionHeader("Payment History");
    drawInvoicePaymentsTable(ctx, data);

    ctx.drawSectionHeader("Project Notes");
    drawInvoiceNotes(ctx, data);

    ctx.drawSectionHeader("Invoice Summary");
    drawInvoiceSummary(ctx, data);

    drawInvoiceFooter(ctx, data.generatedDate);

    const pageRange = doc.bufferedPageRange();
    const totalPages = pageRange.count;
    if (totalPages > 1) {
      drawPageNumbers(ctx, totalPages);
    }

    doc.end();
  });
}
