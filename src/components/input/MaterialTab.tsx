"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Material } from "@/lib/types";
import { materialNameOverrides, type Locale } from "@/lib/i18n";
import { buildStressStrainCurve, materialCurveInfo } from "@/calc/materialCurve";
import { CircleHelp } from "lucide-react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MaterialOverrides = {
  enabled: boolean;
  E_GPa?: number;
  nu?: number;
  allowShort?: number;
  allowLong?: number;
};

type Props = {
  materials: Material[];
  selectedId: string;
  onSelect: (id: string) => void;
  overrides: MaterialOverrides;
  onOverridesChange: (overrides: MaterialOverrides) => void;
  duration: "short" | "medium" | "long";
  onDurationChange: (duration: "short" | "medium" | "long") => void;
  mode: "beginner" | "pro";
  locale: Locale;
  copy: {
    label: string;
    snapshot: string;
    youngsModulus: string;
    poissonRatio: string;
    allowShort: string;
    allowLong: string;
    duration: string;
    durationShort: string;
    durationMedium: string;
    durationLong: string;
    creepWarning: string;
    overrides: string;
    overrideEnable: string;
    overrideE: string;
    overrideNu: string;
    overrideAllowShort: string;
    overrideAllowLong: string;
  };
};

type MaterialHelpCopy = {
  youngsModulus: string;
  poissonRatio: string;
  allowShort: (material: Material) => string;
  allowLong: (material: Material) => string;
  duration: string;
  overrideEnable: string;
  overrideE: string;
  overrideNu: string;
  overrideAllowShort: (material: Material) => string;
  overrideAllowLong: (material: Material) => string;
};

const formatStrengthReference = (material: Material, locale: Locale) => {
  const compressiveYield = material.strength.compressive_yield_MPa;
  if (compressiveYield != null) {
    return locale === "ja"
      ? `圧縮降伏強度 ${compressiveYield} MPa`
      : `compressive yield ${compressiveYield} MPa`;
  }

  const yieldStrength = material.strength.yield_MPa;
  if (yieldStrength != null) {
    return locale === "ja"
      ? `降伏強度 ${yieldStrength} MPa`
      : `yield strength ${yieldStrength} MPa`;
  }

  return locale === "ja" ? "基準強度未設定" : "no explicit yield value set";
};

const materialHelpCopy: Partial<Record<Locale, MaterialHelpCopy>> = {
  en: {
    youngsModulus:
      "Elastic stiffness. Higher values mean less deformation under the same pressure. This is not a failure limit.",
    poissonRatio:
      "Ratio of lateral strain to axial strain. It affects shell, plate, and buckling formulas, but it is not a strength value.",
    allowShort: (material) =>
      `Design allowable used for short-duration checks. It is not the raw yield point; it is a conservative working stress preset below ${formatStrengthReference(material, "en")}. Current preset: ${material.strength.design_allow_MPa_short} MPa.`,
    allowLong: (material) =>
      `Design allowable used for sustained loading. For creep-sensitive materials this is reduced more aggressively than short-term values. Current preset: ${material.strength.design_allow_MPa_long} MPa.`,
    duration:
      "Selects which allowable is used in the calculation. For creep-sensitive materials, medium and long durations also reduce effective stiffness.",
    overrideEnable:
      "Use manual values instead of the preset material database. Only do this when you have verified datasheet values for your exact stock and condition.",
    overrideE:
      "Manual Young's modulus. Use this if you have a measured or certified stiffness value for the selected stock.",
    overrideNu:
      "Manual Poisson's ratio. This is usually a secondary input, but it can affect buckling and deflection calculations.",
    overrideAllowShort: (material) =>
      `Manual short-duration design allowable. The preset for this material is ${material.strength.design_allow_MPa_short} MPa.`,
    overrideAllowLong: (material) =>
      `Manual long-duration design allowable. The preset for this material is ${material.strength.design_allow_MPa_long} MPa.`,
  },
  ja: {
    youngsModulus:
      "材料の剛性です。値が高いほど同じ圧力でも変形しにくくなります。強度限界そのものではありません。",
    poissonRatio:
      "軸方向に伸び縮みしたとき、横方向がどれだけ連動して変形するかを表す比です。座屈やたわみ計算に効きますが、強度値ではありません。",
    allowShort: (material) =>
      `短時間荷重で計算に使う設計用の許容応力です。降伏点そのものではなく、通常は ${formatStrengthReference(material, "ja")} より低い保守値を使います。現在のプリセットは ${material.strength.design_allow_MPa_short} MPa です。`,
    allowLong: (material) =>
      `長時間荷重で使う設計用の許容応力です。クリープに敏感な材料では短期許容より強く下げます。現在のプリセットは ${material.strength.design_allow_MPa_long} MPa です。`,
    duration:
      "計算でどの許容応力を使うかを選びます。クリープに敏感な材料では、中期・長期で実効剛性も下げて評価します。",
    overrideEnable:
      "材質データベースのプリセットではなく、手入力値で計算します。購入材の規格・調質・証明値が分かっている場合だけ使ってください。",
    overrideE:
      "ヤング率を手入力で上書きします。実測値やミルシート値を使いたいとき向けです。",
    overrideNu:
      "ポアソン比を手入力で上書きします。影響はヤング率より小さいことが多いですが、座屈やたわみに効きます。",
    overrideAllowShort: (material) =>
      `短期の設計用許容応力を手入力で上書きします。この材料の現在のプリセットは ${material.strength.design_allow_MPa_short} MPa です。`,
    overrideAllowLong: (material) =>
      `長期の設計用許容応力を手入力で上書きします。この材料の現在のプリセットは ${material.strength.design_allow_MPa_long} MPa です。`,
  },
};

