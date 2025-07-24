# Swiss Investment Strategy Simulator - Next.js Version

A modern web application that helps Swiss residents compare different wealth-building strategies over a 30-year period. This Next.js version provides a responsive, interactive interface for financial planning and investment strategy comparison.

## Features

- 🏢💰 **Rent & Invest Strategy**: Pure investment approach with rental costs
- 🏠↘️ **Property Full Repayment**: Maximum mortgage amortization strategy  
- 🏠📈 **Property + Later Invest**: Amortize to target LTV then invest excess
- 🏠💼 **Property Min + Invest**: Minimum amortization with parallel investment

### Swiss Regulatory Compliance
- Enforces 20% minimum equity requirement
- Implements mandatory amortization to 66.7% LTV within 15 years
- Real-time validation of monthly budget sufficiency

### Interactive Features
- Real-time parameter adjustment with sliders
- Dynamic strategy comparison and validation
- Comprehensive payment breakdown tables
- Interactive charts showing net worth progression over 30 years
- Strategy-specific warnings and recommendations

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualization
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Main simulator page
├── lib/
│   ├── simulations.ts       # Core simulation functions
│   ├── utils.ts             # Utility functions and helpers
├── components/
│   ├── Slider.tsx           # Custom slider component
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Key Components

### Simulation Functions (`lib/simulations.ts`)
- `simulateInvestmentStrategy()` - Pure investment with monthly contributions
- `simulateRealEstateStrategy()` - Real estate with configurable amortization
- `simulateHybridStrategy()` - Minimum amortization plus investment
- `calculateLtvProgression()` - LTV calculations over time
- Swiss regulatory validation functions

### Main Interface (`app/page.tsx`)
- Collapsible configuration sidebar
- Real-time parameter adjustment
- Interactive visualizations
- Strategy comparison tables

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Collapsible sidebar sections for better mobile UX
- Adaptive chart sizing and responsive tables

## Configuration Parameters

### Monthly Savings
- Monthly available amount (CHF 1,000 - 20,000)
- Monthly apartment rent (CHF 0 - 5,000)

### Property Details  
- Property purchase price (CHF 500,000 - 5,000,000)
- Available equity with 20% minimum validation

### Market Parameters
- Mortgage interest rate (-1% to 6%)
- Real estate appreciation rate (0% to 5%)

### Investment Portfolio
- Stock/Bitcoin allocation (customizable split)
- Expected returns for each asset class

## Swiss Regulatory Features

The application automatically enforces Swiss mortgage regulations:

- **Minimum Equity**: 20% of property value required
- **LTV Limits**: Mandatory amortization to 66.7% LTV within 15 years
- **Budget Validation**: Ensures monthly budget covers minimum payments
- **Real-time Warnings**: Alerts for regulatory non-compliance

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

The modular architecture makes it easy to extend:

1. **New Simulation Logic**: Add functions to `lib/simulations.ts`
2. **UI Components**: Create in `components/` directory
3. **Styling**: Use Tailwind classes or extend `globals.css`
4. **Configuration**: Modify parameters in main page component

## Performance Optimizations

- Client-side state management for real-time updates
- Optimized chart rendering with Recharts
- Efficient re-calculations using React hooks
- Responsive images and adaptive layouts

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details

## Disclaimer

This simulation is for educational purposes only. Actual results may vary significantly based on market conditions, tax implications, and other factors not considered in this model. Please consult with financial and real estate professionals before making investment decisions.