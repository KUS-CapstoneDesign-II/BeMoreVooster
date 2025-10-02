import { handle } from 'hono/vercel';
import { createHonoApp } from '@/backend/hono/app';

export const runtime = 'nodejs';

// Lazy initialize per request; call Hono handler with Request only
export function GET(request: Request) {
  const app = createHonoApp();
  return handle(app)(request);
}
export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
