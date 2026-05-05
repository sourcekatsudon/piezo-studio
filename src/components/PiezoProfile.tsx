"use client";

import { Disc3, Ruler } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PiezoMedium, PiezoProfile, PiezoPurpose, PiezoShape } from "@/lib/types";

type Props = {
  profile: PiezoProfile;
  onChange: (profile: PiezoProfile) => void;
};

const shapeLabels: Record<PiezoShape, string> = { disk: "円板", ring: "リング", plate: "板", tube: "チューブ", unknown: "不明" };
const mediumLabels: Record<PiezoMedium, string> = { air: "空気", water: "水", case: "ケース内", unknown: "不明" };
const purposeLabels: Record<PiezoPurpose, string> = { tx: "送波", rx: "受波", trx: "送受波" };

export default function PiezoProfileSection({ profile, onChange }: Props) {
  const modeHints = buildModeHints(profile);
  const update = <K extends keyof PiezoProfile>(key: K, value: PiezoProfile[K]) => onChange({ ...profile, [key]: value });

  return (
    <Card className="border-cyan-200/10 bg-slate-900/70 text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><Disc3 className="size-5 text-cyan-200" />Section 1: 素子プロファイル</CardTitle>
        <p className="text-sm text-slate-400">なぜやるのか: 形状と使う媒質から、最初に疑うべき振動モードを絞ります。</p>
      </CardHeader>
      <CardContent className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="素子名"><Input value={profile.name} onChange={(event) => update("name", event.target.value)} className="border-cyan-200/15 bg-slate-950/60" /></Field>
          <Field label="形状">
            <Select value={profile.shape} onValueChange={(value) => update("shape", value as PiezoShape)}>
              <SelectTrigger className="w-full border-cyan-200/15 bg-slate-950/60"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(shapeLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="直径 mm"><Input type="number" value={profile.diameterMm} onChange={(event) => update("diameterMm", Number(event.target.value))} className="border-cyan-200/15 bg-slate-950/60" /></Field>
          <Field label="厚み mm"><Input type="number" value={profile.thicknessMm} onChange={(event) => update("thicknessMm", Number(event.target.value))} className="border-cyan-200/15 bg-slate-950/60" /></Field>
          <Field label="使用媒質">
            <Select value={profile.medium} onValueChange={(value) => update("medium", value as PiezoMedium)}>
              <SelectTrigger className="w-full border-cyan-200/15 bg-slate-950/60"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(mediumLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="用途">
            <Select value={profile.purpose} onValueChange={(value) => update("purpose", value as PiezoPurpose)}>
              <SelectTrigger className="w-full border-cyan-200/15 bg-slate-950/60"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(purposeLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <div className="rounded-lg border border-cyan-200/10 bg-cyan-950/20 p-4">
          <div className="flex items-center gap-2 font-medium text-cyan-100"><Ruler className="size-4" />ありそうな振動モード候補</div>
          <div className="mt-4 grid gap-3">
            {modeHints.map((hint) => (
              <div key={hint.title} className="rounded-md border border-cyan-200/10 bg-slate-950/50 p-3">
                <div className="font-medium text-white">{hint.title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-300">{hint.body}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="grid gap-2"><Label className="text-slate-300">{label}</Label>{children}</div>;
}

function buildModeHints(profile: PiezoProfile) {
  const thin = profile.thicknessMm > 0 && profile.diameterMm / profile.thicknessMm > 8;
  return [
    {
      title: profile.shape === "disk" && thin ? "径方向モード / 曲げモード" : "主要モード候補",
      body: thin ? "円板・薄型のため、低めの周波数では径方向モードや曲げモードが出やすい条件です。" : "形状情報が増えるほど、厚み・曲げ・高次モードの切り分け精度が上がります。",
    },
    {
      title: "厚みモード",
      body: profile.thicknessMm <= 2.5 ? "厚みが小さいため、高周波側に厚みモードが出る可能性があります。" : "厚み方向の伸縮は高周波側の候補として扱います。",
    },
    {
      title: "媒質の影響",
      body: profile.medium === "water" ? "水中では負荷が増え、共振周波数低下とQ低下が起きやすいです。" : "空中と水中ではピーク位置とQが変わるため、媒質を揃えた再測定が重要です。",
    },
  ];
}
