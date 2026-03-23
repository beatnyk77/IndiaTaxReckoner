'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { Landmark, FileText, Calculator, Scale } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AYSwitcher } from '@/components/AYSwitcher'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Landmark className="h-6 w-6 text-primary" />
                        </div>
                        <span className="hidden font-bold sm:inline-block text-xl tracking-tight text-white">
                            Mahanka Tax Reckoner
                        </span>
                    </Link>
                    <Badge variant="default" className="hidden md:inline-flex bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 border border-blue-600/20 shadow-none">
                        New Income-tax Act 2025
                    </Badge>
                </div>

                <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
                    <Suspense fallback={<div className="h-9 w-[160px] animate-pulse bg-muted rounded-xl" />}>
                        <AYSwitcher />
                    </Suspense>

                    <div className="hidden xl:flex items-center gap-6 border-l border-border/40 pl-6 ml-2">
                        {/* Calculators Dropdown */}
                        <div className="relative group">
                            <button className="transition-colors hover:text-foreground text-primary font-semibold flex items-center gap-2">
                                <Calculator className="h-4 w-4" />
                                <span>Calculators</span>
                            </button>
                            <div className="absolute top-full -left-4 hidden group-hover:block pt-4 w-64">
                                <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2 grid gap-1">
                                    <Link href="/calculator" className="px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-between">
                                        Individual Slabs
                                        <Badge variant="outline" className="text-[8px] h-4">V2</Badge>
                                    </Link>
                                    <div className="h-px bg-border/20 my-1 mx-2" />
                                    <Link href="/calculator/company-mat" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors text-white">Company MAT Estimator</Link>
                                    <Link href="/calculator/trust" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors text-white">Trust Accumulation</Link>
                                    <Link href="/calculator/partnership-llp" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors text-white">Firm & LLP (Sec 61/62)</Link>
                                    <Link href="/calculator/aop-boi" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors text-white">AOP / BOI Share</Link>
                                </div>
                            </div>
                        </div>

                        {/* Entities Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 transition-colors text-foreground/60 hover:text-foreground">
                                <span>Entities</span>
                                <FileText className="h-3 w-3 opacity-50" />
                            </button>
                            <div className="absolute top-full -left-4 hidden group-hover:block pt-4 w-56">
                                <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2 grid gap-1 text-white">
                                    <Link href="/partnerships" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">Partnerships</Link>
                                    <Link href="/llps" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">LLPs</Link>
                                    <Link href="/private-companies" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">Private Cos</Link>
                                    <Link href="/public-companies" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">Public Cos</Link>
                                    <Link href="/trusts" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">Trusts</Link>
                                    <Link href="/aop-boi" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">AOP / BOI</Link>
                                </div>
                            </div>
                        </div>

                        {/* Compliance Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 transition-colors text-foreground/60 hover:text-foreground">
                                <span>Compliance</span>
                                <Scale className="h-3 w-3 opacity-50" />
                            </button>
                            <div className="absolute top-full -left-4 hidden group-hover:block pt-4 w-64">
                                <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2 grid gap-1 text-white">
                                    <Link href="/assessment-proceedings" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">Assessment Proceedings</Link>
                                    <Link href="/appeals" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">Appeals (CIT/ITAT)</Link>
                                    <Link href="/search-seizure" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">Search & Seizure</Link>
                                    <Link href="/penalties-prosecution" className="px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors">Penalties & Prosecution</Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/tax-slabs" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            <span>Slabs</span>
                        </Link>
                        <Link href="/tds-tcs-rates" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            <span>TDS</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}
