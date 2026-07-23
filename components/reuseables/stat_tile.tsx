import type { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

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

export function StatTile({
  icon: Icon,
  label,
  value,
  tone = "turquoise",
}: StatTileProps) {
  return (
    <Card>
      <div className="flex flex-col items-start gap-2 px-4">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-black/[0.04]">
          <Icon className={`h-5 w-5 ${toneClass[tone]}`} />
        </div>
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="m text-3xl font-display font-black tracking-normal">{value}</p>
      </div>
    </Card>
  );
}
