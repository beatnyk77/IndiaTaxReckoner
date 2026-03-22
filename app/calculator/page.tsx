import * as React from 'react'
import { Calculator } from 'lucide-react'

export default function CalculatorPage() {
    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-12">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <Calculator className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Direct Tax Calculator</h1>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Estimate your tax liability under the New Income-tax Act 2025 and compare it with the Old Regime. Fully interactive, real-time results.
                </p>
            </div>

            <div className="p-12 border border-dashed border-border/60 rounded-3xl bg-muted/10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-12 w-12 bg-primary/20 rounded-full animate-pulse" />
                <h2 className="text-xl font-semibold">Calculator Engine Initializing...</h2>
                <p className="text-sm text-muted-foreground">We are setting up the interactive form and fetching the latest tax slabs from our database.</p>
            </div>
        </div>
    )
}
