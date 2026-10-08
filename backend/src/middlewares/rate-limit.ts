import type { Core } from '@strapi/strapi';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function isAllowed(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, 60_000).unref();

export default (config: Record<string, unknown>, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    const ip = ctx.request.ip || 'unknown';
    const isAuthEndpoint =
      ctx.path === '/admin/login' || ctx.path.startsWith('/api/auth/local');
    const isPublicApi = ctx.path.startsWith('/api/') && !isAuthEndpoint;

    if (isAuthEndpoint) {
      if (!isAllowed(`auth:${ip}`, 5, 15 * 60 * 1000)) {
        ctx.status = 429;
        ctx.body = { error: 'Too many attempts. Please try again later.' };
        return;
      }
    } else if (isPublicApi) {
      if (!isAllowed(`general:${ip}`, 100, 60 * 1000)) {
        ctx.status = 429;
        ctx.body = { error: 'Too many requests. Please slow down.' };
        return;
      }
    }
    // Everything else (admin panel, uploads, etc.) — no rate limit here;
    // it's already behind authentication.

    await next();
  };
};
