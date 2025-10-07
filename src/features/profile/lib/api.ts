import { apiClient } from '@/lib/remote/api-client';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export type Profile = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  updated_at: string;
};

async function getAuthToken(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function fetchProfile(): Promise<Profile> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');
  const res = await apiClient.get<Profile>('/api/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateProfile(payload: {
  nickname: string;
  avatar_url?: string | null;
}): Promise<Profile> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');
  const res = await apiClient.put<Profile>('/api/profile', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}


