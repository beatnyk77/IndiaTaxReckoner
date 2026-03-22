'use client'

import * as React from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { calculatePartnershipTax } from "@/lib/entityCalculators"
import { PartnershipTaxResult } from "@/types/tax"
import { Users, Briefcase, Calculator, Info, Scale, Percent } from 'lucide-react'

export function PartnershipCalculator() {
    const [mode, setMode] = React.useState<'actual' | 'presumptive'>('actual')

    // Actual Route State
    const [bookProfit, setBookProfit] = React.useState<number>(1000000)
    const [actualRemuneration, setActualRemuneration] = React.useState<number>(500000)

    // Presumptive Route State
    const [turnover, setTurnover] = React.useState<number>(2000000)
    const [isProfessional, setIsProfessional] = React.useState(false)

    const [results, setResults] = React.useState<PartnershipTaxResult | null>(null)

    React.useEffect(() => {
        const res = calculatePartnershipTax(
            mode === 'actual' ? bookProfit : 0,
            mode === 'actual' ? actualRemuneration : 0,
            mode === 'presumptive',
            mode === 'presumptive' ? turnover : 0,
            mode === 'presumptive' && isProfessional
        );
        setResults(res);
    }, [mode, bookProfit, actualRemuneration, turnover, isProfessional]);

    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!results) return null;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Mode Selection Tabs */}
            <div className="flex justify-center">
                <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2 bg-background/50 backdrop-blur-md border border-white/5 p-1 h-12 rounded-2xl">
                        <TabsTrigger
                            value="actual"
                            className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs uppercase transition-all"
                        >
                            <Scale className="h-4 w-4 mr-2" />
                            Actual Audit
                        </TabsTrigger>
                        <TabsTrigger
                            value="presumptive"
                            className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold text-xs uppercase transition-all"
                        >
                            <Percent className="h-4 w-4 mr-2" />
                            Presumptive
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Panel */}
                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        {mode === 'actual' ? <Briefcase className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5 text-emerald-500" />}
                        {mode === 'actual' ? 'Audit Details' : 'Turnover Metrics'}
                    </h3>

                    <div className="space-y-4">
                        {mode === 'actual' ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="profit">Book Profit (Before Remuneration)</Label>
                                    <Input
                                        id="profit"
                                        type="number"
                                        value={bookProfit}
                                        onChange={(e) => setBookProfit(Number(e.target.value))}
                                        className="bg-background/50 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rem">Actual Partner Remuneration Paid</Label>
                                    <Input
                                        id="rem"
                                        type="number"
                                        value={actualRemuneration}
                                        onChange={(e) => setActualRemuneration(Number(e.target.value))}
                                        className="bg-background/50 border-white/10"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="turnover">Gross Receipts / Turnover</Label>
                                    <Input
                                        id="turnover"
                                        type="number"
                                        value={turnover}
                                        onChange={(e) => setTurnover(Number(e.target.value))}
                                        className="bg-background/50 border-white/10"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold">Professional Services?</Label>
                                        <p className="text-[10px] text-muted-foreground">Opt for Sec 44ADA (50% flat rate)</p>
                                    </div>
                                    <Switch
                                        checked={isProfessional}
                                        onCheckedChange={setIsProfessional}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                {/* Analysis/Limit Card */}
                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 flex flex-col justify-center gap-6">
                    {mode === 'actual' ? (
                        <div className="space-y-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                                <Info className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Sec 40(b) Ceiling</h4>
                                <div className="text-3xl font-black text-white">{formatINR(results.remuneration_limit)}</div>
                            </div>
                            <p className="text-xs text-muted-foreground px-4">
                                Maximum deductible salary/interest for partners based on tiered profits.
                                Excess paid is disallowed and taxed at firm level.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
                                <Percent className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Deemed Profit Rate</h4>
                                <div className="text-4xl font-black text-white">{isProfessional ? '50%' : '8%'}</div>
                            </div>
                            <p className="text-xs text-muted-foreground px-4">
                                Estimated net income for tax purposes. No book profit or expense audit required below statutory thresholds.
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Results Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-8 bg-muted/10 border-white/5 border-dashed flex flex-col items-center justify-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Firm Taxable Base</span>
                    <div className="text-4xl font-black">{formatINR(results.firm_taxable_income)}</div>
                </Card>

                <Card className="p-8 bg-primary/10 border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-6 group-hover:rotate-0 transition-all duration-500">
                        <Calculator className="h-24 w-24 text-primary" />
                    </div>
                    <div className="space-y-1 relative">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Final Tax Payable</span>
                        <div className="text-5xl font-black text-primary font-mono">{formatINR(results.tax_payable)}</div>
                        <div className="flex gap-4 pt-4 mt-2">
                            <div className="text-[10px] text-muted-foreground">Surcharge: {formatINR(results.surcharge)}</div>
                            <div className="text-[10px] text-muted-foreground">Cess (4%): {formatINR(results.cess)}</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-4 bg-muted/20 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    Calculation based on Fixed 30% Tax Rate for Partnerships/LLPs.
                    {mode === 'actual'
                        ? ' Actual route requires audited book profits.'
                        : ' Presumptive route (44AD/ADA) has specific turnover limits (3Cr/75L).'}
                    Consult the {mode === 'actual' ? 'Section 40(b)' : 'Section 44'} guidelines for precise eligibility.
                </p>
            </div>
        </div>
    )
}
