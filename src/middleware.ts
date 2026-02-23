import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Upstash Redis & Ratelimit conditionally in case env vars are absent in local dev
const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;
const ratelimit = redis
  ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '1 d'), // 5 demos per day
    analytics: true,
    prefix: '@upstash/ratelimit/demo-budget',
  })
  : null;

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Edge Rate Limiting for the Demo API endpoint
  if (pathname.includes('/api/budget/generate-demo')) {
    if (ratelimit) {
      // Hybrid key: IP + basic cookie fingerprint prevents large office networks from burning quota quickly
      const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1';
      const deviceId = request.cookies.get('deviceId')?.value || 'anonymous';
      const rateLimitKey = `demo:${ip}:${deviceId}`;

      const { success, pending, limit, reset, remaining } = await ratelimit.limit(rateLimitKey);
      if (!success) {
        return NextResponse.json(
          { error: "Límite de demos excedido. Por favor, crea una cuenta para continuar presupuestando." },
          { status: 429, headers: { 'X-RateLimit-Limit': limit.toString(), 'X-RateLimit-Remaining': remaining.toString() } }
        );
      }
    }
  }

  // Bypass next-intl for all API routes so they don't get locale redirects
  if (pathname.startsWith('/api/') || pathname.includes('/api/')) {
    return NextResponse.next();
  }

  // 2. Default Next-Intl routing for UI pages
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // Notice: We NO LONGER ignore /api here, because we want the rate limiter to catch it.
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
