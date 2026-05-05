import { CircuitBoard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BvdParameters } from "@/lib/types";

export default function BvdCircuit({ params }: { params: BvdParameters }) {
  const metrics = [
    ["C0", `${params.c0Nf} nF`],
    ["Rm", `${params.rmOhm} Ω`],
    ["Lm", `${params.lmMh} mH`],
    ["Cm", `${params.cmPf} pF`],
    ["fr", `${params.frKhz} kHz`],
    ["fa", `${params.faKhz} kHz`],
    ["Q", String(params.q)],
    ["k_eff", String(params.kEff)],
  ];

  return (
    <Card className="border-cyan-200/10 bg-slate-900/70 text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><CircuitBoard className="size-5 text-cyan-200" />Section 4: BVD等価回路</CardTitle>
        <p className="text-sm text-slate-400">なぜやるのか: ピエゾを駆動回路から見た部品として扱えるようにします。</p>
      </CardHeader>
      <CardContent className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-cyan-200/10 bg-slate-950/50 p-5">
          <div className="relative mx-auto h-64 max-w-xl">
            <div className="absolute left-4 right-4 top-1/2 h-px bg-cyan-200/50" />
            <div className="absolute left-14 top-[calc(50%-44px)] h-24 w-px bg-cyan-200/50" />
            <div className="absolute right-14 top-[calc(50%-44px)] h-24 w-px bg-cyan-200/50" />
            <CircuitNode className="left-4 top-[calc(50%-10px)]" label="IN" />
            <CircuitNode className="right-4 top-[calc(50%-10px)]" label="OUT" />
            <Element className="left-[24%] top-[calc(50%-18px)]" label="Rm" />
            <Element className="left-[43%] top-[calc(50%-18px)]" label="Lm" />
            <Element className="left-[62%] top-[calc(50%-18px)]" label="Cm" />
            <div className="absolute left-14 right-14 top-10 h-px bg-cyan-200/50" />
            <Element className="left-[44%] top-4" label="C0" />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-slate-400">静電容量C0と機械共振枝を並列に見た簡易BVDモデル</div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-200/10 bg-cyan-950/20 p-4">
              <div className="text-xs text-slate-400">{label}</div>
              <div className="mt-2 font-display text-xl font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>
        <div className="xl:col-span-2 rounded-lg border border-cyan-200/10 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
          <div className="mb-2 font-medium text-white">この等価回路が意味すること</div>
          Rmが小さいほど共振時に効率よく電気エネルギーが機械振動に変わります。Qが高いと強く鳴りますが、リングダウンが長くなります。C0が大きいと駆動回路の容量負荷が重くなります。
        </div>
      </CardContent>
    </Card>
  );
}

function CircuitNode({ className, label }: { className: string; label: string }) {
  return <div className={`absolute grid size-5 place-items-center rounded-full border border-cyan-200 bg-slate-950 text-[9px] text-cyan-100 ${className}`}>{label}</div>;
}

function Element({ className, label }: { className: string; label: string }) {
  return <div className={`absolute rounded-md border border-cyan-200/50 bg-slate-900 px-5 py-2 font-mono text-sm text-cyan-100 shadow-lg shadow-cyan-950/40 ${className}`}>{label}</div>;
}
