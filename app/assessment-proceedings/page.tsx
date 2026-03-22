import { Suspense } from "react"
import { getEntityTable } from "@/lib/queries"
import { TaxTable } from "@/components/TaxTable"
import { ClipboardCheck } from "lucide-react"

interface Props {
    searchParams: Promise<{ ay?: string }>
}

export const revalidate = 3600 // ISR: revalidate every hour

export default async function AssessmentProceedingsPage({ searchParams }: Props) {
    const { ay = "2027-28" } = await searchParams

    const rows = await getEntityTable("assessment", ay)

    const notices = rows.find(r => r.sub_category === "notice-types")
    const timelines = rows.find(r => r.sub_category === "time-limits")

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-3 rounded-xl">
                        <ClipboardCheck className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Assessment Proceedings</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Reference Data for AY {ay}</p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Guidelines and legal references for Income Tax assessment proceedings for AY {ay}.
                    Covers scrutiny notices, summary assessments, and statutory time limits for completion.
                </p>
            </div>

            {/* Notice Types */}
            <Suspense fallback={<TableSkeleton />}>
                {notices && (
                    <TaxTable
                        title="Common Notices & Sections"
                        subtitle="Key communication channels from the IT Department"
                        data={notices.data as any[]}
                        notes={notices.notes}
                    />
                )}
            </Suspense>

            {/* Time Limits */}
            <Suspense fallback={<TableSkeleton />}>
                {timelines && (
                    <TaxTable
                        title="Statutory Time Limits"
                        subtitle="Deadlines for selection and completion"
                        data={timelines.data as any[]}
                        notes={timelines.notes}
                    />
                )}
            </Suspense>

            {(!notices && !timelines) && (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-3xl bg-muted/5">
                    <p className="text-muted-foreground italic">No specific data found for Assessment Year {ay}.</p>
                </div>
            )}
        </div>
    )
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-7 w-64 bg-muted animate-pulse rounded-xl" />
            <div className="h-40 bg-muted/50 animate-pulse rounded-xl" />
        </div>
    )
}
