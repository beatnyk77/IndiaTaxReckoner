'use client'

import * as React from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { calculateAOPBOITax } from "@/lib/entityCalculators"
import { AOPBOITaxResult } from "@/types/tax"
import { Users2, ShieldAlert, UserPlus, Trash2, PieChart, Info } from 'lucide-react'

export function AOPCalculator() {
    const [totalIncome, setTotalIncome] = React.useState<number>(1000000)
    const [isIndeterminate, setIsIndeterminate] = React.useState(false)
    const [anyMemberAboveBEL, setAnyMemberAboveBEL] = React.useState(false)

    interface Member {
        id: string;
        name: string;
        sharePercent: number;
    }

    const [members, setMembers] = React.useState<Member[]>([
        { id: '1', name: 'Member A', sharePercent: 50 },
        { id: '2', name: 'Member B', sharePercent: 50 },
    ])

    const [results, setResults] = React.useState<AOPBOITaxResult | null>(null)

    React.useEffect(() => {
        const res = calculateAOPBOITax(
            totalIncome,
            isIndeterminate,
            anyMemberAboveBEL ? 400000 : 200000, // Mocking BEL crossing
            members.map(m => ({ name: m.name, sharePercent: m.sharePercent }))
        );
        setResults(res);
    }, [totalIncome, isIndeterminate, anyMemberAboveBEL, members]);

    const handleAddMember = () => {
        setMembers([...members, { id: Date.now().toString(), name: `Member ${String.fromCharCode(65 + members.length)}`, sharePercent: 0 }])
    }

    const handleRemoveMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id))
    }

    const updateShare = (id: string, share: number) => {
        setMembers(members.map(m => m.id === id ? { ...m, sharePercent: share } : m))
    }

    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!results) return null;

    const totalSharedPercent = members.reduce((sum, m) => sum + m.sharePercent, 0);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Association Params */}
                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-400">
                        <Users2 className="h-5 w-5" />
                        Association Profile
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="income">Total Association Income</Label>
                            <Input
                                id="income"
                                type="number"
                                value={totalIncome}
                                onChange={(e) => setTotalIncome(Number(e.target.value))}
                                className="bg-background/50 border-white/10"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold">Indeterminate Shares?</Label>
                                <p className="text-[10px] text-muted-foreground italic">Shares of members are not defined.</p>
                            </div>
                            <Switch
                                checked={isIndeterminate}
                                onCheckedChange={setIsIndeterminate}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold text-amber-400/80">BEL Check</Label>
                                <p className="text-[10px] text-muted-foreground italic">Does any member have income > 3L already?</p>
                            </div>
                            <Switch
                                checked={anyMemberAboveBEL}
                                onCheckedChange={setAnyMemberAboveBEL}
                            />
                        </div>
                    </div>
                </Card>

                {/* Member Definitions */}
                <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Member Sourcing
                        </h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddMember}
                            className="h-8 rounded-lg border-primary/20 text-primary hover:bg-primary/10"
                        >
                            <UserPlus className="h-3.5 w-3.5 mr-2" /> Add
                        </Button>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 group">
                                <Input
                                    value={member.name}
                                    onChange={(e) => setMembers(members.map(m => m.id === member.id ? { ...m, name: e.target.value } : m))}
                                    className="h-8 bg-transparent border-none p-0 focus-visible:ring-0 font-medium text-sm w-24"
                                />
                                <div className="flex-1 flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={member.sharePercent}
                                        onChange={(e) => updateShare(member.id, Number(e.target.value))}
                                        className="h-8 bg-background/30 border-white/10 text-right text-xs"
                                    />
                                    <span className="text-xs text-muted-foreground">%</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {totalSharedPercent !== 100 && !isIndeterminate && (
                        <p className="text-[10px] text-amber-500 font-bold text-center">Warning: Shares total {totalSharedPercent}% (Target 100%)</p>
                    )}
                </Card>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className={`p-6 border-white/10 flex flex-col justify-center text-center gap-2 ${results.mmr_applicable ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                    <div className="mx-auto bg-background/50 p-2 rounded-full mb-2">
                        <ShieldAlert className={`h-6 w-6 ${results.mmr_applicable ? 'text-amber-500' : 'text-emerald-500'}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Tax Regime</span>
                    <div className="text-xl font-bold">{results.mmr_applicable ? 'MMR (30%)' : 'Individual Slabs'}</div>
                    <p className="text-[10px] text-muted-foreground px-4">
                        {results.mmr_applicable ? 'Taxed at Maximum Marginal Rate' : 'Association benefits from progressive slabs'}
                    </p>
                </Card>

                <Card className="lg:col-span-2 p-8 bg-primary/10 border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <PieChart className="h-32 w-32 text-primary" />
                    </div>
                    <div className="space-y-4 relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">Final Entity Liability</span>
                                <div className="text-5xl font-black text-primary mt-1">{formatINR(results.total_tax)}</div>
                            </div>
                            {results.share_taxable_at_aop && (
                                <div className="px-3 py-1 bg-primary text-[10px] font-black rounded-full text-white">TAXABLE AT AOP</div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground max-w-md leading-relaxed italic">
                            The tax is inclusive of 4% Health & Education Cess and applicable surcharges if income crosses 1Cr.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Member Breakdown Table */}
            <Card className="p-6 bg-background/20 backdrop-blur-xl border-white/5 overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                    <Info className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Share-of-Income Distribution</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-tighter">
                                <th className="pb-4 font-semibold">Member</th>
                                <th className="pb-4 text-right font-semibold">Share Amount</th>
                                <th className="pb-4 text-right font-semibold">Tax Impact (In Member Hands)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {results.share_of_members.map((m, idx) => (
                                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 font-medium">{m.member}</td>
                                    <td className="py-4 text-right font-mono">{formatINR(m.share)}</td>
                                    <td className="py-4 text-right">
                                        {m.tax_impact === 0 ? (
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-bold">EXEMPT</span>
                                        ) : (
                                            <span className="font-mono text-rose-400">{formatINR(m.tax_impact)}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
