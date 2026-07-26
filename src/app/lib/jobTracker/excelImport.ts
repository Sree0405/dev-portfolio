import * as XLSX from "xlsx";
import { EXCEL_IMPORT_HEADERS, HEADER_TO_FIELD } from "./constants";

const URL_FIELDS = new Set(["linkedinUrl", "careersUrl"]);

function parseApplied(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined) return false;
  const str = String(value).trim().toLowerCase();
  return ["true", "yes", "y", "1", "applied"].includes(str);
}

function extractCellString(cell: XLSX.CellObject | undefined): string {
  if (!cell) return "";
  if (cell.w != null && String(cell.w).trim()) return String(cell.w).trim();
  if (cell.v != null) return String(cell.v).trim();
  return "";
}

function extractHyperlinkTarget(cell: XLSX.CellObject | undefined): string | null {
  if (!cell) return null;

  const target = cell.l?.Target?.trim();
  if (target) return target;

  const formula = cell.f?.trim();
  if (formula?.toUpperCase().startsWith("HYPERLINK(")) {
    const match = formula.match(/HYPERLINK\s*\(\s*"((?:[^"\\]|\\.)*)"/i);
    if (match?.[1]) {
      return match[1].replace(/\\"/g, '"');
    }
  }

  return null;
}

function extractUrlValue(cell: XLSX.CellObject | undefined): string | null {
  const hyperlink = extractHyperlinkTarget(cell);
  if (hyperlink) return hyperlink;

  const text = extractCellString(cell);
  if (!text) return null;
  if (/^https?:\/\//i.test(text)) return text;

  return text;
}

export interface ParsedImportRow {
  name: string;
  linkedinUrl?: string | null;
  careersUrl?: string | null;
  companyType?: string | null;
  productCategory?: string | null;
  companySize?: string | null;
  headquarters?: string | null;
  officeLocation?: string | null;
  applied?: boolean;
  hrContact?: string | null;
}

function buildHeaderMap(sheet: XLSX.WorkSheet, headerRow: number, startCol: number, endCol: number) {
  const headerMap = new Map<number, string>();

  for (let col = startCol; col <= endCol; col += 1) {
    const address = XLSX.utils.encode_cell({ r: headerRow, c: col });
    const cell = sheet[address] as XLSX.CellObject | undefined;
    const headerText = extractCellString(cell);

    const match = EXCEL_IMPORT_HEADERS.find(
      (required) => required.toLowerCase() === headerText.toLowerCase(),
    );

    if (match) {
      headerMap.set(col, HEADER_TO_FIELD[match]);
    }
  }

  return headerMap;
}

function parseSheetRows(sheet: XLSX.WorkSheet): ParsedImportRow[] {
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1");
  const headerMap = buildHeaderMap(sheet, range.s.r, range.s.c, range.e.c);

  const hasCompanyName = [...headerMap.values()].includes("name");
  if (!hasCompanyName) {
    throw new Error('Missing required column: "Company Name"');
  }

  const parsed: ParsedImportRow[] = [];

  for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
    const rowData: Record<string, unknown> = {};

    for (const [col, field] of headerMap.entries()) {
      const address = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[address] as XLSX.CellObject | undefined;

      if (field === "applied") {
        rowData[field] = parseApplied(cell?.v ?? cell?.w);
      } else if (URL_FIELDS.has(field)) {
        rowData[field] = extractUrlValue(cell);
      } else {
        rowData[field] = extractCellString(cell);
      }
    }

    const name = String(rowData.name ?? "").trim();
    if (!name) continue;

    parsed.push({
      name,
      linkedinUrl: (rowData.linkedinUrl as string) || null,
      careersUrl: (rowData.careersUrl as string) || null,
      companyType: (rowData.companyType as string) || null,
      productCategory: (rowData.productCategory as string) || null,
      companySize: (rowData.companySize as string) || null,
      headquarters: (rowData.headquarters as string) || null,
      officeLocation: (rowData.officeLocation as string) || null,
      applied: Boolean(rowData.applied),
      hrContact: (rowData.hrContact as string) || null,
    });
  }

  return parsed;
}

export function parseExcelFile(file: File): Promise<ParsedImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        if (!sheet?.["!ref"]) {
          reject(new Error("The Excel file is empty."));
          return;
        }

        const parsed = parseSheetRows(sheet);
        if (parsed.length === 0) {
          reject(new Error("The Excel file has no company rows to import."));
          return;
        }

        resolve(parsed);
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to parse Excel file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

// Exported for unit testing
export const excelImportInternals = {
  extractCellString,
  extractHyperlinkTarget,
  extractUrlValue,
  parseSheetRows,
};
