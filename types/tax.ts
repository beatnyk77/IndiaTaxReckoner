/**
 * India Tax Reckoner — Core Type Definitions
 */

export type TaxCategory =
    | 'tax-slabs'
    | 'deductions-limits'
    | 'depreciation-rates'
    | 'tds-tcs-rates'
    | 'cii-history'
    | 'new-act-changes';

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
