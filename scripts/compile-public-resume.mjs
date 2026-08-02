import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const { DEFAULT_RESUME_LATEX } = await import(
    pathToFileURL(join(root, "server/resume/defaultTemplate.ts")).href
  );
  const { compileLatexToPdf } = await import(
    pathToFileURL(join(root, "server/resume/latexCompile.ts")).href
  );

  try {
    const { pdf } = await compileLatexToPdf(DEFAULT_RESUME_LATEX);
    writeFileSync(join(root, "public/resume/Sreekanth_SDE.pdf"), pdf);
    console.log(`PDF_OK bytes=${pdf.length}`);
  } catch (error) {
    console.error(`PDF_FAIL ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  }
}

main();
