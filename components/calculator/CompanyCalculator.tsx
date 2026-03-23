'use client'

import * as React from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { calculateCompanyTax } from "@/lib/entityCalculators"
import { CompanyTaxResult } from "@/types/tax"
import { TrendingUp, Scale, AlertCircle, Info, Save, RotateCcw, Download } from 'lucide-react'
import { generateTaxPDF } from "@/lib/pdfExport"

export function CompanyCalculator() {
    const [totalIncome, setTotalIncome] = React.useState<number>(50000000) // 5Cr default
    const [bookProfit, setBookProfit] = React.useState<number>(60000000) // 6Cr default
    const [isConcessional, setIsConcessional] = React.useState(false)
    const [isInitialPhase, setIsInitialPhase] = React.useState(false)

    const [results, setResults] = React.useState<CompanyTaxResult | null>(null)
    const [isLoaded, setIsLoaded] = React.useState(false)

    // Load from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('company_tax_scenario')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                setTotalIncome(data.totalIncome)
                setBookProfit(data.bookProfit)
                setIsConcessional(data.isConcessional)
                setIsInitialPhase(data.isInitialPhase)
            } catch (e) { console.error(e) }
        }
        setIsLoaded(true)
    }, [])

    React.useEffect(() => {
        if (!isLoaded) return;
        const res = calculateCompanyTax(totalIncome, bookProfit, isConcessional, isInitialPhase);
        setResults(res);
    }, [totalIncome, bookProfit, isConcessional, isInitialPhase, isLoaded]);

    const handleSave = () => {
        localStorage.setItem('company_tax_scenario', JSON.stringify({ totalIncome, bookProfit, isConcessional, isInitialPhase }));
        alert('Company scenario saved!');
    }

    const handleReset = () => {
        if (confirm('Reset inputs?')) {
            setTotalIncome(50000000);
            setBookProfit(60000000);
            setIsConcessional(false);
            setIsInitialPhase(false);
            localStorage.removeItem('company_tax_scenario');
        }
    }

    const downloadPDF = async () => {
        if (!results) return;
        await generateTaxPDF({
            title: "Corporate Tax & MAT Report",
            subtitle: "Basis: New Income-tax Act 2025 | Domestic Company",
            fileName: "Mahanka_Corporate_Tax_Report.pdf",
            summary: [
                { label: "Total Income (ITA)", value: formatINR(totalIncome) },
                { label: "Book Profit (Co. Act)", value: formatINR(bookProfit) },
                { label: "Final Tax Payable", value: formatINR(results.total_payable) }
            ],
            tableHead: ["Component", "Value (INR)"],
            tableRows: [
                ["Normal Tax Liability", formatINR(results.normal_tax)],
                ["MAT Liability (Section 206)", formatINR(results.mat_tax)],
                ["Effective Base Tax", formatINR(results.effective_tax)],
                ["Surcharge", formatINR(results.surcharge)],
                ["Cess (4%)", formatINR(results.cess)],
                ["Total Payable", formatINR(results.total_payable)]
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

            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Operating Metrics
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="income">Taxable Total Income (as per ITA)</Label>
                            <Input
                                id="income"
                                type="number"
                                value={totalIncome}
                                onChange={(e) => setTotalIncome(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profit">Net Book Profit (as per Co. Act)</Label>
                            <Input
                                id="profit"
                                type="number"
                                value={bookProfit}
                                onChange={(e) => setBookProfit(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Scale className="h-5 w-5 text-emerald-500" />
                        Statutory Regimes
                    </h3>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold">Concessional Rate (115BAA/BAB)</Label>
                                <p className="text-xs text-muted-foreground">Opt for 22% or 15% (no deductions)</p>
                            </div>
                            <Switch
                                checked={isConcessional}
                                onCheckedChange={setIsConcessional}
                            />
                        </div>

                        {isConcessional && (
                            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">New Manufacturing (Sec 115BAB)</Label>
                                    <p className="text-xs text-muted-foreground">Reduced rate of 15%</p>
                                </div>
                                <Switch
                                    checked={isInitialPhase}
                                    onCheckedChange={setIsInitialPhase}
                                />
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Results Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Normal Tax Card */}
                <Card className={`p-6 border-white/10 transition-all ${!results.is_mat_applicable ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-background/40 opacity-70'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Normal Tax</span>
                        {!results.is_mat_applicable && <div className="bg-emerald-500 text-[10px] px-2 py-0.5 rounded-full text-white font-bold">ACTIVE</div>}
                    </div>
                    <div className="text-3xl font-bold mb-2">{formatINR(results.normal_tax)}</div>
                    <p className="text-xs text-muted-foreground">Including tiered surcharge & cess</p>
                </Card>

                {/* MAT Tax Card */}
                <Card className={`p-6 border-white/10 transition-all ${results.is_mat_applicable ? 'bg-blue-500/10 border-blue-500/30' : 'bg-background/40 opacity-70'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-blue-400">MAT (Section 206)</span>
                            <Info className="h-3 w-3 text-blue-400/60 cursor-help" />
                        </div>
                        {results.is_mat_applicable && <div className="bg-blue-500 text-[10px] px-2 py-0.5 rounded-full text-white font-bold">APPLICABLE</div>}
                    </div>
                    <div className="text-3xl font-bold mb-2">{formatINR(results.mat_tax)}</div>
                    <p className="text-xs text-muted-foreground">15% on Book Profits + SC/Cess</p>
                </Card>

                {/* Final Liability Card */}
                <Card className="p-6 bg-primary/10 border-primary/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
                        <AlertCircle className="h-12 w-12 text-primary" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Final Tax Payable</span>
                    <div className="text-4xl font-black text-primary mb-2 line-clamp-1">{formatINR(results.total_payable)}</div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/20">
                        <div className={`h-2 w-2 rounded-full ${results.is_mat_applicable ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                        <span className="text-[11px] font-medium">Computed via {results.is_mat_applicable ? 'Minimum Alternate Tax' : 'Normal Provisions'}</span>
                    </div>
                </Card>
            </div>

            {/* Breakdown Table */}
            <Card className="p-6 bg-background/20 backdrop-blur-xl border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="pb-3 font-semibold text-white">Component</th>
                                <th className="pb-3 text-right font-semibold text-white">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3 text-muted-foreground">Base Tax Amount</td>
                                <td className="py-3 text-right font-mono text-white">{formatINR(results.effective_tax)}</td>
                            </tr>
                            <tr>
                                <td className="py-3 text-muted-foreground">Surcharge</td>
                                <td className="py-3 text-right font-mono text-white">{formatINR(results.surcharge)}</td>
                            </tr>
                            <tr>
                                <td className="py-3 text-muted-foreground">Health & Education Cess (4%)</td>
                                <td className="py-3 text-right font-mono text-white">{formatINR(results.cess)}</td>
                            </tr>
                            <tr className="border-t-2 border-white/10">
                                <td className="py-4 font-bold text-primary">Total Liability</td>
                                <td className="py-4 text-right font-bold text-primary text-lg font-mono">{formatINR(results.total_payable)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                    <Button
                        onClick={downloadPDF}
                        className="bg-foreground text-background hover:opacity-90 rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-6"
                    >
                        <Download className="h-3.5 w-3.5 mr-2" /> Download Full Report
                    </Button>
                </div>
            </Card>
        </div>
    )
}
