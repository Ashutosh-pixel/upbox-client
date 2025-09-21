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

export function createChunks(file: File, chunkSize = 5*1024*1024){
  const chunks = [];
  let start = 0;

  while(start < file.size){
    const end = Math.min(start+chunkSize, file.size);
    const chunk = file.slice(start, end);
    chunks.push(chunk);
    start = end;
  }

  const totalParts = chunks.length;
  return {chunks, totalParts};
}