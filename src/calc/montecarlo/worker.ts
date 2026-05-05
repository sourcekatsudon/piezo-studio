import * as Comlink from "comlink";
import type { Geometry, Material, Mode, PressureMode } from "@/lib/types";
import { computeDpLimits, kdfPresetValue, pickOverallLimit } from "@/calc/failureModes";
import { depthToPressure, MPaToPa, PaToMPa, pressureToDepth } from "@/calc/units";

export type MonteCarloInput = {
  geometry: Geometry;
  material: Material;
  pressureMode?: PressureMode;
  endCondition: "closed" | "open";
  planeMode: "plane_strain" | "plane_stress";
  duration: "short" | "medium" | "long";
  rho_kg_m3: number;
  internalPressure_Pa: number;
  uncertainty: {
    enabled: boolean;
    t_tol_m: number;
    d_tol_m: number;
    E_var_pct: number;
    sigma_var_pct: number;
    kdfPreset: "ideal" | "good" | "hobby" | "rough";
    gamma_ln_sigma: number;
  };
  samples: number;
  progressStride?: number;
};

export type MonteCarloOutput = {
  dpLimits: number[];
  modeShare: Record<Mode, number>;
  pfCurve: { value: number; pf: number }[];
  stats: { p5: number; p50: number; p95: number; mean: number };
};

export type ThicknessSweepInput = {
  geometry: Geometry;
  material: Material;
  pressureMode?: PressureMode;
  endCondition: "closed" | "open";
  planeMode: "plane_strain" | "plane_stress";
  duration: "short" | "medium" | "long";
  rho_kg_m3: number;
  internalPressure_Pa: number;
  targetPressure_Pa?: number;
  uncertainty?: {
    enabled: boolean;
    t_tol_m: number;
    d_tol_m: number;
    E_var_pct: number;
    sigma_var_pct: number;
    kdfPreset: "ideal" | "good" | "hobby" | "rough";
    gamma_ln_sigma: number;
    samplesP50: number;
    samplesP5: number;
  };
  t_min_m: number;
  t_max_m: number;
  coarseStep_m: number;
  fineStep_m: number;
  targetDepth_m: number;
};

export type ThicknessSweepOutput = {
  points: { t_m: number; limitValue: number; p50?: number; p5?: number }[];
  requiredThickness_m: number | null;
};

const sampleNormal = (mean: number, std: number) => {
  if (std === 0) return mean;
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * std;
};

const sampleLogNormal = (mean: number, lnSigma: number) => {
  if (lnSigma === 0) return mean;
  const mu = Math.log(mean) - 0.5 * lnSigma * lnSigma;
  const z = sampleNormal(0, 1);
  return Math.exp(mu + lnSigma * z);
};

const sampleTriangular = (min: number, mode: number, max: number) => {
  const u = Math.random();
  const c = (mode - min) / (max - min);
  if (u < c) return min + Math.sqrt(u * (max - min) * (mode - min));
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
};

const clampPositive = (value: number, fallback: number) => (value > 0 ? value : fallback);

