import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getInvoiceLogoPath(): string {
  return path.resolve(__dirname, "../../../public/branding/sreeBrandLogo.png");
}
