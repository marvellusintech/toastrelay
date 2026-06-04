import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "turquoise" | "coral" | "gold";
}

const toneClass = {
  turquoise: "text-turquoise",
  coral: "text-coral",
  gold: "text-gold",
};

export function StatTile({ icon: Icon, label, value, tone = "turquoise" }: StatTileProps) {
  return (
    <div className="rounded-lg border border-line bg-panel p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-black/[0.04]">
        <Icon className={`h-5 w-5 ${toneClass[tone]}`} />
      </div>
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-normal">{value}</p>
    </div>
  );
}
