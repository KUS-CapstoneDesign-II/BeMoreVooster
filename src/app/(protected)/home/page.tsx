"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomeRecordPage() {
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [recording, setRecording] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Record Session</CardTitle>
          <CardDescription>Permissions → Recording → Processing (UI only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            Camera/Mic Permission: <span className="font-medium text-foreground">{permission}</span>
          </div>
          <div className="aspect-video w-full rounded-md border bg-muted" />
          <div className="flex gap-3">
            <Button
              onClick={() => setPermission("granted")}
              variant="outline"
            >
              Grant Permission (mock)
            </Button>
            <Button
              onClick={() => setRecording((s) => !s)}
              disabled={permission !== "granted"}
            >
              {recording ? "Stop" : "Start"} Recording
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


