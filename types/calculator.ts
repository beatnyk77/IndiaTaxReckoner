/**
 * User Inputs for the Tax Calculator
 */
export interface TaxCalculatorInputs {
    taxYear: string;
    ageGroup: 'below-60' | '60-80' | 'above-80';
    income: {
        salary: number;
        interest: number;
        rental: number;
        other: number;
    };
    deductions: {
        section80C: number;
        section80D: number;
        section80E: number; // Education Loan Interest
        nps80CCD1B: number; // Addl 50k
        hra: number;
        standardDeduction: number;
        other: number;
    };
    capitalGains: {
        stcg_15: number;
        stcg_20: number; // New Act rates might vary
        ltcg_10: number;
        ltcg_12_5: number; // New Act rate
    };
}

/**
 * Breakdown of tax for a specific regime
 */
export interface TaxRegimeBreakdown {
    regime: 'old' | 'new';
    grossTotalIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    taxBeforeSurcharge: number;
    rebate87A: number;
    taxAfterRebate: number;
    surcharge: number;
    cess: number;
    totalTaxLiability: number;
    effectiveRate: number;
}

/**
 * Final output of the calculator comparing both regimes
 */
export interface TaxCalculatorResults {
    oldRegime: TaxRegimeBreakdown;
    newRegime: TaxRegimeBreakdown;
    recommendedRegime: 'old' | 'new';
    savings: number;
    breakEvenPoint?: number; // Income level where both regimes are equal
}
