import { createServerClient } from './supabase/server'
import { ReckonerRow, TaxCategory } from '@/types/tax'

/**
 * Core query helper to fetch tax reference tables
 */
export async function getReckonerTable<T = any>(
    category: TaxCategory,
    taxYear?: string
): Promise<ReckonerRow<T>[]> {
    const supabase = createServerClient()

    let query = supabase
        .from('reckoner_content')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)

    if (taxYear && taxYear !== 'N/A') {
        query = query.eq('tax_year', taxYear)
    }

    const { data, error } = await query.order('sub_category', { ascending: true })

    if (error) {
        console.error(`Error fetching ${category}:`, error.message)
        return []
    }

    return data as ReckonerRow[]
}
