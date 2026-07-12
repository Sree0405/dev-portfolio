import { formatInvoiceCurrency, formatInvoiceDate } from "../format.js";
import type { InvoiceData } from "../types.js";
import type { InvoiceLayoutContext } from "./context.js";

interface PaymentColumn {
  label: string;
  width: number;
  align?: "left" | "right" | "center";
}

function getColumns(contentWidth: number): PaymentColumn[] {
  return [
    { label: "Date", width: 72 },
    { label: "Amount", width: 82, align: "right" },
    { label: "Method", width: 78 },
    { label: "Reference", width: 88 },
    { label: "Notes", width: contentWidth - 320 },
  ];
}

function measureRowHeight(
  ctx: InvoiceLayoutContext,
  values: string[],
  columns: PaymentColumn[],
): number {
  let maxHeight = 0;
  values.forEach((value, index) => {
    const cellWidth = columns[index].width - 14;
    const h = ctx.measureWrappedText(value, cellWidth, 8.5);
    maxHeight = Math.max(maxHeight, h);
  });
  return Math.max(32, maxHeight + 18);
}

export function drawInvoicePaymentsTable(ctx: InvoiceLayoutContext, data: InvoiceData): void {
  const { doc, margin, contentWidth, colors } = ctx;
  const columns = getColumns(contentWidth);
  const headerHeight = 30;

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
          characterSpacing: 0.5,
        });
      x += col.width;
    });

    doc.y = headerY + headerHeight;
  };

  drawTableHeader();

  if (data.payments.length === 0) {
    ctx.ensureSpace(36);
    doc.font("Helvetica").fontSize(9).fillColor(colors.muted);
    doc.text("No payments recorded.", margin + 8, doc.y + 10);
    doc.y += 36;
    return;
  }

  data.payments.forEach((payment, index) => {
    const values = [
      formatInvoiceDate(payment.paymentDate),
      formatInvoiceCurrency(payment.amount),
      payment.paymentMethod,
      payment.reference || "—",
      payment.notes || "—",
    ];

    const rowHeight = measureRowHeight(ctx, values, columns);
    ctx.ensureSpace(rowHeight + 4);

    if (doc.y + rowHeight > ctx.pageHeight - ctx.bottomMargin - 40) {
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
    values.forEach((value, colIndex) => {
      const col = columns[colIndex];
      const cellWidth = col.width - 14;
      const isAmount = colIndex === 1;

      doc
        .font(isAmount ? "Helvetica-Bold" : "Helvetica")
        .fontSize(8.5)
        .fillColor(colors.text);

      doc.text(value, x + 8, rowY + 10, {
        width: cellWidth,
        align: col.align ?? "left",
        lineGap: 2,
      });

      x += col.width;
    });

    doc.y = rowY + rowHeight;
  });

  ctx.ensureSpace(36);
  const totalY = doc.y + 6;
  doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.text);
  doc.text("Total Payments", margin + 8, totalY);
  doc.text(formatInvoiceCurrency(data.project.totalPaid), margin, totalY, {
    width: contentWidth - 16,
    align: "right",
  });
  doc.y = totalY + 24;
}
