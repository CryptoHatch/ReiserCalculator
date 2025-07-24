// Swiss Investment Strategy Simulator - Core Simulation Functions

export interface SimulationParams {
  monthlyCap: number;
  monthlyRent: number;
  flatPrice: number;
  equity: number;
  interestRate: number;
  realEstateGrowth: number;
  portfolioReturn: number;
  amortizationYears: number;
}

export interface PaymentBreakdown {
  interest: number;
  amortization: number;
  investment: number;
  isSufficient: boolean;
}

export interface SimulationResult {
  progression: number[];
  payoffYear?: number;
}

// Calculate minimum required payments according to Swiss law
export function calculateMinimumPayments(
  propertyPrice: number,
  downPayment: number,
  interestRate: number
): {
  monthlyInterest: number;
  monthlyMinAmort: number;
  totalMinPayment: number;
} {
  const loan = propertyPrice - downPayment;
  const monthlyInterest = (loan * interestRate) / 12;
  
  // Calculate minimum amortization if LTV > 66.7%
  const ltv = loan / propertyPrice;
  let monthlyMinAmort = 0;
  
  if (ltv > 0.667) {
    const minAmortPerYear = (loan - propertyPrice * 0.667) / 15;
    monthlyMinAmort = minAmortPerYear / 12;
  }
  
  return {
    monthlyInterest,
    monthlyMinAmort,
    totalMinPayment: monthlyInterest + monthlyMinAmort
  };
}

// Calculate monthly payments for different strategies
export function calculateMonthlyPayments(
  propertyPrice: number,
  downPayment: number,
  monthlyBudget: number,
  interestRate: number,
  amortYears: number,
  isHybrid: boolean = false
): PaymentBreakdown {
  const loan = propertyPrice - downPayment;
  const ltv = loan / propertyPrice;
  
  // Calculate minimum required amortization
  let minAmortPerYear = 0;
  if (ltv > 0.667) {
    minAmortPerYear = (loan - propertyPrice * 0.667) / 15;
  }
  
  const monthlyInterest = (loan * interestRate) / 12;
  const monthlyMinAmort = minAmortPerYear / 12;
  
  // Check if budget is sufficient
  const isSufficient = monthlyBudget >= (monthlyInterest + monthlyMinAmort);
  
  let monthlyAmort = 0;
  let monthlyInvestment = 0;
  
  if (!isSufficient) {
    monthlyAmort = Math.max(0, monthlyBudget - monthlyInterest);
    monthlyInvestment = 0;
  } else {
    if (isHybrid) {
      monthlyAmort = monthlyMinAmort;
      monthlyInvestment = Math.max(0, monthlyBudget - monthlyInterest - monthlyAmort);
    } else {
      monthlyAmort = Math.min(loan / 12, Math.max(monthlyMinAmort, monthlyBudget - monthlyInterest));
      monthlyInvestment = 0;
    }
  }
  
  return {
    interest: monthlyInterest,
    amortization: monthlyAmort,
    investment: monthlyInvestment,
    isSufficient
  };
}

// Pure investment strategy simulation
export function simulateInvestmentStrategy(
  monthlyAmount: number,
  annualReturn: number,
  initialCapital: number,
  years: number,
  monthlyRent: number = 0
): number[] {
  const monthlyRate = Math.pow(1 + annualReturn, 1/12) - 1;
  let value = initialCapital;
  const progression: number[] = [];
  
  for (let year = 0; year < years; year++) {
    for (let month = 0; month < 12; month++) {
      value = value * (1 + monthlyRate) + (monthlyAmount - monthlyRent);
    }
    progression.push(value);
  }
  
  return progression;
}

// Real estate strategy simulation
export function simulateRealEstateStrategy(
  propertyPrice: number,
  downPayment: number,
  monthlyBudget: number,
  interestRate: number,
  appreciationRate: number,
  amortYears: number,
  continueAmortization: boolean = true,
  portfolioReturn: number = 0
): SimulationResult {
  let loan = propertyPrice - downPayment;
  let balance = loan;
  let propertyValue = propertyPrice;
  let investmentValue = 0;
  const netWorth: number[] = [];
  const targetLtv = 0.667;
  let payoffYear: number | undefined;
  
  // Calculate required amortization
  const ltv = loan / propertyPrice;
  let minAmortPerYear = 0;
  if (ltv > 0.667) {
    minAmortPerYear = (loan - propertyPrice * 0.667) / 15;
  }
  
  for (let year = 0; year < 30; year++) {
    propertyValue *= (1 + appreciationRate);
    const interest = balance * interestRate;
    
    // Calculate current LTV
    const currentLtv = balance / propertyValue;
    
    // Available for amortization after interest
    const availableForAmort = monthlyBudget * 12 - interest;
    
    if (balance === 0) {
      // Property fully paid off - invest all monthly budget
      const monthlyInvestment = monthlyBudget;
      investmentValue = investmentValue * (1 + portfolioReturn) + (monthlyInvestment * 12);
    } else if (currentLtv > targetLtv || (continueAmortization && year < amortYears)) {
      // Continue amortizing based on strategy
      const amortization = Math.min(balance, Math.max(minAmortPerYear, availableForAmort));
      balance -= amortization;
      
      // Check if we just paid off the property
      if (balance === 0 && payoffYear === undefined) {
        payoffYear = year + 1;
      }
    } else {
      // If target LTV reached and not continuing amortization, invest excess
      const monthlyInvestment = Math.max(0, (monthlyBudget * 12 - interest) / 12);
      investmentValue = investmentValue * (1 + portfolioReturn) + (monthlyInvestment * 12);
    }
    
    netWorth.push(propertyValue - balance + investmentValue);
  }
  
  return { progression: netWorth, payoffYear };
}

