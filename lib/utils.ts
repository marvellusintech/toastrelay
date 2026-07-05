import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export { formatDate } from "@/lib/utils/dateFormatter";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
