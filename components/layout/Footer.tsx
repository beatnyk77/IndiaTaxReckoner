import { ShieldAlert } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-muted/20 py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
                <div className="flex flex-col items-center gap-4 md:items-start md:flex-row">
                    <ShieldAlert className="h-6 w-6 text-muted-foreground/60" />
                    <p className="text-balance text-sm leading-loose text-muted-foreground">
                        Built by{" "}
                        <a
                            href="https://mahanka.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4 hover:text-foreground"
                        >
                            Mahanka
                        </a>
                        . Not official tax advice.
                        Information based on the proposed New Income-tax Act 2025.
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    AY 2027-28 Ref Data
                </p>
            </div>
        </footer>
    )
}
