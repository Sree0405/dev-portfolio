import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { oneDark } from "@codemirror/theme-one-dark";
import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  type LatexPreviewError,
  renderLatexToContainer,
} from "@/app/lib/resume/latexPreviewEngine";
import { isPreviewableLatex } from "@/app/lib/resume/normalizeLatex";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  RESUME_PREVIEW_CONTENT_ID,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
} from "@/app/lib/resume/previewConstants";

const setErrorLineEffect = StateEffect.define<number | null>();

const errorLineDecorations = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(deco, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setErrorLineEffect)) {
        if (effect.value == null) {
          return Decoration.none;
        }

        const safeLine = Math.min(Math.max(effect.value, 1), tr.state.doc.lines);
        const line = tr.state.doc.line(safeLine);
        return Decoration.set([
          Decoration.line({ class: "cm-latex-error-line" }).range(line.from),
        ]);
      }
    }

    return deco.map(tr.changes);
  },
  provide: (field) => EditorView.decorations.from(field),
});

const errorLineTheme = EditorView.baseTheme({
  ".cm-latex-error-line": {
    backgroundColor: "rgba(239, 68, 68, 0.18)",
    borderLeft: "3px solid rgb(239, 68, 68)",
  },
});

interface LatexEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  errorLine?: number | null;
}

export function LatexEditor({ value, onChange, readOnly, className, errorLine }: LatexEditorProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const extensions = useMemo(
    () => [
      StreamLanguage.define(stex),
      EditorView.lineWrapping,
      errorLineDecorations,
      errorLineTheme,
    ],
    [],
  );

  useEffect(() => {
    const view = editorRef.current?.view;
    if (!view) return;

    view.dispatch({ effects: setErrorLineEffect.of(errorLine ?? null) });

    if (errorLine != null) {
      const safeLine = Math.min(errorLine, view.state.doc.lines);
      view.dispatch({
        effects: EditorView.scrollIntoView(view.state.doc.line(safeLine).from, { y: "center" }),
      });
    }
  }, [errorLine, value]);

  return (
    <div className={cn("h-full min-h-0 overflow-hidden", className)}>
      <CodeMirror
        ref={editorRef}
        value={value}
        height="100%"
        theme={oneDark}
        extensions={extensions}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          indentOnInput: true,
        }}
        onChange={onChange}
        className="h-full min-w-0 [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-x-hidden [&_.cm-scroller]:font-mono [&_.cm-scroller]:text-sm"
      />
    </div>
  );
}

interface LatexPreviewProps {
  latexSource: string;
  className?: string;
  onPreviewError?: (error: LatexPreviewError | null) => void;
}

type ZoomMode = "fit" | number;

function clampZoom(value: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 100) / 100));
}

function resolvePreviewPageElement(element: HTMLElement): HTMLElement {
  const pageElement = element.closest(".latex-preview-page");
  return pageElement instanceof HTMLElement ? pageElement : element;
}

function computeFitScale(viewportWidth: number, viewportHeight: number, contentHeight: number): number {
  const horizontalPadding = 32;
  const verticalPadding = 24;
  const availableWidth = Math.max(viewportWidth - horizontalPadding, 120);
  const availableHeight = Math.max(viewportHeight - verticalPadding, 160);
  const widthScale = availableWidth / A4_WIDTH_PX;
  const heightScale = availableHeight / Math.max(contentHeight, A4_HEIGHT_PX);
  return clampZoom(Math.min(widthScale, heightScale));
}

