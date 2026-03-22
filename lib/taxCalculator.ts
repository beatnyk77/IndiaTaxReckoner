import {
    TaxCalculatorInputs,
    TaxRegimeBreakdown,
    TaxCalculatorResults
} from "@/types/calculator";
import { ReckonerRow } from "@/types/tax";

/**
 * Pure function to calculate tax for a specific regime
 */
export function calculateRegimeTax(
    regime: 'old' | 'new',
    inputs: TaxCalculatorInputs,
    slabsData: any[],
    rebateData?: any,
    cessRate: number = 0.04
): TaxRegimeBreakdown {
    const isNewRegime = regime === 'new';

    // 1. Calculate Gross Total Income
    const grossTotalIncome =
        inputs.income.salary +
        inputs.income.interest +
        inputs.income.rental +
        inputs.income.other;

    // 2. Apply Deductions
    let totalDeductions = 0;
    if (isNewRegime) {
        // New Act 2025: Standard Deduction is typically 75,000 for salaried
        // Other deductions are mostly blocked except NPS employer contribution (simplified here)
        totalDeductions = inputs.deductions.standardDeduction;
    } else {
        // Old Regime: Sum of all deductions
        totalDeductions =
            inputs.deductions.section80C +
            inputs.deductions.section80D +
            inputs.deductions.section80E +
            inputs.deductions.nps80CCD1B +
            inputs.deductions.hra +
            inputs.deductions.standardDeduction +
            inputs.deductions.other;
    }

    const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions);

    // 3. Calculate Slab Tax
    let taxBeforeSurcharge = 0;
    const sortedSlabs = [...slabsData].sort((a, b) => {
        // Handle "Above X" vs "X - Y"
        const getMin = (s: string) => {
            if (s.includes('Above')) return parseInt(s.replace(/[^0-9]/g, '')) * 100000;
            return parseInt(s.split('-')[0].replace(/[^0-9]/g, '')) * 100000;
        };
        return getMin(a.income_range) - getMin(b.income_range);
    });

    for (const slab of sortedSlabs) {
        if (taxableIncome <= 0) break;

        const rate = parseFloat(slab.rate.replace('%', '')) / 100;
        const range = slab.income_range;

        let lower = 0;
        let upper = Infinity;

        if (range.includes('Above')) {
            lower = parseInt(range.replace(/[^0-9]/g, '')) * 100000;
        } else {
            const parts = range.split('-').map((p: string) => parseInt(p.replace(/[^0-9]/g, '')) * 100000);
            lower = parts[0];
            upper = parts[1];
        }

        if (taxableIncome > lower) {
            const taxableInSlab = Math.min(taxableIncome, upper) - lower;
            taxBeforeSurcharge += taxableInSlab * rate;
        }
    }

    // 4. Calculate Rebate 87A
    let rebate87A = 0;
    if (rebateData) {
        const rebateLimit = parseInt(rebateData.limit.replace(/[^0-9]/g, '')) * 100000;
        const maxRebate = parseInt(rebateData.amount.replace(/[^0-9]/g, ''));

        if (taxableIncome <= rebateLimit) {
            rebate87A = Math.min(taxBeforeSurcharge, maxRebate);
        }
    }

    let taxAfterRebate = Math.max(0, taxBeforeSurcharge - rebate87A);

    // 5. Calculate Surcharge (Simplified for MVP)
    let surcharge = 0;
    if (taxableIncome > 5000000) {
        // 10% surcharge above 50L (typical)
        surcharge = taxAfterRebate * 0.10;
    }

    // 6. Calculate Cess
    const cess = (taxAfterRebate + surcharge) * cessRate;

    const totalTaxLiability = taxAfterRebate + surcharge + cess;

    return {
        regime,
        grossTotalIncome,
        totalDeductions,
        taxableIncome,
        taxBeforeSurcharge,
        rebate87A,
        taxAfterRebate,
        surcharge,
        cess,
        totalTaxLiability,
        effectiveRate: grossTotalIncome > 0 ? (totalTaxLiability / grossTotalIncome) * 100 : 0
    };
}

/**
 * Orchestrator to calculate both regimes and compare
 */
export function calculateFullTaxComparison(
    inputs: TaxCalculatorInputs,
    allData: ReckonerRow[]
): TaxCalculatorResults {
    // Extract relevant rows for the selected AY
    const oldSlabs = allData.find(d => d.sub_category === 'old-regime-slabs')?.data || [];
    const newSlabs = allData.find(d => d.sub_category === 'new-regime-slabs')?.data || [];
    const oldRebate = allData.find(d => d.sub_category === 'rebates' && d.category === 'deductions-limits')?.data?.[0]; // Usually first is Old
    const newRebate = allData.find(d => d.sub_category === 'rebates' && d.category === 'deductions-limits')?.data?.[1]; // Usually second is New

    const oldBreakdown = calculateRegimeTax('old', inputs, oldSlabs, oldRebate);
    const newBreakdown = calculateRegimeTax('new', inputs, newSlabs, newRebate);

    return {
        oldRegime: oldBreakdown,
        newRegime: newBreakdown,
        recommendedRegime: newBreakdown.totalTaxLiability <= oldBreakdown.totalTaxLiability ? 'new' : 'old',
        savings: Math.abs(oldBreakdown.totalTaxLiability - newBreakdown.totalTaxLiability)
    };
}
