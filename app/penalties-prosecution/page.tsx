import { Suspense } from "react"
import { getEntityTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { AlertTriangle } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function PenaltiesPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getEntityTable("penalties", ay)

    const penalties = rows.find(r => r.sub_category === "common-penalties")
    const prosecution = rows.find(r => r.sub_category === "prosecution-sections")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-3 rounded-xl">
                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Penalties & Prosecution</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Statutory Reference for AY {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Overview of financial penalties and criminal prosecution provisions under the Income Tax Act for AY {ay}.
                    Maps common defaults such as under-reporting of income, failure of audit, and non-payment of TDS to their respective Sections.
                </p>
            </div>

            {/* Common Penalties */}
            <Suspense fallback={<TableSkeleton />}>
                {penalties && (
                    <TaxTable
                        title="Financial Penalties"
                        subtitle="Consequences for monetary defaults and reporting failures"
                        data={penalties.data as any[]}
                        notes={penalties.notes}
                    />
                )}
            </Suspense>

            {/* Prosecution Sections */}
            <Suspense fallback={<TableSkeleton />}>
                {prosecution && (
                    <TaxTable
                        title="Prosecution Provisions"
                        subtitle="Criminal liability and imprisonment terms"
                        data={prosecution.data as any[]}
                        notes={prosecution.notes}
                    />
                )}
            </Suspense>

            {(!penalties && !prosecution) && (
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
