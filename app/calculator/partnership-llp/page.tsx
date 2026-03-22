import { Metadata } from 'next'
import { PartnershipCalculator } from '@/components/calculator/PartnershipCalculator'
import { Users, Calculator, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Partnership & LLP Tax Calculator | India Direct Tax Reckoner 2025',
    description: 'Calculate firm-level tax, Section 40(b) partner remuneration limits, and Section 44AD/ADA presumptive taxation outcomes for AY 2027-28.',
}

export default function PartnershipCalculatorPage() {
    return (
        <main className="min-h-screen pt-24 pb-12">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/partnerships"
                            className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <Calculator className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Firm Estimator</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center gap-4">
                                <Users className="h-10 w-10 text-primary" />
                                Partnership <span className="text-primary italic">&</span> LLPs
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Seamlessly switch between Actual Profit audits and Presumptive Taxation (Sec 44AD/ADA) to optimize firm liability.
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-right">
                            <span className="text-primary font-bold text-sm">AY 2027-28</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Dual-Logic Controller v1.0</span>
                        </div>
                    </div>
                </div>

                {/* Calculator Component */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 blur-[120px] -z-10 rounded-full" />
                    <PartnershipCalculator />
                </div>

                {/* Disclaimer */}
                <div className="mt-16 p-6 bg-muted/10 rounded-2xl border border-border/40 text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                        Disclaimer: This estimator assumes Domestic Partnership/LLP status.
                        LLPs are generally not eligible for Section 44AD presumptive taxation under certain conditions;
                        please verify latest statutory eligibility circulars. Net savings depend on partner-level tax slabs.
                    </p>
                </div>
            </div>
        </main>
    )
}
