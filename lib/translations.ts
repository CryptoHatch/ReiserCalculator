export const translations = {
  // Header and main title
  title: "Schweizer Anlagestrategie-Simulator",
  subtitle: "Vergleichen Sie drei Vermögensaufbau-strategien über 30 Jahre",
  
  // Strategy names
  strategies: {
    rentInvest: "🏢💰 Mieten & Investieren",
    propertyFullRepay: "🏠↘️ Vollständige Rückzahlung", 
    propertyLaterInvest: "🏠📈 Später Investieren",
    propertyMinInvest: "🏠💼 Min. + Investieren"
  },

  // Detailed strategy explanations  
  strategyExplanations: {
    rentInvest: {
      title: "Mieten & Investieren Strategie",
      content: `**Konzept**: Sie mieten eine Wohnung und investieren Ihr gesamtes verfügbares Kapital in Finanzinstrumente.

**Cashflow-Mechanik**:
• Monatliche Mietzahlung für Wohnraum
• Restliches Budget (Gesamtbudget - Miete) wird sofort investiert
• Keine Immobilienschulden oder -eigentum
• Maximale Investitionsquote vom ersten Tag an

**Vorteile**:
✅ **Höchste Liquidität**: Jederzeit Zugang zu Investitionen
✅ **Maximale Marktexposition**: Gesamtes Kapital arbeitet sofort
✅ **Flexibilität**: Einfacher Umzug, keine Eigentumsverantwortung
✅ **Diversifikation**: Globale Märkte statt lokaler Immobilienmarkt

**Risiken**:
⚠️ **Mietrisiko**: Steigende Mieten reduzieren Investitionskapital
⚠️ **Marktvolatilität**: Vollexposition gegenüber Marktschwankungen
⚠️ **Kein Wohneigentum**: Keine Absicherung gegen Mieterhöhungen

**Optimal wenn**: Hohe erwartete Kapitalmarktrenditen, flexible Lebenssituation, hohe Risikotoleranz.`
    },
    propertyFullRepay: {
      title: "Vollständige Rückzahlung Strategie", 
      content: `**Konzept**: Kaufen Sie eine Immobilie und tilgen die Hypothek so schnell wie möglich mit maximalem Kapitaleinsatz.

**Cashflow-Mechanik**:
• 20%+ Eigenkapital beim Kauf (Schweizer Mindestanforderung)
• Gesamtes monatliches Budget für Zinsen + maximale Tilgung
• Keine parallel Investitionen bis Hypothek abbezahlt
• Nach vollständiger Tilgung: Gesamtbudget wird investiert

**Schweizer Regulierung**:
🇨🇭 Bei LTV > 66.7%: Amortisation auf 66.7% in 15 Jahren erforderlich
🇨🇭 Diese Strategie geht oft darüber hinaus für schnellste Schuldenfreiheit

**Vorteile**:
✅ **Garantierte "Rendite"**: Zinsersparnis entspricht sicherer Rendite
✅ **Schuldenfreiheit**: Psychologische Sicherheit und reduzierte Fixkosten
✅ **Wohneigentum**: Schutz vor Mieterhöhungen, Eigentumsrechte
✅ **Reduziertes Risiko**: Keine Leverage, stabile Wohnkosten

**Nachteile**:
⚠️ **Niedrige Liquidität**: Kapital in Immobilie "gefangen"
⚠️ **Opportunity Cost**: Mögliche höhere Renditen am Kapitalmarkt verpasst
⚠️ **Konzentration**: Vermögen konzentriert auf lokalen Immobilienmarkt

**Optimal wenn**: Niedrige Risikotoleranz, hohe Hypothekenzinsen, Wunsch nach Schuldenfreiheit.`
    },
    propertyLaterInvest: {
      title: "Später Investieren Strategie",
      content: `**Konzept**: Identisch mit "Vollständige Rückzahlung", aber mit expliziter Betonung der Post-Tilgungs-Investitionsphase.

**Phasen-Ansatz**:
**Phase 1 (Jahre 1-X)**: Maximale Hypothekentilgung
• Gesamtes Budget für Zinsen + Tilgung
• Fokus auf schnellstmögliche Schuldenbefreiung
• Keine parallelen Investitionen

**Phase 2 (Jahre X-30)**: Intensive Investitionsphase  
• Hypothek vollständig getilgt
• Gesamtes früheres Tilgungsbudget wird investiert
• Compound-Effekt auf verbleibendem Zeitraum

**Mathematische Überlegung**:
• Späteren Investitionsstart, aber höhere monatliche Beträge
• "Backloaded" Vermögensaufbau vs. gleichmäßige Verteilung
• Timing-Risiko: Marktperformance in späteren Jahren kritischer

**Psychologische Komponente**:
🧠 **Zwei-Phasen-Mentalität**: Erst Schulden eliminieren, dann Vermögen aufbauen
🧠 **Sicherheitsgefühl**: Klare Trennung zwischen Verschuldung und Investition

**Unterschied zu anderen Strategien**:
• **vs. Vollständige Rückzahlung**: Identisch, nur andere Darstellung
• **vs. Min. + Investieren**: Sequenziell statt parallel
• **vs. Mieten & Investieren**: Eigentum + verzögerte Investitionen

**Optimal wenn**: Präferenz für klare Phasen, Aversion gegen Schulden während Investitionen.`
    },
    propertyMinInvest: {
      title: "Minimum + Investieren Strategie",
      content: `**Konzept**: Kaufen Sie eine Immobilie und machen nur gesetzlich erforderliche Mindestzahlungen, während Sie parallel investieren.

**Schweizer Regulatory Framework**:
🇨🇭 **20% Eigenkapital**: Gesetzliches Minimum beim Kauf
🇨🇭 **66.7% LTV-Regel**: Amortisation auf 66.7% LTV in 15 Jahren erforderlich
🇩🇪 **Zinsabzug**: Hypothekenzinsen steuerlich absetzbar

**Cashflow-Aufteilung**:
• **Zinszahlungen**: (Hypothekensaldo × Zinssatz) ÷ 12
• **Minimum-Amortisation**: Nur soviel wie nötig für 66.7% LTV in 15 Jahren  
• **Investitionen**: Verbleibendes Budget sofort in Portfolio

**Leverage-Mechanik**:
📈 **Positive Leverage**: Wenn Investitionsrendite > Hypothekenzins
📉 **Negative Leverage**: Wenn Investitionsrendite < Hypothekenzins
⚖️ **Break-Even**: Rendite = Zinssatz (nach Steuern)

**Vorteile**:
✅ **Balanced Approach**: Sowohl Immobilien- als auch Kapitalmarktexposition
✅ **Sofortige Investitionen**: Kein verlorener Compound-Effekt
✅ **Steueroptimierung**: Zinsabzug reduziert effektive Finanzierungskosten
✅ **Diversifikation**: Vermögen auf mehrere Anlageklassen verteilt

**Risiken**:
⚠️ **Sequence Risk**: Schlechte frühe Marktjahre besonders schädlich
⚠️ **Leverage Risk**: Verluste werden durch Schulden verstärkt
⚠️ **Komplexität**: Sowohl Immobilien- als auch Marktrisiko

**Optimal wenn**: Erwartete Investitionsrendite > Hypothekenzins, moderate Risikotoleranz, steuerliche Optimierung gewünscht.`
    }
  },

  // Configuration sections
  configuration: "Konfiguration",
  monthlySavings: "Monatliche Ersparnisse",
  propertyDetails: "Immobilien-Details", 
  marketParameters: "Marktparameter",
  investmentPortfolio: "Anlageportfolio",
  expectedReturns: "Erwartete Renditen",
  portfolioComposition: "Portfolio-Zusammensetzung",

  // Input field labels
  monthlyAmount: "Monatlich verfügbarer Betrag",
  monthlyRent: "Monatliche Wohnungsmiete", 
  propertyPrice: "Immobilien-Kaufpreis",
  availableEquity: "Verfügbares Eigenkapital",
  mortgageRate: "Hypothekenzinssatz",
  realEstateAppreciation: "Immobilien-Wertsteigerung",
  stocksAllocation: "Aktien-Allokation",
  bitcoinAllocation: "Bitcoin-Allokation", 
  stockReturn: "Erwartete Aktienrendite",
  bitcoinReturn: "Erwartete Bitcoin-Rendite",

  // Detailed tooltips explaining how each value is used
  tooltips: {
    monthlyAmount: {
      title: "Monatlich verfügbarer Betrag",
      content: `Dieser Betrag wird in allen Strategien unterschiedlich verwendet:
      
• **Mieten & Investieren**: Gesamtbetrag minus Miete wird monatlich investiert
• **Vollständige Rückzahlung**: Maximale Tilgung nach Zinszahlungen  
• **Min. + Investieren**: Minimale Tilgung + Rest wird investiert

**Schweizer Kontext**: Muss mindestens die Zinsen plus gesetzliche Mindest-Amortisation (66.7% LTV in 15 Jahren) decken.

**Berechnung**: Bestimmt die Geschwindigkeit des Schuldenabbaus und das verfügbare Investitionskapital in jeder Strategie.`
    },
    monthlyRent: {
      title: "Monatliche Wohnungsmiete", 
      content: `Betrifft nur die "Mieten & Investieren"-Strategie:

**Verwendung**: Wird vom monatlich verfügbaren Betrag abgezogen vor der Investition.

**Formel**: Investitionsbetrag = Verfügbarer Betrag - Miete

**Strategievergleich**: Ermöglicht fairen Vergleich zwischen Mieten (mit Investition) und Kaufen (mit Tilgung).

**Schweizer Kontext**: Durchschnittliche Mieten variieren stark je nach Region (CHF 1'200-3'000+ in städtischen Gebieten).`
    },
    propertyPrice: {
      title: "Immobilien-Kaufpreis",
      content: `Grundlage aller immobilienbezogenen Berechnungen:

**LTV-Berechnung**: Loan-to-Value = Hypothek ÷ Immobilienwert
**Eigenkapital-Anforderung**: Mindestens 20% des Kaufpreises (Schweizer Gesetz)
**Hypothekenhöhe**: Kaufpreis minus Eigenkapital
**Tilgungsberechnung**: Bestimmt erforderliche Mindest-Amortisation

**Wertsteigerung**: Jährliche Wertsteigerung wird auf diesen Betrag angewendet und beeinflusst das Nettovermögen in allen Immobilienstrategien.

**Schweizer Durchschnitt**: CHF 600'000 - 2'000'000+ je nach Region.`
    },
    availableEquity: {
      title: "Verfügbares Eigenkapital",
      content: `Ihr Startkapital mit mehreren kritischen Funktionen:

**Schweizer Mindestanforderung**: 20% des Kaufpreises (gesetzlich vorgeschrieben)
**Hypothekenreduzierung**: Reduziert die Hypothekenhöhe und damit Zinszahlungen
**LTV-Ausgangslage**: Bestimmt, ob Amortisation erforderlich ist
**Startwert Investitionen**: Bei reiner Anlagestrategie der Startbetrag für Investitionen

**Berechnung LTV**: (Kaufpreis - Eigenkapital) ÷ Kaufpreis
**Wenn LTV > 66.7%**: Amortisation auf 66.7% in 15 Jahren erforderlich

**Optimierung**: Höheres Eigenkapital = niedrigere Zinsen, aber weniger Leverage-Effekt.`
    },
    mortgageRate: {
      title: "Hypothekenzinssatz",
      content: `Bestimmt die jährlichen Finanzierungskosten:

**Monatliche Zinszahlung**: (Hypothekensaldo × Zinssatz) ÷ 12
**Verfügbares Budget**: Monatlicher Betrag minus Zinsen = verfügbar für Tilgung/Investition
**Gesamtkosten**: Über 30 Jahre erheblicher Einfluss auf Gesamtrendite

**Schweizer Kontext**: 
• **SARON-basiert**: Meist 5-10 Jahre fest
• **Aktuelle Spannen**: 1-3% (2024)
• **Steuerlich**: Zinsen sind vom Einkommen absetzbar

**Strategieeinfluss**: Niedrige Zinsen bevorzugen Leverage-Strategien (Minimum-Tilgung), hohe Zinsen bevorzugen schnelle Tilgung.`
    },
    realEstateAppreciation: {
      title: "Immobilien-Wertsteigerung",
      content: `Jährliche Wertsteigerung der Immobilie:

**Nettovermögen-Effekt**: Immobilienwert steigt jährlich um diesen Prozentsatz
**LTV-Verbesserung**: Wertsteigerung reduziert automatisch die Loan-to-Value-Ratio
**Compound-Effekt**: Wertsteigerung wird auf den bereits gestiegenen Wert angewendet

**Schweizer Langzeit-Durchschnitt**: 
• **Historisch**: ~2-3% jährlich
• **Regional unterschiedlich**: Städte oft höher
• **Inflation**: Oft leicht über Inflationsrate

**Risiko**: Wert kann auch fallen - Simulation geht von konstantem Wachstum aus, reale Märkte schwanken erheblich.

**Berechnung**: Neuer Wert = Vorjahr × (1 + Wertsteigerung)`
    },
    stocksAllocation: {
      title: "Aktien-Allokation",
      content: `Prozentsatz des Portfolios in Aktien investiert:

**Portfolio-Aufbau**: Aktien% + Bitcoin% = 100%
**Rendite-Berechnung**: Gewichteter Durchschnitt beider Anlageklassen
**Risiko-Rendite**: Aktien typischerweise moderater als Bitcoin

**Diversifikation**: 
• **60-80%**: Ausgewogene Allokation
• **>90%**: Konservativ (nur bei stabilen Märkten)
• **<50%**: Aggressiv (mehr Bitcoin-Anteil)

**Schweizer Kontext**: 
• **3. Säule**: Oft konservativere Allokationen
• **Freies Vermögen**: Mehr Flexibilität möglich
• **Heimatmarkt-Bias**: Viele überbewichten Schweizer Aktien

**Verwendung**: Bestimmt erwartete Portfolio-Rendite in Investitions- und Hybrid-Strategien.`
    },
    bitcoinAllocation: {
      title: "Bitcoin-Allokation", 
      content: `Prozentsatz des Portfolios in Bitcoin:

**Automatische Berechnung**: 100% - Aktien-Allokation
**Hohe Volatilität**: Historisch sehr schwankend (±50%+ pro Jahr möglich)
**Rendite-Potenzial**: Hohe erwartete Renditen bei hohem Risiko

**Risiko-Überlegungen**:
• **<10%**: Kleine Beimischung, reduziert Gesamtrisiko wenig
• **10-30%**: Merklicher Einfluss auf Portfolio-Volatilität  
• **>30%**: Portfolio wird sehr risikoreich

**Schweizer Regulierung**: 
• **Steuerlich**: Als Vermögen besteuert, nicht als Einkommen
• **Banken**: Zunehmend akzeptiert, aber noch begrenzte Services

**Historische Rendite**: ~15-25% langfristig, aber mit extremer Volatilität.`
    },
    stockReturn: {
      title: "Erwartete Aktienrendite",
      content: `Jährliche Rendite-Erwartung für Aktieninvestitionen:

**Compound-Berechnung**: Monatliche Rate = (1 + Jahresrendite)^(1/12) - 1
**Portfolio-Gewichtung**: Wird mit Aktien-Allokation multipliziert
**Langzeit-Annahme**: Konstante Rendite über 30 Jahre (vereinfacht)

**Historische Benchmarks**:
• **Schweizer Markt (SPI)**: ~7-8% langfristig
• **Globale Märkte**: ~6-10% je nach Region
• **Inflation bereinigt**: ~4-6% real

**Risiko-Realität**: 
• Simulation nutzt konstante Rendite
• Reale Märkte schwanken stark (-30% bis +30% pro Jahr)
• Sequence-of-Returns-Risiko nicht berücksichtigt

**Verwendung**: Bestimmt Wachstum der Investmentkomponente in Investment- und Hybrid-Strategien.`
    },
    bitcoinReturn: {
      title: "Erwartete Bitcoin-Rendite",
      content: `Jährliche Rendite-Erwartung für Bitcoin:

**Extreme Volatilität**: Historisch -80% bis +400% in einzelnen Jahren
**Langzeit-Trend**: Trotz Volatilität positive Langzeitrendite
**Spekulative Annahme**: Zukunftsrendite sehr unsicher

**Historische Performance**:
• **2010-2024**: ~100%+ jährlich (aber mit extremen Schwankungen)
• **Bären-/Bullenmärkte**: Oft 4-Jahres-Zyklen
• **Institutionelle Adoption**: Zunehmende Akzeptanz könnte Volatilität reduzieren

**Risiko-Warnung**:
• **Totalverlust möglich**: Neue Anlageklasse
• **Regulatorische Risiken**: Verbote möglich
• **Technologie-Risiken**: Quantum Computing, etc.

**Modellierung**: Simulation nutzt konstante Rate - reale Bitcoin-Performance ist chaotisch.`
    }
  },

  // Results section
  results: "Ergebnisse-Analyse",
  monthlyPaymentBreakdown: "Monatliche Zahlungsaufschlüsselung",
  finalValuesAfter30Years: "Endwerte nach 30 Jahren",
  netWorthProgression: "Nettovermögen-Verlauf über Zeit",
  strategyInsights: "Strategie-Erkenntnisse",
  annualGrowthRates: "Jährliche Wachstumsraten (CAGR)",
  riskConsiderations: "Risiko-Überlegungen",
  strategyRecommendations: "Strategie-Empfehlungen",

  // Payment breakdown
  investment: "Investition",
  interest: "Zinsen", 
  amortization: "Tilgung",
  rent: "Miete",
  total: "Total",

  // Warnings and errors
  swissEquityWarning: "⚠️ Warnung: Schweizer Gesetz erfordert mindestens 20% Eigenkapital!",
  requiredEquity: "Erforderlich",
  yourEquity: "Ihr Eigenkapital", 
  shortfall: "Fehlbetrag",
  insufficientBudget: "Unzureichendes monatliches Budget",
  budgetRequired: "Erforderlich",
  yourBudget: "Ihr Budget",
  swissAmortizationRule: "🇨🇭 Schweizer Gesetz erfordert Amortisation auf 66.7% LTV innerhalb von 15 Jahren",

  // Risk descriptions
  riskDescriptions: {
    rentInvest: "Höchste Liquidität, Marktvolatilität",
    propertyFullRepay: "Niedrigste Liquidität, stabile Wohnkosten", 
    propertyMinInvest: "Ausgewogener Ansatz, diversifiziertes Risiko"
  },

  // Recommendations
  recommendationMessages: {
    tightBudget: "⚠️ Monatliches Budget könnte für Immobilieneigentum knapp sein. Erwägen Sie eine günstigere Immobilie.",
    highEquity: "💡 Hohe Eigenkapitalposition - könnten Überschuss über 20%-Anforderung investieren.",
    highReturns: "📈 Erwartete Investitionsrenditen übersteigen deutlich die Immobilien-Wertsteigerung - erwägen Sie mehr Allokation in Investitionen."
  },

  // Footer
  disclaimerTitle: "Haftungsausschluss",
  disclaimerText: "Diese Simulation dient nur zu Bildungszwecken. Tatsächliche Ergebnisse können erheblich abweichen aufgrund von Marktbedingungen, steuerlichen Auswirkungen und anderen Faktoren, die in diesem Modell nicht berücksichtigt sind. Bitte konsultieren Sie Finanz- und Immobilienprofis vor Investitionsentscheidungen.",

  // Units
  currency: "CHF",
  percent: "%",
  years: "Jahre",
  month: "Monat",
  year: "Jahr",

  // Combined portfolio return
  combinedPortfolioReturn: "Kombinierte Portfolio-Rendite"
};