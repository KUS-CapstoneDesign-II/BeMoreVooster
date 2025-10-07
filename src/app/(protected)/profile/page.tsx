"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { fetchProfile, updateProfile } from "@/features/profile/lib/api";
import { getSignedAvatarUpload } from "@/features/storage/lib/api";
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const email = useMemo(() => user?.email ?? "-", [user?.email]);
  const { t } = useI18n();
  const { toast } = useToast();

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      let avatar_url: string | undefined = undefined;
      // Upload new avatar if selected
      if (avatarFile) {
        // Signed upload flow
        const signed = await getSignedAvatarUpload(avatarFile.name);
        const form = new FormData();
        form.append('token', signed.token);
        form.append('file', avatarFile, avatarFile.name);
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/upload/sign/${signed.path}`, {
          method: 'POST',
          headers: { 'x-upsert': 'true' },
          body: form,
        });
        if (!uploadRes.ok) {
          const errorMsg = t("upload_failed_generic") || "Failed to upload image. Please try again.";
          toast({ title: t("profile_image_label"), description: errorMsg, variant: "destructive" });
          setSaveError(errorMsg);
          throw new Error('Signed upload failed');
        }
        avatar_url = signed.publicUrl;
      }
      // Persist to profiles via API
      const profile = await updateProfile({
        nickname,
        avatar_url: avatarFile ? (avatar_url ?? null) : avatarUrl,
      });

      // Sync auth metadata for UI that still reads from auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: { nickname: profile.nickname, avatar_url: profile.avatar_url },
      });
      if (updateError) throw updateError;
      await refresh();
      if (avatar_url) {
        setAvatarUrl(avatar_url);
        setPreviewUrl(null);
        try { localStorage.removeItem("bemore_avatar_preview"); } catch {}
      }
      toast({
        title: t("profile_title"),
        description: t("saved") || "Profile updated successfully!"
      });
      setSaveError(null);
    } catch (e) {
      const errorMsg = t("save_failed") || "Failed to save profile. Please check your connection and try again.";
      setSaveError(errorMsg);
      toast({
        title: t("profile_title"),
        description: errorMsg,
        variant: "destructive"
      });
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

  // Initial load from /api/profile and fallback preview
  useEffect(() => {
    (async () => {
      try {
        const p = await fetchProfile();
        setNickname(p.nickname || "");
        setAvatarUrl(p.avatar_url);
      } catch {
        // ignore; fall back to auth metadata and preview
      } finally {
        if (!avatarUrl) {
          try {
            const stored = localStorage.getItem("bemore_avatar_preview");
            if (stored) setPreviewUrl(stored);
          } catch {}
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero-alt relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 radial-teal opacity-50" />

      <div className="relative mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <Card className="glass border-white/20 shadow-float">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-teal flex items-center justify-center shadow-glow-teal">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{t("profile_title")}</CardTitle>
                <CardDescription className="text-base mt-1">{t("profile_sub")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar Preview Section - Enhanced */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">{t("preview")}</Label>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Large Avatar Preview */}
                <div className="relative group">
                  <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-white/20 bg-gradient-to-br from-brand-teal/10 to-brand-navy/10 shadow-float hover-scale-sm transition-all">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="avatar" src={previewUrl} className="h-full w-full object-cover" />
                    ) : avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="avatar" src={avatarUrl} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-5xl">👤</span>
                      </div>
                    )}
                  </div>
                  {/* Ring indicator for avatar presence */}
                  <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-background flex items-center justify-center shadow-md ${
                    previewUrl || avatarUrl ? 'bg-success' : 'bg-muted'
                  }`}>
                    <span className="text-xs">{previewUrl || avatarUrl ? '✓' : '?'}</span>
                  </div>
                </div>

                {/* User Info Card */}
                <div className="flex-1 glass-hover rounded-xl p-4 border-white/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <span className="text-base font-semibold">{email}</span>
                  </div>
                  {nickname && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Nickname:</span>
                      <span className="text-base font-semibold gradient-text-teal">{nickname}</span>
                    </div>
                  )}
                  <div className="pt-2 text-xs text-muted-foreground">
                    Profile last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            {/* Form Fields with Enhanced Design */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t("email_label")}</Label>
              <Input
                value={email}
                disabled
                className="glass-hover border-white/20 bg-muted/50"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">{t("nickname_label")}</Label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t("nickname_label")}
                className="glass-hover border-white/20 focus:ring-2 focus:ring-brand-teal"
              />
              <p className="text-xs text-muted-foreground">
                {nickname.length}/50 characters
              </p>
            </div>

            {/* File Upload Section - Enhanced */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t("profile_image_label")}</Label>
              <FileUpload
                onFileChange={(file) => {
                  const isImage = file.type.startsWith("image/");
                  const under5mb = file.size <= 5 * 1024 * 1024;
                  if (!isImage) {
                    toast({
                      title: t("profile_image_label"),
                      description: "Please select an image file (JPG, PNG, GIF, etc.)",
                      variant: "destructive"
                    });
                    return;
                  }
                  if (!under5mb) {
                    toast({
                      title: t("profile_image_label"),
                      description: "Image size must be less than 5MB",
                      variant: "destructive"
                    });
                    return;
                  }
                  setAvatarFile(file);
                  toast({
                    title: t("profile_image_label"),
                    description: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
                  });
                }}
                accept="image/*"
              >
                <div className="glass-hover border-white/20 rounded-xl p-6 text-center space-y-2 hover-lift-sm transition-all cursor-pointer">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-xl bg-gradient-teal/10 flex items-center justify-center">
                      <span className="text-3xl">📤</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{t("upload_hint") || "Click or drag to upload"}</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to 5MB</p>
                  {avatarFile && (
                    <p className="text-xs text-brand-teal font-semibold">
                      ✓ {avatarFile.name} selected
                    </p>
                  )}
                </div>
              </FileUpload>
              {(avatarUrl || previewUrl) && (
                <Button
                  variant="ghost"
                  className="w-full hover-lift-sm"
                  onClick={() => {
                    setAvatarUrl(null);
                    setAvatarFile(null);
                    setPreviewUrl(null);
                    try {
                      localStorage.removeItem("bemore_avatar_preview");
                    } catch {}
                    toast({
                      title: t("remove_avatar"),
                      description: "Avatar removed successfully"
                    });
                  }}
                >
                  <span className="mr-2">🗑️</span>
                  {t("remove_avatar")}
                </Button>
              )}
            </div>

            {/* Error Message with Retry */}
            {saveError && (
              <div className="glass-hover border-destructive/20 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-destructive">Save Failed</p>
                    <p className="text-sm text-muted-foreground mt-1">{saveError}</p>
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  variant="outline"
                  className="w-full hover-lift-sm border-destructive/20"
                >
                  <span className="mr-2">🔄</span>
                  Try Again
                </Button>
              </div>
            )}

            {/* Action Buttons - Enhanced */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-teal hover-lift flex-1 sm:flex-initial"
              >
                {isSaving ? (
                  <>
                    <span className="mr-2 animate-spin">⏳</span>
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    {t("save_changes")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