// Hybrid strategy simulation
export function simulateHybridStrategy(
  propertyPrice: number,
  downPayment: number,
  monthlyBudget: number,
  interestRate: number,
  appreciationRate: number,
  portfolioReturn: number,
  amortYears: number
): SimulationResult {
  let loan = propertyPrice - downPayment;
  let balance = loan;
  let propertyValue = propertyPrice;
  let investmentValue = 0;
  const netWorth: number[] = [];
  const targetLtv = 0.667;
  let payoffYear: number | undefined;
  
  // Calculate minimum required amortization
  const ltv = loan / propertyPrice;
  let minAmortPerYear = 0;
  if (ltv > 0.667) {
    minAmortPerYear = (loan - propertyPrice * 0.667) / 15;
  }
  
  for (let year = 0; year < 30; year++) {
    propertyValue *= (1 + appreciationRate);
    const interest = balance * interestRate;
    
    // Calculate current LTV
    const currentLtv = balance / propertyValue;
    
    // Monthly calculations
    const monthlyInterest = interest / 12;
    
    if (balance === 0) {
      // Property fully paid off - invest all monthly budget
      const monthlyInvestment = monthlyBudget;
      investmentValue = investmentValue * (1 + portfolioReturn) + (monthlyInvestment * 12);
      if (payoffYear === undefined) {
        payoffYear = year + 1;
      }
    } else if (currentLtv > targetLtv && year < amortYears) {
      // Only amortize if above target LTV
      const monthlyMinAmort = minAmortPerYear / 12;
      const monthlyInvestment = Math.max(0, monthlyBudget - monthlyInterest - monthlyMinAmort);
      balance -= minAmortPerYear;
      
      // Grow investments
      investmentValue = investmentValue * (1 + portfolioReturn) + (monthlyInvestment * 12);
    } else {
      // If target LTV reached, all excess goes to investment
      const monthlyInvestment = Math.max(0, monthlyBudget - monthlyInterest);
      investmentValue = investmentValue * (1 + portfolioReturn) + (monthlyInvestment * 12);
    }
    
    balance = Math.max(0, balance);
    netWorth.push(propertyValue - balance + investmentValue);
  }
  
  return { progression: netWorth, payoffYear };
}

// Calculate LTV progression for visualization
export function calculateLtvProgression(
  propertyPrice: number,
  downPayment: number,
  monthlyBudget: number,
  interestRate: number,
  realEstateGrowth: number,
  strategy: 'pure_max' | 'pure_invest' | 'hybrid'
): {
  yearsToTarget?: number;
  ltvProgression: number[];
} {
  let loan = propertyPrice - downPayment;
  let balance = loan;
  let propertyValue = propertyPrice;
  const targetLtv = 0.667;
  let yearsToTarget: number | undefined;
  let targetReached = false;
  const ltvProgression: number[] = [];
  
  // Calculate required minimum amortization
  const requiredLoanReduction = loan - (propertyPrice * targetLtv);
  const minMonthlyAmort = requiredLoanReduction / (15 * 12);
  
  // Ensure we have exactly 360 months (30 years) of data
  for (let month = 0; month < 360; month++) {
    // Update property value with monthly growth rate
    propertyValue *= Math.pow(1 + realEstateGrowth, 1/12);
    
    // Calculate current monthly interest based on current balance
    const monthlyInterest = balance * interestRate / 12;
    
    // Calculate current LTV
    const currentLtv = balance / propertyValue;
    
    // Determine amortization based on strategy
    let monthlyAmort = 0;
    
    if (currentLtv <= targetLtv) {
      if (!targetReached) {
        targetReached = true;
        yearsToTarget = Math.floor(month / 12) + 1;
      }
      
      if (strategy === 'pure_max') {
        // Continue maximum amortization
        const availableForAmort = monthlyBudget - monthlyInterest;
        monthlyAmort = Math.min(balance, Math.max(minMonthlyAmort, availableForAmort));
      } else {
        // For both hybrid and pure_invest, stop amortization and invest
        monthlyAmort = 0;
      }
    } else {
      if (strategy === 'hybrid') {
        // Hybrid: Pay only minimum required
        monthlyAmort = minMonthlyAmort;
      } else {
        // Pure strategies: Pay maximum possible until target reached
        const availableForAmort = monthlyBudget - monthlyInterest;
        monthlyAmort = Math.min(balance, Math.max(minMonthlyAmort, availableForAmort));
      }
    }
    
    // Update balance with amortization
    balance = Math.max(0, balance - monthlyAmort);
    
    // Store yearly LTV values
    if (month % 12 === 11) {
      ltvProgression.push(currentLtv);
    }
  }
  
  return { yearsToTarget, ltvProgression };
}

// Calculate portfolio return based on allocation
export function calculatePortfolioReturn(
  stockAlloc: number,
  btcAlloc: number,
  stockReturn: number,
  btcReturn: number
): number {
  return (stockAlloc / 100 * stockReturn) + (btcAlloc / 100 * btcReturn);
}

// Validate Swiss regulatory requirements
export function validateSwissRequirements(
  propertyPrice: number,
  equity: number
): {
  isValid: boolean;
  requiredEquity: number;
  shortfall: number;
} {
  const requiredEquity = propertyPrice * 0.2;
  const shortfall = Math.max(0, requiredEquity - equity);
  
  return {
    isValid: equity >= requiredEquity,
    requiredEquity,
    shortfall
  };
}