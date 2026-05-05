import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResonancePeak } from "@/lib/types";

const kindLabels = { main: "主共振", spurious: "スプリアス", antiresonance: "反共振" };

export default function ResonanceTable({ peaks }: { peaks: ResonancePeak[] }) {
  return (
    <Card className="border-cyan-200/10 bg-slate-900/70 text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><ListChecks className="size-5 text-cyan-200" />Section 3: 共振ピーク一覧</CardTitle>
        <p className="text-sm text-slate-400">なぜやるのか: 使える主共振と、波形を汚す可能性のあるピークを分けます。</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-cyan-200/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-950/80 text-xs text-slate-400">
              <tr>{["周波数", "種類", "強度", "推定モード", "信頼度", "コメント"].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-cyan-200/10">
              {peaks.map((peak) => (
                <tr key={`${peak.kind}-${peak.frequencyKhz}`} className="bg-slate-950/35">
                  <td className="px-4 py-4 font-mono text-cyan-100">{peak.frequencyKhz} kHz</td>
                  <td className="px-4 py-4">{kindLabels[peak.kind]}</td>
                  <td className="px-4 py-4"><Badge className="bg-cyan-300/15 text-cyan-100">{peak.strength}</Badge></td>
                  <td className="px-4 py-4">{peak.estimatedMode}</td>
                  <td className="px-4 py-4">{peak.confidence}%</td>
                  <td className="px-4 py-4 text-slate-300">{peak.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
