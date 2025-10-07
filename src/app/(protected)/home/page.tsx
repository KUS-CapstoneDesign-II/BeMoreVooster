"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/features/i18n/language-context";
import { useToast } from "@/hooks/use-toast";

export default function HomeRecordPage() {
  const { t } = useI18n();
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [reviewReady, setReviewReady] = useState(false);
  const [journal, setJournal] = useState("");
  const timerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Cleanup on unmount: stop media, cancel raf, close audio
  useEffect(() => {
    return () => {
      try {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
          audioContextRef.current.close().catch(() => {});
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
        }
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (recording) {
      timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [recording]);

  const elapsedLabel = useMemo(() => {
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [elapsed]);

  return (
    <div className="min-h-screen bg-gradient-hero-alt relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 radial-teal opacity-50" />

      <div className="relative mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <Card className="glass border-white/20 shadow-float">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-teal flex items-center justify-center shadow-glow-teal">
                <span className="text-2xl">🎥</span>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{t("record_title")}</CardTitle>
                <CardDescription className="text-base mt-1">{t("record_sub")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Bar with Glass Effect */}
            <div className="flex items-center justify-between rounded-xl glass-hover border-white/20 p-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${permission === "granted" ? "bg-success animate-pulse" : permission === "denied" ? "bg-destructive" : "bg-muted-foreground"}`} />
                <span className="text-muted-foreground">
                  {t("permission_status")}: <span className="font-semibold text-foreground">{t(`permission_${permission}` as any)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {recording && <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />}
                <span className="text-xs text-muted-foreground">
                  {t("elapsed")}: <span className="font-mono font-bold text-lg text-brand-teal">{elapsedLabel}</span>
                </span>
              </div>
            </div>

            {/* Video Preview with Enhanced Styling */}
            <div className="aspect-video w-full overflow-hidden rounded-xl border-2 border-white/20 bg-muted shadow-float">
              <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            </div>

            {/* Audio Visualizer with Brand Colors */}
            <div className="relative">
              <canvas ref={canvasRef} className="h-20 w-full rounded-xl border border-white/20 bg-gradient-to-br from-brand-teal/5 to-brand-navy/5 shadow-sm" />
              {!recording && permission === "granted" && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  Audio visualizer ready
                </div>
              )}
            </div>
            {/* Action Buttons with Enhanced Design */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={async () => {
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    streamRef.current = stream;
                    setPermission("granted");
                    if (videoRef.current) {
                      videoRef.current.srcObject = stream;
                      await videoRef.current.play();
                    }
                    // Setup audio visualization with brand colors
                    if (!audioContextRef.current) {
                      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                    }
                    const audioCtx = audioContextRef.current;
                    const source = audioCtx.createMediaStreamSource(stream);
                    const analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    analyserRef.current = analyser;
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    const canvas = canvasRef.current;
                    const ctx = canvas ? canvas.getContext("2d") : null;
                    const draw = () => {
                      if (!ctx || !canvas || !analyserRef.current) return;
                      analyserRef.current.getByteFrequencyData(dataArray);
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      const w = canvas.width;
                      const h = canvas.height;
                      const barWidth = (w / bufferLength) * 1.5;
                      let x = 0;
                      for (let i = 0; i < bufferLength; i++) {
                        const v = dataArray[i] / 255;
                        const barHeight = v * h;
                        // Use brand teal color
                        ctx.fillStyle = "#3D8A9E";
                        ctx.fillRect(x, h - barHeight, barWidth, barHeight);
                        x += barWidth + 1;
                      }
                      rafRef.current = requestAnimationFrame(draw);
                    };
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    draw();
                    toast({ title: t("record_title"), description: t("permission_granted") || "Camera and microphone access granted", variant: "default" });
                  } catch (e) {
                    setPermission("denied");
                    toast({
                      title: t("record_title"),
                      description: t("permission_denied") || "Camera or microphone access denied. Please check your browser settings.",
                      variant: "destructive"
                    });
                  }
                }}
                variant="outline"
                className="glass-hover hover-lift-sm"
              >
                <span className="mr-2">🎬</span>
                {t("grant_permission")}
              </Button>
              <Button
                onClick={() => {
                  if (recording) {
                    setRecording(false);
                    setReviewReady(true);
                  } else {
                    setElapsed(0);
                    setReviewReady(false);
                    setRecording(true);
                  }
                }}
                disabled={permission !== "granted"}
                className={recording ? "bg-destructive hover:bg-destructive/90" : "bg-gradient-teal hover-lift"}
              >
                {recording ? (
                  <>
                    <span className="mr-2">⏹️</span>
                    {t("stop_recording")}
                  </>
                ) : (
                  <>
                    <span className="mr-2">⏺️</span>
                    {t("start_recording")}
                  </>
                )}
              </Button>
              {reviewReady ? (
                <>
                  <Button
                    variant="default"
                    className="bg-gradient-teal hover-lift"
                    onClick={() => {
                      toast({
                        title: t("submit_session"),
                        description: `Recording duration: ${elapsedLabel}. Journal length: ${journal.length} characters.`
                      });
                    }}
                  >
                    <span className="mr-2">📤</span>
                    {t("submit_session")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="hover-lift-sm"
                    onClick={() => {
                      setElapsed(0);
                      setReviewReady(false);
                      setJournal("");
                      // cleanup
                      try {
                        if (rafRef.current) cancelAnimationFrame(rafRef.current);
                        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
                          audioContextRef.current.close().catch(() => {});
                        }
                        streamRef.current?.getTracks().forEach((t) => t.stop());
                        streamRef.current = null;
                      } catch {}
                      toast({ title: t("reset"), description: "Session reset successfully" });
                    }}
                  >
                    <span className="mr-2">🔄</span>
                    {t("reset")}
                  </Button>
                </>
              ) : null}
            </div>

            {/* Journal Input with Enhanced Styling */}
            <div className="space-y-3">
              <Label htmlFor="journal" className="text-base font-semibold">{t("journal_label")}</Label>
              <Textarea
                id="journal"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder={t("journal_placeholder")}
                rows={6}
                className="glass-hover border-white/20 resize-none focus:ring-2 focus:ring-brand-teal"
              />
              <p className="text-xs text-muted-foreground text-right">
                {journal.length} characters
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


