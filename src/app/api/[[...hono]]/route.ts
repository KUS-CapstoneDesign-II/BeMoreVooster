import { handle } from 'hono/vercel';
import { createHonoApp } from '@/backend/hono/app';

export const runtime = 'nodejs';

// Lazy initialize the Hono app per request to avoid env validation at import time
async function handler(request: Request, context: unknown) {
  const app = createHonoApp();
  const honoHandler = handle(app);
  return honoHandler(request, context as any);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
