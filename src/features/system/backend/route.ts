import type { Hono } from 'hono';
import type { AppEnv } from '@/backend/hono/context';

export const registerSystemRoutes = (app: Hono<AppEnv>) => {
  app.get('/health', (c) => {
    return c.json({ status: 'ok' });
  });
};


