import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'light' | 'dark';
}

export function Logo({
  className,
  width = 120,
  height = 40,
  variant = 'default'
}: LogoProps) {
  if (variant === 'light') {
    return (
      <Link href="/" className={cn("block relative transition-opacity hover:opacity-80", className)}>
        <Image src="/images/logo-blanco.png" alt="Basis" width={width} height={height} className="object-contain" priority />
      </Link>
    );
  }

  if (variant === 'dark') {
    return (
      <Link href="/" className={cn("block relative transition-opacity hover:opacity-80", className)}>
        <Image src="/images/logo-negro.png" alt="Basis" width={width} height={height} className="object-contain" priority />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("block relative transition-opacity hover:opacity-80", className)}>
      <Image src="/images/logo-negro.png" alt="Basis" width={width} height={height} className="object-contain dark:hidden" priority />
      <Image src="/images/logo-blanco.png" alt="Basis" width={width} height={height} className="object-contain hidden dark:block" priority />
    </Link>
  );
}

// Text-based logo alternative for situations where image doesn't fit
export function LogoText({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 transition-opacity hover:opacity-80",
        className
      )}
    >
      <span className="font-display text-2xl tracking-tight text-foreground">
        Basis
      </span>
    </Link>
  );
}
