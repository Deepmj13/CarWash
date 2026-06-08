import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US')
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const currencySymbols: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'CA$', AUD: 'A$',
}

export function formatPrice(minPrice?: number, maxPrice?: number, currency?: string): string {
  const sym = currencySymbols[currency || 'USD'] || '$'
  if (!minPrice && !maxPrice) return sym
  if (minPrice && maxPrice && minPrice === maxPrice) return `${sym}${minPrice}`
  if (minPrice && maxPrice) return `${sym}${minPrice} – ${sym}${maxPrice}`
  if (minPrice) return `From ${sym}${minPrice}`
  return `Up to ${sym}${maxPrice}`
}
