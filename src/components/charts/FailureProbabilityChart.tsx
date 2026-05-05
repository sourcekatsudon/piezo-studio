"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";

export type PfPoint = {
  value: number;
  pf: number;
};

type Props = {
  data: PfPoint[];
  targetPf: number;
  valueLabel: string;
  valueUnit: string;
  valueFormatter?: (value: number) => string;
  pfLabel: string;
  description: string;
  title: string;
};

const computeDomain = (data: PfPoint[]) => {
  if (data.length === 0) {
    return [0, 1] as [number, number];
  }
  const sorted = [...data].sort((a, b) => a.value - b.value);
  const minValue = sorted[0].value;
  const maxValue = sorted[sorted.length - 1].value;
  const band = sorted.filter((point) => point.pf >= 0.02 && point.pf <= 0.98);
  if (band.length < 2) {
    return [minValue, maxValue] as [number, number];
  }
  const bandMin = band[0].value;
  const bandMax = band[band.length - 1].value;
  const padding = Math.max((bandMax - bandMin) * 0.2, (maxValue - minValue) * 0.05, 0.1);
  return [Math.max(minValue, bandMin - padding), Math.min(maxValue, bandMax + padding)] as [number, number];
};

export default function FailureProbabilityChart({
  data,
  targetPf,
  valueLabel,
  valueUnit,
  valueFormatter,
  pfLabel,
  description,
  title,
}: Props) {
  const domain = computeDomain(data);
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
              <XAxis dataKey="value" unit={valueUnit} tick={{ fontSize: 10 }} domain={domain} type="number" />
              <YAxis
                dataKey="pf"
                tick={{ fontSize: 10 }}
                width={40}
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }
                  const point = payload[0]?.payload as PfPoint | undefined;
                  if (!point) {
                    return null;
                  }
                  return (
                    <div className="rounded-md border border-border bg-white/95 p-2 text-xs shadow-sm">
                      <div>
                        {valueLabel}: {valueFormatter ? valueFormatter(point.value) : `${point.value.toFixed(2)} ${valueUnit}`}
                      </div>
                      <div>
                        {pfLabel}: {(point.pf * 100).toFixed(2)}%
                      </div>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={targetPf} stroke="#f97316" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="pf" stroke="#0f172a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
