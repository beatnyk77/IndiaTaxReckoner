import Link from 'next/link'
import { Landmark, FileText, Calculator } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Landmark className="h-6 w-6 text-primary" />
                        </div>
                        <span className="hidden font-bold sm:inline-block text-xl tracking-tight">
                            Mahanka Tax Reckoner
                        </span>
                    </Link>
                    <Badge variant="default" className="hidden md:inline-flex bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 border border-blue-600/20">
                        New Income-tax Act 2025
                    </Badge>
                </div>

                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="#tax-slabs" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        <span className="hidden sm:inline">Tax Slabs</span>
                    </Link>
                    <Link href="#tds-tcs" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">TDS / TCS</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