const perturbGeometry = (
  geom: Geometry,
  t_tol_m: number,
  d_tol_m: number
): Geometry => {
  if (geom.shape === "cylinder") {
    const Di = clampPositive(sampleNormal(geom.Di_m, d_tol_m / 3), geom.Di_m);
    const t = clampPositive(sampleNormal(geom.t_m, t_tol_m / 3), geom.t_m);
    const plateT = clampPositive(sampleNormal(geom.plate_t_m, t_tol_m / 3), geom.plate_t_m);
    return { ...geom, Di_m: Di, t_m: t, plate_t_m: plateT };
  }
  if (geom.shape === "plate") {
    const radius = clampPositive(sampleNormal(geom.radius_m, d_tol_m / 6), geom.radius_m);
    const t = clampPositive(sampleNormal(geom.t_m, t_tol_m / 3), geom.t_m);
    return { ...geom, radius_m: radius, t_m: t };
  }
  if (geom.shape === "plate_penetrators") {
    const radius = clampPositive(sampleNormal(geom.radius_m, d_tol_m / 6), geom.radius_m);
    const t = clampPositive(sampleNormal(geom.t_m, t_tol_m / 3), geom.t_m);
    let kt = geom.hole_kt;
    if (geom.hole_kt_variation !== "off") {
      const delta = geom.hole_kt * (geom.hole_kt_var_pct / 100);
      const min = Math.max(0.1, geom.hole_kt - delta);
      const max = Math.max(min + 1e-6, geom.hole_kt + delta);
      kt =
        geom.hole_kt_variation === "uniform"
          ? min + Math.random() * (max - min)
          : sampleTriangular(min, geom.hole_kt, max);
    }
    return { ...geom, radius_m: radius, t_m: t, hole_kt: kt };
  }
  if (geom.shape === "dome") {
    const Di = clampPositive(sampleNormal(geom.Di_m, d_tol_m / 3), geom.Di_m);
    const t = clampPositive(sampleNormal(geom.t_m, t_tol_m / 3), geom.t_m);
    if (geom.mode === "hemi") {
      return { ...geom, Di_m: Di, t_m: t, h_m: Di / 2 };
    }
    const hSample = clampPositive(sampleNormal(geom.h_m, d_tol_m / 3), geom.h_m);
    const h = Math.min(hSample, Di / 2);
    return { ...geom, Di_m: Di, t_m: t, h_m: h };
  }
  const a = clampPositive(sampleNormal(geom.a_m, d_tol_m / 3), geom.a_m);
  const b = clampPositive(sampleNormal(geom.b_m, d_tol_m / 3), geom.b_m);
  const t = clampPositive(sampleNormal(geom.t_m, t_tol_m / 3), geom.t_m);
  return { ...geom, a_m: a, b_m: b, t_m: t };
};

const perturbMaterial = (mat: Material, E_var_pct: number, sigma_var_pct: number): Material => {
  const E = clampPositive(sampleNormal(mat.elastic.E_GPa, (mat.elastic.E_GPa * E_var_pct) / 300), mat.elastic.E_GPa);
  const sigmaScale = clampPositive(sampleNormal(1, sigma_var_pct / 300), 1);
  return {
    ...mat,
    elastic: { ...mat.elastic, E_GPa: E },
    strength: {
      ...mat.strength,
      yield_MPa:
        mat.strength.yield_MPa !== null ? mat.strength.yield_MPa * sigmaScale : null,
      ultimate_MPa:
        mat.strength.ultimate_MPa !== null ? mat.strength.ultimate_MPa * sigmaScale : null,
      compressive_yield_MPa:
        mat.strength.compressive_yield_MPa !== null
          ? mat.strength.compressive_yield_MPa * sigmaScale
          : null,
      design_allow_MPa_short: mat.strength.design_allow_MPa_short * sigmaScale,
      design_allow_MPa_long: mat.strength.design_allow_MPa_long * sigmaScale,
    },
  };
};

const resolveKdfMean = (geom: Geometry, uncertainty: MonteCarloInput["uncertainty"]) => {
  if (geom.shape === "dome") {
    if (geom.kdfMode === "manual") return geom.kdfManual;
    return kdfPresetValue(geom.kdfPreset);
  }
  return kdfPresetValue(uncertainty.kdfPreset);
};

const resolveWAllow = (geom: Geometry) => {
  if (geom.shape === "plate_penetrators") return geom.w_allow_m ?? undefined;
  return undefined;
};

