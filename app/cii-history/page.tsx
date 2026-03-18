import { getReckonerTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { CIIEntry } from "@/types/tax"
import { History } from "lucide-react"

export const revalidate = 3600

export default async function CIIPage() {
    const rows = await getReckonerTable("cii-history")
    const history = rows.find(r => r.sub_category === "history")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-rose-500/10 p-3 rounded-xl">
                        <History className="h-6 w-6 text-rose-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Cost Inflation Index</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Base Year: 2001-02 = 100</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Historical CII values notified by CBDT annually. Used to compute the indexed cost of acquisition
                    for calculating Long-Term Capital Gains (LTCG).
                </p>
            </div>

            {history && (
                <TaxTable
                    title="CII History (FY 2001-02 to 2026-27)"
                    subtitle="CBDT notifies CII annually. Values for recent years may be provisional."
                    data={history.data as CIIEntry[]}
                    notes={history.notes}
                />
            )}
        </div>
    )
}
