import { Suspense } from "react"
import { getReckonerTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { TDSRate, TCSRate } from "@/types/tax"
import { Percent } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600

export default async function TDSTCSPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams
    const rows = await getReckonerTable("tds-tcs-rates", ay)

    const tds = rows.find(r => r.sub_category === "tds")
    const tcs = rows.find(r => r.sub_category === "tcs")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-3 rounded-xl">
                        <Percent className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">TDS & TCS (Act 2025)</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Assessment Year {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Tax Deducted at Source and Tax Collected at Source rates under the New Income-tax Act, 2025 (Section 393 onwards) for AY {ay}.
                    PAN not furnished leads to higher rates (double or 5%, whichever is higher).
                </p>
            </div>

            {tds && (
                <TaxTable
                    title="TDS Rates — Key Sections"
                    subtitle="Threshold limits and applicable rates"
                    data={tds.data as TDSRate[]}
                    notes={tds.notes}
                />
            )}

            {tcs && (
                <TaxTable
                    title="TCS Rates — Key Sections"
                    subtitle="Collected at source by seller from buyer"
                    data={tcs.data as TCSRate[]}
                    notes={tcs.notes}
                />
            )}
        </div>
    )
}
