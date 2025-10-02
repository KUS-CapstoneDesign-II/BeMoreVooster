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
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t("record_title")}</CardTitle>
          <CardDescription>{t("record_sub")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4 text-sm text-muted-foreground">
            <span>
              {t("permission_status")}: <span className="font-medium text-foreground">{t(`permission_${permission}` as any)}</span>
            </span>
            <span className="text-xs">{t("elapsed")}: <span className="font-medium text-foreground">{elapsedLabel}</span></span>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
          </div>
          <canvas ref={canvasRef} className="h-16 w-full rounded-md border bg-muted" />
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
                  // Setup audio visualization
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
                      ctx.fillStyle = "#005F73";
                      ctx.fillRect(x, h - barHeight, barWidth, barHeight);
                      x += barWidth + 1;
                    }
                    rafRef.current = requestAnimationFrame(draw);
                  };
                  if (rafRef.current) cancelAnimationFrame(rafRef.current);
                  draw();
                } catch (e) {
                  setPermission("denied");
                  toast({ title: t("record_title"), description: "Permission denied or no device", variant: "destructive" });
                }
              }}
              variant="outline"
            >
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
            >
              {recording ? t("stop_recording") : t("start_recording")}
            </Button>
            {reviewReady ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({ title: t("submit_session"), description: JSON.stringify({ duration: elapsed, journal }) });
                  }}
                >
                  {t("submit_session")}
                </Button>
                <Button
                  variant="ghost"
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
                  }}
                >
                  {t("reset")}
                </Button>
              </>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="journal">{t("journal_label")}</Label>
            <Textarea id="journal" value={journal} onChange={(e) => setJournal(e.target.value)} placeholder={t("journal_placeholder")} rows={4} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


