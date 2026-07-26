import {
  BarChart3,
  Code2,
  FileUser,
  FolderKanban,
  KeyRound,
  Layers,
  LayoutDashboard,
  PieChart,
  Shield,
  TerminalSquare,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  home: LayoutDashboard,
  layers: Layers,
  code: Code2,
  shield: Shield,
  workflow: BarChart3,
  "layout-dashboard": LayoutDashboard,
  "folder-kanban": FolderKanban,
  "key-round": KeyRound,
  "file-user": FileUser,
  wrench: Wrench,
  "terminal-square": TerminalSquare,
  wallet: Wallet,
  "pie-chart": PieChart,
};

export function resolveDocIcon(name: string, fallback: LucideIcon = Layers): LucideIcon {
  return ICON_MAP[name] ?? fallback;
}
