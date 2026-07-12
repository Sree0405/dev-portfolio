import PDFDocument from "pdfkit";
import type { DataType } from "../../../auth/config.js";
import { getFinanceBranding, FINANCE_PDF } from "../config.js";
import type { FinanceReportTemplateInput } from "../types.js";
import { FinanceLayoutContext } from "./context.js";
import {
  drawFinanceReportHeader,
  drawFinancialSummaryCard,
  drawRecordDetailCard,
  drawReportInformation,
} from "./FinanceReportHeader.js";
import { drawFinancePaymentsTable } from "./FinancePaymentsTable.js";
import { drawFinanceTimeline } from "./FinanceTimeline.js";
import {
  drawFinanceFooter,
  drawFinanceMonthlyBreakdown,
  drawFinancePageNumbers,
  drawFinanceSummarySection,
} from "./FinanceSummarySections.js";

/**
 * FinanceReportTemplate — single reusable PDF engine for all Finance modules.
 * Content varies per report; layout and styling remain identical.
 */
export function renderFinanceReportTemplate(
  data: FinanceReportTemplateInput,
  dataType: DataType,
): Promise<Buffer> {
  const branding = getFinanceBranding(dataType);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: FINANCE_PDF.margin,
        bottom: FINANCE_PDF.margin + 28,
        left: FINANCE_PDF.margin,
        right: FINANCE_PDF.margin,
      },
      bufferPages: true,
      info: {
        Title: data.title,
        Author: branding.companyName,
        Subject: `${data.module} Finance Report`,
        Creator: branding.companyName,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const ctx = new FinanceLayoutContext(doc, branding);
    ctx.drawWatermark();

    drawFinanceReportHeader(ctx, data);

    ctx.drawSectionHeader("Report Information", "📄");
    drawReportInformation(ctx, data);

    ctx.drawSectionHeader("Financial Summary", "💰");
    drawFinancialSummaryCard(ctx, data);

    if (data.detailInfo) {
      ctx.drawSectionHeader("Record Details", "📝");
      drawRecordDetailCard(ctx, data.detailInfo, data.module);
    }

    ctx.drawSectionHeader("Payment History", "📅");
    drawFinancePaymentsTable(ctx, data.rows);

    ctx.drawSectionHeader("Payment Timeline", "📊");
    drawFinanceTimeline(ctx, data.rows);

    ctx.drawSectionHeader("Statistics", "📊");
    drawFinanceSummarySection(ctx, data.summary);

    if (data.summary.monthlyBreakdown && data.summary.monthlyBreakdown.length > 1) {
      ctx.drawSectionHeader("Monthly Breakdown", "📊");
      drawFinanceMonthlyBreakdown(ctx, data.summary.monthlyBreakdown);
    }

    drawFinanceFooter(ctx, data.generatedDate);

    const pageRange = doc.bufferedPageRange();
    const totalPages = pageRange.count;
    if (totalPages >= 1) {
      drawFinancePageNumbers(ctx, totalPages);
    }

    doc.end();
  });
}

// Backward-compatible export name used by services
export { renderFinanceReportTemplate as renderFinancePdf };
