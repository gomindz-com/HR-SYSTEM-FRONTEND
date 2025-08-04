import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return d.toLocaleString("en-US", options);
};

export const formatDateOnly = (date: string | Date): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return d.toLocaleDateString("en-US", options);
};

export const formatTimeOnly = (date: string | Date | null): string => {
  // Handle null values (for absent records)
  if (!date) {
    return "-";
  }

  const d = new Date(date);

  // Check if the date is valid (not Invalid Date)
  if (isNaN(d.getTime())) {
    return "-";
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return d.toLocaleTimeString("en-US", options);
};
