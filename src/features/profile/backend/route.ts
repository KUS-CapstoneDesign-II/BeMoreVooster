import type { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '@/backend/hono/context';
import { getSupabase } from '@/backend/hono/context';

const putSchema = z.object({
  nickname: z.string().trim().max(50),
  avatar_url: z.string().url().optional().nullable(),
});

function error(c: any, code: number, message: string, details?: unknown) {
  const requestId = c.get('requestId') || undefined;
  return c.json({ code, message, details, requestId }, code);
}

async function getUserIdFromAuthHeader(c: any): Promise<string | null> {
  const supabase = getSupabase(c);
  const auth = c.req.header('authorization') || c.req.header('Authorization');
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) return null;
  const token = auth.slice(7);
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

export const registerProfileRoutes = (app: Hono<AppEnv>) => {
  app.get('/profile', async (c) => {
    const supabase = getSupabase(c);
    const userId = await getUserIdFromAuthHeader(c);
    if (!userId) return error(c, 401, 'Unauthorized');

    const { data, error: selectError } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (selectError) return error(c, 500, 'Failed to load profile', selectError.message);

    if (!data) {
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, nickname: '' })
        .select('id, nickname, avatar_url, updated_at')
        .single();
      if (insertError) return error(c, 500, 'Failed to init profile', insertError.message);
      return c.json(inserted);
    }

    return c.json(data);
  });

  app.put('/profile', async (c) => {
    const supabase = getSupabase(c);
    const userId = await getUserIdFromAuthHeader(c);
    if (!userId) return error(c, 401, 'Unauthorized');

    const body = await c.req.json().catch(() => null);
    const parsed = putSchema.safeParse(body);
    if (!parsed.success) return error(c, 422, 'Invalid payload', parsed.error.flatten());

    const { nickname, avatar_url } = parsed.data;
    const { data, error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: userId, nickname, avatar_url: avatar_url ?? null })
      .select('id, nickname, avatar_url, updated_at')
      .single();

    if (updateError) return error(c, 500, 'Failed to update profile', updateError.message);

    return c.json(data);
  });
};


