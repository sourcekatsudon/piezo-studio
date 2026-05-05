"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as Comlink from "comlink";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import GeometryTab from "@/components/input/GeometryTab";
import MaterialTab, { type MaterialOverrides } from "@/components/input/MaterialTab";
import WaterTab from "@/components/input/WaterTab";
import UncertaintyTab from "@/components/input/UncertaintyTab";
import PresetsTab, { type Preset } from "@/components/input/PresetsTab";
import PressureDisplacementChart from "@/components/charts/PressureDisplacementChart";
import ThicknessSweepChart from "@/components/charts/ThicknessSweepChart";
import DistributionChart from "@/components/charts/DistributionChart";
import FailureProbabilityChart from "@/components/charts/FailureProbabilityChart";
import ModeShareChart from "@/components/charts/ModeShareChart";
import HoleMapChart from "@/components/charts/HoleMapChart";
import PressureCaseViewer from "@/components/viewer3d/PressureCaseViewer";
import AssumptionsSheet from "@/components/explain/AssumptionsSheet";
import materialsData from "@/data/materials.json";
import presetsData from "@/data/presets.json";
import type {
  Geometry,
  InputState,
  Material,
  Mode,
  PressureMode,
  ShapeType,
  PlateGeometry,
  PlatePenetratorsGeometry,
  BoxGeometry,
} from "@/lib/types";
import {
  computeDpLimits,
  creepEfactor,
  kdfPresetValue,
  pickOverallLimit,
  pickSigmaAllow,
  pickTensileSigmaAllow,
  tubeDisplacementPerPa,
} from "@/calc/failureModes";
import { strainAmplificationForStress } from "@/calc/materialCurve";
import { tubeMaxVonMisesPerPa } from "@/calc/models/cylinder";
import { plateDeflectionPerPa, plateMaxStressPerPa } from "@/calc/models/plateCircularClamped";
import { analyzePlateWithHoles } from "@/calc/models/plateCircularClampedWithHoles";
import { rectPlateMaxDeflectionPerPa, rectPlateMaxStressPerPa } from "@/calc/models/rectPlateSimplySupported";
import { deriveDomeGeometry, domeDisplacementPerPa } from "@/calc/models/dome";
import { createMonteCarloWorker } from "@/calc/montecarlo/worker-client";
import type { MonteCarloOutput, ThicknessSweepOutput } from "@/calc/montecarlo/worker";
import { depthToPressure, mToMm, mmToM, MPaToAtm, PaToAtm, PaToMPa, pressureToDepth, waterDensity } from "@/calc/units";
import { detectLocale, localeOptions, translations, type Locale } from "@/lib/i18n";

const materials = materialsData as Material[];
const presets = presetsData as Preset[];
const bucklingReferenceUrl = "https://www.pveng.com/home/asme-code-design/external-pressure-methods/?utm_source=chatgpt.com";

type FailureModeDetailCopy = {
  bucklingTitle: string;
  bucklingBody: string[];
  bucklingLinkLabel: string;
  vonMisesTitle: string;
  vonMisesBody: string[];
};

const failureModeDetailCopy: Partial<Record<Locale, FailureModeDetailCopy>> = {
  en: {
    bucklingTitle: "Buckling examples and videos",
    bucklingBody: [
      "When buckling governs, real failures often show sudden ovalization, circumferential lobes, wrinkles, or diamond-shaped waves, followed by a rapid drop in internal volume.",
      "This is more likely in thin-wall, large-diameter, and long shells under external pressure.",
    ],
    bucklingLinkLabel: "Reference on external-pressure buckling behavior",
    vonMisesTitle: "von Mises-driven yielding examples",
    vonMisesBody: [
      "Compared with the cleaner lobe pattern of buckling, yielding usually starts with local plasticity or damage at a weak point, then progresses into dents, local crushing, and sometimes cracking.",
      "For thick cylinders under external pressure, yielding is often explained as starting from the inner surface, with the plastic zone growing outward. After the full section yields, the shell can first move inward more uniformly and then drift toward ovalization or flattening as wall-thickness and roundness imperfections take over.",
    ],
  },
  ja: {
    bucklingTitle: "■座屈事例や動画",
    bucklingBody: [
      "座屈が支配すると、実際の壊れ方は円筒が急に楕円化したり、周方向にローブ状のへこみが出たり、しわ・ダイヤモンド状の波が立って、そのまま一気に体積が減る形になりやすいです。",
      "薄肉・大径・長尺の円筒ほど起きやすく、外圧問題では典型的な不安定破壊です。",
    ],
    bucklingLinkLabel: "外圧座屈の参考ページ",
    vonMisesTitle: "■von Misesの事例",
    vonMisesBody: [
      "座屈みたいなきれいなローブ模様というより、まず局所的な塑性化や弱点部の損傷が出て、そこからへこみ・局所つぶれ・亀裂が進む形です。",
      "外圧を受ける厚肉円筒では、まず内面側から降伏が始まり、塑性域が外側へ広がり、断面全体が降伏した後はいったん比較的一様に内向きにつぶれ、その後は初期偏肉や真円度不良の影響で楕円化・偏平化していく、と説明されます。",
    ],
  },
};

type PressureModeCopy = {
  external: string;
  internal: string;
  sectionExternal: string;
  sectionInternal: string;
  targetPressure: string;
  targetPressureHint: string;
  internalModeNote: string;
  limitPressureLabel: string;
  pressureDistributionNote: string;
  pressureDistributionTitle: string;
  pressureSweepTitle: string;
  theoreticalLimitPressure: string;
  recommendedTeaser: string;
  recommendedIntro: string;
  recommendedMethodMargin: string;
  recommendedMethodPf: string;
  modeTableTitle: string;
  modeLine: string;
  thicknessOk: string;
  thicknessFail: string;
};

const pressureModeCopy: Partial<Record<Locale, PressureModeCopy>> = {
  en: {
    external: "External",
    internal: "Internal",
    sectionExternal: "Water & External Pressure",
    sectionInternal: "Internal Pressure",
    targetPressure: "Target Internal Pressure",
    targetPressureHint: "Gauge pressure for proof-test/service screening.",
    internalModeNote:
      "Internal mode evaluates burst/yield limits from tensile stress. External-pressure buckling and water-depth conversion are hidden.",
    limitPressureLabel: "Limit pressure",
    pressureDistributionNote:
      "Distribution of predicted internal-pressure limit across Monte Carlo samples.",
    pressureDistributionTitle: "Limit Pressure Distribution",
    pressureSweepTitle: "Thickness vs Limit Pressure",
    theoreticalLimitPressure: "Theoretical limit pressure",
    recommendedTeaser:
      "Recommended {value} atm ({valueMpa} MPa) is governed by {mode} (limit {limitValue} atm / {limitValueMpa} MPa).",
    recommendedIntro:
      "The minimum-limit mode is {mode}. This is an internal gauge pressure limit; tensile-side allowable stress is used for material strength.",
    recommendedMethodMargin:
      "With uncertainty OFF, the recommended pressure is {limitValue} atm ({limitValueMpa} MPa) divided by margin {margin}x -> {value} atm ({valueMpa} MPa).",
    recommendedMethodPf:
      "With uncertainty ON, the recommended pressure is the Monte Carlo point where failure probability <= {pf}%, which is {value} atm ({valueMpa} MPa).",
    modeTableTitle: "Mode-by-mode limits (pressure)",
    modeLine: "{mode}: {value} atm ({valueMpa} MPa)",
    thicknessOk: "Required t ≈ {t} mm to reach {target} atm.",
    thicknessFail: "No thickness in sweep range meets the target pressure.",
  },
  ja: {
    external: "外圧",
    internal: "内圧",
    sectionExternal: "水圧条件",
    sectionInternal: "内圧条件",
    targetPressure: "目標内圧",
    targetPressureHint: "耐圧試験や運用時に掛けるゲージ圧。",
    internalModeNote:
      "内圧モードでは引張側の応力で破裂/降伏を評価します。外圧座屈と水深換算は表示から外します。",
    limitPressureLabel: "限界圧力",
    pressureDistributionNote:
      "厚み・径の誤差・材質強度のばらつきを与えた場合の内圧限界分布です。",
    pressureDistributionTitle: "限界内圧の分布",
    pressureSweepTitle: "厚みと限界内圧",
    theoreticalLimitPressure: "理論限界内圧",
    recommendedTeaser:
      "推奨 {value} 気圧（{valueMpa} MPa）は {mode} が支配（限界 {limitValue} 気圧 / {limitValueMpa} MPa）。",
    recommendedIntro:
      "最小の故障モードは {mode}。ここでは内圧ゲージ圧を上げたときの限界で、材料強度は圧縮側ではなく引張側の許容値で評価しています。",
    recommendedMethodMargin:
      "ばらつきOFFのため、理論限界 {limitValue} 気圧（{limitValueMpa} MPa）をマージン {margin}x で割り、推奨内圧 {value} 気圧（{valueMpa} MPa）としています。",
    recommendedMethodPf:
      "ばらつきONのため、モンテカルロで故障確率 <= {pf}% となる内圧 {value} 気圧（{valueMpa} MPa）を採用しています。",
    modeTableTitle: "モード別の限界（内圧）",
    modeLine: "{mode}: {value} 気圧（{valueMpa} MPa）",
    thicknessOk: "目標内圧 {target} 気圧には t ≈ {t} mm が目安です。",
    thicknessFail: "この範囲の厚みでは目標内圧に届きません。",
  },
};

