/**
 * Phase 4: Entity-Specific Tax Calculators
 * Logic for Companies (MAT), Trusts (Accumulation), and Partnerships.
 */

import { CompanyTaxResult, TrustTaxResult, PartnershipTaxResult, AOPBOITaxResult } from "./types/tax";

/**
 * Company MAT vs Normal Tax Calculator
 * Implementation of Section 115JB (MAT) and Section 115BAA/BAB
 */
export function calculateCompanyTax(
    totalIncome: number,
    bookProfit: number,
    optedForConcessional: boolean = false,
    isInitialPhase: boolean = false // for Sec 115BAB
): CompanyTaxResult {
    const normalRateArray = optedForConcessional ? (isInitialPhase ? 0.15 : 0.22) : 0.25; // simplified logic
    let normalTax = totalIncome * normalRateArray;

    // MAT logic (only if not opted for concessional)
    const matRate = 0.15;
    const matTax = optedForConcessional ? 0 : bookProfit * matRate;

    const isMatApplicable = !optedForConcessional && matTax > normalTax;
    const baseTax = isMatApplicable ? matTax : normalTax;

    // Simplified surcharge/cess (using flat rates for prototype)
    const surcharge = baseTax * 0.07; // assume mid-range
    const cess = (baseTax + surcharge) * 0.04;

    return {
        total_income: totalIncome,
        book_profit: bookProfit,
        normal_tax: normalTax,
        mat_tax: matTax,
        effective_tax: baseTax,
        surcharge,
        cess,
        total_payable: baseTax + surcharge + cess,
        is_mat_applicable: isMatApplicable
    };
}

/**
 * Trust Accumulation Calculator (Section 11/12)
 */
export function calculateTrustTax(
    grossReceipts: number,
    appliedAmount: number
): TrustTaxResult {
    const minApplication = grossReceipts * 0.85;
    const accumulation15 = grossReceipts * 0.15;

    const shortfall = Math.max(0, minApplication - appliedAmount);
    const taxableIncome = shortfall; // Simplified for reference
    const taxRate = 0.30; // MMR for trusts

    return {
        gross_receipts: grossReceipts,
        applied_amount: appliedAmount,
        accumulation_15: accumulation15,
        taxable_income: taxableIncome,
        tax_payable: taxableIncome * taxRate,
        deemed_income: shortfall,
        shortfall
    };
}

/**
 * Partnership Remuneration & Tax (Section 40(b))
 */
export function calculatePartnershipTax(
    bookProfit: number,
    actualRemuneration: number
): PartnershipTaxResult {
    // 40(b) Limit logic
    let limit = 0;
    if (bookProfit <= 300000) {
        limit = Math.max(150000, bookProfit * 0.90);
    } else {
        limit = 270000 + (bookProfit - 300000) * 0.60;
    }

    const allowedRemuneration = Math.min(limit, actualRemuneration);
    const taxableIncome = bookProfit - allowedRemuneration;
    const firmTax = taxableIncome * 0.30;
    const surcharge = firmTax > 10000000 ? firmTax * 0.12 : 0;
    const cess = (firmTax + surcharge) * 0.04;

    return {
        book_profit: bookProfit,
        remuneration_limit: limit,
        actual_remuneration: actualRemuneration,
        firm_taxable_income: taxableIncome,
        tax_payable: firmTax + surcharge + cess,
        surcharge,
        cess
    };
}
