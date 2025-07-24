# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Streamlit Application (Python)
```bash
streamlit run app.py
```

### Running the Next.js Application (JavaScript/TypeScript)
```bash
npm install
npm run dev
```

### Running Tests
```bash
python3 -m pytest gpt_unittest.py -v
```

### Installing Dependencies
```bash
# Python version
pip install -r requirements.txt

# Next.js version  
npm install
```

## Project Architecture

This repository contains two implementations of the Swiss Investment Strategy Simulator:

1. **Streamlit Version (Python)** - Original implementation with server-side rendering
2. **Next.js Version (TypeScript)** - Modern web application with client-side interactivity

Both versions compare different wealth-building approaches over 30 years for Swiss residents.

### Streamlit Version (Python Files)

The Streamlit application is structured around three main files:

### Core Files
- **`app.py`** - Main Streamlit application with comprehensive UI and four investment strategies
- **`gpt_simulation.py`** - Core simulation functions and mathematical models (older, simpler version)
- **`gpt_unittest.py`** - Pytest test suite covering simulation functions

### Application Structure

The main application (`app.py`) implements four investment strategies:
1. **Rent & Invest Strategy** - Pure investment with rental costs
2. **Property Full Repayment** - Maximum mortgage amortization
3. **Property + Later Invest** - Amortize to target LTV then invest
4. **Property Min + Invest** - Minimum required amortization with parallel investment

### Key Components

**Swiss Regulatory Compliance:**
- Enforces 20% minimum equity requirement
- Implements mandatory amortization to 66.7% LTV within 15 years
- Validates monthly budget sufficiency for mortgage payments

**Simulation Functions:**
- `simulate_investment_strategy()` - Pure investment with monthly contributions
- `simulate_real_estate_strategy()` - Real estate with configurable amortization
- `simulate_hybrid_strategy()` - Minimum amortization plus investment
- `calculate_ltv_progression()` - LTV calculations over time

**UI Features:**
- Interactive parameter sliders in sidebar
- Real-time strategy validation and warnings
- Monthly payment breakdown tables
- Net worth progression charts with LTV visualization
- Custom CSS styling with tooltips

### Dependencies
- **streamlit** - Web application framework
- **numpy** - Numerical calculations
- **matplotlib** - Plotting and visualization
- **pandas** - Data manipulation for tables

### Testing
The test suite covers simulation accuracy, edge cases, and mathematical consistency. Run tests to verify simulation logic after modifications.

### Key Configuration Parameters
- Monthly savings budget
- Property price and equity
- Mortgage interest rates
- Real estate appreciation
- Portfolio allocation (stocks/Bitcoin)
- Expected investment returns

The application automatically handles Swiss mortgage regulations and provides warnings when user inputs don't meet legal requirements or budget constraints.

### Next.js Version (TypeScript Files)

The modern web application is structured around these key files:

**Core Files:**
- **`app/page.tsx`** - Main React component with complete UI and simulation logic
- **`app/layout.tsx`** - Root layout with global styling and metadata
- **`lib/simulations.ts`** - All simulation functions converted to TypeScript
- **`lib/utils.ts`** - Utility functions for formatting and calculations
- **`components/Slider.tsx`** - Custom slider component using Radix UI

**Configuration Files:**
- **`package.json`** - Dependencies and scripts
- **`next.config.js`** - Next.js configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript configuration

**Key Features:**
- Real-time client-side calculations and updates
- Responsive design with mobile-first approach
- Interactive charts using Recharts
- Collapsible configuration sections
- Swiss regulatory validation with real-time warnings
- Modern UI with Tailwind CSS and Radix UI components

**Technology Stack:**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Recharts for data visualization
- Radix UI for accessible components

### Shared Simulation Logic

Both versions implement the same four investment strategies with identical Swiss regulatory compliance:

1. **Rent & Invest Strategy** - Pure investment with rental costs
2. **Property Full Repayment** - Maximum mortgage amortization  
3. **Property + Later Invest** - Amortize to target LTV then invest
4. **Property Min + Invest** - Minimum required amortization with parallel investment

The mathematical models and Swiss regulatory requirements are consistently implemented across both platforms.