type TooltipLabelProps = {
  label: string;
  description: string;
  className?: string;
};

const materialCurveCopy: Partial<
  Record<
    Locale,
    {
      title: string;
      strain: string;
      stress: string;
      proof: string;
      nonlinear: string;
      elastic: string;
    }
  >
> = {
  en: {
    title: "Stress-strain curve",
    strain: "Strain",
    stress: "Stress",
    proof: "0.2% proof",
    nonlinear: "Nonlinear",
    elastic: "Elastic",
  },
  ja: {
    title: "応力-ひずみ曲線",
    strain: "ひずみ",
    stress: "応力",
    proof: "0.2%耐力",
    nonlinear: "非線形",
    elastic: "弾性直線",
  },
};

function TooltipLabel({ label, description, className }: TooltipLabelProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1 rounded-sm text-left text-muted-foreground transition hover:text-foreground ${className ?? ""}`}
        >
          <span className="underline decoration-dotted underline-offset-4">{label}</span>
          <CircleHelp className="size-3.5 shrink-0" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-80 leading-relaxed">
        {description}
      </TooltipContent>
    </Tooltip>
  );
}

export default function MaterialTab({
  materials,
  selectedId,
  onSelect,
  overrides,
  onOverridesChange,
  duration,
  onDurationChange,
  mode,
  locale,
  copy,
}: Props) {
  const material = materials.find((m) => m.id === selectedId) ?? materials[0];
  const nameOverrides = materialNameOverrides[locale];
  const displayName = (mat: Material) => nameOverrides?.[mat.id] ?? mat.name;
  const help = materialHelpCopy[locale] ?? materialHelpCopy.en!;
  const curveCopy = materialCurveCopy[locale] ?? materialCurveCopy.en!;
  const curveData = useMemo(() => buildStressStrainCurve(material), [material]);
  const curveInfo = useMemo(() => materialCurveInfo(material), [material]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select value={selectedId} onValueChange={onSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            {materials.map((mat) => (
              <SelectItem key={mat.id} value={mat.id}>
                {displayName(mat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border border-border bg-white/80">
        <CardHeader>
          <CardTitle className="text-base">{copy.snapshot}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex justify-between">
            <TooltipLabel label={copy.youngsModulus} description={help.youngsModulus} />
            <span className="font-mono">{material.elastic.E_GPa.toFixed(2)} GPa</span>
          </div>
          <div className="flex justify-between">
            <TooltipLabel label={copy.poissonRatio} description={help.poissonRatio} />
            <span className="font-mono">{material.elastic.nu.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <TooltipLabel label={copy.allowShort} description={help.allowShort(material)} />
            <span className="font-mono">{material.strength.design_allow_MPa_short} MPa</span>
          </div>
          <div className="flex justify-between">
            <TooltipLabel label={copy.allowLong} description={help.allowLong(material)} />
            <span className="font-mono">{material.strength.design_allow_MPa_long} MPa</span>
          </div>
          <div className="grid gap-1">
            <TooltipLabel label={copy.duration} description={help.duration} className="text-xs" />
            <Select value={duration} onValueChange={(value) => onDurationChange(value as Props["duration"])}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">{copy.durationShort}</SelectItem>
                <SelectItem value="medium">{copy.durationMedium}</SelectItem>
                <SelectItem value="long">{copy.durationLong}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border bg-white/80">
        <CardHeader>
          <CardTitle className="text-base">{curveCopy.title}</CardTitle>
        </CardHeader>
        <CardContent className="h-52 min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 1, height: 1 }}
          >
            <LineChart data={curveData} margin={{ left: 8, right: 8, top: 12, bottom: 10 }}>
              <XAxis
                dataKey="strain_pct"
                type="number"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => Number(value).toFixed(1)}
                label={{ value: `${curveCopy.strain} (%)`, position: "insideBottom", offset: -4 }}
              />
              <YAxis
                dataKey="stress_MPa"
                type="number"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => Number(value).toFixed(0)}
                width={48}
                label={{ value: `${curveCopy.stress} (MPa)`, angle: -90, position: "insideLeft", offset: 6 }}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0]?.payload as { strain_pct: number; stress_MPa: number } | undefined;
                  if (!point) return null;
                  return (
                    <div className="rounded-md border border-border bg-white/95 p-2 text-xs shadow-sm">
                      <div>
                        {curveCopy.strain}: {point.strain_pct.toFixed(2)}%
                      </div>
                      <div>
                        {curveCopy.stress}: {point.stress_MPa.toFixed(0)} MPa
                      </div>
                    </div>
                  );
                }}
              />
              <ReferenceLine x={curveInfo.proofStrain_pct} stroke="#9a3412" strokeDasharray="4 4" />
              <ReferenceLine y={curveInfo.proofStress_MPa} stroke="#9a3412" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="linearStress_MPa"
                name={curveCopy.elastic}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="stress_MPa"
                name={curveCopy.nonlinear}
                stroke="#0f172a"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {material.creep.isCreepSensitive && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          {copy.creepWarning}
        </div>
      )}

      {mode === "pro" && (
        <Card className="border border-border bg-white/80">
          <CardHeader>
            <CardTitle className="text-base">{copy.overrides}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center justify-between">
              <TooltipLabel label={copy.overrideEnable} description={help.overrideEnable} />
              <Switch
                checked={overrides.enabled}
                onCheckedChange={(checked) => onOverridesChange({ ...overrides, enabled: checked })}
              />
            </div>
            {overrides.enabled && (
              <div className="grid gap-3">
                <div className="grid gap-1">
                  <TooltipLabel label={copy.overrideE} description={help.overrideE} className="text-xs" />
                  <Input
                    type="number"
                    value={overrides.E_GPa ?? material.elastic.E_GPa}
                    onChange={(event) =>
                      onOverridesChange({ ...overrides, E_GPa: Number(event.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <TooltipLabel label={copy.overrideNu} description={help.overrideNu} className="text-xs" />
                  <Input
                    type="number"
                    value={overrides.nu ?? material.elastic.nu}
                    onChange={(event) =>
                      onOverridesChange({ ...overrides, nu: Number(event.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <TooltipLabel
                    label={copy.overrideAllowShort}
                    description={help.overrideAllowShort(material)}
                    className="text-xs"
                  />
                  <Input
                    type="number"
                    value={overrides.allowShort ?? material.strength.design_allow_MPa_short}
                    onChange={(event) =>
                      onOverridesChange({
                        ...overrides,
                        allowShort: Number(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <TooltipLabel
                    label={copy.overrideAllowLong}
                    description={help.overrideAllowLong(material)}
                    className="text-xs"
                  />
                  <Input
                    type="number"
                    value={overrides.allowLong ?? material.strength.design_allow_MPa_long}
                    onChange={(event) =>
                      onOverridesChange({
                        ...overrides,
                        allowLong: Number(event.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
