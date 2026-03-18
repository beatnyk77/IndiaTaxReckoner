import Link from "next/link";
import {
    Calculator,
    Percent,
    TrendingDown,
    FileText,
    History,
    Scale,
    ArrowRight
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";

const categories = [
    {
        title: "Tax Slabs & Rates",
        description: "Compare New vs Old regime slabs and surcharge applicable for individuals.",
        icon: Calculator,
        href: "/tax-slabs",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Deductions & Limits",
        description: "Explore Chapter VI-A deductions, standard deductions, and 87A rebates.",
        icon: TrendingDown,
        href: "/deductions-limits",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "TDS & TCS Rates",
        description: "Comprehensive list of TDS sections, TCS rates, and threshold limits.",
        icon: Percent,
        href: "/tds-tcs-rates",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        title: "Depreciation Rates",
        description: "Block-wise depreciation rates for tangible and intangible assets.",
        icon: FileText,
        href: "/depreciation-rates",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        title: "Cost Inflation Index",
        description: "Historical CII data from base year 2001-02 for capital gains calculation.",
        icon: History,
        href: "/cii-history",
        color: "text-rose-500",
        bg: "bg-rose-500/10",
    },
    {
        title: "New Act 2025 Changes",
        description: "Key highlights and major impacts of the rewritten Income-tax Act 2025.",
        icon: Scale,
        href: "/new-act-changes",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
    },
];

export default function HomePage() {
    return (
        <div className="flex-1 flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

                <div className="container relative mx-auto px-4 md:px-8 text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Demystifying the New Income-tax Act 2025
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed">
                        India's most comprehensive, blazing-fast digital reference for tax rates, thresholds, and statutory definitions.
                    </p>

                    <div className="mt-10 w-full max-w-xl mx-auto">
                        <SearchBar />
                    </div>
                </div>
            </section>

            {/* Category Grid */}
            <section className="py-16 md:py-24 bg-muted/20 border-t border-border/40 flex-1">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Link
                                    key={category.href}
                                    href={category.href}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 transition-all hover:bg-muted/50 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div>
                                        <div className={`inline-flex rounded-xl p-3 mb-4 ${category.bg}`}>
                                            <Icon className={`h-6 w-6 ${category.color}`} />
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight mb-2">
                                            {category.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {category.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center text-sm font-medium text-primary opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                                        Explore reference <ArrowRight className="ml-2 h-4 w-4" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
