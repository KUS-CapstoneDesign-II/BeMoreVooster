"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type VADPoint = { date: string; v: number; a: number; d: number };

export function VADLineChart({ data }: { data: VADPoint[] }) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="v" name="Valence" stroke="#005F73" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="a" name="Arousal" stroke="#EE9B00" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="d" name="Dominance" stroke="#E9D8A6" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function generateMockSeries(days: number): VADPoint[] {
  const out: VADPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const date = `${d.getMonth() + 1}/${d.getDate()}`;
    const base = Math.sin((i / days) * Math.PI) * 0.2 + 0.4;
    const noise = (seed(i) % 100) / 1000; // 0~0.099
    out.push({ date, v: clamp(base + noise), a: clamp(base + 0.1 - noise), d: clamp(base + 0.05) });
  }
  return out;
}

function seed(i: number) {
  // simple deterministic pseudo-random
  let x = Math.sin(i + 1) * 10000;
  return x - Math.floor(x);
}

function clamp(n: number) {
  return Math.max(0, Math.min(1, Number(n.toFixed(2))));
}


