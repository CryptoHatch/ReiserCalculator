'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronDown, ChevronRight, AlertTriangle, Info, TrendingUp, Home, Building2, Coins } from 'lucide-react'
import { 
  simulateInvestmentStrategy,
  simulateRealEstateStrategy,
  simulateHybridStrategy,
  calculateMonthlyPayments,
  calculateMinimumPayments,
  calculatePortfolioReturn,
  validateSwissRequirements,
  calculateLtvProgression
} from '@/lib/simulations'
import { formatCurrency, formatPercentage, calculateCAGR, generateRecommendations } from '@/lib/utils'
import { Slider } from '@/components/Slider'

export default function InvestmentSimulator() {
  // State for all configuration parameters
  const [monthlyCap, setMonthlyCap] = useState(3500)
  const [monthlyRent, setMonthlyRent] = useState(2000)
  const [flatPrice, setFlatPrice] = useState(1000000)
  const [equity, setEquity] = useState(200000)
  const [interestRate, setInterestRate] = useState(1.5)
  const [realEstateGrowth, setRealEstateGrowth] = useState(2.0)
  const [stockAlloc, setStockAlloc] = useState(80)
  const [stockReturn, setStockReturn] = useState(7.0)
  const [btcReturn, setBtcReturn] = useState(20.0)
  
  // UI state
  const [expandedSections, setExpandedSections] = useState({
    monthlySavings: true,
    propertyDetails: true,
    marketParams: false,
    portfolio: true,
    returns: false
  })
  
  // Calculated values
  const btcAlloc = 100 - stockAlloc
  const portfolioReturn = calculatePortfolioReturn(stockAlloc, btcAlloc, stockReturn / 100, btcReturn / 100)
  const swissValidation = validateSwissRequirements(flatPrice, equity)
  
  // Calculate minimum payments
  const minPayments = calculateMinimumPayments(flatPrice, equity, interestRate / 100)
  const isMonthlyBudgetSufficient = monthlyCap >= minPayments.totalMinPayment
  
  // Calculate payment breakdowns for each strategy
  const pureInvestmentPayments = {
    interest: 0,
    amortization: 0,
    investment: monthlyCap - monthlyRent,
    isSufficient: monthlyCap >= monthlyRent
  }
  
  const realEstatePayments = calculateMonthlyPayments(
    flatPrice, equity, monthlyCap, interestRate / 100, 15, false
  )
  
  const hybridPayments = calculateMonthlyPayments(
    flatPrice, equity, monthlyCap, interestRate / 100, 15, true
  )
  
  // Run simulations
  const investmentProgression = simulateInvestmentStrategy(
    monthlyCap, portfolioReturn, equity, 30, monthlyRent
  )
  
  const realEstateMaxAmort = simulateRealEstateStrategy(
    flatPrice, equity, monthlyCap, interestRate / 100, realEstateGrowth / 100, 15, true, portfolioReturn
  )
  
  const realEstateInvest = simulateRealEstateStrategy(
    flatPrice, equity, monthlyCap, interestRate / 100, realEstateGrowth / 100, 15, false, portfolioReturn
  )
  
  const hybridProgression = simulateHybridStrategy(
    flatPrice, equity, monthlyCap, interestRate / 100, realEstateGrowth / 100, portfolioReturn, 15
  )
  
  // Prepare chart data
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    year: i + 1,
    rentInvest: investmentProgression[i],
    propertyFullRepay: realEstateMaxAmort.progression[i],
    propertyLaterInvest: realEstateInvest.progression[i],
    propertyMinInvest: hybridProgression.progression[i]
  }))
  
  // Generate recommendations  
  const recommendations = generateRecommendations({
    monthlyCap,
    flatPrice,
    equity,
    portfolioReturn,
    realEstateGrowth: realEstateGrowth / 100
  })
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🇨🇭</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Swiss Investment Strategy Simulator</h1>
              <p className="text-gray-600 mt-1">Compare three wealth-building strategies over 30 years</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Configuration */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Configuration
              </h2>
              
              {/* Monthly Savings */}
              <Collapsible.Root
                open={expandedSections.monthlySavings}
                onOpenChange={() => toggleSection('monthlySavings')}
              >
                <Collapsible.Trigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Monthly Savings
                  </span>
                  {expandedSections.monthlySavings ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Monthly Available Amount: {formatCurrency(monthlyCap)}
                    </label>
                    <Slider
                      value={[monthlyCap]}
                      onValueChange={(value) => setMonthlyCap(value[0])}
                      max={20000}
                      min={1000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Monthly Apartment Rent: {formatCurrency(monthlyRent)}
                    </label>
                    <Slider
                      value={[monthlyRent]}
                      onValueChange={(value) => setMonthlyRent(value[0])}
                      max={5000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>

              {/* Property Details */}
              <Collapsible.Root
                open={expandedSections.propertyDetails}
                onOpenChange={() => toggleSection('propertyDetails')}
              >
                <Collapsible.Trigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mt-4">
                  <span className="font-medium flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Property Details
                  </span>
                  {expandedSections.propertyDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Property Purchase Price: {formatCurrency(flatPrice)}
                    </label>
                    <Slider
                      value={[flatPrice]}
                      onValueChange={(value) => setFlatPrice(value[0])}
                      max={5000000}
                      min={500000}
                      step={50000}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Available Equity: {formatCurrency(equity)}
                    </label>
                    <Slider
                      value={[equity]}
                      onValueChange={(value) => setEquity(value[0])}
                      max={2000000}
                      min={100000}
                      step={10000}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Swiss validation warning */}
                  {!swissValidation.isValid && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-red-800">Swiss law requires minimum 20% equity!</p>
                          <p className="text-red-700 mt-1">
                            Required: {formatCurrency(swissValidation.requiredEquity)}<br />
                            Shortfall: {formatCurrency(swissValidation.shortfall)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Collapsible.Content>
              </Collapsible.Root>

              {/* Market Parameters */}
              <Collapsible.Root
                open={expandedSections.marketParams}
                onOpenChange={() => toggleSection('marketParams')}
              >
                <Collapsible.Trigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mt-4">
                  <span className="font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Market Parameters
                  </span>
                  {expandedSections.marketParams ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mortgage Interest Rate: {interestRate.toFixed(1)}%
                    </label>
                    <Slider
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      max={6.0}
                      min={-1.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Real Estate Appreciation: {realEstateGrowth.toFixed(1)}%
                    </label>
                    <Slider
                      value={[realEstateGrowth]}
                      onValueChange={(value) => setRealEstateGrowth(value[0])}
                      max={5.0}
                      min={0.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>

              {/* Investment Portfolio */}
              <Collapsible.Root
                open={expandedSections.portfolio}
                onOpenChange={() => toggleSection('portfolio')}
              >
                <Collapsible.Trigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mt-4">
                  <span className="font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Investment Portfolio
                  </span>
                  {expandedSections.portfolio ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stocks Allocation: {stockAlloc}%
                    </label>
                    <Slider
                      value={[stockAlloc]}
                      onValueChange={(value) => setStockAlloc(value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">₿ Bitcoin Allocation: {btcAlloc}%</p>
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>

              {/* Expected Returns */}
              <Collapsible.Root
                open={expandedSections.returns}
                onOpenChange={() => toggleSection('returns')}
              >
                <Collapsible.Trigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mt-4">
                  <span className="font-medium">Expected Returns</span>
                  {expandedSections.returns ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expected Stock Return: {stockReturn.toFixed(1)}%
                    </label>
                    <Slider
                      value={[stockReturn]}
                      onValueChange={(value) => setStockReturn(value[0])}
                      max={12.0}
                      min={4.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expected Bitcoin Return: {btcReturn.toFixed(1)}%
                    </label>
                    <Slider
                      value={[btcReturn]}
                      onValueChange={(value) => setBtcReturn(value[0])}
                      max={100.0}
                      min={-10.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>

              {/* Portfolio Summary */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <h4 className="font-medium text-sm mb-2">📊 Portfolio Composition</h4>
                <div className="text-xs space-y-1">
                  <div>📈 Stocks: {stockAlloc}% (Return: {stockReturn.toFixed(1)}%)</div>
                  <div>₿ Bitcoin: {btcAlloc}% (Return: {btcReturn.toFixed(1)}%)</div>
                  <div className="font-medium pt-1 border-t">
                    📈 Combined Portfolio Return: {formatPercentage(portfolioReturn)}
                  </div>
                </div>
              </div>

              {/* Budget Warnings */}
              {!isMonthlyBudgetSufficient && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800">Insufficient Monthly Budget</p>
                      <p className="text-red-700 mt-1">
                        Required: {formatCurrency(minPayments.totalMinPayment)}<br />
                        Your Budget: {formatCurrency(monthlyCap)}<br />
                        Shortfall: {formatCurrency(minPayments.totalMinPayment - monthlyCap)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Results Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Monthly Payment Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">💰 Monthly Payment Breakdown</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">🏢💰 Rent & Invest</h3>
                  <div className="space-y-2 text-sm">
                    <div>Investment: {formatCurrency(pureInvestmentPayments.investment)}</div>
                    <div>Rent: {formatCurrency(monthlyRent)}</div>
                    <div className="font-medium pt-2 border-t border-green-200">
                      Total: {formatCurrency(monthlyCap)}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">🏠↘️ Full Repayment</h3>
                  <div className="space-y-2 text-sm">
                    <div>Interest: {formatCurrency(realEstatePayments.interest)}</div>
                    <div>Amortization: {formatCurrency(realEstatePayments.amortization)}</div>
                    <div className="font-medium pt-2 border-t border-blue-200">
                      Total: {formatCurrency(realEstatePayments.interest + realEstatePayments.amortization)}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <h3 className="font-medium text-orange-800 mb-2">🏠📈 Later Invest</h3>
                  <div className="space-y-2 text-sm">
                    <div>Interest: {formatCurrency(realEstatePayments.interest)}</div>
                    <div>Amortization: {formatCurrency(realEstatePayments.amortization)}</div>
                    <div className="font-medium pt-2 border-t border-orange-200">
                      Total: {formatCurrency(realEstatePayments.interest + realEstatePayments.amortization)}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <h3 className="font-medium text-purple-800 mb-2">🏠💼 Min + Invest</h3>
                  <div className="space-y-2 text-sm">
                    <div>Interest: {formatCurrency(hybridPayments.interest)}</div>
                    <div>Amortization: {formatCurrency(hybridPayments.amortization)}</div>
                    <div>Investment: {formatCurrency(hybridPayments.investment)}</div>
                    <div className="font-medium pt-2 border-t border-purple-200">
                      Total: {formatCurrency(hybridPayments.interest + hybridPayments.amortization + hybridPayments.investment)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy Warnings */}
              {(!realEstatePayments.isSufficient || !hybridPayments.isSufficient || !pureInvestmentPayments.isSufficient) && (
                <div className="space-y-2">
                  {!realEstatePayments.isSufficient && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          Real estate strategies may not be feasible with current monthly budget.
                        </p>
                      </div>
                    </div>
                  )}
                  {!pureInvestmentPayments.isSufficient && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          Monthly rent exceeds available budget for pure investment strategy.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Final Values */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Final Values after 30 Years</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(investmentProgression[29])}
                  </div>
                  <div className="text-sm text-green-700 mt-1">🏢💰 Rent & Invest</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(realEstateMaxAmort.progression[29])}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">🏠↘️ Full Repayment</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(realEstateInvest.progression[29])}
                  </div>
                  <div className="text-sm text-orange-700 mt-1">🏠📈 Later Invest</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(hybridProgression.progression[29])}
                  </div>
                  <div className="text-sm text-purple-700 mt-1">🏠💼 Min + Invest</div>
                </div>
              </div>
            </div>

            {/* Net Worth Progression Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">📉 Net Worth Progression Over Time</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rentInvest" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="🏢💰 Rent & Invest"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="propertyFullRepay" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="🏠↘️ Full Repayment"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="propertyLaterInvest" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="🏠📈 Later Invest"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="propertyMinInvest" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="🏠💼 Min + Invest"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">💡 Strategy Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Annual Growth Rates (CAGR)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Rent & Invest:</span>
                      <span className="font-medium">{formatPercentage(calculateCAGR(equity, investmentProgression[29], 30))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Full Repayment:</span>
                      <span className="font-medium">{formatPercentage(calculateCAGR(equity, realEstateMaxAmort.progression[29], 30))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Later Invest:</span>
                      <span className="font-medium">{formatPercentage(calculateCAGR(equity, realEstateInvest.progression[29], 30))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min + Invest:</span>
                      <span className="font-medium">{formatPercentage(calculateCAGR(equity, hybridProgression.progression[29], 30))}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Risk Considerations</h3>
                  <div className="space-y-2 text-sm">
                    <div>📈 <strong>Rent & Invest:</strong> Highest liquidity, market volatility exposure</div>
                    <div>🏠 <strong>Full Repayment:</strong> Lowest liquidity, stable housing costs</div>
                    <div>🏠💼 <strong>Min + Invest:</strong> Balanced approach, diversified risk</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">🎯 Strategy Recommendations</h2>
              <p className="text-gray-600 mb-4">Based on your inputs, here are some key considerations:</p>
              
              {recommendations.length > 0 ? (
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-800">Your parameters look well-balanced for all strategies.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600">
              <p>
                <strong>Disclaimer:</strong> This simulation is for educational purposes only. Actual results may vary significantly based on market conditions, tax implications, and other factors not considered in this model. Please consult with financial and real estate professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}