const makeDefaultGeometry = (shape: ShapeType): Geometry => {
  if (shape === "cylinder") {
    return {
      shape: "cylinder",
      Di_m: 0.1,
      t_m: 0.008,
      L_m: 0.2,
      hasPlate: false,
      plate_t_m: 0.01,
    };
  }
  if (shape === "plate") {
    return {
      shape: "plate",
      radius_m: 0.06,
      t_m: 0.008,
    } as PlateGeometry;
  }
  if (shape === "plate_penetrators") {
    return {
      shape: "plate_penetrators",
      radius_m: 0.06,
      t_m: 0.008,
      hole_count: 4,
      hole_d_m: 0.01,
      hole_forbid_m: 0.018,
      hole_kt: 3.5,
      hole_kt_mode: "preset",
      hole_kt_preset: 3.5,
      hole_kt_variation: "off",
      hole_kt_var_pct: 10,
      w_allow_m: null,
      attachToCylinder: false,
      cylinderLength_m: 0.12,
    } as PlatePenetratorsGeometry;
  }
  if (shape === "dome") {
    return {
      shape: "dome",
      mode: "hemi",
      Di_m: 0.12,
      t_m: 0.006,
      h_m: 0.06,
      kdfMode: "preset",
      kdfPreset: "hobby",
      kdfManual: 0.3,
      sfBuckling: 2.0,
      sfYield: 1.5,
      attachToCylinder: true,
      cylinderLength_m: 0.12,
      connection: "integral",
    };
  }
  return {
    shape: "box",
    a_m: 0.12,
    b_m: 0.08,
    t_m: 0.006,
  } as BoxGeometry;
};

const marginFactors = {
  ideal: 1.2,
  conservative: 1.5,
  ultra: 2.0,
};

const histogramFromSamples = (
  samples: number[],
  pressureMode: PressureMode,
  rho: number,
  internalPressure: number
) => {
  if (samples.length === 0) return [];
  const values =
    pressureMode === "external"
      ? samples.map((dp) => pressureToDepth(dp + internalPressure, rho))
      : samples.map((dp) => PaToAtm(dp));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const bins = 18;
  const step = (max - min) / bins || 1;
  const counts = Array.from({ length: bins }, () => 0);
  values.forEach((value) => {
    const idx = Math.min(bins - 1, Math.floor((value - min) / step));
    counts[idx] += 1;
  });
  return counts.map((count, idx) => ({
    value: min + step * (idx + 0.5),
    count,
  }));
};

const modeShareToChart = (share: Record<Mode, number>, labels: Record<Mode, string>) => {
  const total = Object.values(share).reduce((sum, v) => sum + v, 0) || 1;
  return (Object.entries(share) as [Mode, number][])
    .filter(([, value]) => value > 0)
    .map(([mode, value]) => ({
      mode: labels[mode] ?? mode.replace(/_/g, " "),
      value: (value / total) * 100,
    }));
};

const interpolate = (template: string, values: Record<string, string>) => {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template
  );
};

const encodeShareState = (state: unknown) =>
  btoa(encodeURIComponent(JSON.stringify(state)));

const decodeShareState = (value: string) =>
  JSON.parse(decodeURIComponent(atob(value)));

const formatValue = (value: number | null | undefined, digits: number) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return "--";
  return value.toFixed(digits);
};

