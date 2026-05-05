"use client";

import { CheckCircle2, Circle, FlaskConical, RadioTower, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const workflowSteps = [
  { id: "profile", label: "素子登録", why: "形状と媒質から、ありそうな振動モードを絞ります。" },
  { id: "impedance", label: "インピーダンス測定", why: "電気的に見える共振候補を曲線で見つけます。" },
  { id: "peaks", label: "共振ピーク検出", why: "主共振、スプリアス、反共振を分けて扱います。" },
  { id: "bvd", label: "等価回路推定", why: "駆動回路から見た負荷と効率の目安を作ります。" },
  { id: "modes", label: "振動モード理解", why: "どこが動き、どこから音が出やすいかを確認します。" },
  { id: "sonar", label: "ソナー適性診断", why: "距離分解能、デッドゾーン、残響リスクをまとめます。" },
] as const;

type StepSidebarProps = {
  currentStep: string;
  completedStepIds: Set<string>;
  projectName: string;
  sampleLoaded: boolean;
  onLoadSample: () => void;
  onStepSelect: (stepId: string) => void;
};

export default function StepSidebar({
  currentStep,
  completedStepIds,
  projectName,
  sampleLoaded,
  onLoadSample,
  onStepSelect,
}: StepSidebarProps) {
  return (
    <aside className="sticky top-0 z-20 h-auto border-b border-cyan-200/10 bg-slate-950/90 p-4 backdrop-blur lg:h-screen lg:border-b-0">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
          <Waves className="size-5" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-white">Piezo Sonar Lab</div>
          <div className="text-xs text-slate-400">Acoustic identification MVP</div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-cyan-200/10 bg-slate-900/70 p-3">
        <div className="flex items-center gap-2 text-xs text-cyan-200">
          <FlaskConical className="size-4" />
          現在のプロジェクト
        </div>
        <div className="mt-2 truncate font-medium text-white">{projectName}</div>
        <div className="mt-2 text-xs text-slate-400">{sampleLoaded ? "サンプルデータ読込済み" : "未同定から開始"}</div>
      </div>

      <Button onClick={onLoadSample} className="mt-4 w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200">
        <RadioTower className="size-4" />
        サンプルデータで試す
      </Button>

      <nav className="mt-5 grid gap-2">
        {workflowSteps.map((step, index) => {
          const active = step.id === currentStep;
          const complete = completedStepIds.has(step.id);
          return (
            <button
              key={step.id}
              onClick={() => onStepSelect(step.id)}
              className={cn(
                "rounded-lg border p-3 text-left transition",
                active
                  ? "border-cyan-300/40 bg-cyan-300/10 shadow-lg shadow-cyan-950/30"
                  : "border-cyan-200/10 bg-slate-900/50 hover:border-cyan-300/25 hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-2">
                {complete ? <CheckCircle2 className="size-4 text-cyan-200" /> : <Circle className="size-4 text-slate-500" />}
                <span className="text-xs text-slate-500">{index + 1}</span>
                <span className="font-medium text-white">{step.label}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{step.why}</p>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
