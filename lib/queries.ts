import { createServerClient } from './supabase/server'

export type ReckonerRow = {
    id: string
    category: string
    tax_year: string
    sub_category: string
    data: any
    effective_from: string | null
    notes: string | null
    last_updated: string
    is_active: boolean
}

/**
 * Core query helper to fetch tax reference tables
 */
export async function getReckonerTable(category: string, taxYear?: string): Promise<ReckonerRow[]> {
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
