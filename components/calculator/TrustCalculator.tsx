'use client'

import * as React from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { calculateTrustTax } from "@/lib/entityCalculators"
import { TrustTaxResult } from "@/types/tax"
import { Heart, Landmark, AlertTriangle, ShieldCheck, PieChart } from 'lucide-react'

export function TrustCalculator() {
    const [grossReceipts, setGrossReceipts] = React.useState<number>(10000000) // 1Cr default
    const [voluntaryContributions, setVoluntaryContributions] = React.useState<number>(0)
    const [appliedAmount, setAppliedAmount] = React.useState<number>(8500000)
    const [accumulation11_2, setAccumulation11_2] = React.useState<number>(0)

    const [results, setResults] = React.useState<TrustTaxResult | null>(null)

    React.useEffect(() => {
        const res = calculateTrustTax(grossReceipts, voluntaryContributions, appliedAmount, accumulation11_2);
        setResults(res);
    }, [grossReceipts, voluntaryContributions, appliedAmount, accumulation11_2]);

    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!results) return null;

    const applicationPercentage = (appliedAmount / (grossReceipts + voluntaryContributions)) * 100;
    const totalIncome = grossReceipts + voluntaryContributions;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Input Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-primary" />
                        Income & Receipts
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="receipts">Gross Receipts (from property held)</Label>
                            <Input
                                id="receipts"
                                type="number"
                                value={grossReceipts}
                                onChange={(e) => setGrossReceipts(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contributions">Voluntary Contributions</Label>
                            <Input
                                id="contributions"
                                type="number"
                                value={voluntaryContributions}
                                onChange={(e) => setVoluntaryContributions(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                        <div className="p-3 bg-muted/20 rounded-lg border border-white/5">
                            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                <span>Total Trust Income</span>
                                <span>{formatINR(totalIncome)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Heart className="h-5 w-5 text-rose-500" />
                        Application & Accumulation
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="applied">Amount Applied (for Objects)</Label>
                            <Input
                                id="applied"
                                type="number"
                                value={appliedAmount}
                                onChange={(e) => setAppliedAmount(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="acc112">Accumulated under Sec 11(2) (via Form 10)</Label>
                            <Input
                                id="acc112"
                                type="number"
                                value={accumulation11_2}
                                onChange={(e) => setAccumulation11_2(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                            <p className="text-[10px] text-muted-foreground italic">Requires filing Form 10 before ROI due date.</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Compliance Progress */}
            <Card className="p-8 bg-background/20 backdrop-blur-3xl border-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                    <PieChart className="h-24 w-24 text-primary" />
                </div>
                <div className="max-w-2xl">
                    <div className="flex justify-between items-end mb-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Compliance Score (Application)</h4>
                            <p className="text-xs text-muted-foreground">Threshold: 85% mandatory application</p>
                        </div>
                        <span className={`text-2xl font-black ${applicationPercentage >= 85 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {applicationPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <Progress value={Math.min(applicationPercentage, 100)} className="h-3 bg-white/5" />
                    <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-full border border-white/10">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-[10px] font-bold">15% UNCONDITIONAL EXEMPT: {formatINR(results.accumulation_15)}</span>
                        </div>
                        {applicationPercentage < 85 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-500 italic">SHORTFALL: {formatINR(results.shortfall)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Tax Result Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-background/40 border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-4">Deemed Income (Sec 11)</span>
                    <div className="text-4xl font-black mb-2">{formatINR(results.deemed_income)}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        The surplus amount not applied for charitable purposes or specifically accumulated under Section 11(2).
                    </p>
                </Card>

                <Card className={`p-6 border-white/10 transition-all ${results.tax_payable > 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tax Liability</span>
                        {results.tax_payable > 0 ? (
                            <div className="bg-rose-500 text-[10px] px-2 py-0.5 rounded-full text-white font-bold animate-pulse">ACTION REQUIRED</div>
                        ) : (
                            <div className="bg-emerald-500 text-[10px] px-2 py-0.5 rounded-full text-white font-bold">COMPLIANT</div>
                        )}
                    </div>
                    <div className="text-4xl font-black mb-2">{formatINR(results.tax_payable)}</div>
                    <p className="text-xs text-muted-foreground">Calculated at standard rate for non-application (plus SC/Cess if applicable)</p>
                </Card>
            </div>

            {/* Regulatory Footer */}
            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div className="space-y-1">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Statutory Rule: Application of Income</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Under Section 11(1), every charitable/religious trust must apply at least 85% of its income during the year.
                        Income not so applied and not specifically notified for accumulation (up to 5 years via Form 10) is taxed as Deemed Income.
                    </p>
                </div>
            </div>
        </div>
    )
}
