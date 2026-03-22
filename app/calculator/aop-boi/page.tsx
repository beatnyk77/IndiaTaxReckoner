import { Metadata } from 'next'
import { AOPCalculator } from '@/components/calculator/AOPCalculator'
import { Users2, Calculator, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'AOP & BOI Share Distribution Calculator | India Direct Tax Reckoner 2025',
    description: 'Calculate tax liability for Association of Persons (AOP) and Body of Individuals (BOI). Check MMR triggers and member-level share of income impacts.',
}

export default function AOPCalculatorPage() {
    return (
        <main className="min-h-screen pt-24 pb-12">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/aop-boi"
                            className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <Calculator className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Association Estimator</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center gap-4">
                                <Users2 className="h-10 w-10 text-primary" />
                                AOP <span className="text-primary italic">&</span> BOI
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Project member-level distributions and determine if Section 167B Maximum Marginal Rate (MMR) applies to your association.
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-right">
                            <span className="text-primary font-bold text-sm">New Act 2025</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Distributive Engine v1.0</span>
                        </div>
                    </div>
                </div>

                {/* Calculator Component */}
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/10 blur-[120px] -z-10 rounded-full" />
                    <AOPCalculator />
                </div>

                {/* Disclaimer */}
                <div className="mt-16 p-6 bg-muted/10 rounded-2xl border border-border/40 text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                        Disclaimer: Section 167B provides complex triggers for MMR.
                        This calculator assumes simple Association of Persons status.
                        Indeterminate shares or higher individual income levels drastically change the tax burden. Verify with Section 167B guidelines.
                    </p>
                </div>
            </div>
        </main>
    )
}
