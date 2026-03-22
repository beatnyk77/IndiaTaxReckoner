'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function SearchBar() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const handleSearch = (query: string) => {
        setOpen(false)
        router.push(`/search?q=${encodeURIComponent(query)}`)
    }

    const navigateTo = (path: string) => {
        setOpen(false)
        router.push(path)
    }

    return (
        <>
            <Button
                variant="outline"
                className="relative h-10 w-full justify-start rounded-xl bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-80 lg:w-96 border-border/40 hover:bg-muted/80 backdrop-blur-sm transition-all focus:ring-1 focus:ring-primary/30"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                <span>Search tax sections, rates...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type a section or keyword, then press Enter..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(e.currentTarget.value)
                        }
                    }}
                />
                <CommandList className="max-h-[400px]">
                    <CommandEmpty>Press Enter to search all tax records.</CommandEmpty>
                    <CommandGroup heading="Business Entities">
                        <CommandItem onSelect={() => navigateTo('/partnerships')}>Partnerships Reference</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/llps')}>LLP Provisions</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/private-companies')}>Private Companies (Domestic)</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/public-companies')}>Public & Listed Companies</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/trusts')}>Trusts & Charitable Institutions</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/aop-boi')}>AOP & BOI Rules</CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Compliance & Procedures">
                        <CommandItem onSelect={() => navigateTo('/assessment-proceedings')}>Assessment Proceedings</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/appeals')}>Appeals (CIT/ITAT/HC)</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/search-seizure')}>Search & Seizure Protocol</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/penalties-prosecution')}>Penalties & Prosecution</CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Quick Links">
                        <CommandItem onSelect={() => navigateTo('/calculator')}>Interactive Tax Estimator</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/tax-slabs')}>Tax Slabs (New Regime)</CommandItem>
                        <CommandItem onSelect={() => navigateTo('/tds-tcs-rates')}>TDS / TCS Rates</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
