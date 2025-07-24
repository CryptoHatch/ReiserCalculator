import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency for Swiss Francs
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
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

// Generate strategy recommendations
export function generateRecommendations(params: {
  monthlyCap: number;
  flatPrice: number;
  equity: number;
  portfolioReturn: number;
  realEstateGrowth: number;
}): string[] {
  const recommendations: string[] = [];
  
  if (params.monthlyCap < 0.004 * params.flatPrice) {
    recommendations.push("⚠️ Monthly budget might be tight for property ownership. Consider a lower-priced property.");
  }
  
  if (params.equity > 0.4 * params.flatPrice) {
    recommendations.push("💡 High equity position - could consider investing excess above 20% requirement.");
  }
  
  if (params.portfolioReturn > params.realEstateGrowth + 0.02) {
    recommendations.push("📈 Expected investment returns significantly exceed real estate appreciation - consider allocating more to investments.");
  }
  
  return recommendations;
}