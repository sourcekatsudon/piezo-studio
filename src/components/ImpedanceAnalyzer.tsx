"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { Upload, Waves } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImpedancePoint } from "@/lib/types";
import { detectResonancePeaks, estimateBvdParameters } from "@/lib/analysis";

type Props = {
  data: ImpedancePoint[];
  onDataChange: (data: ImpedancePoint[]) => void;
  onAnalyzeSample: () => void;
};

export default function ImpedanceAnalyzer({ data, onDataChange, onAnalyzeSample }: Props) {
  const peaks = detectResonancePeaks(data);
  const bvd = estimateBvdParameters(data);

  const parseCsv = async (file: File) => {
    const text = await file.text();
    const rows = text
      .split(/\r?\n/)
      .map((line) => line.split(",").map((cell) => Number(cell.trim())))
      .filter((cells) => cells.length >= 3 && cells.every(Number.isFinite));
    if (rows.length) {
      onDataChange(rows.map(([frequencyKhz, impedanceOhm, phaseDeg]) => ({ frequencyKhz, impedanceOhm, phaseDeg })));
    }
  };

  return (
    <Card className="border-cyan-200/10 bg-slate-900/70 text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><Waves className="size-5 text-cyan-200" />Section 2: インピーダンス解析</CardTitle>
        <p className="text-sm text-slate-400">なぜやるのか: 共振は、インピーダンス振幅と位相の変化として最初に現れます。</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-cyan-300/30 bg-slate-950/50 p-5 text-sm text-slate-300 hover:bg-cyan-950/20">
            <Upload className="size-5 text-cyan-200" />
            CSVアップロード（frequencyKhz, impedanceOhm, phaseDeg）
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => event.target.files?.[0] && parseCsv(event.target.files[0])} />
          </label>
          <Button onClick={onAnalyzeSample} className="h-full bg-cyan-300 px-6 text-slate-950 hover:bg-cyan-200">サンプルデータで解析</Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Chart title="周波数 vs インピーダンス振幅" data={data} dataKey="impedanceOhm" unit="Ω" color="#67e8f9" />
          <Chart title="周波数 vs 位相" data={data} dataKey="phaseDeg" unit="deg" color="#38bdf8" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="共振周波数" value={`${bvd.frKhz} kHz`} hint={peaks[0]?.comment ?? "ピークを検出中"} />
          <Metric label="反共振周波数" value={`${bvd.faKhz} kHz`} hint="電気機械結合の評価点です。" />
          <Metric label="Q値推定" value={String(bvd.q)} hint="高いほど鋭く鳴りますが、残響も長くなります。" />
          <Metric label="静電容量推定" value={`${bvd.c0Nf} nF`} hint="駆動回路から見た容量負荷の目安です。" />
        </div>
      </CardContent>
    </Card>
  );
}

function Chart({ title, data, dataKey, unit, color }: { title: string; data: ImpedancePoint[]; dataKey: "impedanceOhm" | "phaseDeg"; unit: string; color: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="rounded-lg border border-cyan-200/10 bg-slate-950/50 p-4">
      <div className="mb-3 text-sm font-medium text-slate-200">{title}</div>
      <div className="h-72">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 0, right: 18, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
              <XAxis dataKey="frequencyKhz" stroke="#94a3b8" tickLine={false} unit="k" minTickGap={24} />
              <YAxis stroke="#94a3b8" tickLine={false} width={54} unit={unit} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(103,232,249,0.22)", borderRadius: 8 }} />
              <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-md bg-slate-900/60" />
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-cyan-200/10 bg-cyan-950/20 p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-xs leading-5 text-slate-300">{hint}</p>
    </div>
  );
}
