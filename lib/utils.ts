import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency for Swiss Francs (German formatting)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format numbers with German/Swiss conventions
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Calculate CAGR (Compound Annual Growth Rate)
export function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  return Math.pow(finalValue / initialValue, 1 / years) - 1;
}

// Debounce function for input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Generate strategy recommendations (German)
export function generateRecommendations(params: {
  monthlyCap: number;
  flatPrice: number;
  equity: number;
  portfolioReturn: number;
  realEstateGrowth: number;
}): string[] {
  const recommendations: string[] = [];
  
  if (params.monthlyCap < 0.004 * params.flatPrice) {
    recommendations.push("⚠️ Monatliches Budget könnte für Immobilieneigentum knapp sein. Erwägen Sie eine günstigere Immobilie.");
  }
  
  if (params.equity > 0.4 * params.flatPrice) {
    recommendations.push("💡 Hohe Eigenkapitalposition - könnten Überschuss über 20%-Anforderung investieren.");
  }
  
  if (params.portfolioReturn > params.realEstateGrowth + 0.02) {
    recommendations.push("📈 Erwartete Investitionsrenditen übersteigen deutlich die Immobilien-Wertsteigerung - erwägen Sie mehr Allokation in Investitionen.");
  }
  
  return recommendations;
}