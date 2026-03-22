import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'India Direct Tax Reckoner',
        short_name: 'TaxReckoner',
        description: 'Digital reference for Indian Tax Slabs, TDS/TCS, and New Income-tax Act 2025.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