const runMonteCarloInternal = (
  input: MonteCarloInput,
  onProgress?: (progress: number) => void
): MonteCarloOutput => {
  const pressureMode = input.pressureMode ?? "external";
  const modeShare: Record<Mode, number> = {
    tube_yield: 0,
    tube_buckling: 0,
    plate_stress: 0,
    plate_deflection: 0,
    plate_hole_stress: 0,
    panel_stress: 0,
    panel_deflection: 0,
    dome_buckling: 0,
    dome_yield: 0,
  };
  const dpLimits: number[] = [];
  const gammaMean = resolveKdfMean(input.geometry, input.uncertainty);
  const stride = input.progressStride ?? Math.max(1, Math.floor(input.samples / 50));

  for (let i = 0; i < input.samples; i += 1) {
    const geom = input.uncertainty.enabled
      ? perturbGeometry(input.geometry, input.uncertainty.t_tol_m, input.uncertainty.d_tol_m)
      : input.geometry;
    const mat = input.uncertainty.enabled
      ? perturbMaterial(input.material, input.uncertainty.E_var_pct, input.uncertainty.sigma_var_pct)
      : input.material;
    const gamma = input.uncertainty.enabled
      ? sampleLogNormal(gammaMean, input.uncertainty.gamma_ln_sigma)
      : gammaMean;
    const dps = computeDpLimits(geom, mat, {
      endCondition: input.endCondition,
      planeMode: input.planeMode,
      pressureMode,
      duration: input.duration,
      kdfGamma: gamma,
      wAllow_m: resolveWAllow(geom),
    });
    const result = pickOverallLimit(dps);
    dpLimits.push(result.dpLimit_Pa);
    modeShare[result.mode] += 1;

    if (onProgress && i % stride === 0) {
      onProgress((i / input.samples) * 100);
    }
  }

  dpLimits.sort((a, b) => a - b);
  const p5 = dpLimits[Math.floor(0.05 * (dpLimits.length - 1))] ?? 0;
  const p50 = dpLimits[Math.floor(0.5 * (dpLimits.length - 1))] ?? 0;
  const p95 = dpLimits[Math.floor(0.95 * (dpLimits.length - 1))] ?? 0;
  const mean = dpLimits.reduce((sum, v) => sum + v, 0) / Math.max(1, dpLimits.length);

  const maxValue =
    pressureMode === "external"
      ? pressureToDepth(
          (dpLimits[dpLimits.length - 1] ?? 0) + input.internalPressure_Pa,
          input.rho_kg_m3
        )
      : PaToMPa(dpLimits[dpLimits.length - 1] ?? 0);
  const pfCurve: { value: number; pf: number }[] = [];
  const steps = 30;
  for (let i = 0; i <= steps; i += 1) {
    const value = (maxValue * i) / steps;
    const dpAtValue =
      pressureMode === "external"
        ? depthToPressure(value, input.rho_kg_m3) - input.internalPressure_Pa
        : MPaToPa(value);
    const failures = dpLimits.filter((v) => v <= dpAtValue).length;
    pfCurve.push({ value, pf: failures / dpLimits.length });
  }

  if (onProgress) onProgress(100);

  return { dpLimits, modeShare, pfCurve, stats: { p5, p50, p95, mean } };
};

