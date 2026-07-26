import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import {
  downloadPreviewElementAsPdf,
  LatexEditor,
  LatexPreview,
  previewElementToBase64,
  renderLatexToContainer,
  RESUME_PREVIEW_CONTENT_ID,
} from "@/app/components/Resume/ResumeLatexWorkspace";
import type { LatexPreviewError } from "@/app/lib/resume/latexPreviewEngine";
import { DEFAULT_RESUME_LATEX } from "@/app/lib/resume/defaultTemplate";
import { normalizeLatexSource } from "@/app/lib/resume/normalizeLatex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ResumeEditorPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { isDemo } = useAuth();
  const isMobile = useIsMobile();

  const getPreviewContentElement = () =>
    document.getElementById(RESUME_PREVIEW_CONTENT_ID) as HTMLElement | null;

  const [title, setTitle] = useState("");
  const [latexSource, setLatexSource] = useState(DEFAULT_RESUME_LATEX);
  const [dirty, setDirty] = useState(false);
  const [previewError, setPreviewError] = useState<LatexPreviewError | null>(null);

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resume", id],
    queryFn: () => api.getResume(id!),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!resume) return;
    setTitle(resume.title);
    setLatexSource(normalizeLatexSource(resume.latexSource));
    setDirty(false);
  }, [resume]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["resumes"] });
    queryClient.invalidateQueries({ queryKey: ["resume", id] });
  };

  const refreshPreviewForSave = useCallback(async () => {
    const previewElement = getPreviewContentElement();
    if (!previewElement) {
      throw new Error("Preview is not ready yet.");
    }

    const result = await renderLatexToContainer(latexSource, previewElement);
    if (result.ok === false) {
      setPreviewError(result.error);
      throw new Error(result.error.message);
    }

    setPreviewError(null);
    return previewElement;
  }, [latexSource]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const previewElement = await refreshPreviewForSave();
      let compiledPdfBase64: string | undefined;

      if (previewElement.childElementCount > 0) {
        try {
          compiledPdfBase64 = await previewElementToBase64(previewElement);
        } catch {
          // Preview PDF generation is optional; LaTeX source is still saved.
        }
      }

      return api.saveResume(id!, {
        title,
        latexSource,
        compiledPdfBase64,
      });
    },
    onSuccess: () => {
      invalidate();
      setDirty(false);
      toast.success("Resume saved");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const compileFromPreview = async () => {
    const previewElement = await refreshPreviewForSave();
    if (previewElement.childElementCount === 0) {
      throw new Error("Fix preview errors before compiling PDF.");
    }

    const compiledPdfBase64 = await previewElementToBase64(previewElement);
    return api.saveResume(id!, {
      title,
      latexSource,
      compiledPdfBase64,
    });
  };

  const compileMutation = useMutation({
    mutationFn: async () => {
      try {
        return await api.compileResume(id!);
      } catch (error) {
        if (
          error instanceof ApiClientError &&
          (error.status === 501 || error.status === 422)
        ) {
          return compileFromPreview();
        }
        throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setDirty(false);
      toast.success("PDF compiled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!saveMutation.isPending && !compileMutation.isPending) {
          saveMutation.mutate();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saveMutation, compileMutation.isPending]);

  const handleDownload = async () => {
    if (resume?.hasCompiledPdf) {
      try {
        await api.downloadResumePdf(id!, resume.pdfFilename ?? undefined);
        return;
      } catch (error) {
        if (!(error instanceof ApiClientError) || error.status !== 404) {
          toast.error(error instanceof Error ? error.message : "Download failed");
          return;
        }
      }
    }

    const previewElement = getPreviewContentElement();
    if (!previewElement || previewElement.childElementCount === 0) {
      toast.error("Fix preview errors before downloading PDF.");
      return;
    }

    try {
      const filename = `${title.trim().replace(/\s+/g, "_") || "Resume"}.pdf`;
      await downloadPreviewElementAsPdf(previewElement, filename);
      toast.success("PDF downloaded from preview");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate PDF");
    }
  };

  if (isLoading || !resume) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3.25rem)] flex-col md:h-[calc(100dvh-0px)]">
      <DashboardHeader
        title={title || "Resume Editor"}
        description="Overleaf-style LaTeX editor with live preview."
        actions={
          <div className="flex w-full flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/resume">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back
              </Link>
            </Button>

            <Input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setDirty(true);
              }}
              className="h-9 w-full min-w-[10rem] max-w-xs"
              placeholder="Resume title"
            />

            <Badge variant="outline" className="hidden sm:inline-flex">
              {resume.compileStatus === "success" ? "PDF ready" : "Draft"}
            </Badge>

            <Button
              variant="sreeDev"
              size="sm"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              Save
              {dirty ? " *" : ""}
              <span className="ml-1 hidden text-[10px] opacity-70 lg:inline">Ctrl+S</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={compileMutation.isPending}
              onClick={() => compileMutation.mutate()}
            >
              {compileMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1.5 h-4 w-4" />
              )}
              Compile
            </Button>

            <Button variant="outline" size="sm" onClick={() => void handleDownload()}>
              <Download className="mr-1.5 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        }
      />

      {isDemo && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-100 md:px-8">
          Demo mode: create and edit resumes freely. Deleting resumes is disabled.
        </div>
      )}

      <div className="min-h-0 flex-1 p-3 md:p-4">
        <PanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="h-full overflow-hidden rounded-xl border border-border/60"
        >
          <Panel
            defaultSize={isMobile ? 50 : 45}
            minSize={isMobile ? 30 : 28}
            maxSize={isMobile ? 65 : 55}
            className="min-w-0"
          >
            <div className="flex h-full min-w-0 flex-col overflow-hidden bg-[#1e1e1e]">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 text-xs font-medium text-white/70">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  LaTeX Source
                </div>
                {previewError?.line != null && (
                  <span className="text-destructive">Error on line {previewError.line}</span>
                )}
              </div>
              <LatexEditor
                value={latexSource}
                onChange={(value) => {
                  setLatexSource(value);
                  setDirty(true);
                }}
                errorLine={previewError?.line ?? null}
                className="flex-1"
              />
            </div>
          </Panel>

          <PanelResizeHandle
            className={cn(
              "shrink-0 bg-border/60 transition-colors hover:bg-primary/40",
              isMobile ? "h-1.5" : "w-1.5",
            )}
          />

          <Panel
            defaultSize={isMobile ? 50 : 55}
            minSize={isMobile ? 35 : 40}
            className="min-w-0"
          >
            <LatexPreview
              latexSource={latexSource}
              onPreviewError={setPreviewError}
              className="h-full min-h-0"
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
