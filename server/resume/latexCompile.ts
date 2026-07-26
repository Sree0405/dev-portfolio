import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface LatexCompileResult {
  pdf: Buffer;
  log: string;
}

export async function compileLatexToPdf(latexSource: string): Promise<LatexCompileResult> {
  const workDir = await mkdtemp(join(tmpdir(), "resume-latex-"));
  const texPath = join(workDir, "resume.tex");

  try {
    await writeFile(texPath, latexSource, "utf8");

    const pdflatexCmd = process.platform === "win32" ? "pdflatex.exe" : "pdflatex";
    const args = [
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-output-directory",
      workDir,
      texPath,
    ];

    let log = "";
    try {
      const { stdout, stderr } = await execFileAsync(pdflatexCmd, args, {
        timeout: 60_000,
        maxBuffer: 4 * 1024 * 1024,
      });
      log = [stdout, stderr].filter(Boolean).join("\n");
    } catch (error) {
      const execError = error as NodeJS.ErrnoException & {
        stdout?: string;
        stderr?: string;
        code?: string;
      };

      if (execError.code === "ENOENT") {
        throw new Error("LATEX_NOT_INSTALLED");
      }

      log = [execError.stdout, execError.stderr].filter(Boolean).join("\n");
      throw new Error(log || "LaTeX compilation failed");
    }

    const pdfPath = join(workDir, "resume.pdf");
    const pdf = await readFile(pdfPath);
    return { pdf, log };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

export function isLatexInstalledError(error: unknown): boolean {
  return error instanceof Error && error.message === "LATEX_NOT_INSTALLED";
}
