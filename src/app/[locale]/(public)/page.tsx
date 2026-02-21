import { getDictionary } from '@/lib/dictionaries';
import { constructMetadata } from '@/i18n/seo-utils';
import { OrganizationJsonLd } from '@/components/seo/json-ld';

// New Basis Components
import { HeroSection } from '@/components/home/basis/HeroSection';
import { InteractiveWizard } from '@/components/home/basis/InteractiveWizard';
import { PainPoints } from '@/components/home/basis/PainPoints';
import { Benefits } from '@/components/home/basis/Benefits';
import { Testimonials } from '@/components/home/basis/Testimonials';
import { AgendaSection } from '@/components/home/basis/AgendaSection';
import { CallToAction } from '@/components/home/basis/CallToAction';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return constructMetadata({
    title: 'Basis - Software A Medida con IA para Construcción',
    description: 'Reduce tus horas de presupuesto a 15 minutos exactos y controla tu rentabilidad en tiempo real.',
    path: '/',
    locale
  });
}

export default async function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <main className="flex-1 overflow-x-hidden bg-background">
        <HeroSection />
        <InteractiveWizard />
        <PainPoints />
        <Benefits />
        <Testimonials />
        <AgendaSection />
        <CallToAction />
      </main>
    </>
  );
}
