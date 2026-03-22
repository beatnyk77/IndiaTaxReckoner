import { Suspense } from "react"
import { getEntityTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { ShieldAlert } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function SearchSeizurePage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getEntityTable("search-seizure", ay)

    const powers = rows.find(r => r.sub_category === "statutory-powers")
    const rights = rows.find(r => r.sub_category === "procedural-rights")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-3 rounded-xl">
                        <ShieldAlert className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Search & Seizure</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Procedural Reference for AY {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Framework for Income Tax Search operations (Raids) and Seizure protocols for AY {ay}.
                    Maps statutory powers under Section 132 and essential rights/obligations of the assessee during proceedings.
                </p>
            </div>

            {/* Statutory Powers */}
            <Suspense fallback={<TableSkeleton />}>
                {powers && (
                    <TaxTable
                        title="Statutory Powers"
                        subtitle="Legal authority for entry, search, and requisition"
                        data={powers.data as any[]}
                        notes={powers.notes}
                    />
                )}
            </Suspense>

            {/* Procedural Rights */}
            <Suspense fallback={<TableSkeleton />}>
                {rights && (
                    <TaxTable
                        title="Procedural Rights & Protocols"
                        subtitle="Panchnama requirements and digital asset handling"
                        data={rights.data as any[]}
                        notes={rights.notes}
                    />
                )}
            </Suspense>

            {(!powers && !rights) && (
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
