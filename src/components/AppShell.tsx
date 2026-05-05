"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Beaker, Radar } from "lucide-react";
import { estimateBvdParameters, calculateSonarScore, detectResonancePeaks } from "@/lib/analysis";
import { sampleImpedanceData, samplePiezoProfile } from "@/lib/sampleData";
import type { ImpedancePoint, PiezoProfile, SonarParams } from "@/lib/types";
import StepSidebar, { workflowSteps } from "@/components/StepSidebar";
import InsightPanel from "@/components/InsightPanel";
import PiezoProfileSection from "@/components/PiezoProfile";
import ImpedanceAnalyzer from "@/components/ImpedanceAnalyzer";
import ResonanceTable from "@/components/ResonanceTable";
import BvdCircuit from "@/components/BvdCircuit";
import ModeVisualizer from "@/components/ModeVisualizer";
import SonarSuitability from "@/components/SonarSuitability";
import ExperimentRoadmap from "@/components/ExperimentRoadmap";

const initialProfile: PiezoProfile = {
  name: "未同定ピエゾ",
  shape: "unknown",
  diameterMm: 25,
  thicknessMm: 2,
  medium: "unknown",
  purpose: "trx",
};

export default function AppShell() {
  const [profile, setProfile] = useState<PiezoProfile>(initialProfile);
  const [data, setData] = useState<ImpedancePoint[]>(sampleImpedanceData);
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState("impedance");

  const peaks = useMemo(() => detectResonancePeaks(data), [data]);
  const bvd = useMemo(() => estimateBvdParameters(data), [data]);
  const sonarParams: SonarParams = {
    medium: profile.medium === "air" ? "air" : "water",
    driveVoltage: 24,
    burstCycles: 8,
    targetDistanceM: 2,
    requiredResolutionCm: 8,
    receiverGainDb: 32,
    adcSamplingKhz: 1000,
    q: bvd.q,
    frequencyKhz: bvd.frKhz,
    spuriousCount: peaks.filter((peak) => peak.kind === "spurious").length,
  };
  const sonar = calculateSonarScore(sonarParams);

  const completedStepIds = new Set(["profile", data.length ? "impedance" : "", peaks.length ? "peaks" : "", "bvd", "modes", "sonar"]);

  const loadSample = () => {
    setProfile(samplePiezoProfile);
    setData(sampleImpedanceData);
    setSampleLoaded(true);
    setCurrentStep("peaks");
  };

  return (
    <main className="min-h-screen bg-[#08131f] text-slate-100">
      <div className="fixed inset-0 -z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(42,157,244,0.22),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(36,211,202,0.14),transparent_28%),linear-gradient(180deg,#08131f,#091824_45%,#061017)]" />
      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <StepSidebar
          currentStep={currentStep}
          completedStepIds={completedStepIds}
          projectName={profile.name}
          sampleLoaded={sampleLoaded}
          onLoadSample={loadSample}
          onStepSelect={setCurrentStep}
        />
        <section className="min-w-0 border-x border-cyan-200/10 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-4 rounded-lg border border-cyan-200/10 bg-slate-950/60 p-4 shadow-2xl shadow-cyan-950/30 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-200/70">Piezo Sonar Lab</p>
              <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">謎ピエゾを、ソナー候補へ育てる実験ラボ</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                測定曲線、共振ピーク、等価回路、振動モード、ソナー適性をひとつの流れで確認します。
              </p>
            </div>
            <div className="grid min-w-56 grid-cols-2 gap-2 text-xs">
              <StatusChip icon={<Beaker />} label="現在" value={workflowSteps.find((step) => step.id === currentStep)?.label ?? "測定"} />
              <StatusChip icon={<Radar />} label="次" value="水中再測定" />
            </div>
          </div>

          <div className="space-y-5">
            <PiezoProfileSection profile={profile} onChange={setProfile} />
            <ImpedanceAnalyzer data={data} onDataChange={setData} onAnalyzeSample={loadSample} />
            <ResonanceTable peaks={peaks} />
            <BvdCircuit params={bvd} />
            <ModeVisualizer />
            <SonarSuitability initialParams={sonarParams} bvd={bvd} peaks={peaks} />
            <ExperimentRoadmap />
          </div>
        </section>
        <InsightPanel profile={profile} bvd={bvd} peaks={peaks} sonar={sonar} />
      </div>
    </main>
  );
}

function StatusChip({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-cyan-200/10 bg-cyan-950/20 p-3">
      <div className="flex items-center gap-2 text-cyan-200 [&_svg]:size-4">{icon}<span>{label}</span></div>
      <div className="mt-1 font-medium text-white">{value}</div>
    </div>
  );
}
