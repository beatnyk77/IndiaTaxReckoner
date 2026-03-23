/**
 * Phase 5: Income-tax Act, 2025 Reconciliation
 * Logic for Companies (MAT), Trusts (Accumulation), and Partnerships.
 * Standardized across 536 sections of the New Act.
 */

import { CompanyTaxResult, TrustTaxResult, PartnershipTaxResult, AOPBOITaxResult } from "@/types/tax";

/**
 * Company MAT vs Normal Tax Calculator
 * Implementation of Section 206 (MAT) and Section 115BAA/BAB (Legacy/Transitional)
 * Note: Act 2025 consolidates Minimum Alternate Tax under Section 206.
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
        : 0.25;

    let normalTax = totalIncome * normalBaseRate;

    // 2. MAT Calculation (Section 206)
    const matBaseRate = 0.15;
    const matTaxInitial = optedForConcessional ? 0 : bookProfit * matBaseRate;

    // 3. Surcharge Logic
    let normalSurcharge = 0;
    let matSurcharge = 0;

    if (optedForConcessional) {
        normalSurcharge = normalTax * 0.10; // Fixed 10%
    } else {
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
        normal_tax: totalNormal + (totalNormal * 0.04),
        mat_tax: totalMat + (totalMat * 0.04),
        effective_tax: effectiveBaseTax,
        surcharge: effectiveSurcharge,
        cess,
        total_payable: effectiveBaseTax + effectiveSurcharge + cess,
        is_mat_applicable: isMatApplicable
    };
}

/**
 * Trust Accumulation Calculator (Section 11/12 - 2025 Act)
 * Logic for 85% application and 15% conditional accumulation.
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

    // Shortfall after application and notified accumulation under Sec 11(2)
    const shortfall = Math.max(0, requiredApplication - appliedAmount - accumulation11_2);

    const taxableIncome = shortfall;
    const taxRate = 0.30;

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
 * Partnership Remuneration & Tax (Section 39 - 2025 Act)
 * Previously Section 40(b) of 1961 Act.
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
        // Section 61 (Business) or 62 (Professional) - Presumptive Scheme
        const presumptiveRate = isProfessionalServices ? 0.50 : 0.08;
        finalTaxableIncome = turnover * presumptiveRate;
        remunerationLimit = 0;
    } else {
        // Section 39 Limit logic on Book Profit (Updated limits as per Finance Act 2024 / Act 2025)
        // First 6L @ 90% or 3.0L; Balance @ 60%
        if (bookProfit <= 600000) {
            remunerationLimit = Math.max(300000, bookProfit * 0.90);
        } else {
            remunerationLimit = 540000 + (bookProfit - 600000) * 0.60;
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
 * Implementation of Section 197 (AOP MMR rule - 2025 Act)
 * Previously Section 167B.
 */
export function calculateAOPBOITax(
    totalIncome: number,
    isIndeterminate: boolean,
    maxMemberIndividualIncome: number = 0,
    memberShares: { name: string, sharePercent: number }[] = []
): AOPBOITaxResult {
    const BEL = 400000; // Updated Basic Exemption Limit for individuals (Act 2025)
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
        // Individual slabs simulation (Act 2025 Default Regime)
        if (totalIncome <= BEL) totalTax = 0;
        else if (totalIncome <= 800000) totalTax = (totalIncome - BEL) * 0.05;
        else if (totalIncome <= 1200000) totalTax = (totalIncome - 800000) * 0.10 + 20000;
        else totalTax = (totalIncome - 1200000) * 0.15 + 60000; // Simplified for deep logic
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
