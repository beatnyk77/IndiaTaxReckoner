'use client'

import * as React from 'react'
import { TaxInputForm } from './TaxInputForm'
import dynamic from 'next/dynamic'
import { calculateFullTaxComparison } from '@/lib/taxCalculator'

const TaxResults = dynamic(() => import('./TaxResults').then(mod => mod.TaxResults), {
    ssr: false,
    loading: () => <div className="h-96 flex items-center justify-center bg-muted/10 border border-dashed rounded-3xl animate-pulse">
        <p className="text-muted-foreground font-medium">Hydrating analysis engine...</p>
    </div>
})
import { TaxCalculatorInputs, TaxCalculatorResults } from '@/types/calculator'
import { ReckonerRow } from '@/types/tax'

interface Props {
    referenceData: ReckonerRow[]
}

const DEFAULT_INPUTS: TaxCalculatorInputs = {
    taxYear: '2027-28',
    ageGroup: 'below-60',
    income: {
        salary: 1500000,
        interest: 50000,
        rental: 0,
        other: 0
    },
    deductions: {
        section80C: 150000,
        section80D: 25000,
        section80E: 0,
        nps80CCD1B: 0,
        hra: 0,
        standardDeduction: 75000, // New Act default for New Regime
        other: 0
    },
    capitalGains: {
        stcg_15: 0,
        stcg_20: 0,
        ltcg_10: 0,
        ltcg_12_5: 0
    }
}

export function InteractiveCalculator({ referenceData }: Props) {
    const [inputs, setInputs] = React.useState<TaxCalculatorInputs>(DEFAULT_INPUTS)
    const [results, setResults] = React.useState<TaxCalculatorResults | null>(null)

    const [isLoaded, setIsLoaded] = React.useState(false)

    // Load from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('tax_scenario')
        if (saved) {
            try {
                setInputs(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse saved scenario')
            }
        }
        setIsLoaded(true)
    }, [])

    // Recalculate whenever inputs change
    React.useEffect(() => {
        if (!isLoaded) return
        // Dynamic Standard Deduction based on regime would be tricky in one engine call 
        // unless we pass a list of deductions. 
        // For simplicity, we ensure 75k vs 50k is handled inside the calculator engine 
        // or passed explicitly. The engine currently uses inputs.deductions.standardDeduction.
        // In AY 2027-28, New is 75k, Old is 50k.

        const calculation = calculateFullTaxComparison(inputs, referenceData)
        setResults(calculation)
    }, [inputs, referenceData, isLoaded])

    const handleSave = () => {
        localStorage.setItem('tax_scenario', JSON.stringify(inputs))
        alert('Scenario saved to this browser!')
    }

    const handleReset = () => {
        if (confirm('Reset all inputs?')) {
            setInputs(DEFAULT_INPUTS)
            localStorage.removeItem('tax_scenario')
        }
    }

    if (!isLoaded) return null

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/20 p-4 rounded-2xl border border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Persistent Session Active
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-primary/20"
                    >
                        Save Scenario
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 sticky top-24">
                    <TaxInputForm
                        initialValues={inputs}
                        onInputChange={(newInputs) => setInputs(newInputs)}
                    />
                </div>

                <div className="lg:col-span-7">
                    {results ? (
                        <TaxResults results={results} />
                    ) : (
                        <div className="h-96 flex items-center justify-center bg-muted/20 border border-dashed rounded-3xl animate-pulse">
                            <p className="text-muted-foreground font-medium">Calculating liability...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
