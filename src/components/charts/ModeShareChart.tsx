"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ModeSharePoint = { mode: string; value: number };

type Props = {
  data: ModeSharePoint[];
  title: string;
};

export default function ModeShareChart({ data, title }: Props) {
  return (
    <Card className="border border-border bg-white/80">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-56 min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 1, height: 1 }}
        >
          <BarChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 10 }}>
            <XAxis dataKey="mode" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={40} />
            <Tooltip formatter={(value) => (typeof value === "number" ? `${value.toFixed(0)}%` : value)} />
            <Bar dataKey="value" fill="#0f172a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
