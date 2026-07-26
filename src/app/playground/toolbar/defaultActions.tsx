import {
  Copy,
  Download,
  Eraser,
  FilePlus2,
  FileUp,
  Maximize2,
  Moon,
  Play,
  Square,
  Sun,
  WrapText,
  Wand2,
} from "lucide-react";
import { registerToolbarAction } from "./toolbarActionRegistry";
import { listLanguages } from "../languages/languageRegistry";

const defaultActions = [
  {
    id: "run",
    label: "Run",
    icon: <Play className="h-3.5 w-3.5" />,
    group: "execution" as const,
    order: 10,
    shortcut: "Ctrl+Enter",
    isDisabled: (ctx) => ctx.isRunning,
    onClick: (ctx) => ctx.run(),
  },
  {
    id: "stop",
    label: "Stop",
    icon: <Square className="h-3.5 w-3.5" />,
    group: "execution" as const,
    order: 20,
    isDisabled: (ctx) => !ctx.isRunning,
    onClick: (ctx) => ctx.stop(),
  },
  {
    id: "clear-console",
    label: "Clear Console",
    icon: <Eraser className="h-3.5 w-3.5" />,
    group: "execution" as const,
    order: 30,
    onClick: (ctx) => ctx.clearConsole(),
  },
  {
    id: "new-file",
    label: "New",
    icon: <FilePlus2 className="h-3.5 w-3.5" />,
    group: "file" as const,
    order: 35,
    onClick: (ctx) => {
      const language = listLanguages().find((item) => item.id === ctx.languageId);
      ctx.setCode(language?.defaultCode ?? "");
      ctx.clearConsole();
    },
  },
  {
    id: "format",
    label: "Format",
    icon: <Wand2 className="h-3.5 w-3.5" />,
    group: "file" as const,
    order: 40,
    onClick: (ctx) => void ctx.formatCode(),
  },
  {
    id: "copy",
    label: "Copy",
    icon: <Copy className="h-3.5 w-3.5" />,
    group: "file" as const,
    order: 50,
    onClick: (ctx) => ctx.copyCode(),
  },
  {
    id: "download",
    label: "Download",
    icon: <Download className="h-3.5 w-3.5" />,
    group: "file" as const,
    order: 60,
    onClick: (ctx) => ctx.downloadCode(),
  },
  {
    id: "upload",
    label: "Upload",
    icon: <FileUp className="h-3.5 w-3.5" />,
    group: "file" as const,
    order: 70,
    render: (ctx) => (
      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
        <FileUp className="h-3.5 w-3.5" />
        Upload
        <input
          type="file"
          accept=".js,.ts,.txt"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            void file.text().then((content) => ctx.uploadCode(content));
            event.target.value = "";
          }}
        />
      </label>
    ),
  },
  {
    id: "theme",
    label: "Theme",
    icon: <Moon className="h-3.5 w-3.5" />,
    group: "view" as const,
    order: 80,
    onClick: (ctx) => ctx.toggleTheme(),
  },
  {
    id: "word-wrap",
    label: "Word Wrap",
    icon: <WrapText className="h-3.5 w-3.5" />,
    group: "view" as const,
    order: 100,
    isActive: (ctx) => Boolean((ctx as unknown as { wordWrap?: boolean }).wordWrap),
    onClick: (ctx) => ctx.toggleWordWrap(),
  },
  {
    id: "fullscreen",
    label: "Fullscreen",
    icon: <Maximize2 className="h-3.5 w-3.5" />,
    group: "view" as const,
    order: 110,
    onClick: (ctx) => ctx.toggleFullscreen(),
  },
];

for (const action of defaultActions) {
  registerToolbarAction(action);
}

export { Sun };
