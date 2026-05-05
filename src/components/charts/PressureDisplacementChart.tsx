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

export type PressureDisplacementPoint = {
  pressure_MPa: number;
  displacement_mm: number;
};

type Props = {
  data: PressureDisplacementPoint[];
  limit_MPa?: number;
  label: string;
  description: string;
  title: string;
  pressureLabel: string;
  pressureUnit?: string;
  pressureTickFormatter?: (value_MPa: number) => string;
  pressureFormatter?: (value_MPa: number) => string;
  displacementLabel: string;
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

export default function PressureDisplacementChart({
  data,
  limit_MPa,
  label,
  description,
  title,
  pressureLabel,
  pressureUnit = "MPa",
  pressureTickFormatter,
  pressureFormatter,
  displacementLabel,
}: Props) {
  const first = data[0];
  const mid = data[Math.floor((data.length - 1) / 2)];
  const last = data[data.length - 1];
  const displacementTicks = uniqueTicks([
    first?.displacement_mm ?? 0,
    mid?.displacement_mm ?? 0,
    last?.displacement_mm ?? 0,
  ]);
  const pressureTicks = uniqueTicks([
    first?.pressure_MPa ?? 0,
    mid?.pressure_MPa ?? 0,
    last?.pressure_MPa ?? 0,
  ]);
  return (
    <Card className="border border-border bg-white/80">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-52 min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 1, height: 1 }}
          >
            <LineChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 10 }}>
              <XAxis
                dataKey="displacement_mm"
                tick={{ fontSize: 10 }}
                ticks={displacementTicks}
                tickFormatter={(value) => Number(value).toFixed(2)}
                label={{
                  value: `${label} (mm)`,
                  position: "insideBottom",
                  offset: -4,
                }}
              />
              <YAxis
                dataKey="pressure_MPa"
                tick={{ fontSize: 10 }}
                ticks={pressureTicks}
                tickFormatter={(value) =>
                  pressureTickFormatter ? pressureTickFormatter(Number(value)) : Number(value).toFixed(2)
                }
                width={52}
                label={{
                  value: `${pressureLabel} (${pressureUnit})`,
                  angle: -90,
                  position: "insideLeft",
                  offset: 6,
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }
                  const point = payload[0]?.payload as PressureDisplacementPoint | undefined;
                  if (!point) {
                    return null;
                  }
                  return (
                    <div className="rounded-md border border-border bg-white/95 p-2 text-xs shadow-sm">
                      <div>
                        {pressureLabel}: {pressureFormatter ? pressureFormatter(point.pressure_MPa) : `${point.pressure_MPa.toFixed(2)} MPa`}
                      </div>
                      <div>
                        {displacementLabel}: {point.displacement_mm.toFixed(2)} mm
                      </div>
                    </div>
                  );
                }}
              />
              {limit_MPa && (
                <ReferenceLine y={limit_MPa} stroke="#111" strokeDasharray="4 4" />
              )}
              <Line type="monotone" dataKey="pressure_MPa" stroke="#0f172a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
