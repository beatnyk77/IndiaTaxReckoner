import { getReckonerTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { NewActChange } from "@/types/tax"
import { Scale } from "lucide-react"

export const revalidate = 3600

export default async function NewActPage() {
    const rows = await getReckonerTable("new-act-changes", "2027-28")
    const highlights = rows.find(r => r.sub_category === "highlights")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 p-3 rounded-xl">
                        <Scale className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Income-tax Act, 2025 (Highlights)</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Renumbered & Rationalized Provisions</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Key changes and structural reforms introduced by the New Income-tax Act 2025, which replaces
                    the Income-tax Act of 1961 with effect from FY 2026-27 (AY 2027-28).
                </p>
            </div>

            {highlights && (
                <TaxTable
                    title="Key Changes & Highlights"
                    subtitle="Impact assessment: High / Medium / Low based on taxpayer relevance"
                    data={highlights.data as NewActChange[]}
                    notes={highlights.notes}
                />
            )}
        </div>
    )
}
