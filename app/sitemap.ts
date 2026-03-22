import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://mahanka.com'
    const lastModified = new Date()

    const routes = [
        '',
        '/tax-slabs',
        '/deductions-limits',
        '/tds-tcs-rates',
        '/depreciation-rates',
        '/cii-history',
        '/new-act-changes',
        '/search',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))
}
