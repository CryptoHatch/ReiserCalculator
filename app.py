import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
import pandas as pd

# Page configuration
st.set_page_config(
    page_title="Swiss Investment Strategy Simulator",
    page_icon="🇨🇭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stSlider {
        padding-bottom: 1rem;
    }
    .stMetric {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
    }
    .tooltip {
        position: relative;
        display: inline-block;
        cursor: help;
    }
    </style>
""", unsafe_allow_html=True)

st.title("🇨🇭 Swiss Investment Strategy Simulator")
st.markdown("""
Compare three wealth-building strategies over 30 years:
1. 📈 **Pure Investment**: Monthly savings invested in a diversified portfolio
2. 🏠 **Pure Real Estate**: Focus on property ownership and amortization
3. 🏠💼 **Hybrid Approach**: Property ownership with minimum amortization and surplus investment
""")

# --- Sidebar Configuration ---
with st.sidebar:
    st.header("📊 Configuration")
    
    # Monthly Investment Settings
    with st.expander("💰 Monthly Savings", expanded=True):
        monthly_cap = st.slider(
            "Monthly Available Amount (CHF)",
            min_value=1000,
            max_value=20000,
            value=3500,
            step=100,
            help="Your monthly amount available for investment/mortgage/amortization"
        )
        
        monthly_rent = st.slider(
            "Monthly Apartment Rent (CHF)",
            min_value=0,
            max_value=5000,
            value=2000,
            step=100,
            help="Monthly rent to be deducted from pure investment strategy"
        )

    # Real Estate Settings
    with st.expander("🏠 Property Details", expanded=True):
        flat_price = st.slider(
            "Property Purchase Price (CHF)",
            min_value=500_000,
            max_value=5_000_000,
            value=1_000_000,
            step=50_000,
            help="The purchase price of the property"
        )
        
        equity = st.slider(
            "Available Equity (CHF)",
            min_value=100_000,
            max_value=2_000_000,
            value=200_000,
            step=10_000,
            help="Your available down payment (minimum 20% required in Switzerland)"
        )
        
        # Swiss-specific validation
        insufficient_equity = equity < 0.2 * flat_price
        if insufficient_equity:
            st.error("⚠️ Warning: Swiss law requires minimum 20% equity! Results shown below assume you will increase your equity to meet this requirement.")
            st.markdown(f"""
            **Required equity:** CHF {(0.2 * flat_price):,.0f}
            **Your equity:** CHF {equity:,.0f}
            **Shortfall:** CHF {(0.2 * flat_price - equity):,.0f}
            """)

    # Market Parameters
    with st.expander("📈 Market Parameters", expanded=True):
        interest_rate = st.slider(
            "Mortgage Interest Rate (%)",
            min_value=-1.0,
            max_value=6.0,
            value=1.5,
            step=0.1,
            help="Annual mortgage interest rate"
        ) / 100
        
        real_estate_growth = st.slider(
            "Real Estate Appreciation (%)",
            min_value=0.0,
            max_value=5.0,
            value=2.0,
            step=0.1,
            help="Expected annual property value appreciation"
        ) / 100

        # Swiss LTV calculations
        ltv_initial = 1 - equity / flat_price
        swiss_ltv_limit = 0.667  # Swiss legal limit
        swiss_min_period = 15    # Years to reach target LTV

        # Amortization settings
        if ltv_initial > swiss_ltv_limit:
            st.warning("🇨🇭 Swiss law requires amortization to 66.7% LTV within 15 years")
            amortization_years = swiss_min_period
        else:
            amortization_years = st.slider(
                "Amortization Period (Years)",
                min_value=5,
                max_value=30,
                value=15,
                help="Period over which to amortize the mortgage"
            )

    # Investment Portfolio Settings
    with st.expander("💼 Investment Portfolio", expanded=True):
        stock_alloc = st.slider(
            "📈 Stocks Allocation (%)",
            min_value=0,
            max_value=100,
            value=80,
            step=5,
            help="Percentage allocated to stocks (remainder goes to Bitcoin)"
        )
        
        btc_alloc = 100 - stock_alloc
        st.info(f"₿ Bitcoin Allocation: {btc_alloc}%")
        
        stock_return = st.slider(
            "📈 Expected Stock Return (%)",
            min_value=4.0,
            max_value=12.0,
            value=7.0,
            step=0.1,
            help="Long-term expected annual stock market return"
        ) / 100
        
        btc_return = st.slider(
            "₿ Expected Bitcoin Return (%)",
            min_value=-10.0,
            max_value=100.0,
            value=20.0,
            step=0.1,
            help="Expected annual Bitcoin return"
        ) / 100

# Calculate portfolio return
portfolio_return = (stock_alloc/100 * stock_return) + (btc_alloc/100 * btc_return)

# Add portfolio composition display
st.sidebar.markdown("---")
st.sidebar.markdown("#### 📊 Portfolio Composition")
st.sidebar.markdown(f"""
- 📈 Stocks: {stock_alloc}% (Expected return: {stock_return*100:.1f}%)
- ₿ Bitcoin: {btc_alloc}% (Expected return: {btc_return*100:.1f}%)
- 📈 Combined Portfolio Return: {portfolio_return*100:.1f}%
""")

# Calculate minimum required monthly payments
def calculate_minimum_payments(property_price, down_payment, interest_rate):
    loan = property_price - down_payment
    monthly_interest = (loan * interest_rate) / 12
    
    # Calculate minimum amortization if LTV > 66.7%
    if (1 - down_payment/property_price) > 0.667:
        min_amort_per_year = (loan - property_price * 0.667) / 15
        monthly_min_amort = min_amort_per_year / 12
    else:
        monthly_min_amort = 0
    
    return {
        "monthly_interest": monthly_interest,
        "monthly_min_amort": monthly_min_amort,
        "total_min_payment": monthly_interest + monthly_min_amort
    }

# Add this after the Monthly Investment Settings expander
with st.sidebar:
    # Calculate minimum required payments
    min_payments = calculate_minimum_payments(flat_price, equity, interest_rate)
    
    # Show warning if monthly amount is insufficient
    if monthly_cap < min_payments["total_min_payment"]:
        st.error(f"""
        ⚠️ **WARNING: Insufficient Monthly Budget**
        
        Your monthly budget is too low to cover the minimum required payments:
        
        Required Monthly Payments:
        - Interest: CHF {min_payments['monthly_interest']:,.0f}
        - Min. Amortization: CHF {min_payments['monthly_min_amort']:,.0f}
        - **Total Required: CHF {min_payments['total_min_payment']:,.0f}**
        
        Your Budget: CHF {monthly_cap:,.0f}
        Shortfall: CHF {min_payments['total_min_payment'] - monthly_cap:,.0f}
        
        The Pure Real Estate and Hybrid strategies require at least this amount to be feasible.
        """)

# Modify the calculate_monthly_payments function to include validation
def calculate_monthly_payments(
    property_price, down_payment, monthly_budget,
    interest_rate, amort_years, is_hybrid=False
):
    loan = property_price - down_payment
    
    # Calculate minimum required amortization
    if (1 - down_payment/property_price) > 0.667:
        min_amort_per_year = (loan - property_price * 0.667) / 15
    else:
        min_amort_per_year = 0
    
    monthly_interest = (loan * interest_rate) / 12
    monthly_min_amort = min_amort_per_year / 12
    
    # Check if budget is sufficient
    is_sufficient = monthly_budget >= (monthly_interest + monthly_min_amort)
    
    if not is_sufficient:
        monthly_amort = monthly_budget - monthly_interest if monthly_budget > monthly_interest else 0
        monthly_investment = 0
    else:
        if is_hybrid:
            monthly_amort = monthly_min_amort
            monthly_investment = monthly_budget - monthly_interest - monthly_amort
        else:
            monthly_amort = min(loan/12, max(monthly_min_amort, monthly_budget - monthly_interest))
            monthly_investment = 0
    
    return {
        "Interest": monthly_interest,
        "Amortization": monthly_amort,
        "Investment": monthly_investment,
        "Is_Sufficient": is_sufficient
    }

# --- Simulation Functions ---
def simulate_investment_strategy(monthly_amount, annual_return, initial_capital, years):
    """Simulate pure investment strategy with monthly contributions."""
    monthly_rate = (1 + annual_return) ** (1/12) - 1
    value = initial_capital
    progression = []
    
    for _ in range(years * 12):
        value = value * (1 + monthly_rate) + (monthly_amount - monthly_rent)
        if _ % 12 == 11:  # Store yearly values
            progression.append(value)
            
    return progression

def simulate_real_estate_strategy(
    property_price, down_payment, monthly_budget, 
    interest_rate, appreciation_rate, amort_years,
    continue_amortization=True
):
    """Simulate pure real estate strategy with maximum amortization.
    
    Args:
        continue_amortization: If True, continue amortizing after target LTV. If False, invest excess.
    """
    loan = property_price - down_payment
    balance = loan
    property_value = property_price
    investment_value = 0
    net_worth = []
    target_ltv = 0.667
    payoff_year = None
    
    # Calculate required amortization
    if (1 - down_payment/property_price) > 0.667:
        min_amort_per_year = (loan - property_price * 0.667) / 15
    else:
        min_amort_per_year = 0
        
    for year in range(30):
        property_value *= (1 + appreciation_rate)
        interest = balance * interest_rate
        
        # Calculate current LTV
        current_ltv = balance / property_value if property_value > 0 else 0
        
        # Available for amortization after interest
        available_for_amort = monthly_budget * 12 - interest
        
        if balance == 0:
            # Property fully paid off - invest all monthly budget
            monthly_investment = monthly_budget
            investment_value = investment_value * (1 + portfolio_return) + (monthly_investment * 12)
            amortization = 0
        elif current_ltv > target_ltv or (continue_amortization and year < amort_years):
            # Continue amortizing based on strategy
            amortization = min(balance, max(min_amort_per_year, available_for_amort))
            balance -= amortization
            monthly_investment = 0
            
            # Check if we just paid off the property
            if balance == 0 and payoff_year is None:
                payoff_year = year + 1
        else:
            # If target LTV reached and not continuing amortization, invest excess
            amortization = 0
            monthly_investment = max(0, (monthly_budget * 12 - interest) / 12)
            investment_value = investment_value * (1 + portfolio_return) + (monthly_investment * 12)
        
        net_worth.append(property_value - balance + investment_value)
        
    return net_worth, payoff_year

def simulate_hybrid_strategy(
    property_price, down_payment, monthly_budget,
    interest_rate, appreciation_rate, portfolio_return, amort_years
):
    """Simulate hybrid strategy with minimum amortization and investment."""
    loan = property_price - down_payment
    balance = loan
    property_value = property_price
    investment_value = 0
    net_worth = []
    target_ltv = 0.667
    payoff_year = None
    
    # Calculate minimum required amortization
    if (1 - down_payment/property_price) > 0.667:
        min_amort_per_year = (loan - property_price * 0.667) / 15
    else:
        min_amort_per_year = 0
    
    for year in range(30):
        property_value *= (1 + appreciation_rate)
        interest = balance * interest_rate
        
        # Calculate current LTV
        current_ltv = balance / property_value if property_value > 0 else 0
        
        # Monthly calculations
        monthly_interest = interest / 12
        
        if balance == 0:
            # Property fully paid off - invest all monthly budget
            monthly_min_amort = 0
            monthly_investment = monthly_budget
            investment_value = investment_value * (1 + portfolio_return) + (monthly_investment * 12)
        elif current_ltv > target_ltv and year < amort_years:
            # Only amortize if above target LTV
            monthly_min_amort = min_amort_per_year / 12
            monthly_investment = max(0, monthly_budget - monthly_interest - monthly_min_amort)
            balance -= min_amort_per_year
            
            # Check if we just paid off the property
            if balance == 0 and payoff_year is None:
                payoff_year = year + 1
        else:
            # If target LTV reached, all excess goes to investment
            monthly_min_amort = 0
            monthly_investment = max(0, monthly_budget - monthly_interest)
        
        balance = max(0, balance)
        
        # Grow investments
        investment_value = investment_value * (1 + portfolio_return) + (monthly_investment * 12)
        
        net_worth.append(property_value - balance + investment_value)
    
    return net_worth, payoff_year

# --- Run Simulations ---
years = 30
investment_progression = simulate_investment_strategy(monthly_cap, portfolio_return, equity, years)
real_estate_progression_max_amort, re_max_payoff_year = simulate_real_estate_strategy(
    flat_price, equity, monthly_cap, interest_rate, real_estate_growth, 
    amortization_years, continue_amortization=True
)
real_estate_progression_invest, re_inv_payoff_year = simulate_real_estate_strategy(
    flat_price, equity, monthly_cap, interest_rate, real_estate_growth,
    amortization_years, continue_amortization=False
)
hybrid_progression, hybrid_payoff_year = simulate_hybrid_strategy(
    flat_price, equity, monthly_cap, interest_rate, real_estate_growth, 
    portfolio_return, amortization_years
)

# --- Display Results ---
st.header("📊 Results Analysis")

# Add Monthly Payment Breakdown section
st.subheader("💰 Monthly Payment Breakdown")

# Calculate payments for each strategy
pure_investment = {
    "Interest": 0,
    "Amortization": 0,
    "Investment": monthly_cap - monthly_rent,
    "Is_Sufficient": monthly_cap >= monthly_rent
}

real_estate = calculate_monthly_payments(
    flat_price, equity, monthly_cap,
    interest_rate, amortization_years
)

hybrid = calculate_monthly_payments(
    flat_price, equity, monthly_cap,
    interest_rate, amortization_years,
    is_hybrid=True
)

# Create columns for strategy information with tooltips
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown("🏢💰 **Rent & Invest Strategy**")
    with st.expander("ℹ️ Strategy Details"):
        st.markdown(f"""
        - Monthly budget: CHF {monthly_cap:,.0f}
        - Monthly rent: CHF {monthly_rent:,.0f}
        - Available for investment: CHF {pure_investment['Investment']:,.0f}
        - No mortgage payments
        - Maximum investment potential
        - Highest flexibility & liquidity
        """)

with col2:
    st.markdown("🏠↘️ **Property Full Repayment Strategy**")
    with st.expander("ℹ️ Strategy Details"):
        st.markdown("""
        - Monthly interest payment
        - Maximum possible debt repayment
        - Focus on mortgage reduction
        - Lowest long-term interest cost
        - No investment component
        """)

with col3:
    st.markdown("🏠📈 **Property + Later Invest Strategy**")
    with st.expander("ℹ️ Strategy Details"):
        st.markdown("""
        - Monthly interest payment
        - Maximum repayment until target LTV
        - Switches to investment after target
        - Balanced approach to debt & investment
        - Moderate flexibility after target LTV
        """)

with col4:
    st.markdown("🏠💼 **Property Min + Invest Strategy**")
    with st.expander("ℹ️ Strategy Details"):
        st.markdown("""
        - Monthly interest payment
        - Minimum required repayment
        - Parallel investment from start
        - Maximum investment potential
        - Higher initial interest costs
        """) 

# Display monthly payments table
payment_data = {
    "Component": ["Monthly Investment", "Monthly Interest", "Monthly Amortization", "Remaining for Investment"],
    "🏢💰 Rent & Invest": [
        f"CHF {pure_investment['Investment']:,.0f}",
        "CHF 0",
        "CHF 0",
        "N/A"
    ],
    "🏠↘️ Property Full Repayment": [
        f"CHF {real_estate['Investment']:,.0f}",
        f"CHF {real_estate['Interest']:,.0f}",
        f"CHF {real_estate['Amortization']:,.0f}",
        "N/A"
    ],
    "🏠📈 Property + Later Invest": [
        "N/A",
        f"CHF {real_estate['Interest']:,.0f}",
        f"CHF {real_estate['Amortization']:,.0f}",
        f"CHF {real_estate['Investment']:,.0f}"
    ],
    "🏠💼 Property Min + Invest": [
        "N/A",
        f"CHF {hybrid['Interest']:,.0f}",
        f"CHF {hybrid['Amortization']:,.0f}",
        f"CHF {hybrid['Investment']:,.0f}"
    ]
}

df_payments = pd.DataFrame(payment_data)
st.table(df_payments.set_index("Component"))

# Calculate and display minimum monthly amortization
min_payments = calculate_minimum_payments(flat_price, equity, interest_rate)
st.markdown(f"""
**🔄 Minimum Monthly Amortization Required:** CHF {min_payments['monthly_min_amort']:,.0f}
""")

# Display strategy-specific warnings
if not real_estate['Is_Sufficient']:
    st.warning("""
    ⚠️ **Pure Real Estate Strategy Warning:**
    Monthly budget is insufficient to cover minimum required payments. 
    This strategy may not be feasible without increasing your monthly budget.
    """)

if not hybrid['Is_Sufficient']:
    st.warning("""
    ⚠️ **Hybrid Strategy Warning:**
    Monthly budget is insufficient to cover minimum required payments.
    This strategy may not be feasible without increasing your monthly budget.
    No funds will be available for investment until minimum payments are met.
    """)

# Add warning if rent is too high
if not pure_investment['Is_Sufficient']:
    st.warning("""
    ⚠️ **Pure Investment Strategy Warning:**
    Monthly rent exceeds your available budget. This strategy may not be feasible without increasing your monthly budget.
    """)

# Final Values
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric(
        "🏢💰 Rent & Invest", 
        f"CHF {investment_progression[-1]:,.0f}".replace(",", "'")
    )
with col2:
    st.metric(
        "🏠↘️ Property Full Repayment", 
        f"CHF {real_estate_progression_max_amort[-1]:,.0f}".replace(",", "'")
    )
with col3:
    st.metric(
        "🏠📈 Property + Later Invest", 
        f"CHF {real_estate_progression_invest[-1]:,.0f}".replace(",", "'")
    )
with col4:
    st.metric(
        "🏠💼 Property Min + Invest", 
        f"CHF {hybrid_progression[-1]:,.0f}".replace(",", "'")
    )

def calculate_ltv_progression(property_price, down_payment, monthly_budget, interest_rate, strategy="pure_max"):
    """Calculate when the LTV reaches 66.7% for each strategy
    
    Args:
        strategy: One of "pure_max", "pure_invest", or "hybrid"
    """
    loan = property_price - down_payment
    balance = loan
    property_value = property_price
    target_ltv = 0.667
    years_to_target = None
    target_reached = False
    investment_value = 0
    
    # Calculate required minimum amortization
    required_loan_reduction = loan - (property_price * target_ltv)
    min_monthly_amort = required_loan_reduction / (15 * 12)  # Monthly minimum over 15 years
    
    # Calculate initial monthly interest
    initial_monthly_interest = (loan * interest_rate) / 12
    
    # Store progression for debugging
    balance_progression = []
    ltv_progression = []
    amort_progression = []
    
    # Ensure we have exactly 360 months (30 years) of data
    for month in range(360):  # 30 years * 12 months
        # Update property value with monthly growth rate
        property_value *= (1 + real_estate_growth) ** (1/12)
        
        # Calculate current monthly interest based on current balance
        monthly_interest = balance * interest_rate / 12
        
        # Calculate current LTV
        current_ltv = balance / property_value if property_value > 0 else 0
        
        # Determine amortization based on strategy
        if current_ltv <= target_ltv:
            if not target_reached:
                target_reached = True
                years_to_target = month // 12 + 1
            
            if strategy == "pure_max":
                # Continue maximum amortization
                available_for_amort = monthly_budget - monthly_interest
                monthly_amort = min(balance, max(min_monthly_amort, available_for_amort))
            else:
                # For both hybrid and pure_invest, stop amortization and invest
                monthly_amort = 0
        else:
            if strategy == "hybrid":
                # Hybrid: Pay only minimum required
                monthly_amort = min_monthly_amort
            else:
                # Pure strategies: Pay maximum possible until target reached
                available_for_amort = monthly_budget - monthly_interest
                monthly_amort = min(balance, max(min_monthly_amort, available_for_amort))
        
        # Update balance with amortization
        balance = max(0, balance - monthly_amort)
        
        balance_progression.append(balance)
        ltv_progression.append(current_ltv)
        amort_progression.append(monthly_amort)
    
    # Return the data without displaying debug info
    return years_to_target, balance_progression, ltv_progression, {
        "property_price": property_price,
        "loan": loan,
        "target_ltv": target_ltv,
        "required_loan_reduction": required_loan_reduction,
        "min_monthly_amort": min_monthly_amort,
        "initial_monthly_interest": initial_monthly_interest,
        "years_to_target": years_to_target,
        "final_ltv": ltv_progression[-1],
        "final_balance": balance_progression[-1],
        "strategy": strategy
    }

# Visualization
st.subheader("📉 Net Worth and LTV Progression")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10), height_ratios=[2, 1])

# Calculate completion years and progressions for all strategies
re_max_completion_year, re_max_balance, re_max_ltv, re_max_debug = calculate_ltv_progression(
    flat_price, equity, monthly_cap, interest_rate, strategy="pure_max"
)
re_inv_completion_year, re_inv_balance, re_inv_ltv, re_inv_debug = calculate_ltv_progression(
    flat_price, equity, monthly_cap, interest_rate, strategy="pure_invest"
)
hybrid_completion_year, hybrid_balance, hybrid_ltv, hybrid_debug = calculate_ltv_progression(
    flat_price, equity, monthly_cap, interest_rate, strategy="hybrid"
)

# Net Worth plot
years = range(1, 31)
ax1.plot(years, investment_progression, label="Rent & Invest", linewidth=2)
ax1.plot(years, real_estate_progression_max_amort, label="Property Full Repayment", linewidth=2)
ax1.plot(years, real_estate_progression_invest, label="Property + Later Invest", linewidth=2, linestyle='--')
ax1.plot(years, hybrid_progression, label="Property Min + Invest", linewidth=2)

# Add markers and lines for completion points on net worth plot
if (1 - equity/flat_price) > 0.667:
    # Property Full Repayment
    if re_max_completion_year:
        ax1.axvline(x=re_max_completion_year, color='gray', linestyle='--', alpha=0.3)
        re_max_value = real_estate_progression_max_amort[re_max_completion_year - 1]
        ax1.plot(re_max_completion_year, re_max_value, 'o', color='red', 
                markersize=10, markeredgewidth=2, markeredgecolor='white',
                alpha=0.7, label=f'Full Repay: Target LTV (Year {re_max_completion_year})')
    
    # Property + Later Invest
    if re_inv_completion_year:
        ax1.axvline(x=re_inv_completion_year, color='gray', linestyle='--', alpha=0.3)
        re_inv_value = real_estate_progression_invest[re_inv_completion_year - 1]
        ax1.plot(re_inv_completion_year, re_inv_value, 's', color='orange', 
                markersize=10, markeredgewidth=2, markeredgecolor='white',
                alpha=0.7, label=f'Later Invest: Target LTV (Year {re_inv_completion_year})')
    
    # Property Min + Invest
    if hybrid_completion_year:
        ax1.axvline(x=hybrid_completion_year, color='gray', linestyle='--', alpha=0.3)
        hybrid_value = hybrid_progression[hybrid_completion_year - 1]
        ax1.plot(hybrid_completion_year, hybrid_value, '^', color='green', 
                markersize=12, markeredgewidth=2, markeredgecolor='white',
                alpha=0.7, label=f'Min + Invest: Target LTV (Year {hybrid_completion_year})')

    # Add a note if points overlap
    if len(set([re_max_completion_year, re_inv_completion_year, hybrid_completion_year])) < len([x for x in [re_max_completion_year, re_inv_completion_year, hybrid_completion_year] if x is not None]):
        ax1.text(0.02, 0.98, '* Some target points overlap - shown with different shapes', 
                transform=ax1.transAxes, fontsize=8, alpha=0.7,
                verticalalignment='top')

ax1.set_xlabel("Year")
ax1.set_ylabel("Net Worth (CHF)")
ax1.grid(True, alpha=0.3)
ax1.legend(loc="upper left", bbox_to_anchor=(0, 1.02), ncol=2)

# LTV Progression plot
# Convert monthly data points to yearly for consistent plotting
yearly_points = range(30)  # 30 years
yearly_re_max_ltv = [re_max_ltv[i*12] for i in range(30)]
yearly_re_inv_ltv = [re_inv_ltv[i*12] for i in range(30)]
yearly_hybrid_ltv = [hybrid_ltv[i*12] for i in range(30)]

ax2.plot(yearly_points, yearly_re_max_ltv, label="Full Repayment LTV", color='red', linewidth=2)
ax2.plot(yearly_points, yearly_re_inv_ltv, label="Later Invest LTV", color='orange', linewidth=2, linestyle='--')
ax2.plot(yearly_points, yearly_hybrid_ltv, label="Min + Invest LTV", color='green', linewidth=2)
ax2.axhline(y=0.667, color='gray', linestyle='--', label='Target LTV (66.7%)')
ax2.set_xlabel("Year")
ax2.set_ylabel("Loan-to-Value Ratio")
ax2.grid(True, alpha=0.3)
ax2.legend(loc="upper right")
ax2.yaxis.set_major_formatter(FuncFormatter(lambda x, p: f"{x*100:.1f}%"))

plt.tight_layout()
st.pyplot(fig)

# Detailed Analysis
st.subheader("💡 Strategy Insights")

# Create comparison table
data = {
    'Year': list(range(1, 31)),
    'Rent & Invest': investment_progression,
    'Property Full Repayment': real_estate_progression_max_amort,
    'Property + Later Invest': real_estate_progression_invest,
    'Property Min + Invest': hybrid_progression
}
df = pd.DataFrame(data)

# Calculate and display key metrics
st.markdown("#### Key Metrics")
metrics_col1, metrics_col2 = st.columns(2)

with metrics_col1:
    st.markdown("**Annual Growth Rates**")
    for strategy in ['Rent & Invest', 'Property Full Repayment', 'Property + Later Invest', 'Property Min + Invest']:
        initial_value = equity
        final_value = df[strategy].iloc[-1]
        cagr = (final_value/initial_value) ** (1/30) - 1
        st.write(f"{strategy}: {cagr*100:.1f}%")

with metrics_col2:
    st.markdown("**Risk Considerations**")
    st.markdown("""
    - 📈 Rent & Invest: Highest liquidity, market volatility exposure
    - 🏠 Property Full Repayment: Lowest liquidity, stable housing costs
    - 🏠💼 Property Min + Invest: Balanced approach, diversified risk
    """)

# Strategy Recommendations
st.subheader("🎯 Strategy Recommendations")
st.markdown("""
Based on your inputs, here are some key considerations:
""")

# Dynamic recommendations based on inputs
recommendations = []

if monthly_cap < 0.004 * flat_price:
    recommendations.append("⚠️ Monthly budget might be tight for property ownership. Consider a lower-priced property.")

if equity > 0.4 * flat_price:
    recommendations.append("💡 High equity position - could consider investing excess above 20% requirement.")

if portfolio_return > real_estate_growth + 0.02:
    recommendations.append("📈 Expected investment returns significantly exceed real estate appreciation - consider allocating more to investments.")

for rec in recommendations:
    st.markdown(f"- {rec}")

# Disclaimer
st.markdown("""
---
**Disclaimer**: This simulation is for educational purposes only. Actual results may vary significantly based on market conditions, tax implications, and other factors not considered in this model. Please consult with financial and real estate professionals before making investment decisions.
""")

# Add debug information in a collapsible section
with st.expander("🔍 View Detailed Amortization Analysis", expanded=False):
    st.markdown("### Property Full Repayment Strategy")
    st.markdown(f"""
    **Initial Setup:**
    - Property Price: CHF {re_max_debug['property_price']:,.0f}
    - Initial Loan: CHF {re_max_debug['loan']:,.0f}
    - Target LTV: {re_max_debug['target_ltv']*100:.1f}%
    - Required Loan Reduction: CHF {re_max_debug['required_loan_reduction']:,.0f}
    - Minimum Monthly Amortization: CHF {re_max_debug['min_monthly_amort']:,.0f}
    - Initial Monthly Interest: CHF {re_max_debug['initial_monthly_interest']:,.0f}
    - Initial Total Monthly Payment: CHF {(re_max_debug['initial_monthly_interest'] + re_max_debug['min_monthly_amort']):,.0f}
    
    **Results:**
    - Years to reach {re_max_debug['target_ltv']*100:.1f}% LTV: {re_max_debug['years_to_target'] if re_max_debug['years_to_target'] else 'Not reached'}
    - Final LTV: {re_max_debug['final_ltv']*100:.1f}%
    - Final Balance: CHF {re_max_debug['final_balance']:,.0f}
    """)
    
    st.markdown("### Property + Later Invest Strategy")
    st.markdown(f"""
    **Initial Setup:**
    - Property Price: CHF {re_inv_debug['property_price']:,.0f}
    - Initial Loan: CHF {re_inv_debug['loan']:,.0f}
    - Target LTV: {re_inv_debug['target_ltv']*100:.1f}%
    - Required Loan Reduction: CHF {re_inv_debug['required_loan_reduction']:,.0f}
    - Minimum Monthly Amortization: CHF {re_inv_debug['min_monthly_amort']:,.0f}
    - Initial Monthly Interest: CHF {re_inv_debug['initial_monthly_interest']:,.0f}
    - Initial Total Monthly Payment: CHF {(re_inv_debug['initial_monthly_interest'] + re_inv_debug['min_monthly_amort']):,.0f}
    
    **Results:**
    - Years to reach {re_inv_debug['target_ltv']*100:.1f}% LTV: {re_inv_debug['years_to_target'] if re_inv_debug['years_to_target'] else 'Not reached'}
    - Final LTV: {re_inv_debug['final_ltv']*100:.1f}%
    - Final Balance: CHF {re_inv_debug['final_balance']:,.0f}
    """)
    
    st.markdown("### Property Min + Invest Strategy")
    st.markdown(f"""
    **Initial Setup:**
    - Property Price: CHF {hybrid_debug['property_price']:,.0f}
    - Initial Loan: CHF {hybrid_debug['loan']:,.0f}
    - Target LTV: {hybrid_debug['target_ltv']*100:.1f}%
    - Required Loan Reduction: CHF {hybrid_debug['required_loan_reduction']:,.0f}
    - Minimum Monthly Amortization: CHF {hybrid_debug['min_monthly_amort']:,.0f}
    - Initial Monthly Interest: CHF {hybrid_debug['initial_monthly_interest']:,.0f}
    - Initial Total Monthly Payment: CHF {(hybrid_debug['initial_monthly_interest'] + hybrid_debug['min_monthly_amort']):,.0f}
    
    **Results:**
    - Years to reach {hybrid_debug['target_ltv']*100:.1f}% LTV: {hybrid_debug['years_to_target'] if hybrid_debug['years_to_target'] else 'Not reached'}
    - Final LTV: {hybrid_debug['final_ltv']*100:.1f}%
    - Final Balance: CHF {hybrid_debug['final_balance']:,.0f}
    """) 