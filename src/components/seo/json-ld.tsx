/**
 * JSON-LD Structured Data Components
 * Reusable across all public pages for SEO
 */

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface ServiceSchemaProps {
    name: string;
    description: string;
    category: string;
    image?: string;
    areaServed?: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

interface OrganizationSchemaProps {
    name?: string;
    description?: string;
    url?: string;
    logo?: string;
    areaServed?: string[];
    telephone?: string;
    email?: string;
}

// Organization JSON-LD
export function OrganizationJsonLd({
    name = 'Grupo RG',
    description = 'Empresa de construcción y reformas con más de 30 años de experiencia en Mallorca y las Islas Baleares.',
    url = 'https://gruporg.es',
    logo = '/logo.webp',
    areaServed = ['Mallorca', 'Menorca', 'Ibiza', 'Formentera', 'Islas Baleares'],
    telephone,
    email
}: OrganizationSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        name,
        description,
        url,
        logo: `${url}${logo}`,
        areaServed: areaServed.map(area => ({
            '@type': 'Place',
            name: area
        })),
        ...(telephone && { telephone }),
        ...(email && { email }),
        priceRange: '€€€',
        foundingDate: '1994',
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: 50
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '127'
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Breadcrumb JSON-LD
export function BreadcrumbJsonLd({ items, baseUrl = 'https://gruporg.es' }: { items: BreadcrumbItem[]; baseUrl?: string }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.href}`
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Service JSON-LD
export function ServiceJsonLd({
    name,
    description,
    category,
    image,
    areaServed = 'Mallorca, Islas Baleares'
}: ServiceSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        category,
        provider: {
            '@type': 'HomeAndConstructionBusiness',
            name: 'Grupo RG',
            url: 'https://gruporg.es'
        },
        areaServed: {
            '@type': 'Place',
            name: areaServed
        },
        ...(image && { image })
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// FAQ JSON-LD
export function FAQJsonLd({ items }: { items: FAQItem[] }) {
    if (!items || items.length === 0) return null;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// WebPage JSON-LD
export function WebPageJsonLd({
    name,
    description,
    url,
    type = 'WebPage'
}: {
    name: string;
    description: string;
    url: string;
    type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage';
}) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': type,
        name,
        description,
        url,
        isPartOf: {
            '@type': 'WebSite',
            name: 'Grupo RG',
            url: 'https://gruporg.es'
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
