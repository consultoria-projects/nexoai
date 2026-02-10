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
  return (
    <Link
      href="/"
      className={cn(
        "block relative transition-opacity hover:opacity-80",
        className
      )}
    >
      <Image
        src="/images/logo.avif"
        alt="Grupo RG - Construcción y Reformas"
        width={width}
        height={height}
        className={cn(
          "object-contain",
          variant === 'light' && "brightness-0 invert",
          variant === 'dark' && "brightness-0"
        )}
        priority
      />
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
        GRUPO RG
      </span>
      <span className="hidden sm:inline text-xs text-muted-foreground uppercase tracking-widest">
        Construcción
      </span>
    </Link>
  );
}
