import { Suspense } from "react"
import { getReckonerTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { TaxSlab, SurchargeRate } from "@/types/tax"
import { Calculator } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function TaxSlabsPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getReckonerTable("tax-slabs", ay)

    const newRegime = rows.find(r => r.sub_category === "new-regime")
    const oldRegime = rows.find(r => r.sub_category === "old-regime")
    const surcharge = rows.find(r => r.sub_category === "surcharge")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-3 rounded-xl">
                        <Calculator className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Tax Slabs & Rates (Act 2025)</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Assessment Year {ay} | Default Regime</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Income tax slab rates under the New Income-tax Act, 2025 (default regime) and re-linked legacy regimes for AY {ay}.
                    Surcharge and Health &amp; Education Cess are additional.
                </p>
            </div>

            {/* New Regime Slabs */}
            <Suspense fallback={<TableSkeleton />}>
                {newRegime && (
                    <TaxTable
                        title="New Tax Regime (Default)"
                        subtitle="Applicable for FY 2026-27 onwards • Standard Deduction: ₹75,000 (Salaried)"
                        data={newRegime.data as TaxSlab[]}
                        notes={newRegime.notes}
                    />
                )}
            </Suspense>

            {/* Old Regime Slabs */}
            <Suspense fallback={<TableSkeleton />}>
                {oldRegime && (
                    <TaxTable
                        title="Old Tax Regime (Opt-in)"
                        subtitle="All Chapter VI-A deductions, HRA, LTA exemptions available"
                        data={oldRegime.data as TaxSlab[]}
                        notes={oldRegime.notes}
                    />
                )}
            </Suspense>

            {/* Surcharge Rates */}
            <Suspense fallback={<TableSkeleton />}>
                {surcharge && (
                    <TaxTable
                        title="Surcharge Rates"
                        subtitle="Applied on the base tax amount for incomes above ₹50 lakhs"
                        data={surcharge.data as SurchargeRate[]}
                        notes={surcharge.notes}
                    />
                )}
            </Suspense>
        </div>
    )
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-7 w-64 bg-muted animate-pulse rounded-xl" />
            <div className="h-40 bg-muted/50 animate-pulse rounded-xl" />
        </div>
    )
}
