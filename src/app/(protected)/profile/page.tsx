"use client";

import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useI18n } from "@/features/i18n/language-context";

export default function ProfilePage() {
  const { user, refresh } = useCurrentUser();
  const [nickname, setNickname] = useState<string>(() => String(user?.userMetadata?.nickname || ""));
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>((): string | null => String(user?.userMetadata?.avatar_url || "") || null);
  const [isSaving, setIsSaving] = useState(false);
  const email = useMemo(() => user?.email ?? "-", [user?.email]);
  const { t } = useI18n();

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      let avatar_url: string | undefined = undefined;
      if (avatarFile) {
        const bucket = "avatars"; // use a dedicated bucket
        const path = `${user?.id}/${Date.now()}-${avatarFile.name}`;
        const { data: upload, error: uploadError } = await supabase.storage.from(bucket).upload(path, avatarFile, { upsert: true });
        if (uploadError) {
          if (uploadError.message?.toLowerCase().includes("bucket not found")) {
            alert(t("bucket_missing"));
          }
          throw uploadError;
        }
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(upload.path);
        avatar_url = pub.publicUrl;
      }
      const { error: updateError } = await supabase.auth.updateUser({
        data: { nickname, ...(avatar_url ? { avatar_url } : {}) },
      });
      if (updateError) throw updateError;
      await refresh();
      if (avatar_url) setAvatarUrl(avatar_url);
      alert(t("saved"));
    } catch (e) {
      alert(t("save_failed"));
    } finally {
      setIsSaving(false);
    }
  }, [avatarFile, nickname, refresh, user?.id]);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t("profile_title")}</CardTitle>
          <CardDescription>{t("profile_sub")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t("preview")}</Label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border bg-muted">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="avatar" src={avatarUrl} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">{t("no_image")}</div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("email_label")}</Label>
            <Input value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label>{t("nickname_label")}</Label>
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={t("nickname_label")} />
          </div>
          <div className="space-y-2">
            <Label>{t("profile_image_label")}</Label>
            <FileUpload onFileChange={setAvatarFile} accept="image/*">
              <p className="text-sm text-muted-foreground">{t("upload_hint")}</p>
            </FileUpload>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? t("saving") : t("save_changes")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


