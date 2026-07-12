import { formatFinanceCurrency } from "../format.js";
import type { FinanceLayoutContext } from "./context.js";
import { drawStatusBadge } from "./FinanceReportHeader.js";
import type { FinanceReportRow } from "../types.js";

export function drawFinanceTimeline(ctx: FinanceLayoutContext, rows: FinanceReportRow[]): void {
  if (rows.length === 0) return;

  const { doc, margin, contentWidth, colors } = ctx;
  const sorted = [...rows].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return da - db;
  });

  const itemHeight = 52;
  const totalHeight = sorted.length * itemHeight + 16;

  ctx.ensureSpace(Math.min(totalHeight, 220));

  const cardY = doc.y;
  const cardHeight = Math.min(totalHeight, sorted.length * itemHeight + 24);

  ctx.drawCard(margin, cardY, contentWidth, cardHeight);

  let y = cardY + 16;
  const lineX = margin + 28;

  sorted.forEach((row, index) => {
    if (y + itemHeight > cardY + cardHeight - 8) {
      return;
    }

    const label = row.periodLabel ?? row.date;
    const isPaid = row.status === "Paid";

    doc.circle(lineX, y + 8, 4).fill(isPaid ? colors.success : colors.warning);

    doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.text);
    doc.text(label, margin + 44, y, { width: contentWidth - 60 });

    doc.font("Helvetica").fontSize(9).fillColor(colors.muted);
    doc.text(isPaid ? formatFinanceCurrency(row.amount) : row.status, margin + 44, y + 14, {
      width: contentWidth - 120,
    });

    drawStatusBadge(ctx, row.status, margin + contentWidth - 108, y + 2, 88);

    if (index < sorted.length - 1) {
      doc
        .moveTo(lineX, y + 16)
        .lineTo(lineX, y + itemHeight - 4)
        .strokeColor(colors.border)
        .lineWidth(1)
        .stroke();
    }

    y += itemHeight;
  });

  doc.y = cardY + cardHeight + ctx.sectionGap;
}
