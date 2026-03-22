import { Metadata } from 'next'
import { TrustCalculator } from '@/components/calculator/TrustCalculator'
import { Heart, Calculator, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Trust & NGO Tax Calculator | India Direct Tax Reckoner 2025',
    description: 'Specialized estimator for charitable and religious trusts to calculate income application (85%) and accumulation (15%) under Section 11/12.',
}

export default function TrustCalculatorPage() {
    return (
        <main className="min-h-screen pt-24 pb-12">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/trusts"
                            className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <Calculator className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Compliance Estimator</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center gap-4">
                                <Heart className="h-10 w-10 text-rose-500" />
                                Trust Income <span className="text-rose-500 italic">&</span> NGOs
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Evaluate your "Application of Income" status under Section 11/12 and identify potential tax leakages for the year.
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-right">
                            <span className="text-rose-500 font-bold text-sm">New Act 2025</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Exemption Monitoring v1.0</span>
                        </div>
                    </div>
                </div>

                {/* Calculator Component */}
                <div className="relative">
                    <div className="absolute inset-0 bg-rose-500/10 blur-[120px] -z-10 rounded-full" />
                    <TrustCalculator />
                </div>

                {/* Disclaimer */}
                <div className="mt-16 p-6 bg-muted/10 rounded-2xl border border-border/40 text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                        Disclaimer: This calculator is for estimating "Application of Income" for charitable/religious trusts registered under Section 12AB/10(23C).
                        It does not account for business income (Incidental vs Non-incidental) or foreign contribution (FCRA) rules. Consult a professional auditor for audits.
                    </p>
                </div>
            </div>
        </main>
    )
}
