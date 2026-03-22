import { Suspense } from "react"
import { getEntityTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { Heart } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function TrustsPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getEntityTable("trust", ay)

    const exemptions = rows.find(r => r.sub_category === "exemption-rules")
    const registrations = rows.find(r => r.sub_category === "registration-sections")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-rose-500/10 p-3 rounded-xl">
                        <Heart className="h-6 w-6 text-rose-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Trusts & Charitable Institutions</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Assessment Year {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Taxation and exemption framework for Charitable and Private Trusts for AY {ay}.
                    Focuses on application of income, accumulation limits, and mandatory registration under the New Act.
                </p>
            </div>

            {/* Exemption Rules */}
            <Suspense fallback={<TableSkeleton />}>
                {exemptions && (
                    <TaxTable
                        title="Income & Exemption Rules"
                        subtitle="Application thresholds and accumulation limits"
                        data={exemptions.data as any[]}
                        notes={exemptions.notes}
                    />
                )}
            </Suspense>

            {/* Registration Sections */}
            <Suspense fallback={<TableSkeleton />}>
                {registrations && (
                    <TaxTable
                        title="Registration & Compliance"
                        subtitle="Sections 12AB and 80G requirements"
                        data={registrations.data as any[]}
                        notes={registrations.notes}
                    />
                )}
            </Suspense>

            {(!exemptions && !registrations) && (
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
