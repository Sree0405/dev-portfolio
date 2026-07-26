let latexJsLoader: Promise<typeof window.latexjs> | null = null;

declare global {
  interface Window {
    latexjs: {
      parse: (source: string, options: { generator: unknown }) => unknown;
      HtmlGenerator: new (options?: {
        hyphenate?: boolean;
        CustomMacros?: unknown;
      }) => {
        domFragment: () => DocumentFragment;
      };
    };
  }
}

export function loadLatexJs(): Promise<typeof window.latexjs> {
  if (typeof window !== "undefined" && window.latexjs) {
    return Promise.resolve(window.latexjs);
  }

  if (!latexJsLoader) {
    latexJsLoader = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-latex-js="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.latexjs));
        existing.addEventListener("error", () => reject(new Error("Failed to load LaTeX preview engine")));
        return;
      }

      const script = document.createElement("script");
      script.src = "/vendor/latex.js/latex.js";
      script.async = true;
      script.dataset.latexJs = "true";
      script.onload = () => resolve(window.latexjs);
      script.onerror = () => reject(new Error("Failed to load LaTeX preview engine"));
      document.head.appendChild(script);
    });
  }

  return latexJsLoader;
}
