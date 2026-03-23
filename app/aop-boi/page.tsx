import Link from "next/link"
import { Suspense } from "react"
import { getEntityTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { Users } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function AopBoiPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getEntityTable("aop-boi", ay)

    const taxRates = rows.find(r => r.sub_category === "tax-rates")
    const provisions = rows.find(r => r.sub_category === "share-provisions")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-3 rounded-xl">
                        <Users className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">AOP & BOI</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Assessment Year {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Taxation framework for Association of Persons (AOP) and Body of Individuals (BOI) for AY {ay}.
                    Covers MMR application, determinate vs indeterminate shares, and double taxation relief rules.
                </p>
            </div>

            {/* Quick Action Simulator */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-primary/[0.07] transition-all text-white">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                        <Users className="h-5 w-5 text-orange-500" />
                        AOP/BOI Share Simulator
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Calculate entity level tax liability and derive distributive share-of-income impacts for members.
                    </p>
                </div>
                <Link
                    href="/calculator/aop-boi"
                    className="bg-primary px-8 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest text-white hover:opacity-90 transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
                >
                    Open Simulator
                </Link>
            </div>

            {/* Tax Rates */}
            <Suspense fallback={<TableSkeleton />}>
                {taxRates && (
                    <TaxTable
                        title="Taxation Rates"
                        subtitle="MMR and Individual rate applicability"
                        data={taxRates.data as any[]}
                        notes={taxRates.notes}
                    />
                )}
            </Suspense>

            {/* Share Provisions */}
            <Suspense fallback={<TableSkeleton />}>
                {provisions && (
                    <TaxTable
                        title="Share & Membership Provisions"
                        subtitle="Section 197 MMR and double tax relief"
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
