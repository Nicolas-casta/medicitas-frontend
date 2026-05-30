import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  tooltip: string;
  onClick: () => void;
  color?: string;
  tooltipPosition?: "top" | "left";
}

export const IconButton = ({
  icon: Icon,
  tooltip,
  onClick,
  color = "text-slate-400 hover:text-white hover:bg-slate-600",
  tooltipPosition = "top",
}: Props) => {
  const tooltipClasses =
    tooltipPosition === "left"
      ? "absolute right-10 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block pointer-events-none"
      : "absolute bottom-10 right-0 z-50 hidden group-hover:block pointer-events-none";

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${color}`}
      >
        <Icon size={18} />
      </button>
      <div className={tooltipClasses}>
        <div className="bg-slate-700 text-slate-100 text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg border border-slate-600">
          {tooltip}
        </div>
      </div>
    </div>
  );
};