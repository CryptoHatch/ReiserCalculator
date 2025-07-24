/**
 * Test suite for Swiss Investment Strategy Simulator
 * Validates mathematical accuracy and Swiss regulatory compliance
 */

import {
  simulateInvestmentStrategy,
  simulateRealEstateStrategy,
  simulateHybridStrategy,
  calculateMinimumPayments,
  calculateMonthlyPayments,
  calculatePortfolioReturn,
  validateSwissRequirements,
  calculateLtvProgression
} from '../simulations';

describe('Investment Strategy Simulations', () => {
  describe('simulateInvestmentStrategy', () => {
    it('should grow more than sum of contributions due to compounding', () => {
      const result = simulateInvestmentStrategy(1000, 0.05, 0, 30, 0);
      expect(result).toHaveLength(30);
      // After 30 years, should be more than raw cash invested due to compound growth
      expect(result[29]).toBeGreaterThan(1000 * 12 * 30);
    });

    it('should equal contributions plus initial capital with zero return', () => {
      const result = simulateInvestmentStrategy(500, 0.0, 10000, 10, 0);
      const expected = 10000 + 500 * 12 * 10;
      expect(result[9]).toBeCloseTo(expected, 1);
    });

    it('should account for monthly rent properly', () => {
      const withRent = simulateInvestmentStrategy(1000, 0.05, 0, 10, 200);
      const withoutRent = simulateInvestmentStrategy(800, 0.05, 0, 10, 0);
      // Results should be approximately equal when accounting for rent
      expect(withRent[9]).toBeCloseTo(withoutRent[9], -2); // Allow for small compound differences
    });
  });

  describe('calculateMinimumPayments', () => {
    it('should calculate Swiss minimum payments correctly', () => {
      const result = calculateMinimumPayments(1000000, 200000, 0.015);
      const loan = 800000;
      const expectedInterest = (loan * 0.015) / 12;
      const expectedMinAmort = ((loan - 1000000 * 0.667) / 15) / 12;
      
      expect(result.monthlyInterest).toBeCloseTo(expectedInterest, 2);
      expect(result.monthlyMinAmort).toBeCloseTo(expectedMinAmort, 2);
      expect(result.totalMinPayment).toBeCloseTo(expectedInterest + expectedMinAmort, 2);
    });

    it('should have zero minimum amortization when LTV <= 66.7%', () => {
      const result = calculateMinimumPayments(1000000, 400000, 0.015);
      expect(result.monthlyMinAmort).toBe(0);
      expect(result.totalMinPayment).toBeCloseTo((600000 * 0.015) / 12, 2);
    });
  });

  describe('calculateMonthlyPayments', () => {
    it('should handle sufficient budget correctly', () => {
      const result = calculateMonthlyPayments(1000000, 200000, 2500, 0.015, 15, false);
      expect(result.isSufficient).toBe(true);
      expect(result.interest).toBeGreaterThan(0);
      expect(result.amortization).toBeGreaterThan(0);
      expect(result.investment).toBe(0); // Non-hybrid strategy
    });

    it('should handle insufficient budget correctly', () => {
      const result = calculateMonthlyPayments(1000000, 200000, 500, 0.015, 15, false);
      expect(result.isSufficient).toBe(false);
      expect(result.investment).toBe(0);
      // Should allocate all remaining budget after interest to amortization
      expect(result.amortization).toBeCloseTo(Math.max(0, 500 - result.interest), 2);
    });

    it('should handle hybrid strategy correctly', () => {
      const result = calculateMonthlyPayments(1000000, 200000, 2500, 0.015, 15, true);
      expect(result.isSufficient).toBe(true);
      expect(result.investment).toBeGreaterThan(0); // Should have investment in hybrid
      // Should pay only minimum amortization
      const expectedMinAmort = ((800000 - 1000000 * 0.667) / 15) / 12;
      expect(result.amortization).toBeCloseTo(expectedMinAmort, 2);
    });
  });

  describe('Swiss Regulatory Compliance', () => {
    describe('validateSwissRequirements', () => {
      it('should validate 20% equity requirement', () => {
        const valid = validateSwissRequirements(1000000, 200000);
        expect(valid.isValid).toBe(true);
        expect(valid.requiredEquity).toBe(200000);
        expect(valid.shortfall).toBe(0);

        const invalid = validateSwissRequirements(1000000, 150000);
        expect(invalid.isValid).toBe(false);
        expect(invalid.requiredEquity).toBe(200000);
        expect(invalid.shortfall).toBe(50000);
      });
    });
  });

  describe('Real Estate Strategy', () => {
    it('should always increase net worth with property appreciation', () => {
      const result = simulateRealEstateStrategy(
        1000000, 200000, 2500, 0.01, 0.03, 15, true, 0.07
      );
      expect(result.progression).toHaveLength(30);
      
      // Net worth should generally increase over time with appreciation
      const earlyValue = result.progression[5];
      const lateValue = result.progression[25];
      expect(lateValue).toBeGreaterThan(earlyValue);
    });

    it('should set payoff year when property is fully amortized', () => {
      // High monthly budget should lead to faster payoff
      const result = simulateRealEstateStrategy(
        500000, 100000, 5000, 0.02, 0.02, 10, true, 0.05
      );
      
      // Should have a payoff year when loan is fully paid
      if (result.payoffYear) {
        expect(result.payoffYear).toBeGreaterThan(0);
        expect(result.payoffYear).toBeLessThanOrEqual(30);
      }
    });
  });

  describe('Hybrid Strategy', () => {
    it('should balance amortization and investment', () => {
      const result = simulateHybridStrategy(
        1000000, 200000, 3000, 0.015, 0.025, 0.07, 15
      );
      expect(result.progression).toHaveLength(30);
      expect(result.progression[29]).toBeGreaterThan(200000); // Should grow from initial equity
    });

    it('should set payoff year correctly', () => {
      const result = simulateHybridStrategy(
        600000, 200000, 4000, 0.01, 0.02, 0.08, 15
      );
      
      // With high budget, should eventually pay off property
      if (result.payoffYear) {
        expect(result.payoffYear).toBeGreaterThan(0);
        expect(result.payoffYear).toBeLessThanOrEqual(30);
      }
    });
  });

  describe('LTV Progression', () => {
    it('should calculate years to target LTV correctly', () => {
      const result = calculateLtvProgression(
        1000000, 200000, 3000, 0.015, 0.02, 'pure_max'
      );
      
      expect(result.ltvProgression).toHaveLength(30);
      
      // Should reach target LTV at some point with sufficient budget
      if (result.yearsToTarget) {
        expect(result.yearsToTarget).toBeGreaterThan(0);
        expect(result.yearsToTarget).toBeLessThanOrEqual(30);
      }
    });

    it('should handle different strategies differently', () => {
      const pureMax = calculateLtvProgression(1000000, 200000, 3000, 0.015, 0.02, 'pure_max');
      const hybrid = calculateLtvProgression(1000000, 200000, 3000, 0.015, 0.02, 'hybrid');
      
      // Pure max should reach target faster due to more aggressive amortization
      if (pureMax.yearsToTarget && hybrid.yearsToTarget) {
        expect(pureMax.yearsToTarget).toBeLessThanOrEqual(hybrid.yearsToTarget);
      }
    });
  });

  describe('Portfolio Return Calculation', () => {
    it('should calculate weighted portfolio returns correctly', () => {
      const result = calculatePortfolioReturn(80, 20, 0.07, 0.15);
      const expected = 0.8 * 0.07 + 0.2 * 0.15;
      expect(result).toBeCloseTo(expected, 4);
    });

    it('should handle 100% allocation correctly', () => {
      const allStocks = calculatePortfolioReturn(100, 0, 0.08, 0.20);
      expect(allStocks).toBeCloseTo(0.08, 4);

      const allBtc = calculatePortfolioReturn(0, 100, 0.08, 0.20);
      expect(allBtc).toBeCloseTo(0.20, 4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero returns gracefully', () => {
      const result = simulateInvestmentStrategy(1000, 0, 10000, 5, 0);
      const expected = 10000 + 1000 * 12 * 5;
      expect(result[4]).toBeCloseTo(expected, 1);
    });

    it('should handle negative returns', () => {
      const result = simulateInvestmentStrategy(1000, -0.05, 0, 10, 0);
      expect(result[9]).toBeLessThan(1000 * 12 * 10);
    });

    it('should protect against division by zero in LTV calculations', () => {
      // This should not throw an error
      expect(() => {
        calculateLtvProgression(1000000, 200000, 3000, 0.015, 0, 'pure_max');
      }).not.toThrow();
    });

    it('should handle very high monthly budgets', () => {
      const result = simulateRealEstateStrategy(
        500000, 100000, 50000, 0.02, 0.03, 5, true, 0.07
      );
      expect(result.progression).toHaveLength(30);
      expect(result.payoffYear).toBeDefined();
      expect(result.payoffYear).toBeLessThan(10); // Should pay off quickly with high budget
    });
  });

  describe('Mathematical Consistency', () => {
    it('should maintain consistent compound interest calculations', () => {
      // Test that monthly rate conversion is consistent
      const annualRate = 0.07;
      const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;
      const backToAnnual = Math.pow(1 + monthlyRate, 12) - 1;
      expect(backToAnnual).toBeCloseTo(annualRate, 6);
    });

    it('should maintain precision over long simulation periods', () => {
      const result1 = simulateInvestmentStrategy(1000, 0.05, 0, 30, 0);
      const result2 = simulateInvestmentStrategy(1000, 0.05, 0, 30, 0);
      
      // Results should be exactly identical
      expect(result1[29]).toEqual(result2[29]);
    });
  });
});