const ChartExplanation = ({
  title,
  teaser,
  open,
  onToggle,
  buttonLabel,
  children,
}: {
  title: string;
  teaser: string;
  open: boolean;
  onToggle: () => void;
  buttonLabel: string;
  children: ReactNode;
}) => (
  <div className="rounded-2xl border border-border/60 bg-white/60 p-3 text-[11px] text-muted-foreground">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p>{teaser}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="shrink-0 text-xs font-medium text-primary transition hover:text-primary/80"
        aria-expanded={open}
      >
        {buttonLabel}
      </button>
    </div>
    <div className={`overflow-hidden transition-all ${open ? "max-h-[1600px] opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="space-y-2 pt-2">{children}</div>
    </div>
  </div>
);

export default function PressureCaseApp() {
  const [locale, setLocale] = useState<Locale>("en");
  const [input, setInput] = useState<InputState>({
    pressureMode: "external",
    shape: "cylinder",
    geometry: makeDefaultGeometry("cylinder"),
    endCondition: "closed",
    planeMode: "plane_strain",
    water: "seawater",
    rho_kg_m3: waterDensity.seawater,
    internalPressure_Pa: 0,
    targetPressure_Pa: 1e6,
    depthTarget_m: 120,
    duration: "short",
    uncertainty: {
      enabled: true,
      t_tol_m: 0.0002,
      d_tol_m: 0.0002,
      E_var_pct: 7,
      sigma_var_pct: 10,
      kdfPreset: "hobby",
      samples: 10000,
      gamma_ln_sigma: 0.35,
    },
    mode: "beginner",
    units: "metric",
    autoRun: true,
    marginPreset: "conservative",
    pfTarget: 0.01,
  });

  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [materialOverrides, setMaterialOverrides] = useState<MaterialOverrides>({ enabled: false });
  const [showDimensions, setShowDimensions] = useState(true);
  const [mcProgress, setMcProgress] = useState(0);
  const [mcResult, setMcResult] = useState<MonteCarloOutput | null>(null);
  const [sweepResult, setSweepResult] = useState<ThicknessSweepOutput | null>(null);
  const [sweepProgress, setSweepProgress] = useState(0);
  const [showFailureIllustration, setShowFailureIllustration] = useState(false);
  const [showRecommendedExplanation, setShowRecommendedExplanation] = useState(false);
  const [openCharts, setOpenCharts] = useState<Record<string, boolean>>({});

  const workerRef = useRef<ReturnType<typeof createMonteCarloWorker> | null>(null);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const stateParam = url.searchParams.get("state");
    if (!stateParam) return;
    try {
      const parsed = decodeShareState(stateParam) as {
        input?: InputState;
        materialId?: string;
        materialOverrides?: MaterialOverrides;
        locale?: Locale;
      };
      if (parsed.input) {
        setInput(parsed.input);
      }
      if (parsed.materialId) {
        setMaterialId(parsed.materialId);
      }
      if (parsed.materialOverrides) {
        setMaterialOverrides(parsed.materialOverrides);
      }
      if (parsed.locale) {
        setLocale(parsed.locale);
      }
    } catch {
      // Ignore invalid URL payloads.
    }
  }, []);

  useEffect(() => {
    workerRef.current = createMonteCarloWorker();
    return () => {
      workerRef.current = null;
    };
  }, []);

  const baseMaterial = useMemo(
    () => materials.find((mat) => mat.id === materialId) ?? materials[0],
    [materialId]
  );

  const material = useMemo<Material>(() => {
    if (!materialOverrides.enabled) return baseMaterial;
    return {
      ...baseMaterial,
      elastic: {
        E_GPa: materialOverrides.E_GPa ?? baseMaterial.elastic.E_GPa,
        nu: materialOverrides.nu ?? baseMaterial.elastic.nu,
      },
      strength: {
        ...baseMaterial.strength,
        design_allow_MPa_short:
          materialOverrides.allowShort ?? baseMaterial.strength.design_allow_MPa_short,
        design_allow_MPa_long:
          materialOverrides.allowLong ?? baseMaterial.strength.design_allow_MPa_long,
      },
    };
  }, [baseMaterial, materialOverrides]);

  const pressureMode = input.pressureMode ?? "external";
  const targetPressure_Pa = input.targetPressure_Pa ?? 1e6;
  const isExternalPressureMode = pressureMode === "external";

  const recommendedLimit = useMemo(() => {
    const kdfGamma =
      input.geometry.shape === "dome"
        ? input.geometry.kdfMode === "manual"
          ? input.geometry.kdfManual
          : kdfPresetValue(input.geometry.kdfPreset)
        : kdfPresetValue(input.uncertainty.kdfPreset);
    const dps = computeDpLimits(input.geometry, material, {
      endCondition: input.endCondition,
      planeMode: input.planeMode,
      pressureMode,
      duration: input.duration,
      kdfGamma,
      wAllow_m:
        input.geometry.shape === "plate_penetrators" ? input.geometry.w_allow_m ?? undefined : undefined,
    });
    return pickOverallLimit(dps);
  }, [
    input.geometry,
    input.duration,
    input.endCondition,
    input.planeMode,
    pressureMode,
    input.uncertainty.kdfPreset,
    material,
  ]);

  const depthLimitRecommended = pressureToDepth(
    recommendedLimit.dpLimit_Pa + input.internalPressure_Pa,
    input.rho_kg_m3
  );
  const limitValueRecommended = isExternalPressureMode
    ? depthLimitRecommended
    : PaToAtm(recommendedLimit.dpLimit_Pa);
  const marginValue = limitValueRecommended / marginFactors[input.marginPreset];

  const equivalentStressPerPa = useMemo(() => {
    if (input.geometry.shape === "cylinder") {
      const a = input.geometry.Di_m / 2;
      const b = a + input.geometry.t_m;
      return tubeMaxVonMisesPerPa({ a, b }, input.endCondition, pressureMode);
    }
    if (input.geometry.shape === "plate") {
      const { maxVonMises } = plateMaxStressPerPa({
        a: input.geometry.radius_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      });
      return maxVonMises;
    }
    if (input.geometry.shape === "plate_penetrators") {
      const plateProps = {
        a: input.geometry.radius_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      };
      const { maxVonMises } = plateMaxStressPerPa(plateProps);
      const holes = analyzePlateWithHoles({
        plate: plateProps,
        holeCount: input.geometry.hole_count,
        holeForbid_m: input.geometry.hole_forbid_m,
        kt: input.geometry.hole_kt,
        sigmaAllow_Pa: 1,
      });
      return Math.max(
        maxVonMises,
        holes.worstHole ? holes.worstHole.vmPerPa * input.geometry.hole_kt : 0
      );
    }
    if (input.geometry.shape === "box") {
      const { maxVonMises } = rectPlateMaxStressPerPa({
        a: input.geometry.a_m,
        b: input.geometry.b_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      });
      return maxVonMises;
    }
    if (input.geometry.shape === "dome") {
      const { Rm_m } = deriveDomeGeometry(input.geometry);
      return Rm_m / (2 * input.geometry.t_m);
    }
    return 0;
  }, [input.geometry, input.endCondition, material, pressureMode]);

  const displacementMmAtPressure = useCallback(
    (linearDisplacementPerPa: number, dp_Pa: number) => {
      const amplification = strainAmplificationForStress(
        equivalentStressPerPa * dp_Pa,
        material
      );
      return mToMm(linearDisplacementPerPa * dp_Pa * amplification);
    },
    [equivalentStressPerPa, material]
  );

  const pressureDisplacementData = useMemo(() => {
    const maxPressure = Number.isFinite(recommendedLimit.dpLimit_Pa)
      ? recommendedLimit.dpLimit_Pa * 1.1
      : isExternalPressureMode
        ? depthToPressure(input.depthTarget_m, input.rho_kg_m3)
        : targetPressure_Pa;
    const points = 40;
    const data: { pressure_MPa: number; displacement_mm: number }[] = [];
    if (input.geometry.shape === "cylinder") {
      const perPa = tubeDisplacementPerPa(input.geometry, material, input.planeMode, pressureMode);
      for (let i = 0; i <= points; i += 1) {
        const dp = (maxPressure * i) / points;
        data.push({ pressure_MPa: PaToMPa(dp), displacement_mm: displacementMmAtPressure(perPa, dp) });
      }
      return data;
    }
    if (input.geometry.shape === "plate") {
      const wPerPa = plateDeflectionPerPa({
        a: input.geometry.radius_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      });
      for (let i = 0; i <= points; i += 1) {
        const dp = (maxPressure * i) / points;
        data.push({ pressure_MPa: PaToMPa(dp), displacement_mm: displacementMmAtPressure(wPerPa, dp) });
      }
      return data;
    }
    if (input.geometry.shape === "plate_penetrators") {
      const wPerPa = plateDeflectionPerPa({
        a: input.geometry.radius_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      });
      for (let i = 0; i <= points; i += 1) {
        const dp = (maxPressure * i) / points;
        data.push({ pressure_MPa: PaToMPa(dp), displacement_mm: displacementMmAtPressure(wPerPa, dp) });
      }
      return data;
    }
    if (input.geometry.shape === "box") {
      const wPerPa = rectPlateMaxDeflectionPerPa({
        a: input.geometry.a_m,
        b: input.geometry.b_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      });
      for (let i = 0; i <= points; i += 1) {
        const dp = (maxPressure * i) / points;
        data.push({ pressure_MPa: PaToMPa(dp), displacement_mm: displacementMmAtPressure(wPerPa, dp) });
      }
      return data;
    }
    if (input.geometry.shape === "dome") {
      const perPa = domeDisplacementPerPa(input.geometry, material.elastic.E_GPa * 1e9, material.elastic.nu);
      for (let i = 0; i <= points; i += 1) {
        const dp = (maxPressure * i) / points;
        data.push({ pressure_MPa: PaToMPa(dp), displacement_mm: displacementMmAtPressure(perPa, dp) });
      }
      return data;
    }
    return data;
  }, [
    input.geometry,
    input.depthTarget_m,
    input.rho_kg_m3,
    input.planeMode,
    isExternalPressureMode,
    material,
    displacementMmAtPressure,
    pressureMode,
    recommendedLimit.dpLimit_Pa,
    targetPressure_Pa,
  ]);

  const runMonteCarlo = useCallback(async () => {
    if (!workerRef.current || !input.uncertainty.enabled) return;
    setMcProgress(0);
    const result = await workerRef.current.runMonteCarlo(
      {
        geometry: input.geometry,
        material,
        pressureMode,
        endCondition: input.endCondition,
        planeMode: input.planeMode,
        duration: input.duration,
        rho_kg_m3: input.rho_kg_m3,
        internalPressure_Pa: input.internalPressure_Pa,
        uncertainty: {
          enabled: input.uncertainty.enabled,
          t_tol_m: input.uncertainty.t_tol_m,
          d_tol_m: input.uncertainty.d_tol_m,
          E_var_pct: input.uncertainty.E_var_pct,
          sigma_var_pct: input.uncertainty.sigma_var_pct,
          kdfPreset: input.uncertainty.kdfPreset,
          gamma_ln_sigma: input.uncertainty.gamma_ln_sigma,
        },
        samples: input.uncertainty.samples,
      },
      Comlink.proxy((progress: number) => setMcProgress(progress))
    );
    setMcResult(result);
  }, [input, material, pressureMode]);

  const runThicknessSweep = useCallback(async () => {
    if (!workerRef.current) return;
    setSweepProgress(0);
    const result = await workerRef.current.runThicknessSweep(
      {
        geometry: input.geometry,
        material,
        pressureMode,
        endCondition: input.endCondition,
        planeMode: input.planeMode,
        duration: input.duration,
        rho_kg_m3: input.rho_kg_m3,
        internalPressure_Pa: input.internalPressure_Pa,
        targetPressure_Pa,
        t_min_m: 0.002,
        t_max_m: 0.02,
        coarseStep_m: 0.0005,
        fineStep_m: 0.00005,
        targetDepth_m: input.depthTarget_m,
        uncertainty: {
          enabled: input.uncertainty.enabled,
          t_tol_m: input.uncertainty.t_tol_m,
          d_tol_m: input.uncertainty.d_tol_m,
          E_var_pct: input.uncertainty.E_var_pct,
          sigma_var_pct: input.uncertainty.sigma_var_pct,
          kdfPreset: input.uncertainty.kdfPreset,
          gamma_ln_sigma: input.uncertainty.gamma_ln_sigma,
          samplesP50: 200,
          samplesP5: 2000,
        },
      },
      Comlink.proxy((progress: number) => setSweepProgress(progress))
    );
    setSweepResult(result);
  }, [input, material, pressureMode, targetPressure_Pa]);

  useEffect(() => {
    if (!input.autoRun) return;
    const timer = setTimeout(() => {
      runMonteCarlo();
      runThicknessSweep();
    }, 450);
    return () => clearTimeout(timer);
  }, [input, runMonteCarlo, runThicknessSweep]);

  useEffect(() => {
    if (!input.autoRun) {
      setMcResult(null);
      setSweepResult(null);
    }
  }, [input.autoRun]);

  const recommendedValue = useMemo(() => {
    if (input.uncertainty.enabled && mcResult?.pfCurve) {
      const candidate = [...mcResult.pfCurve].reverse().find((p) => p.pf <= input.pfTarget);
      return candidate ? (isExternalPressureMode ? candidate.value : MPaToAtm(candidate.value)) : marginValue;
    }
    return marginValue;
  }, [mcResult, input.uncertainty.enabled, input.pfTarget, isExternalPressureMode, marginValue]);

  useEffect(() => {
    if (!input.uncertainty.enabled) {
      setMcResult(null);
    }
  }, [input.uncertainty.enabled]);

  const histogramData = useMemo(() => {
    if (!mcResult) return [];
    return histogramFromSamples(
      mcResult.dpLimits,
      pressureMode,
      input.rho_kg_m3,
      input.internalPressure_Pa
    );
  }, [mcResult, pressureMode, input.rho_kg_m3, input.internalPressure_Pa]);

  const thicknessData = useMemo(() => {
    if (!sweepResult) return [];
    return sweepResult.points.map((point) => ({
      t_mm: mToMm(point.t_m),
      limitValue: isExternalPressureMode ? point.limitValue : MPaToAtm(point.limitValue),
      p50: point.p50 === undefined || isExternalPressureMode ? point.p50 : MPaToAtm(point.p50),
      p5: point.p5 === undefined || isExternalPressureMode ? point.p5 : MPaToAtm(point.p5),
    }));
  }, [sweepResult, isExternalPressureMode]);

  const copy = translations[locale];
  const loadCopy = pressureModeCopy[locale] ?? pressureModeCopy.en!;
  const failureModeDetails = failureModeDetailCopy[locale] ?? failureModeDetailCopy.en!;
  const modeLabels = copy.modeLabels as Record<Mode, string>;
  const baseModeReasons = copy.modeReasons as Record<Mode, string>;
  const baseModeDescriptions = copy.modeDescriptions as Record<Mode, string>;
  const modeReasons: Record<Mode, string> = isExternalPressureMode
    ? baseModeReasons
    : {
        ...baseModeReasons,
        tube_yield:
          locale === "ja"
            ? "内圧による引張の周方向応力が許容値に到達します。"
            : "Internal-pressure tensile hoop stress reaches allowable first.",
        plate_stress:
          locale === "ja"
            ? "板表面の曲げ引張応力が許容値に到達します。"
            : "Plate surface tensile bending stress reaches allowable first.",
        plate_hole_stress:
          locale === "ja"
            ? "穴まわりのピーク引張応力が許容値に到達します。"
            : "Peak tensile stress around a hole reaches allowable first.",
        panel_stress:
          locale === "ja"
            ? "パネルの曲げ引張応力が最初の限界です。"
            : "Panel tensile bending stress is the first limit.",
        dome_yield:
          locale === "ja"
            ? "ドームの膜引張応力が許容値に到達します。"
            : "Dome membrane tensile stress reaches allowable first.",
      };
  const modeDescriptions: Record<Mode, string> = isExternalPressureMode
    ? baseModeDescriptions
    : {
        ...baseModeDescriptions,
        tube_yield:
          locale === "ja"
            ? "円筒壁が引張側で降伏し、径方向に膨らむ永久変形や漏れにつながります。"
            : "The cylindrical wall yields in tension, causing permanent expansion and possible leakage.",
        plate_stress:
          locale === "ja"
            ? "板の表裏どちらかの面で曲げ引張応力が許容を超え、塑性化や割れが進みます。"
            : "Tensile bending stress on a plate face exceeds allowable, driving yielding or cracking.",
        plate_hole_stress:
          locale === "ja"
            ? "穴縁の局所引張応力が支配し、き裂やシール面損傷の起点になります。"
            : "Local tensile stress at the hole edge governs and can initiate cracks or seal damage.",
        panel_stress:
          locale === "ja"
            ? "箱パネルの曲げ引張応力が支配し、角や固定端から塑性化/割れが進みます。"
            : "Tensile panel bending governs, often starting at edges or corners.",
        dome_yield:
          locale === "ja"
            ? "ドームの膜応力が引張側で限界に達し、膨らみや塑性変形が進みます。"
            : "Dome membrane stress reaches the tensile limit, causing expansion or plastic deformation.",
      };
  const dpLimitRecommended_MPa = PaToMPa(recommendedLimit.dpLimit_Pa);
  const resultUnit = isExternalPressureMode ? "m" : "atm";
  const valueLabel = isExternalPressureMode ? copy.charts.depthLabel : loadCopy.limitPressureLabel;
  const valueUnit = isExternalPressureMode ? "m" : "atm";
  const targetValue = isExternalPressureMode ? input.depthTarget_m : PaToAtm(targetPressure_Pa);
  const formatPressurePair = (atm: number) => `${atm.toFixed(1)} atm (${(atm / MPaToAtm(1)).toFixed(3)} MPa)`;

  const modeShareData = useMemo(() => {
    if (!mcResult) return [];
    return modeShareToChart(mcResult.modeShare, modeLabels);
  }, [mcResult, modeLabels]);

  const pfCurveData = useMemo(() => {
    if (!mcResult?.pfCurve) return [];
    if (isExternalPressureMode) return mcResult.pfCurve;
    return mcResult.pfCurve.map((point) => ({
      ...point,
      value: MPaToAtm(point.value),
    }));
  }, [mcResult, isExternalPressureMode]);

  const modeShareRanking = useMemo(() => {
    return [...modeShareData].sort((a, b) => b.value - a.value);
  }, [modeShareData]);

  const displacementPerPa = useMemo(() => {
    if (input.geometry.shape === "cylinder") {
      return tubeDisplacementPerPa(input.geometry, material, input.planeMode, pressureMode);
    }
    if (input.geometry.shape === "plate") {
      return plateDeflectionPerPa({
        a: input.geometry.radius_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      });
    }
    if (input.geometry.shape === "plate_penetrators") {
      return plateDeflectionPerPa({
        a: input.geometry.radius_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      });
    }
    if (input.geometry.shape === "box") {
      return rectPlateMaxDeflectionPerPa({
        a: input.geometry.a_m,
        b: input.geometry.b_m,
        t: input.geometry.t_m,
        E_Pa: material.elastic.E_GPa * 1e9,
        nu: material.elastic.nu,
      });
    }
    if (input.geometry.shape === "dome") {
      return domeDisplacementPerPa(
        input.geometry,
        material.elastic.E_GPa * 1e9,
        material.elastic.nu
      );
    }
    return null;
  }, [input.geometry, input.planeMode, material, pressureMode]);

  const displacementAtLimit_mm = useMemo(() => {
    if (!displacementPerPa || !Number.isFinite(recommendedLimit.dpLimit_Pa)) return null;
    return displacementMmAtPressure(displacementPerPa, recommendedLimit.dpLimit_Pa);
  }, [displacementMmAtPressure, displacementPerPa, recommendedLimit.dpLimit_Pa]);

  const targetDp_Pa = Math.max(
    isExternalPressureMode
      ? depthToPressure(input.depthTarget_m, input.rho_kg_m3) - input.internalPressure_Pa
      : targetPressure_Pa,
    0
  );

  const displacementAtTarget_mm = useMemo(() => {
    if (!displacementPerPa || !Number.isFinite(targetDp_Pa)) return null;
    return displacementMmAtPressure(displacementPerPa, targetDp_Pa);
  }, [displacementMmAtPressure, displacementPerPa, targetDp_Pa]);

  const displacementPerMPa_mm = useMemo(() => {
    if (!displacementPerPa) return null;
    return mToMm(displacementPerPa * 1e6);
  }, [displacementPerPa]);

  const currentThickness_m = useMemo(() => {
    if (input.geometry.shape === "cylinder") return input.geometry.t_m;
    if (input.geometry.shape === "plate") return input.geometry.t_m;
    if (input.geometry.shape === "plate_penetrators") return input.geometry.t_m;
    if (input.geometry.shape === "box") return input.geometry.t_m;
    if (input.geometry.shape === "dome") return input.geometry.t_m;
    return 0;
  }, [input.geometry]);

  const currentThicknessPoint = useMemo(() => {
    if (!sweepResult) return null;
    return sweepResult.points.reduce((closest, point) => {
      if (!closest) return point;
      return Math.abs(point.t_m - currentThickness_m) < Math.abs(closest.t_m - currentThickness_m)
        ? point
        : closest;
    }, null as ThicknessSweepOutput["points"][number] | null);
  }, [sweepResult, currentThickness_m]);

  const holeAnalysis = useMemo(() => {
    if (input.geometry.shape !== "plate_penetrators") return null;
    const sigmaAllow_Pa =
      (isExternalPressureMode
        ? pickSigmaAllow(material, input.duration)
        : pickTensileSigmaAllow(material, input.duration)) * 1e6;
    const Eeff_Pa = material.elastic.E_GPa * 1e9 * creepEfactor(material, input.duration);
    return analyzePlateWithHoles({
      plate: {
        a: input.geometry.radius_m,
        t: input.geometry.t_m,
        E_Pa: Eeff_Pa,
        nu: material.elastic.nu,
      },
      holeCount: input.geometry.hole_count,
      holeForbid_m: input.geometry.hole_forbid_m,
      kt: input.geometry.hole_kt,
      sigmaAllow_Pa,
    });
  }, [input.geometry, material, input.duration, isExternalPressureMode]);

  const holeAreaRatio = useMemo(() => {
    if (input.geometry.shape !== "plate_penetrators") return null;
    const plateArea = Math.PI * input.geometry.radius_m ** 2;
    const holeArea = Math.PI * (input.geometry.hole_d_m / 2) ** 2;
    return (holeArea * input.geometry.hole_count) / Math.max(plateArea, 1e-9);
  }, [input.geometry]);

  const holeLayoutFits = holeAnalysis?.layout.fits ?? true;
  const holeAreaRatioPct = holeAreaRatio !== null ? holeAreaRatio * 100 : null;
  const holeAreaWarning =
    holeAreaRatio !== null && holeAreaRatio > 0.25;

  const distributionStats = useMemo(() => {
    if (!mcResult) return null;
    if (!isExternalPressureMode) {
      return {
        p5: PaToAtm(mcResult.stats.p5),
        p50: PaToAtm(mcResult.stats.p50),
        p95: PaToAtm(mcResult.stats.p95),
      };
    }
    return {
      p5: pressureToDepth(mcResult.stats.p5 + input.internalPressure_Pa, input.rho_kg_m3),
      p50: pressureToDepth(mcResult.stats.p50 + input.internalPressure_Pa, input.rho_kg_m3),
      p95: pressureToDepth(mcResult.stats.p95 + input.internalPressure_Pa, input.rho_kg_m3),
    };
  }, [mcResult, isExternalPressureMode, input.internalPressure_Pa, input.rho_kg_m3]);

  const pfValueTarget = useMemo(() => {
    if (!mcResult?.pfCurve) return null;
    const candidate = [...mcResult.pfCurve].reverse().find((point) => point.pf <= input.pfTarget);
    if (!candidate) return null;
    return isExternalPressureMode ? candidate.value : MPaToAtm(candidate.value);
  }, [mcResult, input.pfTarget, isExternalPressureMode]);

  const pfValue50 = useMemo(() => {
    if (!mcResult?.pfCurve) return null;
    const sorted = [...mcResult.pfCurve].sort((a, b) => a.pf - b.pf);
    const match = sorted.find((point) => point.pf >= 0.5);
    const value = match?.value ?? sorted[sorted.length - 1]?.value;
    if (value === undefined) return null;
    return isExternalPressureMode ? value : MPaToAtm(value);
  }, [mcResult, isExternalPressureMode]);

  const toggleChart = (key: string) => {
    setOpenCharts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShareUrl = async () => {
    if (typeof window === "undefined") return;
    const state = {
      input,
      materialId,
      materialOverrides,
      locale,
    };
    const url = new URL(window.location.href);
    url.searchParams.set("state", encodeShareState(state));
    try {
      await navigator.clipboard.writeText(url.toString());
      toast.success(copy.shareCopied);
    } catch {
      toast.error(copy.shareFailed);
    }
  };

  const modeCandidates = useMemo<Mode[]>(() => {
    if (input.geometry.shape === "cylinder") {
      if (!isExternalPressureMode) {
        return input.geometry.hasPlate
          ? ["tube_yield", "plate_stress", "plate_deflection"]
          : ["tube_yield"];
      }
      return input.geometry.hasPlate
        ? ["tube_yield", "tube_buckling", "plate_stress", "plate_deflection"]
        : ["tube_yield", "tube_buckling"];
    }
    if (input.geometry.shape === "plate") {
      return ["plate_stress", "plate_deflection"];
    }
    if (input.geometry.shape === "plate_penetrators") {
      return ["plate_stress", "plate_deflection", "plate_hole_stress"];
    }
    if (input.geometry.shape === "box") {
      return ["panel_stress", "panel_deflection"];
    }
    return isExternalPressureMode ? ["dome_buckling", "dome_yield"] : ["dome_yield"];
  }, [input.geometry, isExternalPressureMode]);

  const modeLimitRows = useMemo(() => {
    return modeCandidates
      .map((mode) => {
        const dp = recommendedLimit.details[mode];
        if (!Number.isFinite(dp) || dp <= 0) return null;
        const value = isExternalPressureMode
          ? pressureToDepth(dp + input.internalPressure_Pa, input.rho_kg_m3)
          : PaToAtm(dp);
        return {
          mode,
          value,
          dp_MPa: PaToMPa(dp),
        };
      })
      .filter((row): row is { mode: Mode; value: number; dp_MPa: number } => Boolean(row))
      .sort((a, b) => a.value - b.value);
  }, [
    modeCandidates,
    recommendedLimit.details,
    isExternalPressureMode,
    input.internalPressure_Pa,
    input.rho_kg_m3,
  ]);

  const explanationTokens = {
    depth: recommendedValue.toFixed(1),
    value: recommendedValue.toFixed(1),
    limitDepth: depthLimitRecommended.toFixed(1),
    limitValue: limitValueRecommended.toFixed(1),
    valueMpa: (recommendedValue / MPaToAtm(1)).toFixed(3),
    limitValueMpa: (limitValueRecommended / MPaToAtm(1)).toFixed(3),
    dp: dpLimitRecommended_MPa.toFixed(2),
    margin: String(marginFactors[input.marginPreset]),
    pf: (input.pfTarget * 100).toFixed(2),
    mode: modeLabels[recommendedLimit.mode],
  };

  const explanationTeaser = interpolate(
    isExternalPressureMode ? copy.results.recommendedExplainTeaser : loadCopy.recommendedTeaser,
    explanationTokens
  );
  const explanationIntro = interpolate(
    isExternalPressureMode ? copy.results.recommendedExplainIntro : loadCopy.recommendedIntro,
    explanationTokens
  );
  const explanationMethod = input.uncertainty.enabled
    ? interpolate(
        isExternalPressureMode ? copy.results.recommendedExplainMethodPf : loadCopy.recommendedMethodPf,
        explanationTokens
      )
    : interpolate(
        isExternalPressureMode ? copy.results.recommendedExplainMethodMargin : loadCopy.recommendedMethodMargin,
        explanationTokens
      );

  const pressureDisplacementTokens = {
    dp: dpLimitRecommended_MPa.toFixed(2),
    disp: formatValue(displacementAtLimit_mm, 2),
    per: formatValue(displacementPerMPa_mm, 2),
    targetDepth: formatValue(input.depthTarget_m, 0),
    targetDp: formatValue(PaToMPa(targetDp_Pa), 2),
    targetPressureAtm: formatValue(PaToAtm(targetDp_Pa), 1),
    targetPressureMpa: formatValue(PaToMPa(targetDp_Pa), 3),
    targetDisp: formatValue(displacementAtTarget_mm, 2),
  };

  const thicknessTokens = {
    t: formatValue(mToMm(currentThickness_m), 2),
    limitDepth: formatValue(
      currentThicknessPoint
        ? isExternalPressureMode
          ? currentThicknessPoint.limitValue
          : MPaToAtm(currentThicknessPoint.limitValue)
        : null,
      isExternalPressureMode ? 1 : 1
    ),
    p50: formatValue(
      currentThicknessPoint?.p50 === undefined
        ? null
        : isExternalPressureMode
          ? currentThicknessPoint.p50
          : MPaToAtm(currentThicknessPoint.p50),
      isExternalPressureMode ? 1 : 1
    ),
    p5: formatValue(
      currentThicknessPoint?.p5 === undefined
        ? null
        : isExternalPressureMode
          ? currentThicknessPoint.p5
          : MPaToAtm(currentThicknessPoint.p5),
      isExternalPressureMode ? 1 : 1
    ),
    targetDepth: formatValue(input.depthTarget_m, 0),
    target: formatValue(targetValue, isExternalPressureMode ? 0 : 1),
    requiredT: formatValue(sweepResult?.requiredThickness_m ? mToMm(sweepResult.requiredThickness_m) : null, 2),
  };

  const distributionTokens = {
    p5: formatValue(distributionStats?.p5 ?? null, 1),
    p50: formatValue(distributionStats?.p50 ?? null, 1),
    p95: formatValue(distributionStats?.p95 ?? null, 1),
    samples: input.uncertainty.enabled ? String(input.uncertainty.samples) : "--",
    recommended: recommendedValue.toFixed(isExternalPressureMode ? 1 : 1),
  };

  const failureTokens = {
    pf: (input.pfTarget * 100).toFixed(2),
    pfDepth: formatValue(pfValueTarget ?? null, isExternalPressureMode ? 1 : 2),
    pf50: formatValue(pfValue50 ?? null, isExternalPressureMode ? 1 : 2),
  };

  const modeShareTokens = {
    mode1: modeShareRanking[0] ? modeShareRanking[0].mode : "--",
    share1: modeShareRanking[0] ? modeShareRanking[0].value.toFixed(1) : "--",
    mode2: modeShareRanking[1] ? modeShareRanking[1].mode : "--",
    share2: modeShareRanking[1] ? modeShareRanking[1].value.toFixed(1) : "--",
  };

  const pressureDisplacementExplainBody = (
    isExternalPressureMode
      ? copy.charts.pressureDisplacementExplainBody
      : locale === "ja"
        ? [
            "このグラフは内圧ゲージ圧と変位の関係です。0.2%耐力付近では、選択材料のRamberg-Osgood近似により弾性直線より変位が大きくなります。",
            "推奨限界での変位は {disp} mm。目標内圧 {targetPressureAtm} 気圧（{targetPressureMpa} MPa）では {targetDisp} mm です。",
            "変位が大きいと、破裂/降伏前にシールや内部部品の機能不全が起きる可能性があります。",
          ]
        : [
            "This chart plots internal gauge pressure against deformation. Near the proof stress, the selected material's Ramberg-Osgood curve increases displacement from the elastic line.",
            "At the recommended limit, the predicted displacement is {disp} mm. At the target pressure {targetPressureAtm} atm ({targetPressureMpa} MPa), the displacement is {targetDisp} mm.",
            "If displacement is large, seals, clearances, or internal components may fail before burst/yield.",
          ]
  ).map((line) => interpolate(line, pressureDisplacementTokens));
  const pressureDisplacementExplainBullets = (
    isExternalPressureMode
      ? copy.charts.pressureDisplacementExplainBullets
      : locale === "ja"
        ? [
            "内圧では円筒壁に引張の周方向応力が生じます。",
            "同じ圧力でも、円筒・板・ドームで変位の出方は大きく異なります。",
            "この曲線は破裂、漏れ、塑性変形が始まる前までの目安です。",
          ]
        : [
            "Internal pressure loads the wall in tensile hoop stress.",
            "Different shapes show different displacement sensitivities at the same pressure.",
            "Use this curve only before rupture, leakage, or plastic deformation begins.",
          ]
  ).map((line) => interpolate(line, pressureDisplacementTokens));

  const thicknessExplainBody = (
    isExternalPressureMode
      ? copy.charts.thicknessSweepExplainBody
      : locale === "ja"
        ? [
            "横軸は厚み、縦軸は内圧限界です。理論限界はばらつき無し、P50/P5はばらつき込みの中央値/下側5%です。",
            "目標内圧 {target} 気圧を満たす必要厚みの目安は {requiredT} mm です。",
            "曲線が急な領域は、少しの厚み誤差で限界圧力が大きく変わります。",
          ]
        : [
            "The horizontal axis is thickness, the vertical axis is internal pressure limit. Theoretical limit is deterministic; P50/P5 include uncertainty.",
            "The estimated thickness to reach target pressure {target} atm is {requiredT} mm.",
            "Where the curve is steep, small thickness errors cause large changes in pressure limit.",
          ]
  ).map((line) => interpolate(line, thicknessTokens));
  const thicknessExplainBullets = (
    isExternalPressureMode
      ? copy.charts.thicknessSweepExplainBullets
      : locale === "ja"
        ? [
            "P5を見れば保守的な耐圧試験目標の目安になります。",
            "厚みを増やしても効果が小さい場合は、径を小さくするか強い材料を検討します。",
            "穴のKtや局所形状は、実際の内圧破壊を支配することがあります。",
          ]
        : [
            "Use P5 for a conservative proof-pressure target.",
            "If thickness gives little gain, consider a smaller diameter or stronger material.",
            "Hole Kt and local features can dominate real internal-pressure failures.",
          ]
  ).map((line) => interpolate(line, thicknessTokens));

  const distributionExplainBody = input.uncertainty.enabled && mcResult
    ? (isExternalPressureMode
        ? copy.charts.distributionExplainBody
        : locale === "ja"
          ? [
              "厚み・径・引張強度のばらつきを与えた多数サンプルの内圧限界を並べたヒストグラムです。",
              "P50は中央値、P5は保守側の下限目安です。",
              "推奨内圧 {recommended} 気圧は、この分布の安全側に位置するように設定されています。",
            ]
          : [
              "This histogram shows the spread of internal pressure limits across randomized samples of thickness, diameter, and tensile strength.",
              "P50 is the median limit, and P5 is a conservative lower bound.",
              "The recommended pressure {recommended} atm is positioned on the safer side of this spread.",
            ]
      ).map((line) => interpolate(line, distributionTokens))
    : [copy.charts.distributionExplainUnavailable];
  const distributionExplainBullets = input.uncertainty.enabled && mcResult
    ? (isExternalPressureMode
        ? copy.charts.distributionExplainBullets
        : locale === "ja"
          ? [
              "P5-P95の幅が狭いほど再現性が高い。",
              "分布が低圧側へ寄る場合は厚みや材料許容値の見直しが必要です。",
              "ばらつきOFFでは分布は計算されません。",
            ]
          : [
              "Narrow P5-P95 range means more consistent performance.",
              "If the distribution shifts low, adjust thickness or material allowables.",
              "No distribution is computed when uncertainty is OFF.",
            ]
      ).map((line) => interpolate(line, distributionTokens))
    : [];

  const failureExplainBody = input.uncertainty.enabled && mcResult
    ? (isExternalPressureMode
        ? copy.charts.failureProbabilityExplainBody
        : locale === "ja"
          ? [
              "横軸が内圧、縦軸が故障確率です。圧力が上がるほど壊れる確率が増えます。",
              "目標とする故障確率 {pf}% を満たす内圧が {pfDepth} 気圧で、ここが推奨内圧の基準になります。",
              "50%の点は半分が壊れる内圧で、分布の中心を表します。",
            ]
          : [
              "The horizontal axis is internal pressure, the vertical axis is failure probability. It increases as pressure rises.",
              "The target failure probability {pf}% is met at {pfDepth} atm; this is the basis for the recommended pressure.",
              "The 50% point is the median failure pressure and aligns with the center of the distribution.",
            ]
      ).map((line) => interpolate(line, failureTokens))
    : [copy.charts.failureProbabilityExplainUnavailable];
  const failureExplainBullets = input.uncertainty.enabled && mcResult
    ? (isExternalPressureMode
        ? copy.charts.failureProbabilityExplainBullets
        : locale === "ja"
          ? [
              "故障確率は設計のリスク許容度に直結します。",
              "ばらつきOFFでは曲線は計算されません。",
              "重要用途の耐圧試験は、必ず安全な遮蔽と手順で行ってください。",
            ]
          : [
              "Failure probability encodes your risk tolerance.",
              "No curve is computed when uncertainty is OFF.",
              "Proof-test critical hardware with controlled safety shielding.",
            ]
      ).map((line) => interpolate(line, failureTokens))
    : [];

  const modeShareExplainBody = input.uncertainty.enabled && mcResult
    ? (isExternalPressureMode
        ? copy.charts.modeShareExplainBody
        : locale === "ja"
          ? [
              "ばらつきサンプルがどの内圧故障モードで破壊したかの割合です。",
              "割合が高いモードほど、内圧設計の弱点として優先的に対策すべきです。",
              "厚み、径、穴のKt、材料許容値の変更で、支配モードが切り替わることがあります。",
            ]
          : [
              "This chart shows which internal-pressure failure mode occurred across uncertainty samples.",
              "A higher share means that mode is the internal-pressure design bottleneck to address first.",
              "Thickness, diameter, hole Kt, and material allowables can shift the dominant mode.",
            ]
      ).map((line) => interpolate(line, modeShareTokens))
    : [copy.charts.modeShareExplainUnavailable];
  const modeShareExplainBullets = input.uncertainty.enabled && mcResult
    ? (isExternalPressureMode
        ? copy.charts.modeShareExplainBullets
        : locale === "ja"
          ? [
              "引張降伏対策は厚み増、径の縮小、材料許容値の向上。",
              "穴支配ならKt低減、穴径/配置、局所補強を見直します。",
              "割合はばらつき込みの傾向で、確定的な破壊順序ではありません。",
            ]
          : [
              "Tensile-yield countermeasures: add thickness, reduce diameter, or raise allowable stress.",
              "If holes govern, reduce Kt, revise hole diameter/layout, or add local reinforcement.",
              "Shares reflect uncertainty-driven outcomes, not deterministic failure order.",
            ]
      ).map((line) => interpolate(line, modeShareTokens))
    : [];

  return (
    <div className="relative min-h-screen px-4 pb-8 pt-4 md:px-6">
      <Toaster />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute right-10 top-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>
      <header className="relative mb-4 flex flex-col gap-3 rounded-3xl border border-border bg-white/75 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/robozero-tools-s.png"
              alt="Robozero Tools"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.appName}</p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-semibold text-slate-900 md:text-3xl">
                  {copy.appTitle}
                </h1>
                <span className="rounded-full border border-border/60 bg-white/70 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {copy.appAlphaTag}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{copy.appSubtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-border bg-white/80 px-2 py-1 shadow-sm">
              {localeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-label={`Switch language to ${option.label}`}
                  onClick={() => setLocale(option.value)}
                  className={`h-8 min-w-9 rounded-lg px-2 text-xs font-medium transition ${
                    locale === option.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Select
              value={input.mode}
              onValueChange={(value) => setInput((prev) => ({ ...prev, mode: value as InputState["mode"] }))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{copy.modeBeginner}</SelectItem>
                <SelectItem value="pro">{copy.modePro}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={input.units}
              onValueChange={(value) => setInput((prev) => ({ ...prev, units: value as InputState["units"] }))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">{copy.unitsMetric}</SelectItem>
                <SelectItem value="si">{copy.unitsSI}</SelectItem>
              </SelectContent>
            </Select>
            <AssumptionsSheet material={material} copy={copy.assumptions} />
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)_340px]">
        <aside className="order-2 space-y-3 lg:order-1">
          <Card className="border border-border bg-white/80">
            <CardHeader>
              <CardTitle className="text-sm">{copy.inputsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-white/70 p-1">
                {(["external", "internal"] as PressureMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setInput((prev) => ({ ...prev, pressureMode: mode }))}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      pressureMode === mode
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {mode === "external" ? loadCopy.external : loadCopy.internal}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {copy.geometrySection}
                  </p>
                  <button
                    type="button"
                    onClick={handleShareUrl}
                    className="rounded-full border border-border/70 bg-white/70 px-3 py-1 text-[11px] font-medium text-slate-600 transition hover:border-primary/50 hover:text-primary"
                  >
                    {copy.shareUrl}
                  </button>
                </div>
                <GeometryTab
                  shape={input.shape}
                  geometry={input.geometry}
                  endCondition={input.endCondition}
                  planeMode={input.planeMode}
                  pressureMode={pressureMode}
                  mode={input.mode}
                  holeLayoutFits={holeLayoutFits}
                  copy={copy.geometry}
                  onShapeChange={(shape) =>
                    setInput((prev) => ({
                      ...prev,
                      shape,
                      geometry: makeDefaultGeometry(shape),
                    }))
                  }
                  onGeometryChange={(geom) => setInput((prev) => ({ ...prev, geometry: geom }))}
                  onEndConditionChange={(value) => setInput((prev) => ({ ...prev, endCondition: value }))}
                  onPlaneModeChange={(value) => setInput((prev) => ({ ...prev, planeMode: value }))}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {copy.materialSection}
                </p>
                <MaterialTab
                  materials={materials}
                  selectedId={materialId}
                  onSelect={setMaterialId}
                  overrides={materialOverrides}
                  onOverridesChange={setMaterialOverrides}
                  duration={input.duration}
                  onDurationChange={(duration) => setInput((prev) => ({ ...prev, duration }))}
                  mode={input.mode}
                  locale={locale}
                  copy={copy.material}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {isExternalPressureMode ? loadCopy.sectionExternal : loadCopy.sectionInternal}
                </p>
                <WaterTab
                  pressureMode={pressureMode}
                  water={input.water}
                  rho_kg_m3={input.rho_kg_m3}
                  internalPressure_Pa={input.internalPressure_Pa}
                  targetPressure_Pa={targetPressure_Pa}
                  targetDepth_m={input.depthTarget_m}
                  onWaterChange={(water) =>
                    setInput((prev) => ({
                      ...prev,
                      water,
                      rho_kg_m3: water === "freshwater" ? waterDensity.freshwater : waterDensity.seawater,
                    }))
                  }
                  onRhoChange={(rho) => setInput((prev) => ({ ...prev, rho_kg_m3: rho }))}
                  onInternalPressureChange={(pa) => setInput((prev) => ({ ...prev, internalPressure_Pa: pa }))}
                  onTargetPressureChange={(pa) => setInput((prev) => ({ ...prev, targetPressure_Pa: pa }))}
                  onTargetDepthChange={(depth) => setInput((prev) => ({ ...prev, depthTarget_m: depth }))}
                  copy={{
                    ...copy.water,
                    targetPressure: loadCopy.targetPressure,
                    targetPressureHint: loadCopy.targetPressureHint,
                    internalModeNote: loadCopy.internalModeNote,
                  }}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {copy.uncertaintySection}
                </p>
                <UncertaintyTab
                  enabled={input.uncertainty.enabled}
                  t_tol_mm={mToMm(input.uncertainty.t_tol_m)}
                  d_tol_mm={mToMm(input.uncertainty.d_tol_m)}
                  E_var_pct={input.uncertainty.E_var_pct}
                  sigma_var_pct={input.uncertainty.sigma_var_pct}
                  kdfPreset={input.uncertainty.kdfPreset}
                  samples={input.uncertainty.samples}
                  pfTarget={input.pfTarget}
                  showKdf={isExternalPressureMode}
                  copy={copy.uncertainty}
                  onChange={(next) =>
                    setInput((prev) => ({
                      ...prev,
                      pfTarget: next.pfTarget ?? prev.pfTarget,
                      uncertainty: {
                        ...prev.uncertainty,
                        enabled: next.enabled ?? prev.uncertainty.enabled,
                        t_tol_m: next.t_tol_mm !== undefined ? mmToM(next.t_tol_mm) : prev.uncertainty.t_tol_m,
                        d_tol_m: next.d_tol_mm !== undefined ? mmToM(next.d_tol_mm) : prev.uncertainty.d_tol_m,
                        E_var_pct: next.E_var_pct ?? prev.uncertainty.E_var_pct,
                        sigma_var_pct: next.sigma_var_pct ?? prev.uncertainty.sigma_var_pct,
                        kdfPreset: next.kdfPreset ?? prev.uncertainty.kdfPreset,
                        samples: next.samples ?? prev.uncertainty.samples,
                      },
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {copy.presetsSection}
                </p>
                <PresetsTab
                  presets={presets}
                  materials={materials}
                  copy={copy.presets}
                  onApply={(preset, geometry) => {
                    setInput((prev) => ({
                      ...prev,
                      shape: preset.shape,
                      geometry,
                      water: preset.water,
                      rho_kg_m3: preset.water === "freshwater" ? waterDensity.freshwater : waterDensity.seawater,
                      internalPressure_Pa: preset.internalPressure_kPa * 1000,
                      duration: preset.duration,
                      uncertainty: {
                        ...prev.uncertainty,
                        enabled: preset.uncertainty.enabled,
                        t_tol_m: mmToM(preset.uncertainty.t_tol_mm),
                        d_tol_m: mmToM(preset.uncertainty.d_tol_mm),
                        E_var_pct: preset.uncertainty.E_var_pct,
                        sigma_var_pct: preset.uncertainty.sigma_var_pct,
                        kdfPreset: preset.uncertainty.kdfPreset,
                        samples: preset.uncertainty.samples,
                      },
                    }));
                    setMaterialId(preset.materialId);
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <div className="sr-only">
            {copy.runNow}
          </div>
        </aside>

        <main className="order-1 space-y-4 lg:order-2">
          <div className="rounded-3xl border border-border bg-white/80 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{copy.viewer.kicker}</p>
                <h2 className="font-display text-lg font-semibold">{copy.viewer.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{copy.viewer.dimensions}</span>
                  <Switch checked={showDimensions} onCheckedChange={setShowDimensions} />
                </div>
              </div>
            </div>
            <PressureCaseViewer
              geometry={input.geometry}
              showDimensions={showDimensions}
              holeAnalysis={holeLayoutFits ? holeAnalysis ?? undefined : undefined}
            />
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              {input.geometry.shape === "cylinder" && (
                <>
                  <div>Di: {mToMm(input.geometry.Di_m).toFixed(1)} mm</div>
                  <div>t: {mToMm(input.geometry.t_m).toFixed(1)} mm</div>
                  <div>L: {mToMm(input.geometry.L_m).toFixed(0)} mm</div>
                </>
              )}
              {input.geometry.shape === "plate" && (
                <>
                  <div>a: {mToMm(input.geometry.radius_m).toFixed(0)} mm</div>
                  <div>t: {mToMm(input.geometry.t_m).toFixed(1)} mm</div>
                  <div>{copy.viewer.boundaryClamped}</div>
                </>
              )}
              {input.geometry.shape === "plate_penetrators" && (
                <>
                  <div>a: {mToMm(input.geometry.radius_m).toFixed(0)} mm</div>
                  <div>t: {mToMm(input.geometry.t_m).toFixed(1)} mm</div>
                  <div>N: {input.geometry.hole_count}</div>
                </>
              )}
              {input.geometry.shape === "box" && (
                <>
                  <div>a: {mToMm(input.geometry.a_m).toFixed(0)} mm</div>
                  <div>b: {mToMm(input.geometry.b_m).toFixed(0)} mm</div>
                  <div>t: {mToMm(input.geometry.t_m).toFixed(1)} mm</div>
                </>
              )}
              {input.geometry.shape === "dome" && (
                <>
                  <div>Di: {mToMm(input.geometry.Di_m).toFixed(0)} mm</div>
                  <div>t: {mToMm(input.geometry.t_m).toFixed(1)} mm</div>
                  <div>h: {mToMm(deriveDomeGeometry(input.geometry).h_m).toFixed(0)} mm</div>
                </>
              )}
            </div>
          </div>

          {input.geometry.shape === "plate_penetrators" && holeAnalysis && (
            <div className="space-y-2">
              <HoleMapChart
                title={copy.charts.holeMap}
                description={copy.charts.holeMapNote}
                radius_m={input.geometry.radius_m}
                hole_d_m={input.geometry.hole_d_m}
                holes={holeAnalysis.holes}
                worstHole={holeAnalysis.worstHole}
                warning={holeLayoutFits ? undefined : copy.geometry.platePenetratorLayoutError}
              />
              <ChartExplanation
                title={copy.charts.holeMapExplainTitle}
                teaser={copy.charts.holeMapExplainTeaser}
                open={Boolean(openCharts.holeMap)}
                onToggle={() => toggleChart("holeMap")}
                buttonLabel={Boolean(openCharts.holeMap) ? copy.charts.explainLess : copy.charts.explainMore}
              >
                {copy.charts.holeMapExplainBody.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <ul className="list-disc space-y-1 pl-4">
                  {copy.charts.holeMapExplainBullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </ChartExplanation>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
            <div className="space-y-2">
              <PressureDisplacementChart
                data={pressureDisplacementData}
                limit_MPa={dpLimitRecommended_MPa}
                label={
                  input.geometry.shape === "cylinder"
                    ? "u(ro)"
                    : input.geometry.shape === "dome"
                      ? "dr"
                      : "w0"
                }
                description={copy.charts.pressureDisplacementNote}
                title={copy.charts.pressureDisplacement}
                pressureLabel={copy.charts.pressureLabel}
                pressureUnit={isExternalPressureMode ? "MPa" : "atm"}
                pressureTickFormatter={
                  isExternalPressureMode ? undefined : (valueMPa) => MPaToAtm(valueMPa).toFixed(1)
                }
                pressureFormatter={
                  isExternalPressureMode
                    ? undefined
                    : (valueMPa) => formatPressurePair(MPaToAtm(valueMPa))
                }
                displacementLabel={copy.charts.displacementLabel}
              />
              <ChartExplanation
                title={copy.charts.pressureDisplacementExplainTitle}
                teaser={interpolate(copy.charts.pressureDisplacementExplainTeaser, pressureDisplacementTokens)}
                open={Boolean(openCharts.pressureDisplacement)}
                onToggle={() => toggleChart("pressureDisplacement")}
                buttonLabel={
                  Boolean(openCharts.pressureDisplacement) ? copy.charts.explainLess : copy.charts.explainMore
                }
              >
                {pressureDisplacementExplainBody.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <ul className="list-disc space-y-1 pl-4">
                  {pressureDisplacementExplainBullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </ChartExplanation>
            </div>
            <div className="space-y-2">
              <ThicknessSweepChart
                data={thicknessData}
                targetValue={targetValue}
                valueUnit={valueUnit}
                valueFormatter={isExternalPressureMode ? undefined : formatPressurePair}
                thicknessLabel={copy.charts.thicknessLabel}
                limitLabel={isExternalPressureMode ? copy.charts.limitDepthLabel : loadCopy.theoreticalLimitPressure}
                p50Label={copy.charts.p50Label}
                p5Label={copy.charts.p5Label}
                progressLabel={copy.sweepLabel}
                progressValue={sweepProgress}
                title={isExternalPressureMode ? copy.charts.thicknessSweep : loadCopy.pressureSweepTitle}
              />
              <ChartExplanation
                title={copy.charts.thicknessSweepExplainTitle}
                teaser={interpolate(
                  isExternalPressureMode
                    ? copy.charts.thicknessSweepExplainTeaser
                    : locale === "ja"
                      ? "現在 t {t} mm 付近の理論限界 {limitDepth} 気圧 / P50 {p50} 気圧 / P5 {p5} 気圧。"
                      : "At t {t} mm: limit {limitDepth} atm / P50 {p50} atm / P5 {p5} atm.",
                  thicknessTokens
                )}
                open={Boolean(openCharts.thicknessSweep)}
                onToggle={() => toggleChart("thicknessSweep")}
                buttonLabel={Boolean(openCharts.thicknessSweep) ? copy.charts.explainLess : copy.charts.explainMore}
              >
                {thicknessExplainBody.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <ul className="list-disc space-y-1 pl-4">
                  {thicknessExplainBullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </ChartExplanation>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <DistributionChart
                data={histogramData}
                p5={distributionStats?.p5}
                p50={distributionStats?.p50}
                p95={distributionStats?.p95}
                description={isExternalPressureMode ? copy.charts.distributionNote : loadCopy.pressureDistributionNote}
                valueLabel={valueLabel}
                valueUnit={valueUnit}
                valueFormatter={isExternalPressureMode ? undefined : formatPressurePair}
                probabilityLabel={copy.charts.probabilityLabel}
                progressLabel={copy.monteCarloLabel}
                progressValue={mcProgress}
                title={isExternalPressureMode ? copy.charts.distribution : loadCopy.pressureDistributionTitle}
              />
              <ChartExplanation
                title={copy.charts.distributionExplainTitle}
                teaser={interpolate(
                  isExternalPressureMode
                    ? copy.charts.distributionExplainTeaser
                    : locale === "ja"
                      ? "P5 {p5} 気圧 / P50 {p50} 気圧 / P95 {p95} 気圧（{samples} サンプル）。"
                      : "P5 {p5} atm / P50 {p50} atm / P95 {p95} atm ({samples} samples).",
                  distributionTokens
                )}
                open={Boolean(openCharts.distribution)}
                onToggle={() => toggleChart("distribution")}
                buttonLabel={Boolean(openCharts.distribution) ? copy.charts.explainLess : copy.charts.explainMore}
              >
                {distributionExplainBody.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {distributionExplainBullets.length > 0 && (
                  <ul className="list-disc space-y-1 pl-4">
                    {distributionExplainBullets.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </ChartExplanation>
            </div>
            <div className="space-y-2">
              <FailureProbabilityChart
                data={pfCurveData}
                targetPf={input.pfTarget}
                valueLabel={valueLabel}
                valueUnit={valueUnit}
                valueFormatter={isExternalPressureMode ? undefined : formatPressurePair}
                pfLabel={copy.charts.failureProbabilityLabel}
                description={
                  isExternalPressureMode
                    ? copy.charts.failureProbabilityNote
                    : loadCopy.pressureDistributionNote
                }
                title={copy.charts.failureProbability}
              />
              <ChartExplanation
                title={copy.charts.failureProbabilityExplainTitle}
                teaser={interpolate(
                  isExternalPressureMode
                    ? copy.charts.failureProbabilityExplainTeaser
                    : locale === "ja"
                      ? "故障確率 {pf}% の内圧 {pfDepth} 気圧 / 50% 到達 {pf50} 気圧。"
                      : "Failure probability {pf}% at {pfDepth} atm / 50% at {pf50} atm.",
                  failureTokens
                )}
                open={Boolean(openCharts.failureProbability)}
                onToggle={() => toggleChart("failureProbability")}
                buttonLabel={Boolean(openCharts.failureProbability) ? copy.charts.explainLess : copy.charts.explainMore}
              >
                {failureExplainBody.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {failureExplainBullets.length > 0 && (
                  <ul className="list-disc space-y-1 pl-4">
                    {failureExplainBullets.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </ChartExplanation>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <ModeShareChart data={modeShareData} title={copy.charts.modeShare} />
              <ChartExplanation
                title={copy.charts.modeShareExplainTitle}
                teaser={interpolate(copy.charts.modeShareExplainTeaser, modeShareTokens)}
                open={Boolean(openCharts.modeShare)}
                onToggle={() => toggleChart("modeShare")}
                buttonLabel={Boolean(openCharts.modeShare) ? copy.charts.explainLess : copy.charts.explainMore}
              >
                {modeShareExplainBody.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {modeShareExplainBullets.length > 0 && (
                  <ul className="list-disc space-y-1 pl-4">
                    {modeShareExplainBullets.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </ChartExplanation>
            </div>
            <Card className="border border-border bg-white/80">
              <CardHeader>
                <CardTitle className="text-sm">{copy.charts.uncertaintySummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{copy.uncertainty.samples}: {input.uncertainty.enabled ? input.uncertainty.samples : "Off"}</p>
                <p>
                  P5: {distributionStats ? (isExternalPressureMode ? `${distributionStats.p5.toFixed(1)} ${valueUnit}` : formatPressurePair(distributionStats.p5)) : "--"}
                </p>
                <p>
                  P50: {distributionStats ? (isExternalPressureMode ? `${distributionStats.p50.toFixed(1)} ${valueUnit}` : formatPressurePair(distributionStats.p50)) : "--"}
                </p>
                <p>
                  P95: {distributionStats ? (isExternalPressureMode ? `${distributionStats.p95.toFixed(1)} ${valueUnit}` : formatPressurePair(distributionStats.p95)) : "--"}
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <aside className="order-3 space-y-3 lg:order-3">
          <Card className="border border-border bg-white/80">
            <CardContent className="space-y-3 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {copy.results.recommended}
                </p>
                <h3 className="font-display text-4xl font-semibold text-slate-900">
                  {recommendedValue.toFixed(isExternalPressureMode ? 1 : 1)} {resultUnit}
                </h3>
                {!isExternalPressureMode && (
                  <p className="text-xs text-muted-foreground">
                    {(recommendedValue / MPaToAtm(1)).toFixed(3)} MPa
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {copy.results.pfNote
                    .replace("{pf}", (input.pfTarget * 100).toFixed(2))
                    .replace("{margin}", String(marginFactors[input.marginPreset]))}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {copy.results.uncertaintyState.replace("{state}", input.uncertainty.enabled ? copy.on : copy.off)}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {isExternalPressureMode
                    ? copy.results.dominantMode
                    : locale === "ja"
                      ? "内圧上昇時のウィークポイント"
                      : "Weakest point under internal pressure"}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{modeLabels[recommendedLimit.mode]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{modeReasons[recommendedLimit.mode]}</p>
              </div>
              {input.geometry.shape === "plate_penetrators" && holeAnalysis?.worstHole && (
                <>
                  <Separator />
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="text-xs font-medium text-muted-foreground">{copy.results.dominantHole}</p>
                    <p>
                      {copy.results.dominantHoleLabel
                        .replace("{index}", String(holeAnalysis.holes.indexOf(holeAnalysis.worstHole) + 1))
                        .replace("{r}", mToMm(holeAnalysis.worstHole.r).toFixed(1))
                        .replace("{theta}", (holeAnalysis.worstHole.theta_rad * 180 / Math.PI).toFixed(1))}
                    </p>
                  </div>
                </>
              )}
              <Separator />
              <div className="space-y-2 text-sm">
                {modeLimitRows.map(({ mode, value }, index) => (
                    <div key={mode} className="flex items-center justify-between">
                      <span className={index === 0 ? "font-semibold text-slate-900" : "text-muted-foreground"}>
                        {modeLabels[mode]}
                      </span>
                      <span className={index === 0 ? "font-mono font-semibold text-slate-900" : "font-mono"}>
                        {isExternalPressureMode ? `${value.toFixed(1)} ${valueUnit}` : formatPressurePair(value)}
                      </span>
                    </div>
                  ))}
              </div>
              {input.geometry.shape === "plate_penetrators" && holeAreaRatioPct !== null && (
                <div
                  className={`rounded-xl border p-2 text-xs ${
                    holeAreaWarning ? "border-amber-300 bg-amber-50 text-amber-800" : "border-border bg-white/70 text-muted-foreground"
                  }`}
                >
                  <p>{copy.results.holeAreaRatioLabel.replace("{ratio}", holeAreaRatioPct.toFixed(1))}</p>
                  {holeAreaWarning && (
                    <p>{copy.results.holeAreaRatioWarning.replace("{threshold}", "25")}</p>
                  )}
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{copy.results.marginPreset}</p>
                <Select
                  value={input.marginPreset}
                  onValueChange={(value) => setInput((prev) => ({ ...prev, marginPreset: value as InputState["marginPreset"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideal">{copy.results.marginIdeal}</SelectItem>
                    <SelectItem value="conservative">{copy.results.marginConservative}</SelectItem>
                    <SelectItem value="ultra">{copy.results.marginUltra}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {isExternalPressureMode
                    ? copy.results.recommendedExplainTitle
                    : locale === "ja"
                      ? "推奨内圧の技術解説"
                      : "Recommended pressure rationale"}
                </p>
                <p className="text-xs text-muted-foreground">{explanationTeaser}</p>
                <button
                  type="button"
                  onClick={() => setShowRecommendedExplanation((prev) => !prev)}
                  className="text-xs font-medium text-primary transition hover:text-primary/80"
                  aria-expanded={showRecommendedExplanation}
                >
                  {showRecommendedExplanation ? copy.results.recommendedExplainLess : copy.results.recommendedExplainMore}
                </button>
                <div
                  className={`overflow-hidden transition-all ${
                    showRecommendedExplanation ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-3 pt-2 text-xs text-muted-foreground">
                    <p>{explanationIntro}</p>
                    <p>{explanationMethod}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {copy.results.recommendedExplainWeakestTitle}
                      </p>
                      <p>{modeReasons[recommendedLimit.mode]}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {isExternalPressureMode
                          ? copy.results.recommendedExplainModeTableTitle
                          : loadCopy.modeTableTitle}
                      </p>
                      <div className="space-y-1">
                        {modeLimitRows.map((row) => (
                          <p key={row.mode}>
                            {interpolate(
                              isExternalPressureMode
                                ? copy.results.recommendedExplainModeLine
                                : loadCopy.modeLine,
                              {
                                mode: modeLabels[row.mode],
                                dp: row.dp_MPa.toFixed(2),
                                depth: row.value.toFixed(1),
                                value: row.value.toFixed(1),
                                valueMpa: (row.value / MPaToAtm(1)).toFixed(3),
                              }
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {copy.results.recommendedExplainFailureTitle}
                      </p>
                      <p>{modeDescriptions[recommendedLimit.mode]}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {copy.results.recommendedExplainMarginTitle}
                      </p>
                      <ul className="list-disc space-y-1 pl-4">
                        {copy.results.recommendedExplainMarginItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white/80">
            <CardHeader>
              <CardTitle className="text-sm">{copy.results.realityCheck}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>{copy.results.reality1}</p>
              <p>{copy.results.reality2}</p>
              <p>{copy.results.reality3}</p>
            </CardContent>
          </Card>

          {isExternalPressureMode && (
            <Card className="border border-border bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{copy.results.failureIllustrationsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowFailureIllustration(true)}
                  className="w-full rounded-2xl border border-border/60 bg-white/60 p-3 transition hover:border-primary/50 hover:shadow-sm"
                >
                  <Image
                    src="/failuremode.png"
                    alt="Failure mode illustration"
                    width={520}
                    height={320}
                    className="h-auto w-full"
                  />
                </button>
                <div className="space-y-4 text-xs text-muted-foreground">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-700">{failureModeDetails.bucklingTitle}</p>
                    {failureModeDetails.bucklingBody.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    <a
                      href={bucklingReferenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-primary underline underline-offset-4 transition hover:text-primary/80"
                    >
                      {failureModeDetails.bucklingLinkLabel}
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-700">{failureModeDetails.vonMisesTitle}</p>
                    {failureModeDetails.vonMisesBody.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border border-border bg-white/80">
            <CardHeader>
              <CardTitle className="text-sm">{copy.results.thicknessSuggestion}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {sweepResult?.requiredThickness_m ? (
                <p>
                  {(isExternalPressureMode ? copy.results.thicknessOk : loadCopy.thicknessOk)
                    .replace("{t}", mToMm(sweepResult.requiredThickness_m).toFixed(2))
                    .replace("{depth}", input.depthTarget_m.toFixed(0))
                    .replace("{target}", targetValue.toFixed(isExternalPressureMode ? 0 : 1))}
                </p>
              ) : (
                <p>{isExternalPressureMode ? copy.results.thicknessFail : loadCopy.thicknessFail}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border bg-white/80">
            <CardHeader>
              <CardTitle className="text-sm">{copy.aiNote.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {copy.aiNote.body}
            </CardContent>
          </Card>
        </aside>
      </div>
      {showFailureIllustration && isExternalPressureMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowFailureIllustration(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-slate-700 shadow"
              onClick={() => setShowFailureIllustration(false)}
            >
              Close
            </button>
            <Image
              src="/failuremode.png"
              alt="Failure mode illustration"
              width={1200}
              height={740}
              className="h-auto w-full rounded-2xl border border-white/10 shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
