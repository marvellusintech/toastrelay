import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "turquoise" | "coral" | "gold";
  className?: string;
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
  className,
}: StatTileProps) {
  return (
    <Card className={cn("shrink-0 sm:shrink", className)}>
      <div className="flex flex-col items-start gap-2 px-4">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-black/[0.04]">
          <Icon className={`h-5 w-5 ${toneClass[tone]}`} />
        </div>
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="m text-3xl font-body font-bold tracking-normal">{value}</p>
      </div>
    </Card>
  );
}
