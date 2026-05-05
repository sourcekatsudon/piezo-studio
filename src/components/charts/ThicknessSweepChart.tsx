"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

export type ThicknessPoint = {
  t_mm: number;
  limitValue: number;
  p50?: number;
  p5?: number;
};

type Props = {
  data: ThicknessPoint[];
  targetValue: number;
  valueUnit: string;
  valueFormatter?: (value: number) => string;
  thicknessLabel: string;
  limitLabel: string;
  p50Label: string;
  p5Label: string;
  progressLabel: string;
  progressValue: number;
  title: string;
};

const uniqueTicks = (values: number[]) => {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toFixed(6);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export default function ThicknessSweepChart({
  data,
  targetValue,
  valueUnit,
  valueFormatter,
  thicknessLabel,
  limitLabel,
  p50Label,
  p5Label,
  progressLabel,
  progressValue,
  title,
}: Props) {
  const first = data[0];
  const mid = data[Math.floor((data.length - 1) / 2)];
  const last = data[data.length - 1];
  const thicknessTicks = uniqueTicks([
    first?.t_mm ?? 0,
    mid?.t_mm ?? 0,
    last?.t_mm ?? 0,
  ]);
  return (
    <Card className="border border-border bg-white/80">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-56 min-w-0">
        <div className="relative h-full min-w-0">
          <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-white/80 px-2 py-1 text-[10px] text-muted-foreground shadow-sm">
            {progressLabel}: {progressValue.toFixed(0)}%
          </div>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 1, height: 1 }}
          >
            <LineChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 10 }}>
              <XAxis
                dataKey="t_mm"
                unit="mm"
                tick={{ fontSize: 10 }}
                ticks={thicknessTicks}
                tickFormatter={(value) => Number(value).toFixed(1)}
              />
              <YAxis dataKey="limitValue" unit={valueUnit} tick={{ fontSize: 10 }} width={50} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }
                  const point = payload[0]?.payload as ThicknessPoint | undefined;
                  if (!point) {
                    return null;
                  }
                  return (
                    <div className="rounded-md border border-border bg-white/95 p-2 text-xs shadow-sm">
                      <div>
                        {thicknessLabel}: {point.t_mm.toFixed(2)} mm
                      </div>
                      <div>
                        {limitLabel}: {valueFormatter ? valueFormatter(point.limitValue) : `${point.limitValue.toFixed(2)} ${valueUnit}`}
                      </div>
                      <div>
                        {p50Label}: {point.p50 !== undefined ? valueFormatter ? valueFormatter(point.p50) : `${point.p50.toFixed(2)} ${valueUnit}` : "--"}
                      </div>
                      <div>
                        {p5Label}: {point.p5 !== undefined ? valueFormatter ? valueFormatter(point.p5) : `${point.p5.toFixed(2)} ${valueUnit}` : "--"}
                      </div>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={targetValue} stroke="#9a3412" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="limitValue" stroke="#0f172a" strokeWidth={2} dot={false} />
              {data.some((p) => p.p50 !== undefined) && (
                <Line type="monotone" dataKey="p50" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              )}
              {data.some((p) => p.p5 !== undefined) && (
                <Line type="monotone" dataKey="p5" stroke="#f97316" strokeWidth={2} dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
