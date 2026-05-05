"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HoleStressResult } from "@/calc/models/plateCircularClampedWithHoles";

type Props = {
  title: string;
  description: string;
  radius_m: number;
  hole_d_m: number;
  holes: HoleStressResult[];
  worstHole: HoleStressResult | null;
  warning?: string;
};

const colorForValue = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return "#94a3b8";
  const span = Math.max(max - min, 1e-9);
  const t = Math.min(1, Math.max(0, (value - min) / span));
  const mid = 0.6;
  const lerp = (a: number, b: number, x: number) => Math.round(a + (b - a) * x);
  if (t <= mid) {
    const tt = t / mid;
    return `rgb(${lerp(52, 245, tt)}, ${lerp(211, 158, tt)}, ${lerp(153, 11, tt)})`;
  }
  const tt = (t - mid) / (1 - mid);
  return `rgb(${lerp(245, 239, tt)}, ${lerp(158, 68, tt)}, ${lerp(11, 68, tt)})`;
};

export default function HoleMapChart({
  title,
  description,
  radius_m,
  hole_d_m,
  holes,
  worstHole,
  warning,
}: Props) {
  const values = holes.map((hole) => hole.vmPerPa);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const viewBox = `${-radius_m} ${-radius_m} ${radius_m * 2} ${radius_m * 2}`;
  const rows = holes.map((hole, idx) => ({
    id: idx + 1,
    x_mm: hole.x * 1000,
    y_mm: hole.y * 1000,
    r_mm: hole.r * 1000,
  }));

  return (
    <Card className="border border-border bg-white/80">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {warning && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
            {warning}
          </div>
        )}
        <div className="flex justify-center">
          <div className="aspect-square w-full max-w-[220px] rounded-2xl border border-border bg-white/70 p-3">
            <svg viewBox={viewBox} className="h-full w-full">
              <circle cx={0} cy={0} r={radius_m} fill="#f8fafc" stroke="#94a3b8" strokeWidth={radius_m * 0.02} />
              {holes.map((hole, idx) => {
                const isWorst = worstHole && hole.x === worstHole.x && hole.y === worstHole.y;
                return (
                  <g key={`${hole.x}-${hole.y}`}>
                    <circle
                      cx={hole.x}
                      cy={hole.y}
                      r={hole_d_m / 2}
                      fill={colorForValue(hole.vmPerPa, min, max)}
                      fillOpacity={0.75}
                      stroke={isWorst ? "#ef4444" : "#0f172a"}
                      strokeWidth={isWorst ? hole_d_m * 0.12 : hole_d_m * 0.04}
                    />
                    <text
                      x={hole.x}
                      y={hole.y + hole_d_m * 0.12}
                      fontSize={hole_d_m * 0.55}
                      textAnchor="middle"
                      fill="#0f172a"
                      stroke="#ffffff"
                      strokeWidth={hole_d_m * 0.08}
                      paintOrder="stroke"
                    >
                      {idx + 1}
                    </text>
                    {isWorst && (
                      <circle
                        cx={hole.x}
                        cy={hole.y}
                        r={hole_d_m * 0.75}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth={hole_d_m * 0.08}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white/70 p-2 text-xs text-muted-foreground">
          <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 border-b border-border/60 pb-1 font-medium text-slate-700">
            <div>No</div>
            <div>x (mm)</div>
            <div>y (mm)</div>
            <div>r (mm)</div>
          </div>
          <div className="max-h-32 overflow-auto">
            {rows.map((row) => (
              <div key={row.id} className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 py-0.5">
                <div>{row.id}</div>
                <div className="font-mono">{row.x_mm.toFixed(1)}</div>
                <div className="font-mono">{row.y_mm.toFixed(1)}</div>
                <div className="font-mono">{row.r_mm.toFixed(1)}</div>
              </div>
            ))}
            {rows.length === 0 && (
              <div className="py-1 text-xs text-muted-foreground">No layout available.</div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
