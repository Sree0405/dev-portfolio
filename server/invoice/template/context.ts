import type PDFDocument from "pdfkit";
import { INVOICE_PDF, type InvoiceBranding } from "../config.js";

export class InvoiceLayoutContext {
  readonly doc: PDFKit.PDFDocument;
  readonly branding: InvoiceBranding;
  readonly margin = INVOICE_PDF.margin;
  readonly contentWidth = INVOICE_PDF.page.width - INVOICE_PDF.margin * 2;
  readonly pageHeight = INVOICE_PDF.page.height;
  readonly bottomMargin = INVOICE_PDF.margin + 28;
  readonly colors = INVOICE_PDF.colors;
  readonly sectionGap = INVOICE_PDF.sectionGap;

  constructor(doc: PDFKit.PDFDocument, branding: InvoiceBranding) {
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
    doc.opacity(0.04);
    doc.font("Helvetica-Bold").fontSize(52).fillColor(this.colors.text);
    doc.rotate(-35, { origin: [INVOICE_PDF.page.width / 2, INVOICE_PDF.page.height / 2] });
    doc.text(this.branding.watermarkText, 0, INVOICE_PDF.page.height / 2 - 20, {
      width: INVOICE_PDF.page.width,
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

  advance(gap = this.sectionGap): void {
    this.doc.y += gap;
  }

  drawSectionHeader(title: string): void {
    this.ensureSpace(36);
    const y = this.doc.y;

    this.doc
      .moveTo(this.margin, y + 18)
      .lineTo(this.margin + this.contentWidth, y + 18)
      .strokeColor(this.colors.border)
      .lineWidth(0.75)
      .stroke();

    this.doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(this.colors.accent)
      .text(title.toUpperCase(), this.margin, y, {
        width: this.contentWidth,
        characterSpacing: 1.2,
      });

    this.doc.y = y + 28;
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

    this.doc.roundedRect(x, y, width, height, INVOICE_PDF.cardRadius).fill(fill);
    this.doc
      .roundedRect(x, y, width, height, INVOICE_PDF.cardRadius)
      .strokeColor(stroke)
      .lineWidth(0.75)
      .stroke();
  }

  drawCardTitle(x: number, y: number, title: string): void {
    this.doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(this.colors.muted)
      .text(title.toUpperCase(), x, y, { characterSpacing: 0.8 });
  }

  measureWrappedText(text: string, width: number, fontSize = 9): number {
    this.doc.font("Helvetica").fontSize(fontSize);
    return this.doc.heightOfString(text, { width, lineGap: 3 });
  }

  drawWrappedText(
    text: string,
    x: number,
    y: number,
    width: number,
    options?: {
      fontSize?: number;
      font?: string;
      color?: string;
      lineGap?: number;
      align?: "left" | "right" | "center";
    },
  ): number {
    const fontSize = options?.fontSize ?? 9;
    const font = options?.font ?? "Helvetica";
    const color = options?.color ?? this.colors.text;
    const lineGap = options?.lineGap ?? 3;

    this.doc.font(font).fontSize(fontSize).fillColor(color);
    this.doc.text(text, x, y, { width, lineGap, align: options?.align ?? "left" });
    return this.doc.heightOfString(text, { width, lineGap });
  }

  drawFieldBlock(
    x: number,
    y: number,
    width: number,
    label: string,
    value: string,
    valueOptions?: { fontSize?: number; color?: string; bold?: boolean },
  ): number {
    this.doc.font("Helvetica").fontSize(8).fillColor(this.colors.muted);
    this.doc.text(label, x, y, { width });

    const labelH = this.doc.heightOfString(label, { width });
    const valueFont = valueOptions?.bold ? "Helvetica-Bold" : "Helvetica";
    const valueSize = valueOptions?.fontSize ?? 10;

    this.doc.font(valueFont).fontSize(valueSize).fillColor(valueOptions?.color ?? this.colors.text);
    this.doc.text(value, x, y + labelH + 4, { width, lineGap: 2 });

    return labelH + 4 + this.doc.heightOfString(value, { width, lineGap: 2 });
  }

  drawLink(url: string, display: string, x: number, y: number, width: number): void {
    this.doc.font("Helvetica").fontSize(9).fillColor(this.colors.accent);
    this.doc.text(display, x, y, { width, link: url, underline: true });
  }
}

export type InvoiceDoc = PDFDocument;
