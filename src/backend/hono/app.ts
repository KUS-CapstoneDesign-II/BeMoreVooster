import { Hono } from 'hono';
import { errorBoundary } from '@/backend/middleware/error';
import { withAppContext } from '@/backend/middleware/context';
import { withSupabase } from '@/backend/middleware/supabase';
import { registerExampleRoutes } from '@/features/example/backend/route';
import { registerSystemRoutes } from '@/features/system/backend/route';
import type { AppEnv } from '@/backend/hono/context';
import { registerProfileRoutes } from '@/features/profile/backend/route';
import { registerStorageRoutes } from '@/features/storage/backend/route';

let singletonApp: Hono<AppEnv> | null = null;

export const createHonoApp = () => {
  if (singletonApp) {
    return singletonApp;
  }

  const app = new Hono<AppEnv>();

  app.use('*', errorBoundary());
  app.use('*', withAppContext());
  app.use('*', withSupabase());

  registerSystemRoutes(app);
  registerExampleRoutes(app);
  registerProfileRoutes(app);
  registerStorageRoutes(app);

  singletonApp = app;

  return app;
};
