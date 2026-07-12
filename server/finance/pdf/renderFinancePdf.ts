export {
  renderFinanceReportTemplate,
  renderFinancePdf,
} from "./template/renderFinanceReportTemplate.js";

export type {
  FinanceReportTemplateInput,
  FinanceReportRow,
  FinanceReportSummary,
  FinanceReportDetailInfo,
} from "./types.js";

/** @deprecated Use FinanceReportTemplateInput */
export type { FinanceReportTemplateInput as FinancePdfInput } from "./types.js";

/** @deprecated Use FinanceReportRow */
export type { FinanceReportRow as FinancePdfRow } from "./types.js";

/** @deprecated Use FinanceReportSummary */
export type { FinanceReportSummary as FinancePdfSummary } from "./types.js";
