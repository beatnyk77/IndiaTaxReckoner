import { getReckonerTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { DepreciationRate } from "@/types/tax"
import { FileText } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600

export default async function DepreciationPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams
    const rows = await getReckonerTable("depreciation-rates", ay)

    const tangible = rows.find(r => r.sub_category === "tangible-assets")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-3 rounded-xl">
                        <FileText className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Depreciation Rates</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Assessment Year {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Block-wise depreciation rates on Written Down Value (WDV) for tangible and intangible assets under the Income-tax Act for AY {ay}.
                </p>
            </div>

            {tangible && (
                <TaxTable
                    title="Block-wise Depreciation Rates"
                    subtitle="WDV method — Additional 20% depreciation on new manufacturing P&M (Old Regime)"
                    data={tangible.data as DepreciationRate[]}
                    notes={tangible.notes}
                />
            )}
        </div>
    )
}
