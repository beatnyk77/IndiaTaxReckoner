import { Suspense } from "react"
import { getEntityTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { Gavel } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function AppealsPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getEntityTable("appeals", ay)

    const hierarchy = rows.find(r => r.sub_category === "appellate-hierarchy")
    const deadlines = rows.find(r => r.sub_category === "fling-deadlines")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-3 rounded-xl">
                        <Gavel className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Appeals & Dispute Resolution</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Statutory Reference for AY {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Taxpayer remedies and the judicial hierarchy for resolving Income Tax disputes in AY {ay}.
                    Maps the progression from Faceless Appeals to the Supreme Court, including statutory filing deadlines.
                </p>
            </div>

            {/* Appellate Hierarchy */}
            <Suspense fallback={<TableSkeleton />}>
                {hierarchy && (
                    <TaxTable
                        title="Appellate Hierarchy"
                        subtitle="Levels of judicial and administrative oversight"
                        data={hierarchy.data as any[]}
                        notes={hierarchy.notes}
                    />
                )}
            </Suspense>

            {/* Filing Deadlines */}
            <Suspense fallback={<TableSkeleton />}>
                {deadlines && (
                    <TaxTable
                        title="Filing Deadlines"
                        subtitle="Time limits for initiating legal remedies"
                        data={deadlines.data as any[]}
                        notes={deadlines.notes}
                    />
                )}
            </Suspense>

            {(!hierarchy && !deadlines) && (
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
