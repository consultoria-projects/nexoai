'use client';

import Image from 'next/image';
import { BudgetWidget } from '@/components/budget-widget';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/auth/user-nav';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MegaMenu } from './mega-menu';
import { MobileMenu } from './mobile-menu';

export function Header({ t }: { t: any }) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: { pathname: '/', hash: 'wizard' }, label: "Asistente Costes" },
    { href: '/', label: "Plataforma" },
    { href: '/', label: "Casos de Uso" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out h-[10vh] flex items-center",
        isScrolled
          ? "border-b border-primary/10 bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="w-[85vw] max-w-[1920px] mx-auto flex h-full items-center justify-between transition-all duration-300">
        <div className={cn("transition-transform duration-300 flex-shrink-0", isScrolled ? "scale-90" : "scale-100")}>
          <Logo className="h-8 flex items-center" width={110} height={32} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
