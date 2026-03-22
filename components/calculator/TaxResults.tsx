'use client'

import * as React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, TrendingUp, Wallet, Download } from 'lucide-react'
import { TaxCalculatorResults, TaxRegimeBreakdown } from '@/types/calculator'

interface Props {
    results: TaxCalculatorResults
}

export function TaxResults({ results }: Props) {
    const downloadReport = async () => {
        // Dynamic import to avoid SSR issues with Workers
        const { default: jsPDF } = await import('jspdf')
        const { default: autoTable } = await import('jspdf-autotable')

        const doc = new jsPDF()

        // Header
        doc.setFontSize(22)
        doc.text('India Tax Comparison Report', 20, 20)
        doc.setFontSize(10)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 28)
        doc.text('Basis: New Income-tax Act 2025 Proposals (AY 2027-28)', 20, 33)

        // Table Data
        const rows = [
            ['Gross Total Income', results.oldRegime.grossTotalIncome, results.newRegime.grossTotalIncome],
            ['Total Deductions', results.oldRegime.totalDeductions, results.newRegime.totalDeductions],
            ['Taxable Income', results.oldRegime.taxableIncome, results.newRegime.taxableIncome],
            ['Tax Before Surcharge', results.oldRegime.taxBeforeSurcharge, results.newRegime.taxBeforeSurcharge],
            ['Rebate 87A', results.oldRegime.rebate87A, results.newRegime.rebate87A],
            ['Surcharge & Cess', results.oldRegime.surcharge + results.oldRegime.cess, results.newRegime.surcharge + results.newRegime.cess],
            ['Total Liability', results.oldRegime.totalTaxLiability, results.newRegime.totalTaxLiability],
            ['Effective Rate', `${results.oldRegime.effectiveRate.toFixed(2)}%`, `${results.newRegime.effectiveRate.toFixed(2)}%`],
        ]

        autoTable(doc, {
            startY: 45,
            head: [['Metric', 'Old Regime (INR)', 'New Regime (INR)']],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] }
        })

        // Recommendation
        const finalY = (doc as any).lastAutoTable.finalY || 100
        doc.setFontSize(14)
        doc.text(`Recommended Regime: ${results.recommendedRegime.toUpperCase()}`, 20, finalY + 20)
        doc.text(`Potential Annual Savings: INR ${results.savings.toLocaleString('en-IN')}`, 20, finalY + 30)

        doc.save('India_Tax_Report.pdf')
    }
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val)
    }

    const RegimeCard = ({
        data,
        isRecommended
    }: {
        data: TaxRegimeBreakdown,
        isRecommended: boolean
    }) => (
        <Card className={`relative overflow-hidden transition-all duration-500 bg-background/40 backdrop-blur-md border-border/40 hover:shadow-2xl ${isRecommended ? 'ring-2 ring-primary shadow-primary/10' : 'opacity-80 grayscale-[0.3]'
            }`}>
            {isRecommended && (
                <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-tighter flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Recommended
                    </div>
                </div>
            )}

            <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black capitalize">{data.regime} Regime</CardTitle>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Liability Summary</p>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-1">
                    <span className="text-4xl font-mono font-bold text-foreground">
                        {formatCurrency(data.totalTaxLiability)}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Effective Rate:</span>
                        <span className="font-bold text-primary">{data.effectiveRate.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/20">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxable Income</span>
                        <span className="font-mono">{formatCurrency(data.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Surcharge & Cess</span>
                        <span className="font-mono">{formatCurrency(data.surcharge + data.cess)}</span>
                    </div>
                    {data.rebate87A > 0 && (
                        <div className="flex justify-between text-sm text-emerald-500 font-medium">
                            <span>Rebate 87A</span>
                            <span className="font-mono">-{formatCurrency(data.rebate87A)}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                        <span>Tax Burden</span>
                        <span>{data.effectiveRate.toFixed(0)}% of Gross</span>
                    </div>
                    <Progress value={data.effectiveRate * 2.5} className="h-2 bg-muted/30" />
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <RegimeCard
                    data={results.newRegime}
                    isRecommended={results.recommendedRegime === 'new'}
                />
                <RegimeCard
                    data={results.oldRegime}
                    isRecommended={results.recommendedRegime === 'old'}
                />
            </div>

            {results.savings > 0 && (
                <Card className="bg-primary/5 border-primary/20 border-dashed rounded-2xl">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="bg-primary/10 p-3 rounded-2xl">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Annual Potential Savings</h3>
                                <p className="text-sm text-muted-foreground">By choosing the <span className="text-primary font-bold uppercase">{results.recommendedRegime}</span> regime, you save significantly.</p>
                            </div>
                        </div>
                        <div className="text-3xl font-black text-primary p-4 bg-background/50 rounded-2xl border border-primary/10 shadow-inner">
                            {formatCurrency(results.savings)}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-muted-foreground italic">
                <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Calculations are based on the New Income-tax Act 2025 proposals.
                </div>
                <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
                >
                    <Download className="h-3 w-3" />
                    Download Report (PDF)
                </button>
            </div>
        </div>
    )
}