const thicknessSweep = (
  input: ThicknessSweepInput,
  onProgress?: (progress: number) => void
): ThicknessSweepOutput => {
  const pressureMode = input.pressureMode ?? "external";
  const points: { t_m: number; limitValue: number; p50?: number; p5?: number }[] = [];
  const gammaMean = input.uncertainty
    ? resolveKdfMean(input.geometry, input.uncertainty)
    : kdfPresetValue("hobby");

  const coarse: number[] = [];
  for (let t = input.t_min_m; t <= input.t_max_m + 1e-9; t += input.coarseStep_m) {
    coarse.push(t);
  }

  const total = coarse.length;

  coarse.forEach((t, idx) => {
    const geom = { ...input.geometry } as Geometry;
    if (geom.shape === "cylinder") {
      geom.t_m = t;
      geom.plate_t_m = t;
    }
    if (geom.shape === "plate") {
      geom.t_m = t;
    }
    if (geom.shape === "plate_penetrators") {
      geom.t_m = t;
    }
    if (geom.shape === "box") {
      geom.t_m = t;
    }
    if (geom.shape === "dome") {
      geom.t_m = t;
    }

    const dps = computeDpLimits(geom, input.material, {
      endCondition: input.endCondition,
      planeMode: input.planeMode,
      pressureMode,
      duration: input.duration,
      kdfGamma: gammaMean,
      wAllow_m: resolveWAllow(geom),
    });
    const result = pickOverallLimit(dps);
    const limitValue =
      pressureMode === "external"
        ? pressureToDepth(result.dpLimit_Pa + input.internalPressure_Pa, input.rho_kg_m3)
        : PaToMPa(result.dpLimit_Pa);
    const point: { t_m: number; limitValue: number; p50?: number; p5?: number } = {
      t_m: t,
      limitValue,
    };

    if (input.uncertainty?.enabled) {
      const common = {
        geometry: geom,
        material: input.material,
        pressureMode,
        endCondition: input.endCondition,
        planeMode: input.planeMode,
        duration: input.duration,
        rho_kg_m3: input.rho_kg_m3,
        internalPressure_Pa: input.internalPressure_Pa,
        uncertainty: {
          enabled: true,
          t_tol_m: input.uncertainty.t_tol_m,
          d_tol_m: input.uncertainty.d_tol_m,
          E_var_pct: input.uncertainty.E_var_pct,
          sigma_var_pct: input.uncertainty.sigma_var_pct,
          kdfPreset: input.uncertainty.kdfPreset,
          gamma_ln_sigma: input.uncertainty.gamma_ln_sigma,
        },
      };
      const p50Out = runMonteCarloInternal({ ...common, samples: input.uncertainty.samplesP50 });
      const p5Out = runMonteCarloInternal({ ...common, samples: input.uncertainty.samplesP5 });
      point.p50 =
        pressureMode === "external"
          ? pressureToDepth(p50Out.stats.p50 + input.internalPressure_Pa, input.rho_kg_m3)
          : PaToMPa(p50Out.stats.p50);
      point.p5 =
        pressureMode === "external"
          ? pressureToDepth(p5Out.stats.p5 + input.internalPressure_Pa, input.rho_kg_m3)
          : PaToMPa(p5Out.stats.p5);
    }

    points.push(point);
    if (onProgress) onProgress(((idx + 1) / total) * 100);
  });

  let requiredThickness: number | null = null;
  const targetValue =
    pressureMode === "external" ? input.targetDepth_m : PaToMPa(input.targetPressure_Pa ?? 1e6);
  const candidate = points.find((p) => p.limitValue >= targetValue);
  if (candidate) {
    const fineStart = Math.max(input.t_min_m, candidate.t_m - input.coarseStep_m);
    const fineEnd = Math.min(input.t_max_m, candidate.t_m + input.coarseStep_m);
    let best: number | null = null;
    for (let t = fineStart; t <= fineEnd + 1e-9; t += input.fineStep_m) {
      const geom = { ...input.geometry } as Geometry;
      if (geom.shape === "cylinder") {
        geom.t_m = t;
        geom.plate_t_m = t;
      }
      if (geom.shape === "plate") geom.t_m = t;
      if (geom.shape === "plate_penetrators") geom.t_m = t;
      if (geom.shape === "box") geom.t_m = t;
      if (geom.shape === "dome") geom.t_m = t;
      const dps = computeDpLimits(geom, input.material, {
        endCondition: input.endCondition,
        planeMode: input.planeMode,
        pressureMode,
        duration: input.duration,
        kdfGamma: gammaMean,
        wAllow_m: resolveWAllow(geom),
      });
      const result = pickOverallLimit(dps);
      const limitValue =
        pressureMode === "external"
          ? pressureToDepth(result.dpLimit_Pa + input.internalPressure_Pa, input.rho_kg_m3)
          : PaToMPa(result.dpLimit_Pa);
      if (limitValue >= targetValue) {
        best = t;
        break;
      }
    }
    requiredThickness = best;
  }

  return { points, requiredThickness_m: requiredThickness };
};

const api = {
  runMonteCarlo: (input: MonteCarloInput, onProgress?: (progress: number) => void) =>
    runMonteCarloInternal(input, onProgress),
  runThicknessSweep: (input: ThicknessSweepInput, onProgress?: (progress: number) => void) =>
    thicknessSweep(input, onProgress),
};

Comlink.expose(api);
