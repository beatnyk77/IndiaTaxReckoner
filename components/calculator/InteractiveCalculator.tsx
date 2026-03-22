'use client'

import * as React from 'react'
import { TaxInputForm } from './TaxInputForm'
import { TaxResults } from './TaxResults'
import { calculateFullTaxComparison } from '@/lib/taxCalculator'
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

    // Recalculate whenever inputs change
    React.useEffect(() => {
        // Dynamic Standard Deduction based on regime would be tricky in one engine call 
        // unless we pass a list of deductions. 
        // For simplicity, we ensure 75k vs 50k is handled inside the calculator engine 
        // or passed explicitly. The engine currently uses inputs.deductions.standardDeduction.
        // In AY 2027-28, New is 75k, Old is 50k.

        const calculation = calculateFullTaxComparison(inputs, referenceData)
        setResults(calculation)
    }, [inputs, referenceData])

    return (
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
    )
}
