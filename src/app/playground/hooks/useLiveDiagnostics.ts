import { useEffect, useRef, useState } from "react";
import type { DiagnosticMarker } from "../types";
import { validateSource } from "../diagnostics/validateSource";

const LIVE_VALIDATION_DEBOUNCE_MS = 200;

export function useLiveDiagnostics(code: string, languageId: string) {
  const [diagnostics, setDiagnostics] = useState<DiagnosticMarker[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    const runValidation = () => {
      setIsValidating(true);

      try {
        const result = validateSource(code, languageId);
        if (!cancelled && requestIdRef.current === requestId) {
          setDiagnostics(result.diagnostics);
        }
      } catch (error) {
        if (!cancelled && requestIdRef.current === requestId) {
          setDiagnostics([
            {
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 2,
              message: (error as Error).message || "Validation failed",
              severity: "error",
            },
          ]);
        }
      } finally {
        if (!cancelled && requestIdRef.current === requestId) {
          setIsValidating(false);
        }
      }
    };

    const timer = window.setTimeout(runValidation, LIVE_VALIDATION_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code, languageId]);

  return { diagnostics, isValidating };
}
