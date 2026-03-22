/**
 * India Tax Reckoner — Core Type Definitions
 */

export type TaxCategory =
    | 'tax-slabs'
    | 'deductions-limits'
    | 'depreciation-rates'
    | 'tds-tcs-rates'
    | 'cii-history'
    | 'new-act-changes'
    | 'partnership'
    | 'llp'
    | 'private-company'
    | 'public-company'
    | 'trust'
    | 'aop-boi'
    | 'assessment'
    | 'appeals'
    | 'search-seizure'
    | 'penalties';

export interface TaxSlab {
    income_range: string;
    rate: string;
    notes?: string;
}

export interface SurchargeRate {
    income_range: string;
    rate: string;
    notes?: string;
}

export interface DeductionLimit {
    section: string;
    limit: string;
    regime: 'New Regime' | 'Old Regime only' | 'Both Regimes';
}

export interface DepreciationRate {
    block: string;
    rate: string;
}

export interface TDSRate {
    section: string;
    nature: string;
    rate: string;
    threshold: string;
}

export interface TCSRate {
    section: string;
    nature: string;
    rate: string;
    threshold: string;
}

export interface CIIEntry {
    fy: string;
    cii: string;
    is_base?: boolean;
    notes?: string;
}

export interface NewActChange {
    change: string;
    detail: string;
    impact: 'High' | 'Medium' | 'Low';
}

export interface RebateSurchargeInfo {
    item: string;
    amount: string;
    condition: string;
}

/**
 * Supabase Row Structure
 */
export interface ReckonerRow<T = any> {
    id: string;
    category: TaxCategory;
    tax_year: string;
    sub_category: string;
    data: T[];
    effective_from: string | null;
    notes: string | null;
    last_updated: string;
    is_active: boolean;
}
/**
 * Entity-Specific Calculation Results
 */

export interface CompanyTaxResult {
    total_income: number;
    book_profit: number;
    normal_tax: number;
    mat_tax: number;
    effective_tax: number;
    surcharge: number;
    cess: number;
    total_payable: number;
    is_mat_applicable: boolean;
}

export interface TrustTaxResult {
    gross_receipts: number;
    applied_amount: number;
    accumulation_15: number;
    taxable_income: number;
    tax_payable: number;
    deemed_income: number;
    shortfall: number;
}

export interface PartnershipTaxResult {
    book_profit: number;
    remuneration_limit: number;
    actual_remuneration: number;
    firm_taxable_income: number;
    tax_payable: number;
    surcharge: number;
    cess: number;
}

export interface AOPBOITaxResult {
    total_income: number;
    share_taxable_at_aop: boolean;
    mmr_applicable: boolean;
    total_tax: number;
    share_of_members: {
        member: string;
        share: number;
        tax_impact: number;
    }[];
}
