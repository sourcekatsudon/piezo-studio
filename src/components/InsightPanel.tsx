import { AlertTriangle, ArrowRight, Gauge, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { BvdParameters, PiezoProfile, ResonancePeak, SonarResult, UnderstandingStage } from "@/lib/types";

type InsightPanelProps = {
  profile: PiezoProfile;
  bvd: BvdParameters;
  peaks: ResonancePeak[];
  sonar: SonarResult;
};

export default function InsightPanel({ profile, bvd, peaks, sonar }: InsightPanelProps) {
  const stage: UnderstandingStage =
    sonar.score > 0 ? "ソナー評価済み" : bvd.q > 0 ? "等価回路推定済み" : peaks.length ? "共振候補あり" : "未同定";
  const mainPeak = peaks[0];

  return (
    <aside className="sticky top-0 h-auto border-t border-cyan-200/10 bg-slate-950/90 p-4 backdrop-blur lg:h-screen lg:border-t-0">
      <div className="rounded-lg border border-cyan-200/10 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-white">現在の理解度</div>
          <Badge className="bg-cyan-300 text-slate-950">{stage}</Badge>
        </div>
        <div className="mt-4 grid gap-2">
          {["未同定", "共振候補あり", "等価回路推定済み", "モード仮説あり", "ソナー評価済み"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
              <span className={item === stage ? "size-2 rounded-full bg-cyan-200" : "size-2 rounded-full bg-slate-700"} />
              {item}
            </div>
          ))}
        </div>
      </div>

      <PanelBlock icon={<Lightbulb />} title="今日の重要発見">
        <p>{mainPeak ? `${mainPeak.frequencyKhz}kHzに強い共振があります。` : "まだピークは未検出です。"}</p>
        <p>Q={bvd.q} のため、送信後のリングダウンを実測で確認してください。</p>
        <p>{profile.medium === "water" ? "水中利用では共振周波数が下がる可能性があります。" : "媒質を水に変えたときの再測定が判断材料になります。"}</p>
      </PanelBlock>

      <PanelBlock icon={<ArrowRight />} title="次にやること">
        <p>水中で同じ周波数スイープを行ってください。</p>
        <p>送信後のリングダウン波形を測り、近距離デッドゾーンを確認します。</p>
      </PanelBlock>

      <PanelBlock icon={<Gauge />} title="ソナー適性">
        <div className="flex items-end gap-2">
          <span className="font-display text-4xl font-semibold text-white">{sonar.score}</span>
          <span className="mb-1 text-sm text-slate-400">/ 100</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${sonar.score}%` }} />
        </div>
      </PanelBlock>

      <PanelBlock icon={<AlertTriangle />} title="危険・注意">
        <p>高電圧駆動時は感電に注意してください。</p>
        <p>水中実験では絶縁と防水を先に確認します。</p>
        <p>共振駆動では素子の発熱に注意してください。</p>
      </PanelBlock>
    </aside>
  );
}

function PanelBlock({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="mt-4 rounded-lg border border-cyan-200/10 bg-slate-900/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-100 [&_svg]:size-4">{icon}{title}</div>
      <div className="space-y-2 text-sm leading-6 text-slate-300">{children}</div>
    </section>
  );
}
