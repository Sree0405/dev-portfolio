type GeneratorApi = {
  create: (element: string | HTMLElement, className?: string, inner?: string) => HTMLElement;
};

type CustomMacrosInstance = {
  g: GeneratorApi;
};

type CustomMacrosConstructor = {
  new (generator: GeneratorApi): CustomMacrosInstance;
  args: Record<string, string[]>;
  prototype: Record<string, (this: CustomMacrosInstance, ...args: unknown[]) => HTMLElement[]>;
};

export function createLatexPreviewCustomMacros(): CustomMacrosConstructor {
  function CustomMacros(this: CustomMacrosInstance, generator: GeneratorApi) {
    this.g = generator;
  }

  CustomMacros.args = {
    hfill: ["H"],
    hfil: ["H"],
    hrule: ["H"],
  };

  CustomMacros.prototype.hfill = function hfill(this: CustomMacrosInstance) {
    const span = document.createElement("span");
    span.className = "latex-preview-hfill";
    span.setAttribute("aria-hidden", "true");
    return [span];
  };

  CustomMacros.prototype.hfil = function hfil(this: CustomMacrosInstance) {
    const span = document.createElement("span");
    span.className = "latex-preview-hfill";
    span.setAttribute("aria-hidden", "true");
    return [span];
  };

  CustomMacros.prototype.hrule = function hrule(this: CustomMacrosInstance) {
    const hr = document.createElement("hr");
    hr.className = "latex-preview-hrule";
    return [hr];
  };

  return CustomMacros as unknown as CustomMacrosConstructor;
}
