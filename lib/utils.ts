import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateFormat(dateStr: string) {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'short', day: '2-digit'};

  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
}