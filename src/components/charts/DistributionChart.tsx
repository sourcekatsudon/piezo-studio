"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

export type HistogramPoint = {
  value: number;
  count: number;
};

type Props = {
  data: HistogramPoint[];
  p5?: number;
  p50?: number;
  p95?: number;
  description: string;
  valueLabel: string;
  valueUnit: string;
  valueFormatter?: (value: number) => string;
  probabilityLabel: string;
  progressLabel: string;
  progressValue: number;
  title: string;
};

export default function DistributionChart({
  data,
  p5,
  p50,
  p95,
  description,
  valueLabel,
  valueUnit,
  valueFormatter,
  probabilityLabel,
  progressLabel,
  progressValue,
  title,
}: Props) {
  const total = data.reduce((sum, point) => sum + point.count, 0);
  const chartData = data.map((point) => ({
    ...point,
    percent: total > 0 ? (point.count / total) * 100 : 0,
  }));
  return (
    <Card className="border border-border bg-white/80">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="relative h-52 min-w-0">
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
            <BarChart layout="vertical" data={chartData} margin={{ left: 16, right: 8, top: 10, bottom: 10 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="value"
                unit={valueUnit}
                tick={{ fontSize: 10 }}
                width={56}
                tickFormatter={(value) => Number(value).toFixed(valueUnit === "MPa" ? 1 : 0)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }
                  const point = payload[0]?.payload as (HistogramPoint & { percent: number }) | undefined;
                  if (!point) {
                    return null;
                  }
                  return (
                    <div className="rounded-md border border-border bg-white/95 p-2 text-xs shadow-sm">
                      <div>
                        {valueLabel}: {valueFormatter ? valueFormatter(point.value) : `${point.value.toFixed(2)} ${valueUnit}`}
                      </div>
                      <div>
                        {probabilityLabel}: {point.percent.toFixed(1)}%
                      </div>
                    </div>
                  );
                }}
              />
              {p5 && <ReferenceLine y={p5} stroke="#f97316" strokeDasharray="4 4" />}
              {p50 && <ReferenceLine y={p50} stroke="#0ea5e9" strokeDasharray="4 4" />}
              {p95 && <ReferenceLine y={p95} stroke="#22c55e" strokeDasharray="4 4" />}
              <Bar dataKey="percent" fill="#1f2937" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
