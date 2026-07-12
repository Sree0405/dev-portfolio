import { formatFinanceCurrency } from "../format.js";
import type { FinanceLayoutContext } from "./context.js";
import { drawStatusBadge } from "./FinanceReportHeader.js";
import type { FinanceReportRow } from "../types.js";

interface PaymentColumn {
  label: string;
  width: number;
  align?: "left" | "right" | "center";
}

function getColumns(contentWidth: number): PaymentColumn[] {
  return [
    { label: "Payment Date", width: 88 },
    { label: "Amount", width: 82, align: "right" },
    { label: "Status", width: 72, align: "center" },
    { label: "Reference", width: 88 },
    { label: "Notes", width: contentWidth - 330 },
  ];
}

function measureRowHeight(
  ctx: FinanceLayoutContext,
  values: string[],
  columns: PaymentColumn[],
): number {
  let maxHeight = 0;
  values.forEach((value, index) => {
    const cellWidth = columns[index].width - 14;
    const h = ctx.measureWrappedText(value, cellWidth, 10);
    maxHeight = Math.max(maxHeight, h);
  });
  return Math.max(34, maxHeight + 20);
}

export function drawFinancePaymentsTable(
  ctx: FinanceLayoutContext,
  rows: FinanceReportRow[],
): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const columns = getColumns(contentWidth);
  const headerHeight = 32;

  ctx.ensureSpace(headerHeight + 20);

  const drawTableHeader = () => {
    const headerY = doc.y;
    doc.roundedRect(margin, headerY, contentWidth, headerHeight, 6).fill(colors.tableHeaderBg);
    doc
      .roundedRect(margin, headerY, contentWidth, headerHeight, 6)
      .strokeColor(colors.border)
      .lineWidth(0.5)
      .stroke();

    let x = margin;
    columns.forEach((col) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(colors.tableHeader)
        .text(col.label.toUpperCase(), x + 8, headerY + 10, {
          width: col.width - 14,
          align: col.align ?? "left",
          characterSpacing: 0.4,
        });
      x += col.width;
    });

    doc.y = headerY + headerHeight;
  };

  drawTableHeader();

  if (rows.length === 0) {
    ctx.ensureSpace(40);
    doc.font("Helvetica").fontSize(10).fillColor(colors.muted);
    doc.text("No payment records for the selected period.", margin + 8, doc.y + 12);
    doc.y += 44;
    return;
  }

  rows.forEach((row, index) => {
    const values = [
      row.date,
      formatFinanceCurrency(row.amount),
      row.status,
      row.reference || "—",
      row.notes || "—",
    ];

    const rowHeight = measureRowHeight(ctx, values, columns);
    ctx.ensureSpace(rowHeight + 4);

    if (doc.y + rowHeight > ctx.pageHeight - ctx.bottomMargin - 48) {
      doc.addPage();
      ctx.drawWatermark();
      doc.y = ctx.margin;
      drawTableHeader();
    }

    const rowY = doc.y;

    if (index % 2 === 0) {
      doc.rect(margin, rowY, contentWidth, rowHeight).fill(colors.stripe);
    }

    doc
      .moveTo(margin, rowY + rowHeight)
      .lineTo(margin + contentWidth, rowY + rowHeight)
      .strokeColor(colors.border)
      .lineWidth(0.5)
      .stroke();

    let x = margin;

    doc.font("Helvetica").fontSize(10).fillColor(colors.text);
    doc.text(values[0], x + 8, rowY + 11, { width: columns[0].width - 14, lineGap: 2 });
    x += columns[0].width;

    doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.text);
    doc.text(values[1], x + 8, rowY + 11, {
      width: columns[1].width - 14,
      align: "right",
      lineGap: 2,
    });
    x += columns[1].width;

    drawStatusBadge(ctx, row.status, x + 8, rowY + 10, columns[2].width - 16);
    x += columns[2].width;

    doc.font("Helvetica").fontSize(9.5).fillColor(colors.textSecondary);
    doc.text(values[3], x + 8, rowY + 11, { width: columns[3].width - 14, lineGap: 2 });
    x += columns[3].width;

    doc.font("Helvetica").fontSize(9.5).fillColor(colors.textSecondary);
    doc.text(values[4], x + 8, rowY + 11, { width: columns[4].width - 14, lineGap: 2 });

    doc.y = rowY + rowHeight;
  });

  doc.y += 8;
}
