import { getDictionary } from '@/lib/dictionaries';

export default async function ViewerLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const dict = await getDictionary(locale as any);

    return (
        <main className="flex-1 w-full h-full min-h-screen bg-slate-50 dark:bg-zinc-950">
            {children}
        </main>
    );
}
