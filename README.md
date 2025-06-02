# Swiss Investment Strategy Simulator 🇨🇭

This Streamlit application helps Swiss residents compare different wealth-building strategies over a 30-year period. The simulator compares three main strategies:

1. 📈 **Pure Investment Strategy**: Investing monthly savings in a diversified portfolio of stocks and bonds
2. 🏠 **Pure Real Estate Strategy**: Focusing on property ownership with maximum amortization
3. 🏠💼 **Hybrid Strategy**: Property ownership with minimum required amortization and surplus investment

## Features

- Interactive sliders for all key parameters
- Real-time simulation updates
- Swiss-specific mortgage rules compliance
- Detailed visualization of wealth progression
- Key metrics and strategy recommendations
- Risk consideration analysis

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd swiss-investment-simulator
```

2. Install the required packages:
```bash
pip install -r requirements.txt
```

## Usage

Run the Streamlit application:
```bash
streamlit run app.py
```

## Input Parameters

### Monthly Savings
- Set your available monthly amount for investment/mortgage/amortization

### Property Details
- Property purchase price
- Available equity (minimum 20% required by Swiss law)

### Market Parameters
- Mortgage interest rate
- Real estate appreciation rate
- Amortization period (follows Swiss regulations)

### Investment Portfolio
- Stock/Bond allocation
- Expected returns for each asset class

## Swiss-Specific Features

The simulator incorporates Swiss real estate regulations:
- Minimum 20% equity requirement
- Mandatory amortization to 66.7% LTV within 15 years
- Realistic mortgage rates and property appreciation scenarios

## Disclaimer

This simulation is for educational purposes only. Actual results may vary significantly based on market conditions, tax implications, and other factors not considered in this model. Please consult with financial and real estate professionals before making investment decisions.

## License

MIT License 