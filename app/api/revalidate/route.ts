import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin')
        const secret = request.headers.get('x-revalidate-secret')

        // In a real app, match this against process.env.REVALIDATION_SECRET
        // For MVP, we'll accept a basic header check
        if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV === 'production') {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
        }

        const { path } = await request.json()

        if (path) {
            revalidatePath(path)
            return NextResponse.json({ revalidated: true, path, now: Date.now() })
        }

        // Revalidate all data paths
        revalidatePath('/tax-slabs')
        revalidatePath('/deductions-limits')
        revalidatePath('/tds-tcs-rates')
        revalidatePath('/depreciation-rates')
        revalidatePath('/cii-history')
        revalidatePath('/new-act-changes')
        revalidatePath('/search')

        return NextResponse.json({ revalidated: true, now: Date.now(), message: 'All tax paths revalidated' })
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
    }
}
