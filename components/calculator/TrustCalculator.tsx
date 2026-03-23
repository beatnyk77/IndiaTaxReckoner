'use client'

import * as React from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculateTrustTax } from "@/lib/entityCalculators"
import { TrustTaxResult } from "@/types/tax"
import { Landmark, Heart, ShieldCheck, AlertTriangle, Info, Save, RotateCcw, Download } from 'lucide-react'
import { generateTaxPDF } from "@/lib/pdfExport"

export function TrustCalculator() {
    const [grossReceipts, setGrossReceipts] = React.useState<number>(10000000)
    const [voluntaryContributions, setVoluntaryContributions] = React.useState<number>(2000000)
    const [appliedAmount, setAppliedAmount] = React.useState<number>(8000000)
    const [accumulation11_2, setAccumulation11_2] = React.useState<number>(0)
    const [isLoaded, setIsLoaded] = React.useState(false)

    const [results, setResults] = React.useState<TrustTaxResult | null>(null)

    // Persistence
    React.useEffect(() => {
        const saved = localStorage.getItem('trust_tax_scenario')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                setGrossReceipts(data.grossReceipts)
                setVoluntaryContributions(data.voluntaryContributions)
                setAppliedAmount(data.appliedAmount)
                setAccumulation11_2(data.accumulation11_2)
            } catch (e) { console.error(e) }
        }
        setIsLoaded(true)
    }, [])

    React.useEffect(() => {
        if (!isLoaded) return;
        const res = calculateTrustTax(grossReceipts, voluntaryContributions, appliedAmount, accumulation11_2);
        setResults(res);
    }, [grossReceipts, voluntaryContributions, appliedAmount, accumulation11_2, isLoaded]);

    const handleSave = () => {
        localStorage.setItem('trust_tax_scenario', JSON.stringify({ grossReceipts, voluntaryContributions, appliedAmount, accumulation11_2 }));
        alert('Trust scenario saved!');
    }

    const handleReset = () => {
        if (confirm('Reset inputs?')) {
            setGrossReceipts(10000000);
            setVoluntaryContributions(2000000);
            setAppliedAmount(8000000);
            setAccumulation11_2(0);
            localStorage.removeItem('trust_tax_scenario');
        }
    }

    const downloadPDF = async () => {
        if (!results) return;
        await generateTaxPDF({
            title: "Trust Tax & Accumulation Report",
            subtitle: "Basis: New Income-tax Act 2025 | Section 11/12 Exemption",
            fileName: "Mahanka_Trust_Tax_Report.pdf",
            summary: [
                { label: "Gross Receipts", value: formatINR(grossReceipts) },
                { label: "Applied for Charity", value: formatINR(appliedAmount) },
                { label: "Deemed Taxable Income", value: formatINR(results.deemed_income) }
            ],
            tableHead: ["Statutory Component", "Value (INR)"],
            tableRows: [
                ["Total Receipts (incl. VC)", formatINR(grossReceipts + voluntaryContributions)],
                ["Unconditional Exemption (15%)", formatINR(results.accumulation_15)],
                ["Notified Accumulation (11(2))", formatINR(accumulation11_2)],
                ["Shortfall in Application", formatINR(results.shortfall)],
                ["Deemed Taxable Income", formatINR(results.taxable_income)],
                ["Final Tax Payable (30% flat)", formatINR(results.tax_payable)]
            ]
        });
    }

    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!isLoaded || !results) return null;

    const totalIncome = grossReceipts + voluntaryContributions;
    const requiredApplication = totalIncome * 0.85;
    const currentApplication = appliedAmount + accumulation11_2;
    const applicationPercent = Math.min(100, (currentApplication / requiredApplication) * 100);
    const isCompliant = results.taxable_income === 0;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Persistence Bar */}
            <div className="flex border border-white/5 bg-background/20 p-2 rounded-2xl justify-between items-center px-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Drafting Session
                </div>
                <div className="flex gap-4">
                    <button onClick={handleReset} className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground hover:text-rose-400 transition-colors">
                        <RotateCcw className="h-3 w-3" /> Reset
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary hover:opacity-80">
                        <Save className="h-3 w-3" /> Save Scenario
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-primary" />
                        Inflow & Sourcing
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="receipts">Gross Receipts (Rents/Dividends etc.)</Label>
                            <Input
                                id="receipts"
                                type="number"
                                value={grossReceipts}
                                onChange={(e) => setGrossReceipts(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vc">Voluntary Contributions (Donations)</Label>
                            <Input
                                id="vc"
                                type="number"
                                value={voluntaryContributions}
                                onChange={(e) => setVoluntaryContributions(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-rose-400">
                        <Heart className="h-5 w-5" />
                        Charitable Application
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="applied">Amount Applied (Spent on Charity)</Label>
                            <Input
                                id="applied"
                                type="number"
                                value={appliedAmount}
                                onChange={(e) => setAppliedAmount(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="acc">Section 11(2) Accumulation (Specific Purpose)</Label>
                            <Input
                                id="acc"
                                type="number"
                                value={accumulation11_2}
                                onChange={(e) => setAccumulation11_2(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Compliance Progress */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border-white/10">
                <div className="flex justify-between items-end mb-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">85% Mandatory Application Rule</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-white">{formatINR(currentApplication)}</span>
                            <span className="text-muted-foreground">/ {formatINR(requiredApplication)}</span>
                        </div>
                    </div>
                    <Badge className={isCompliant ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}>
                        {isCompliant ? <ShieldCheck className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                        {isCompliant ? 'Compliant' : 'Shortfall Detected'}
                    </Badge>
                </div>
                <Progress value={applicationPercent} className="h-3 bg-white/5" />
                <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    15% of income ({formatINR(results.accumulation_15)}) is eligible for unconditional accumulation (exempt).
                </p>
            </Card>

            {/* Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-8 bg-muted/10 border-white/5 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Taxable Shortfall (Deemed Income)</span>
                    <div className={`text-4xl font-black ${isCompliant ? 'text-emerald-500' : 'text-rose-500 underline decoration-rose-500/30'}`}>{formatINR(results.taxable_income)}</div>
                </Card>

                <Card className="p-8 bg-primary/10 border-primary/20 relative overflow-hidden group">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Liability on Unapplied Income</span>
                    <div className="text-5xl font-black text-primary font-mono">{formatINR(results.tax_payable)}</div>
                    <p className="mt-4 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Exit Tax Rate: 34.32% (incl. SC + Cess)</p>
                </Card>
            </div>

            <Card className="p-6 bg-background/20 backdrop-blur-xl border-white/5">
                <div className="mt-2 flex justify-end">
                    <Button
                        onClick={downloadPDF}
                        className="bg-foreground text-background hover:opacity-90 rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-6"
                    >
                        <Download className="h-3.5 w-3.5 mr-2" /> Download Report (PDF)
                    </Button>
                </div>
            </Card>
        </div>
    )
}
