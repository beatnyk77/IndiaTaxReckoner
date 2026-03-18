'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TaxTableProps {
    title: string
    subtitle?: string
    data: any[]
    notes?: string | null
}

export function TaxTable({ title, subtitle, data, notes }: TaxTableProps) {
    if (!data || data.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                No data available for this category.
            </div>
        )
    }

    // Get dynamic headers from the first data object
    const keys = Object.keys(data[0])

    // Custom header mapping for better readability
    const headerMap: Record<string, string> = {
        income_range: "Income Range",
        rate: "Rate",
        notes: "Notes",
        section: "Section",
        limit: "Limit",
        regime: "Regime",
        block: "Asset Block",
        nature: "Nature of Payment",
        threshold: "Threshold",
        item: "Item",
        amount: "Amount",
        condition: "Condition",
        change: "Change",
        detail: "Detail",
        impact: "Impact",
        fy: "Financial Year",
        cii: "CII"
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="rounded-xl border bg-card/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {keys.map((key) => (
                                <TableHead key={key} className="py-4 font-bold text-foreground">
                                    {headerMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                {keys.map((key) => {
                                    const value = row[key];

                                    // Special rendering for specific keys
                                    if (key === 'impact') {
                                        const impactColor =
                                            value === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                value === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';

                                        return (
                                            <TableCell key={key} className="py-4">
                                                <Badge variant="outline" className={impactColor}>{value}</Badge>
                                            </TableCell>
                                        )
                                    }

                                    return (
                                        <TableCell key={key} className="py-4 text-sm leading-relaxed">
                                            {value || "—"}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {notes && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                        <span className="font-bold uppercase text-[10px] tracking-wider text-primary mr-2">Note:</span>
                        {notes}
                    </p>
                </div>
            )}
        </div>
    )
}
