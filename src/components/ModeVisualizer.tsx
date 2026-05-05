"use client";

import { useState } from "react";
import { AudioWaveform } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PiezoMode } from "@/lib/types";

const modes: Record<PiezoMode, { label: string; text: string; node: string; beam: string }> = {
  radial: {
    label: "径方向モード",
    text: "円板が横方向に伸び縮みします。低めの周波数に出やすく、円板ソナーの主候補になります。",
    node: "中心と外周の間に節が現れやすい",
    beam: "面に対して前後方向へ音が出やすい",
  },
  thickness: {
    label: "厚みモード",
    text: "厚み方向に伸び縮みします。高周波・高効率になりやすく、薄い素子で注目します。",
    node: "厚み中央付近に節を仮定",
    beam: "面の法線方向へ強く出やすい",
  },
  bending: {
    label: "曲げモード",
    text: "板がたわむモードです。低周波に出やすい一方、固定条件で大きく変わります。",
    node: "固定端や同心円状の節を疑う",
    beam: "指向性と効率は取り付け条件依存",
  },
  higher: {
    label: "高次モード",
    text: "複数の節と腹が混在します。波形が複雑になり、ソナー波形の汚れにつながる場合があります。",
    node: "複数の節線が出る",
    beam: "サイドローブが増えやすい",
  },
};

export default function ModeVisualizer() {
  const [mode, setMode] = useState<PiezoMode>("radial");
  const current = modes[mode];

  return (
    <Card className="border-cyan-200/10 bg-slate-900/70 text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><AudioWaveform className="size-5 text-cyan-200" />Section 5: 振動モードビジュアライザー</CardTitle>
        <p className="text-sm text-slate-400">なぜやるのか: 周波数ピークを、実際にどこが動いているかの仮説に変換します。</p>
      </CardHeader>
      <CardContent className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-cyan-200/10 bg-slate-950/50 p-4">
          <Tabs value={mode} onValueChange={(value) => setMode(value as PiezoMode)}>
            <TabsList className="grid h-auto w-full grid-cols-2 bg-slate-900/80 p-1 sm:grid-cols-4">
              {Object.entries(modes).map(([key, item]) => <TabsTrigger key={key} value={key}>{item.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>
          <div className="mt-5 grid min-h-80 place-items-center overflow-hidden rounded-lg bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_62%)]">
            <PiezoSvg mode={mode} />
          </div>
        </div>
        <div className="grid content-start gap-3">
          <Info title={current.label} body={current.text} />
          <Info title="節と腹" body={current.node} />
          <Info title="音が出やすい方向" body={current.beam} />
        </div>
      </CardContent>
    </Card>
  );
}

function PiezoSvg({ mode }: { mode: PiezoMode }) {
  return (
    <svg viewBox="0 0 420 300" className={`h-full max-h-80 w-full max-w-xl mode-${mode}`} role="img" aria-label="ピエゾ円板の振動モード模式図">
      <defs>
        <radialGradient id="disc" cx="50%" cy="45%">
          <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#22d3ee" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <g className="piezo-disc">
        <ellipse cx="210" cy="148" rx="120" ry="76" fill="url(#disc)" stroke="#a5f3fc" strokeWidth="2" />
        <ellipse cx="210" cy="148" rx="72" ry="44" fill="none" stroke="#0f172a" strokeWidth="2" strokeDasharray="5 7" opacity="0.8" />
        {mode === "higher" && <>
          <path d="M112 148 C160 100 260 196 308 148" fill="none" stroke="#082f49" strokeWidth="3" />
          <path d="M210 72 C245 122 174 174 210 224" fill="none" stroke="#082f49" strokeWidth="3" />
        </>}
        {mode === "bending" && <path d="M95 150 C150 92 265 206 325 138" fill="none" stroke="#082f49" strokeWidth="5" opacity="0.7" />}
      </g>
      <g className="sound-rays" stroke="#67e8f9" strokeWidth="2" opacity="0.8">
        <path d="M210 52 L210 18" />
        <path d="M160 64 L135 34" />
        <path d="M260 64 L285 34" />
        <path d="M210 244 L210 282" />
      </g>
      <text x="210" y="286" textAnchor="middle" fill="#cbd5e1" fontSize="13">青い破線: 節の候補 / 明るい領域: 腹の候補</text>
    </svg>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return <div className="rounded-lg border border-cyan-200/10 bg-cyan-950/20 p-4"><div className="font-medium text-white">{title}</div><p className="mt-2 text-sm leading-6 text-slate-300">{body}</p></div>;
}
