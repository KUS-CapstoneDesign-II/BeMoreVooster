"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useI18n } from "@/features/i18n/language-context";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const BUCKET_NAME = (process.env.NEXT_PUBLIC_AVATAR_BUCKET as string) || "avatars";
  const { user, refresh } = useCurrentUser();
  const [nickname, setNickname] = useState<string>(() => String(user?.userMetadata?.nickname || ""));
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>((): string | null => String(user?.userMetadata?.avatar_url || "") || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const email = useMemo(() => user?.email ?? "-", [user?.email]);
  const { t } = useI18n();
  const { toast } = useToast();

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      let avatar_url: string | undefined = undefined;
      // Upload new avatar if selected
      if (avatarFile) {
        const bucket = BUCKET_NAME; // configurable bucket name
        const path = `${user?.id}/${Date.now()}-${avatarFile.name}`;
        const { data: upload, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, avatarFile, {
            upsert: true,
            cacheControl: "3600",
            contentType: avatarFile.type || "application/octet-stream",
          });
        if (uploadError) {
          if (uploadError.message?.toLowerCase().includes("bucket not found")) {
            toast({ title: t("profile_image_label"), description: t("bucket_missing"), variant: "destructive" });
          } else {
            toast({ title: t("profile_image_label"), description: uploadError.message || "Upload failed (400)", variant: "destructive" });
          }
          throw uploadError;
        }
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(upload.path);
        avatar_url = pub.publicUrl;
      }
      // If avatarFile is null and avatarUrl is null, treat as removal
      const nextMeta: Record<string, unknown> = { nickname };
      if (avatarFile) nextMeta.avatar_url = avatar_url;
      if (!avatarFile && avatarUrl === null) nextMeta.avatar_url = null;
      const { error: updateError } = await supabase.auth.updateUser({ data: nextMeta });
      if (updateError) throw updateError;
      await refresh();
      if (avatar_url) {
        setAvatarUrl(avatar_url);
        setPreviewUrl(null);
        try { localStorage.removeItem("bemore_avatar_preview"); } catch {}
      }
      toast({ title: t("profile_title"), description: t("saved") });
    } catch (e) {
      toast({ title: t("profile_title"), description: t("save_failed"), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [BUCKET_NAME, avatarFile, avatarUrl, nickname, refresh, t, user?.id]);

  // Generate local object URL for immediate preview when a file is chosen
  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setPreviewUrl(url);
    // Also persist as data URL to survive reloads before save
    try {
      const reader = new FileReader();
      reader.onload = () => {
        try { localStorage.setItem("bemore_avatar_preview", String(reader.result || "")); } catch {}
      };
      reader.readAsDataURL(avatarFile);
    } catch {}
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [avatarFile]);

  // Load persisted preview on mount if no server avatar is set
  useEffect(() => {
    if (avatarUrl) return;
    try {
      const stored = localStorage.getItem("bemore_avatar_preview");
      if (stored) setPreviewUrl(stored);
    } catch {}
  }, [avatarUrl]);

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
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="avatar" src={previewUrl} className="h-full w-full object-cover" />
                ) : avatarUrl ? (
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
            <FileUpload
              onFileChange={(file) => {
                const isImage = file.type.startsWith("image/");
                const under5mb = file.size <= 5 * 1024 * 1024;
                if (!isImage || !under5mb) {
                  alert("Only images up to 5MB are allowed");
                  return;
                }
                setAvatarFile(file);
              }}
              accept="image/*"
            >
              <p className="text-sm text-muted-foreground">{t("upload_hint")}</p>
            </FileUpload>
            <div className="pt-2">
              <Button variant="ghost" onClick={() => { setAvatarUrl(null); setAvatarFile(null); setPreviewUrl(null); try { localStorage.removeItem("bemore_avatar_preview"); } catch {} }}>
                {t("remove_avatar")}
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? t("saving") : t("save_changes")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


