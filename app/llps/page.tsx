import { Suspense } from "react"
import { getEntityTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { Scale } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function LLPsPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getEntityTable("llp", ay)

    const taxRates = rows.find(r => r.sub_category === "tax-rates")
    const provisions = rows.find(r => r.sub_category === "provisions")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 p-3 rounded-xl">
                        <Scale className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">LLPs (Limited Liability Partnerships)</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Assessment Year {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Taxation and compliance framework for Limited Liability Partnerships (LLPs) for AY {ay} under the New Income-tax Act, 2025.
                    LLPs combine the flexibility of partnerships with the limited liability benefits of a company.
                </p>
            </div>

            {/* Tax Rates */}
            <Suspense fallback={<TableSkeleton />}>
                {taxRates && (
                    <TaxTable
                        title="LLP Tax Rates"
                        subtitle="Flat rate taxation and surcharges"
                        data={taxRates.data as any[]}
                        notes={taxRates.notes}
                    />
                )}
            </Suspense>

            {/* General Provisions */}
            <Suspense fallback={<TableSkeleton />}>
                {provisions && (
                    <TaxTable
                        title="LLP Specific Provisions"
                        subtitle="Audit thresholds and partner guidelines"
                        data={provisions.data as any[]}
                        notes={provisions.notes}
                    />
                )}
            </Suspense>

            {(!taxRates && !provisions) && (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-3xl bg-muted/5">
                    <p className="text-muted-foreground italic">No specific data found for Assessment Year {ay}.</p>
                </div>
            )}
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
