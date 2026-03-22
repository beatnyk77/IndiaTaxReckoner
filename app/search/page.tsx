import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { ReckonerRow } from "@/types/tax"
import { Search, AlertCircle } from "lucide-react"

interface Props {
    searchParams: Promise<{ q?: string; ay?: string }>
}

export const revalidate = 60 // Shorter revalidation for search cache

export default async function SearchPage({ searchParams }: Props) {
    const { q = "", ay = "2027-28" } = await searchParams

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-12">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <Search className="h-6 w-6 text-primary" />
                    </div>
                    Search Results
                </h1>
                <p className="text-muted-foreground">
                    {q ? (
                        <>Showing results for <span className="font-semibold text-foreground">"{q}"</span> in AY {ay}</>
                    ) : (
                        "Please enter a search term to find relevant tax sections, rates, and limits."
                    )}
                </p>
            </div>

            <div className="space-y-6">
                <Suspense fallback={<SearchSkeleton />}>
                    <SearchResults q={q} ay={ay} />
                </Suspense>
            </div>
        </div>
    )
}

async function SearchResults({ q, ay }: { q: string, ay: string }) {
    if (!q) return null

    const supabase = createServerClient()
    // Fetch all for the AY, then filter in memory for precision across JSONB fields
    const { data: rows } = await supabase
        .from("reckoner_content")
        .select("*")
        .eq("tax_year", ay)
        .eq("is_active", true)

    if (!rows || rows.length === 0) {
        return <NoResults query={q} />
    }

    const queryLower = q.toLowerCase()

    // Custom filter: Check if any part of the JSON payload stringified contains the query
    const matchedRows = rows.filter((row) => {
        // Also match on category or sub_category names
        if (row.category.toLowerCase().includes(queryLower) || row.sub_category.toLowerCase().includes(queryLower)) return true

        // Stringify the data array and deeply search
        const dataString = JSON.stringify(row.data).toLowerCase()
        return dataString.includes(queryLower)
    }) as ReckonerRow[]

    if (matchedRows.length === 0) {
        return <NoResults query={q} />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedRows.map((row) => (
                <div key={row.id} className="bg-muted/30 border border-border/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold uppercase tracking-wider text-xs text-primary bg-primary/10 px-2 py-1 rounded inline-block">
                            {row.category.replace("-", " ")}
                        </h3>
                        <span className="text-xs text-muted-foreground">{row.sub_category.replace("-", " ")}</span>
                    </div>

                    <div className="space-y-3">
                        {/* Render matching snippets */}
                        {row.data.filter((item: any) => JSON.stringify(item).toLowerCase().includes(queryLower)).slice(0, 3).map((item: any, i: number) => {
                            // Extract the most relevant keys to display
                            const title = item.section || item.income_range || item.block || item.change || item.item || "Detail"
                            const val = item.rate || item.limit || item.impact || item.cii || item.amount || ""

                            return (
                                <div key={i} className="flex justify-between items-start gap-4 text-sm bg-background p-3 rounded-lg border border-border/40">
                                    <span className="font-medium">{title}</span>
                                    {val && <span className="text-muted-foreground text-right">{val}</span>}
                                </div>
                            )
                        })}
                        {row.data.filter((item: any) => JSON.stringify(item).toLowerCase().includes(queryLower)).length > 3 && (
                            <div className="text-xs text-muted-foreground text-center pt-2">
                                + more matches found in this category
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

function NoResults({ query }: { query: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 border border-border/50 rounded-xl border-dashed">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No direct matches found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
                We couldn't find any matching sections, limits, or rates for "{query}". Try searching for broader terms like "80C", "TDS", or "Slabs".
            </p>
        </div>
    )
}

function SearchSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
        </div>
    )
}
