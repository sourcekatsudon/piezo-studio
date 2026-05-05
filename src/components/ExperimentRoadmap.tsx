import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experiments = [
  ["空中でインピーダンスを測る", "素子単体の共振候補を把握する", "LCRメータまたはインピーダンスアナライザ", "主共振とスプリアスが再現する", "素子そのものの癖"],
  ["水中で再測定する", "ソナー媒質でピーク移動とQ低下を確認する", "防水治具、絶縁、容器", "主共振が追跡できる", "実使用時の駆動周波数"],
  ["ケースに入れて再測定する", "固定とケースがモードに与える影響を見る", "想定ケース、固定具", "ピーク位置の変化量が説明できる", "実装後の再現性"],
  ["ハイドロフォンで音圧を測る", "電気ピークが音圧に変換されるか確かめる", "ハイドロフォン、同期計測", "主共振付近で音圧が最大になる", "送波効率"],
  ["反射板までの距離を変えてエコーを測る", "デッドゾーンと距離分解能を確認する", "反射板、距離治具、オシロスコープ", "距離変化に応じてエコー遅延が動く", "測距の実用性"],
  ["バースト波数を変えてリングダウンを比較する", "短い波形で残響を抑えられるか確認する", "信号発生器、ドライバ", "波数を減らすと残響が短くなる", "近距離測定の限界"],
];

export default function ExperimentRoadmap() {
  return (
    <Card className="border-cyan-200/10 bg-slate-900/70 text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><ClipboardCheck className="size-5 text-cyan-200" />Section 7: 実験ログ / 次の実験</CardTitle>
        <p className="text-sm text-slate-400">なぜやるのか: 解析結果を次の測定に変換し、謎ピエゾの理解度を一段ずつ上げます。</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {experiments.map(([title, purpose, tools, success, insight]) => (
            <article key={title} className="rounded-lg border border-cyan-200/10 bg-slate-950/50 p-4">
              <div className="font-medium text-white">{title}</div>
              <dl className="mt-3 grid gap-2 text-sm leading-5">
                <Row label="目的" value={purpose} />
                <Row label="必要なもの" value={tools} />
                <Row label="成功条件" value={success} />
                <Row label="得られる知見" value={insight} />
              </dl>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-cyan-200/75">{label}</dt><dd className="text-slate-300">{value}</dd></div>;
}
