import type PDFDocument from "pdfkit";
import { FINANCE_PDF, type FinanceBranding } from "../config.js";

export class FinanceLayoutContext {
  readonly doc: PDFKit.PDFDocument;
  readonly branding: FinanceBranding;
  readonly margin = FINANCE_PDF.margin;
  readonly contentWidth = FINANCE_PDF.page.width - FINANCE_PDF.margin * 2;
  readonly pageHeight = FINANCE_PDF.page.height;
  readonly bottomMargin = FINANCE_PDF.margin + 32;
  readonly colors = FINANCE_PDF.colors;
  readonly sectionGap = FINANCE_PDF.sectionGap;

  constructor(doc: PDFKit.PDFDocument, branding: FinanceBranding) {
    this.doc = doc;
    this.branding = branding;
  }

  get y(): number {
    return this.doc.y;
  }

  set y(value: number) {
    this.doc.y = value;
  }

  drawWatermark(): void {
    const { doc } = this;
    doc.save();
    doc.opacity(0.03);
    doc.font("Helvetica-Bold").fontSize(48).fillColor(this.colors.text);
    doc.rotate(-35, { origin: [FINANCE_PDF.page.width / 2, FINANCE_PDF.page.height / 2] });
    doc.text(this.branding.watermarkText, 0, FINANCE_PDF.page.height / 2 - 24, {
      width: FINANCE_PDF.page.width,
      align: "center",
    });
    doc.restore();
  }

  ensureSpace(needed: number): void {
    if (this.doc.y + needed > this.pageHeight - this.bottomMargin) {
      this.doc.addPage();
      this.drawWatermark();
      this.doc.y = this.margin;
    }
  }

  drawCard(
    x: number,
    y: number,
    width: number,
    height: number,
    options?: { fill?: string; stroke?: string },
  ): void {
    const fill = options?.fill ?? this.colors.cardBg;
    const stroke = options?.stroke ?? this.colors.cardBorder;

    this.doc.roundedRect(x, y, width, height, FINANCE_PDF.cardRadius).fill(fill);
    this.doc
      .roundedRect(x, y, width, height, FINANCE_PDF.cardRadius)
      .strokeColor(stroke)
      .lineWidth(0.75)
      .stroke();
  }

  drawSectionHeader(title: string, icon?: string): void {
    this.ensureSpace(40);
    const y = this.doc.y;

    this.doc
      .moveTo(this.margin, y + 20)
      .lineTo(this.margin + this.contentWidth, y + 20)
      .strokeColor(this.colors.border)
      .lineWidth(0.75)
      .stroke();

    const label = icon ? `${icon}  ${title.toUpperCase()}` : title.toUpperCase();

    this.doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(this.colors.accent)
      .text(label, this.margin, y, {
        width: this.contentWidth,
        characterSpacing: 0.8,
      });

    this.doc.y = y + 30;
  }

  measureWrappedText(text: string, width: number, fontSize = 10): number {
    this.doc.font("Helvetica").fontSize(fontSize);
    return this.doc.heightOfString(text, { width, lineGap: 3 });
  }

  drawFieldBlock(
    x: number,
    y: number,
    width: number,
    label: string,
    value: string,
    options?: { bold?: boolean; color?: string },
  ): number {
    this.doc.font("Helvetica").fontSize(9).fillColor(this.colors.muted);
    this.doc.text(label, x, y, { width });

    const labelH = this.doc.heightOfString(label, { width });
    const font = options?.bold ? "Helvetica-Bold" : "Helvetica";

    this.doc.font(font).fontSize(11).fillColor(options?.color ?? this.colors.text);
    this.doc.text(value, x, y + labelH + 4, { width, lineGap: 2 });

    return labelH + 4 + this.doc.heightOfString(value, { width, lineGap: 2 });
  }

  drawLink(url: string, display: string, x: number, y: number, width: number): void {
    this.doc.font("Helvetica").fontSize(10).fillColor(this.colors.accent);
    this.doc.text(display, x, y, { width, link: url, underline: true });
  }
}
