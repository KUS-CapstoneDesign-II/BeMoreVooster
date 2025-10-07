import type { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '@/backend/hono/context';
import { getSupabase } from '@/backend/hono/context';

const querySchema = z.object({
  filename: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[^\\/]+$/), // no slashes
});

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

export const registerStorageRoutes = (app: Hono<AppEnv>) => {
  app.get('/storage/avatar/signed-upload', async (c) => {
    const userId = await getUserIdFromAuthHeader(c);
    if (!userId) return c.json({ message: 'Unauthorized' }, 401);

    const parsed = querySchema.safeParse(Object.fromEntries(c.req.query() as any));
    if (!parsed.success) return c.json({ message: 'Invalid query', details: parsed.error.flatten() }, 422);

    const filename = parsed.data.filename;
    const bucket = (process.env.NEXT_PUBLIC_AVATAR_BUCKET as string) || 'avatars';
    const path = `${userId}/${Date.now()}-${filename}`;

    const supabase = getSupabase(c);
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
    if (error || !data) return c.json({ message: error?.message || 'Failed to create signed URL' }, 500);

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);

    return c.json({ bucket, path, token: data.token, publicUrl: pub.publicUrl });
  });
};


