import { Suspense } from "react"
import { getReckonerTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { DeductionLimit, RebateSurchargeInfo } from "@/types/tax"
import { TrendingDown } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600

export default async function DeductionsPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams
    const rows = await getReckonerTable("deductions-limits", ay)

    const general = rows.find(r => r.sub_category === "general")
    const rebate = rows.find(r => r.sub_category === "rebate-surcharge")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-3 rounded-xl">
                        <TrendingDown className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Deductions & Tax Limits (Act 2025)</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Assessment Year {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Key deductions, exemptions (Sec 123/124), and limits available under the New Income-tax Act, 2025 for AY {ay}.
                </p>
            </div>

            {general && (
                <TaxTable
                    title="Chapter VI-A Deductions & Limits"
                    subtitle="Regime-wise applicability noted for each deduction"
                    data={general.data as DeductionLimit[]}
                    notes={general.notes}
                />
            )}

            {rebate && (
                <TaxTable
                    title="Rebates (Section 155), Surcharge & Cess"
                    subtitle="Section 155 relief, Health & Education Cess, and AMT re-linked provisions"
                    data={rebate.data as RebateSurchargeInfo[]}
                    notes={rebate.notes}
                />
            )}
        </div>
    )
}
