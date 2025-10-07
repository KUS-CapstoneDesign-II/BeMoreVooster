import { apiClient } from '@/lib/remote/api-client';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export type SignedAvatarUpload = {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
};

async function getAuthToken(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function getSignedAvatarUpload(filename: string): Promise<SignedAvatarUpload> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');
  const res = await apiClient.get<SignedAvatarUpload>(`/api/storage/avatar/signed-upload`, {
    params: { filename },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}


