import { defineRouting } from 'next-intl/routing';


export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['es', 'en', 'ca', 'de', 'nl', 'fr', 'it'],

    // Used when no locale matches
    defaultLocale: 'es',

    // Localized pathnames
    pathnames: {
        '/': '/',
        '/contact': {
            es: '/contacto',
            en: '/contact',
            ca: '/contacte',
            de: '/kontakt',
            nl: '/contact',
            fr: '/contact',
            it: '/contatto'
        },
        '/services': {
            es: '/servicios',
            en: '/services',
            ca: '/serveis',
            de: '/dienstleistungen',
            nl: '/diensten',
            fr: '/services',
            it: '/servizi'
        },
        '/budget-request': {
            es: '/presupuesto',
            en: '/budget-request',
            ca: '/pressupost',
            de: '/angebot-anfordern',
            nl: '/offerte-aanvragen',
            fr: '/devis',
            it: '/preventivo'
        },
        '/services/[category]/[subcategory]': {
            es: '/servicios/[category]/[subcategory]',
            en: '/services/[category]/[subcategory]',
            ca: '/serveis/[category]/[subcategory]',
            de: '/dienstleistungen/[category]/[subcategory]',
            nl: '/diensten/[category]/[subcategory]',
            fr: '/services/[category]/[subcategory]',
            it: '/servizi/[category]/[subcategory]'
        },
        '/blog': {
            es: '/blog',
            en: '/blog',
            ca: '/blog',
            de: '/blog',
            nl: '/blog',
            fr: '/blog',
            it: '/blog'
        },
        '/blog/[slug]': {
            es: '/blog/[slug]',
            en: '/blog/[slug]',
            ca: '/blog/[slug]',
            de: '/blog/[slug]',
            nl: '/blog/[slug]',
            fr: '/blog/[slug]',
            it: '/blog/[slug]'
        },
        '/privacy': '/privacy',
        '/terms': '/terms',
        '/login': '/login',
        '/signup': '/signup',
        '/zonas/[zone]': {
            es: '/zonas/[zone]',
            en: '/locations/[zone]',
            ca: '/zones/[zone]',
            de: '/standorte/[zone]',
            nl: '/locaties/[zone]',
            fr: '/zones/[zone]',
            it: '/zone/[zone]'
        },
        '/dashboard': '/dashboard',
        '/dashboard/budget-request': '/dashboard/budget-request',
        '/dashboard/admin/budgets': '/dashboard/admin/budgets',
        '/dashboard/seo-generator': '/dashboard/seo-generator',
        '/dashboard/settings/pricing': '/dashboard/settings/pricing',
        '/dashboard/settings/financial': '/dashboard/settings/financial',
        '/dashboard/admin/prices': '/dashboard/admin/prices',
        '/dashboard/settings': '/dashboard/settings'
    }
});
