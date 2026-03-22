/**
 * Phase 4: Entity-Specific Tax Calculators
 * Logic for Companies (MAT), Trusts (Accumulation), and Partnerships.
 */

import { CompanyTaxResult, TrustTaxResult, PartnershipTaxResult, AOPBOITaxResult } from "@/types/tax";

/**
 * Company MAT vs Normal Tax Calculator
 * Implementation of Section 115JB (MAT) and Section 115BAA/BAB
 */
export function calculateCompanyTax(
    totalIncome: number,
    bookProfit: number,
    optedForConcessional: boolean = false,
    isInitialPhaseBAB: boolean = false
): CompanyTaxResult {
    // 1. Normal Tax Calculation
    const normalBaseRate = optedForConcessional
        ? (isInitialPhaseBAB ? 0.15 : 0.22)
        : 0.25; // 25% if turnover <= 400Cr (prototype default)

    let normalTax = totalIncome * normalBaseRate;

    // 2. MAT Calculation (Sec 115JB)
    const matBaseRate = 0.15;
    const matTaxInitial = optedForConcessional ? 0 : bookProfit * matBaseRate;

    // 3. Surcharge Logic
    let normalSurcharge = 0;
    let matSurcharge = 0;

    if (optedForConcessional) {
        normalSurcharge = normalTax * 0.10; // Fixed 10% for BAA/BAB
    } else {
        // Tiered surcharge for Domestic Companies
        if (totalIncome > 100000000) normalSurcharge = normalTax * 0.12;
        else if (totalIncome > 10000000) normalSurcharge = normalTax * 0.07;

        if (bookProfit > 100000000) matSurcharge = matTaxInitial * 0.12;
        else if (bookProfit > 10000000) matSurcharge = matTaxInitial * 0.07;
    }

    const totalNormal = normalTax + normalSurcharge;
    const totalMat = matTaxInitial + matSurcharge;

    const isMatApplicable = !optedForConcessional && totalMat > totalNormal;
    const effectiveBaseTax = isMatApplicable ? matTaxInitial : normalTax;
    const effectiveSurcharge = isMatApplicable ? matSurcharge : normalSurcharge;

    // 4. Health & Education Cess
    const cess = (effectiveBaseTax + effectiveSurcharge) * 0.04;

    return {
        total_income: totalIncome,
        book_profit: bookProfit,
        normal_tax: totalNormal + (totalNormal * 0.04), // inclusive of cess for display
        mat_tax: totalMat + (totalMat * 0.04),
        effective_tax: effectiveBaseTax,
        surcharge: effectiveSurcharge,
        cess,
        total_payable: effectiveBaseTax + effectiveSurcharge + cess,
        is_mat_applicable: isMatApplicable
    };
}

/**
 * Trust Accumulation Calculator (Section 11/12)
 */
export function calculateTrustTax(
    grossReceipts: number,
    voluntaryContributions: number,
    appliedAmount: number,
    accumulation11_2: number = 0
): TrustTaxResult {
    const totalIncome = grossReceipts + voluntaryContributions;

    // Statutory 15% is exempt without conditions
    const accumulation15 = totalIncome * 0.15;

    // 85% must be applied for charitable purposes
    const requiredApplication = totalIncome * 0.85;

    // Shortfall after application and notified accumulation under 11(2)
    const shortfall = Math.max(0, requiredApplication - appliedAmount - accumulation11_2);

    const taxableIncome = shortfall;
    const taxRate = 0.30; // Standard rate for trusts failing application requirements

    return {
        gross_receipts: grossReceipts,
        applied_amount: appliedAmount,
        accumulation_15: accumulation15,
        taxable_income: taxableIncome,
        tax_payable: taxableIncome * taxRate,
        deemed_income: shortfall, // Deemed as income of the year in case of non-application
        shortfall
    };
}

/**
 * Partnership Remuneration & Tax (Section 40(b))
 */
export function calculatePartnershipTax(
    bookProfit: number,
    actualRemuneration: number,
    isPresumptive: boolean = false,
    turnover: number = 0,
    isProfessionalServices: boolean = false
): PartnershipTaxResult {
    let finalTaxableIncome = 0;
    let remunerationLimit = 0;

    if (isPresumptive) {
        // Section 44AD (8% / 6%) or 44ADA (50%)
        const presumptiveRate = isProfessionalServices ? 0.50 : 0.08;
        finalTaxableIncome = turnover * presumptiveRate;
        remunerationLimit = 0; // Not applicable in presumptive
    } else {
        // 40(b) Limit logic on Book Profit
        if (bookProfit <= 300000) {
            remunerationLimit = Math.max(150000, bookProfit * 0.90);
        } else {
            remunerationLimit = 270000 + (bookProfit - 300000) * 0.60;
        }

        const allowedRemuneration = Math.min(remunerationLimit, actualRemuneration);
        finalTaxableIncome = Math.max(0, bookProfit - allowedRemuneration);
    }

    const baseTax = finalTaxableIncome * 0.30;
    const surcharge = finalTaxableIncome > 10000000 ? baseTax * 0.12 : 0;
    const cess = (baseTax + surcharge) * 0.04;

    return {
        book_profit: isPresumptive ? 0 : bookProfit,
        remuneration_limit: remunerationLimit,
        actual_remuneration: isPresumptive ? 0 : actualRemuneration,
        firm_taxable_income: finalTaxableIncome,
        tax_payable: baseTax + surcharge + cess,
        surcharge,
        cess
    };
}

/**
 * AOP/BOI Share-of-Income Calculator
 */
export function calculateAOPBOITax(
    totalIncome: number,
    isIndeterminate: boolean,
    maxMemberIndividualIncome: number = 0,
    memberShares: { name: string, sharePercent: number }[] = []
): AOPBOITaxResult {
    const BEL = 300000; // Basic Exemption Limit for individuals (simplified)
    const mmrRate = 0.30;

    let shareTaxableAtAOP = false;
    let mmrApplicable = false;
    let totalTax = 0;

    if (isIndeterminate) {
        mmrApplicable = true;
        shareTaxableAtAOP = true;
    } else {
        if (maxMemberIndividualIncome > BEL) {
            mmrApplicable = true;
            shareTaxableAtAOP = true;
        } else {
            // Simplified progressive tax (Individual slabs)
            shareTaxableAtAOP = true;
            mmrApplicable = false;
        }
    }

    if (mmrApplicable) {
        const baseTax = totalIncome * mmrRate;
        const surcharge = totalIncome > 10000000 ? baseTax * 0.12 : 0;
        totalTax = (baseTax + surcharge) * 1.04;
    } else {
        // Individual slabs simulation
        if (totalIncome <= BEL) totalTax = 0;
        else if (totalIncome <= 700000) totalTax = (totalIncome - BEL) * 0.05;
        else totalTax = (totalIncome - 700000) * 0.10 + 20000; // Rough approx
        totalTax = totalTax * 1.04;
    }

    return {
        total_income: totalIncome,
        share_taxable_at_aop: shareTaxableAtAOP,
        mmr_applicable: mmrApplicable,
        total_tax: totalTax,
        share_of_members: memberShares.map(m => ({
            member: m.name,
            share: (totalIncome * m.sharePercent) / 100,
            tax_impact: shareTaxableAtAOP ? 0 : ((totalIncome * m.sharePercent) / 100) * mmrRate
        }))
    };
}
