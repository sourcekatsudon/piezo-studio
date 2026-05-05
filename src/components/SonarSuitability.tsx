"use client";

import { useMemo, useState } from "react";
import { Radar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { calculateSonarScore } from "@/lib/analysis";
import type { BvdParameters, ResonancePeak, SonarParams } from "@/lib/types";

type Props = {
  initialParams: SonarParams;
  bvd: BvdParameters;
  peaks: ResonancePeak[];
};

export default function SonarSuitability({ initialParams, bvd, peaks }: Props) {
  const [params, setParams] = useState<SonarParams>(initialParams);
  const result = useMemo(
    () =>
      calculateSonarScore({
        ...params,
        q: bvd.q,
        frequencyKhz: bvd.frKhz,
        spuriousCount: peaks.filter((peak) => peak.kind === "spurious").length,
      }),
    [bvd.frKhz, bvd.q, params, peaks]
  );
  const update = <K extends keyof SonarParams>(key: K, value: SonarParams[K]) => setParams((previous) => ({ ...previous, [key]: value }));

  return (
    <Card className="border-cyan-200/10 bg-slate-900/70 text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><Radar className="size-5 text-cyan-200" />Section 6: ソナー適性診断</CardTitle>
        <p className="text-sm text-slate-400">なぜやるのか: 共振の良さだけでなく、残響、距離分解能、実験条件までまとめて判断します。</p>
      </CardHeader>
      <CardContent className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-slate-300">媒質</Label>
            <Select value={params.medium} onValueChange={(value) => update("medium", value as "water" | "air")}>
              <SelectTrigger className="w-full border-cyan-200/15 bg-slate-950/60"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="water">水</SelectItem><SelectItem value="air">空気</SelectItem></SelectContent>
            </Select>
          </div>
          <Control label="駆動電圧" value={params.driveVoltage} unit="V" min={5} max={80} onChange={(value) => update("driveVoltage", value)} />
          <Control label="バースト波数" value={params.burstCycles} unit="波" min={2} max={20} onChange={(value) => update("burstCycles", value)} />
          <Control label="ターゲット距離" value={params.targetDistanceM} unit="m" min={0.2} max={10} step={0.1} onChange={(value) => update("targetDistanceM", value)} />
          <Control label="必要距離分解能" value={params.requiredResolutionCm} unit="cm" min={1} max={50} onChange={(value) => update("requiredResolutionCm", value)} />
          <Control label="受信ゲイン" value={params.receiverGainDb} unit="dB" min={0} max={60} onChange={(value) => update("receiverGainDb", value)} />
          <Control label="ADCサンプリング周波数" value={params.adcSamplingKhz} unit="kHz" min={100} max={3000} step={100} onChange={(value) => update("adcSamplingKhz", value)} />
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg border border-cyan-200/10 bg-cyan-950/20 p-5">
            <div className="text-sm text-slate-400">ソナー適性スコア</div>
            <div className="mt-2 flex items-end gap-2"><span className="font-display text-6xl font-semibold text-white">{result.score}</span><span className="mb-2 text-slate-400">/100</span></div>
            <div className="mt-4 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-300" style={{ width: `${result.score}%` }} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Result label="推奨駆動周波数" value={`${result.recommendedFrequencyKhz} kHz`} />
            <Result label="推奨バースト波数" value={`${result.recommendedBurstCycles} 波`} />
            <Result label="予想リングダウン" value={`${result.ringdownMs} ms`} />
            <Result label="近距離デッドゾーン" value={`${result.deadZoneCm} cm`} />
            <Result label="距離分解能" value={`${result.rangeResolutionCm} cm`} />
          </div>
          <div className="rounded-lg border border-cyan-200/10 bg-slate-950/50 p-4">
            <div className="mb-2 font-medium text-white">注意点と解釈</div>
            <div className="space-y-2 text-sm leading-6 text-slate-300">{result.notes.map((note) => <p key={note}>{note}</p>)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Control({ label, value, unit, min, max, step = 1, onChange }: { label: string; value: number; unit: string; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return (
    <div className="rounded-lg border border-cyan-200/10 bg-slate-950/45 p-4">
      <div className="mb-3 flex items-center justify-between text-sm"><Label className="text-slate-300">{label}</Label><span className="font-mono text-cyan-100">{value} {unit}</span></div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([next]) => onChange(next)} />
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-cyan-200/10 bg-slate-950/50 p-4"><div className="text-xs text-slate-400">{label}</div><div className="mt-2 font-display text-xl font-semibold text-white">{value}</div></div>;
}
