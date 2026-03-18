'use client'

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function AYSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    // Ensure this components works safely even if useSearchParams isn't wrapped in Suspense yet
    // In Next.js 15, we handle this carefully, but searchParams can safely be read here if wrapped higher up.
    const searchParams = useSearchParams()

    const defaultAY = "2027-28"
    const currentAY = searchParams.get("ay") || defaultAY

    const handleValueChange = (value: string | null) => {
        if (!value) return
        const params = new URLSearchParams(searchParams.toString())
        params.set("ay", value)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline-block">
                Assessment Year:
            </span>
            <Select value={currentAY} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[160px] h-9 rounded-xl bg-muted/30 shadow-none border-border/40 font-medium hover:bg-muted/50 transition-colors focus:ring-1 focus:ring-primary/30">
                    <SelectValue placeholder="Select AY" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-2xl border-border/40 bg-background/95 backdrop-blur-md">
                    <SelectItem value="2027-28" className="font-medium cursor-pointer rounded-lg hover:bg-muted/50 focus:bg-muted/50 py-2.5">
                        <div className="flex items-center gap-2">
                            AY 2027-28
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-center">New Act</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="2026-27" className="cursor-pointer rounded-lg hover:bg-muted/50 focus:bg-muted/50 py-2.5">
                        AY 2026-27
                    </SelectItem>
                    <SelectItem value="2025-26" className="cursor-pointer rounded-lg hover:bg-muted/50 focus:bg-muted/50 py-2.5">
                        AY 2025-26
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