export function LatexPreview({
  latexSource,
  className,
  onPreviewError,
}: LatexPreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<LatexPreviewError | null>(null);
  const [rendering, setRendering] = useState(false);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);
  const [fitScale, setFitScale] = useState(1);
  const [zoomMode, setZoomMode] = useState<ZoomMode>("fit");

  const effectiveScale = zoomMode === "fit" ? fitScale : zoomMode;
  const zoomLabel = `${Math.round(effectiveScale * 100)}%`;

  const updateFitScale = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setFitScale(computeFitScale(viewport.clientWidth, viewport.clientHeight, contentHeight));
  }, [contentHeight]);

  const measureContent = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    const nextHeight = Math.max(content.scrollHeight, A4_HEIGHT_PX);
    setContentHeight(nextHeight);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateFitScale();
    const observer = new ResizeObserver(() => updateFitScale());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [updateFitScale]);

  useEffect(() => {
    measureContent();
  }, [latexSource, rendering, measureContent]);

  const renderPreview = useCallback(
    async (source: string) => {
      if (!contentRef.current) return;

      if (!isPreviewableLatex(source)) {
        contentRef.current.innerHTML = "";
        setError(null);
        onPreviewError?.(null);
        setRendering(false);
        setContentHeight(A4_HEIGHT_PX);
        return;
      }

      setRendering(true);

      const result = await renderLatexToContainer(source, contentRef.current);

      if (result.ok) {
        setError(null);
        onPreviewError?.(null);
        requestAnimationFrame(() => {
          measureContent();
          updateFitScale();
        });
      } else if (result.ok === false) {
        setError(result.error);
        onPreviewError?.(result.error);
      }

      setRendering(false);
    },
    [measureContent, onPreviewError, updateFitScale],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void renderPreview(latexSource);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [latexSource, renderPreview]);

  const handleZoomIn = () => {
    const base = zoomMode === "fit" ? fitScale : zoomMode;
    setZoomMode(clampZoom(base + ZOOM_STEP));
  };

  const handleZoomOut = () => {
    const base = zoomMode === "fit" ? fitScale : zoomMode;
    setZoomMode(clampZoom(base - ZOOM_STEP));
  };

  const handleFitToPage = () => {
    setZoomMode("fit");
    updateFitScale();
  };

  const scaledWidth = A4_WIDTH_PX * effectiveScale;
  const scaledHeight = contentHeight * effectiveScale;

  return (
    <div className={cn("relative flex h-full min-h-0 flex-col", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">PDF Preview</span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="min-w-[3.25rem] text-center text-xs tabular-nums text-muted-foreground">
            {zoomLabel}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant={zoomMode === "fit" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={handleFitToPage}
            aria-label="Fit page to viewport"
            title="Fit to page"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {rendering && (
        <div className="absolute right-3 top-12 z-10 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
          Updating preview…
        </div>
      )}

      {!isPreviewableLatex(latexSource) ? (
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
          Loading resume template…
        </div>
      ) : (
        <>
          <div
            ref={viewportRef}
            id="resume-latex-preview"
            className="latex-preview-viewport relative min-h-0 flex-1 overflow-auto"
          >
            <div
              className="latex-preview-scaler-wrapper mx-auto py-4"
              style={{ width: scaledWidth, height: scaledHeight }}
            >
              <div
                className="latex-preview-scaler"
                style={{
                  width: A4_WIDTH_PX,
                  height: contentHeight,
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: "top left",
                }}
              >
                <div className="latex-preview-page">
                  <div
                    ref={contentRef}
                    id={RESUME_PREVIEW_CONTENT_ID}
                    className={cn("latex-preview text-black", error && "opacity-30")}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="absolute inset-x-0 bottom-0 top-10 flex items-center justify-center bg-background/70 p-6 text-center backdrop-blur-sm">
              <div>
                <p className="text-sm font-medium text-destructive">Preview error</p>
                <p className="mt-2 text-xs text-muted-foreground">{error.message}</p>
                {error.line != null && (
                  <p className="mt-2 text-xs font-medium text-destructive/90">
                    Line {error.line}
                    {error.column != null ? `, column ${error.column}` : ""}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export async function downloadPreviewElementAsPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const html2pdf = (await import("html2pdf.js")).default;
  const pageElement = resolvePreviewPageElement(element);

  await html2pdf()
    .set({
      margin: [0, 0, 0, 0],
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, width: A4_WIDTH_PX },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(pageElement)
    .save();
}

export async function previewElementToBase64(element: HTMLElement): Promise<string> {
  const html2pdf = (await import("html2pdf.js")).default;
  const pageElement = resolvePreviewPageElement(element);

  const worker = html2pdf()
    .set({
      margin: [0, 0, 0, 0],
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, width: A4_WIDTH_PX },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(pageElement);

  const pdf = await worker.toPdf().get("pdf");
  const dataUri = pdf.output("datauristring") as string;
  return dataUri.split(",")[1] ?? "";
}

export { RESUME_PREVIEW_CONTENT_ID } from "@/app/lib/resume/previewConstants";

export { renderLatexToContainer } from "@/app/lib/resume/latexPreviewEngine";
