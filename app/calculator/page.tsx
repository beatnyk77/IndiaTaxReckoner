import * as React from 'react'
import { Calculator } from 'lucide-react'
import { createServerClient } from "@/lib/supabase/server"
import { InteractiveCalculator } from '@/components/calculator/InteractiveCalculator'

export const revalidate = 3600

export default async function CalculatorPage() {
    const supabase = createServerClient()

    // Fetch both slabs and rebates for calculations
    const { data: referenceData } = await supabase
        .from("reckoner_content")
        .select("*")
        .eq("is_active", true)
        .in("category", ["tax-slabs", "deductions-limits"])
        .order("tax_year", { ascending: false })

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-12">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary font-bold">
                        <Calculator className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Direct Tax Calculator</h1>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Compare the Old and New tax regimes with real-time precision. Powered by the New Income-tax Act 2025.
                </p>
            </div>

            <InteractiveCalculator referenceData={referenceData || []} />

            <div className="mt-12 p-8 rounded-3xl border border-border/40 bg-muted/5 flex flex-col items-center text-center space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">About the Engine</h3>
                <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
                    Our calculator uses the latest rates for AY 2027-28 (New Act 2025 proposals) and standard slabs for individual taxpayers.
                    The Old Regime calculation includes Section 87A rebates and standard deductions, but excludes specific HRA computation intricacies beyond the exemption amount provided.
                </p>
            </div>
        </div>
    )
}
