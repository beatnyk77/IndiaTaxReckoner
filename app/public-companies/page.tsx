import Link from "next/link"
import { Suspense } from "react"
import { getEntityTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { Landmark, Building } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function PublicCompaniesPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getEntityTable("public-company", ay)

    const taxRates = rows.find(r => r.sub_category === "tax-rates")
    const provisions = rows.find(r => r.sub_category === "listing-provisions")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-sky-500/10 p-3 rounded-xl">
                        <Landmark className="h-6 w-6 text-sky-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Public & Listed Companies</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Assessment Year {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed text-white">
                    Taxation rules for public listed companies and foreign entities for AY {ay}.
                    Covers specific surcharges, securities transaction tax (STT) implications, and dividend rules.
                </p>
            </div>

            {/* Quick Action Simulator */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-primary/[0.07] transition-all text-white">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start text-white">
                        <Building className="h-5 w-5 text-sky-500" />
                        Corporate Tax Analyzer
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Calculate MAT liability vs Normal Tax and evaluate buyback or dividend distribution impacts.
                    </p>
                </div>
                <Link
                    href="/calculator/company-mat"
                    className="bg-primary px-8 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest text-white hover:opacity-90 transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
                >
                    Launch Calculator
                </Link>
            </div>

            {/* Tax Rates */}
            <Suspense fallback={<TableSkeleton />}>
                {taxRates && (
                    <TaxTable
                        title="Corporate Tax Rates"
                        subtitle="Domestic and Foreign company taxation"
                        data={taxRates.data as any[]}
                        notes={taxRates.notes}
                    />
                )}
            </Suspense>

            {/* General Provisions */}
            <Suspense fallback={<TableSkeleton />}>
                {provisions && (
                    <TaxTable
                        title="Listing & Capital Provisions"
                        subtitle="STT, Buyback tax, and Dividend distribution"
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
