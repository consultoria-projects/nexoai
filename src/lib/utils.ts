import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string): string {
  const num = Number(value);
  if (Number.isNaN(num) || value === null || value === undefined) return "0,00 €";

  // Forzamos formato estricto España 1.234,00 € asegurando el punto incluso para 4 dígitos
  const parts = num.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${integerPart},${decimalPart} €`;
}
