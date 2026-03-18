'use client'

import * as React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from 'lucide-react'

export function DisclaimerModal() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        // Check if the user has already accepted the disclaimer
        const hasAccepted = localStorage.getItem('tax-reckoner-disclaimer-accepted')
        if (!hasAccepted) {
            setOpen(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('tax-reckoner-disclaimer-accepted', 'true')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] border-border/40 bg-background/95 backdrop-blur">
                <DialogHeader className="flex flex-col items-center gap-4 text-center">
                    <div className="bg-amber-500/10 p-3 rounded-full">
                        <ShieldAlert className="h-8 w-8 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                        <DialogTitle className="text-2xl font-bold tracking-tight">Important Disclaimer</DialogTitle>
                        <DialogDescription className="text-muted-foreground leading-relaxed">
                            Mahanka Tax Reckoner is a digital reference tool for educational purposes only.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <p>
                        1. The information provided here is based on the proposed <span className="text-foreground font-medium underline decoration-primary/30">New Income-tax Act 2025</span> and current tax laws.
                    </p>
                    <p>
                        2. This tool does <span className="text-foreground font-bold">not</span> constitute official tax or legal advice. Tax laws are subject to change and interpretation.
                    </p>
                    <p>
                        3. Always consult with a qualified Chartered Accountant or tax professional before making any financial decisions or filing your returns.
                    </p>
                </div>

                <DialogFooter className="sm:justify-center pt-2">
                    <Button
                        onClick={handleAccept}
                        className="w-full sm:w-auto px-8 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    >
                        I Understand & Accept
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
