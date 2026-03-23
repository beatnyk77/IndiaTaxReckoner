import { Metadata } from 'next'
import { CompanyCalculator } from '@/components/calculator/CompanyCalculator'
import { Building2, Calculator, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Company MAT & Normal Tax Calculator | India Direct Tax Reckoner 2025',
    description: 'Interactive estimator for domestic companies to compare Normal Tax vs Section 115JB (MAT) and Section 115BAA/BAB concessional regimes.',
}

export default function CompanyCalculatorPage() {
    return (
        <main className="min-h-screen pt-24 pb-12">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/private-companies"
                            className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <Calculator className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Interactive Estimator</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center gap-4">
                                <Building2 className="h-10 w-10 text-primary" />
                                Corporate Tax <span className="text-primary italic">&</span> MAT
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Compare Normal Provisions against Minimum Alternate Tax (Section 206) and concessional regimes for AY 2027-28.
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-right">
                            <span className="text-primary font-bold text-sm">New Act 2025</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Statutory Benchmark v2.0</span>
                        </div>
                    </div>
                </div>

                {/* Calculator Component */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 blur-[120px] -z-10 rounded-full" />
                    <CompanyCalculator />
                </div>

                {/* Disclaimer */}
                <div className="mt-16 p-6 bg-muted/10 rounded-2xl border border-border/40 text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                        Disclaimer: This calculator is for educational purposes only and provides estimations based on New Income-tax Act 2025 provisions.
                        It assumes domestic company status and turnover limits. Corporate tax involves complex adjustments to book profit; consult a CA for official filings.
                    </p>
                </div>
            </div>
        </main>
    )
}
