import type {
  CylinderGeometry,
  EndCondition,
  Geometry,
  LimitResult,
  Material,
  Mode,
  PlaneMode,
  PressureMode,
} from "@/lib/types";
import {
  tubeBucklingPressureFiniteLength,
  tubeMaxVonMisesPerPa,
  tubeOuterDisplacementPerPa,
} from "@/calc/models/cylinder";
import { plateDeflectionPerPa, plateMaxStressPerPa } from "@/calc/models/plateCircularClamped";
import { analyzePlateWithHoles } from "@/calc/models/plateCircularClampedWithHoles";
import {
  rectPlateMaxDeflectionPerPa,
  rectPlateMaxStressPerPa,
} from "@/calc/models/rectPlateSimplySupported";
import { domeBucklingPressure, domeYieldPressure } from "@/calc/models/dome";

export const creepEfactor = (mat: Material, duration: "short" | "medium" | "long") => {
  if (!mat.creep.isCreepSensitive) return 1;
  if (duration === "short") return 1;
  if (duration === "medium") return 0.8;
  return 0.6;
};

export const pickSigmaAllow = (mat: Material, duration: "short" | "medium" | "long") => {
  const shortAllow = mat.strength.design_allow_MPa_short;
  const longAllow = mat.strength.design_allow_MPa_long;
  if (duration === "short") return shortAllow;
  if (duration === "medium") return Math.min(longAllow, shortAllow * 0.6);
  return longAllow;
};

export const pickTensileSigmaAllow = (
  mat: Material,
  duration: "short" | "medium" | "long"
) => {
  const baseAllow = pickSigmaAllow(mat, duration);
  const yieldAllow = mat.strength.yield_MPa !== null ? mat.strength.yield_MPa / 1.5 : Infinity;
  const ultimateAllow =
    mat.strength.ultimate_MPa !== null ? mat.strength.ultimate_MPa / 2.4 : Infinity;
  return Math.min(baseAllow, yieldAllow, ultimateAllow);
};

export const pickYieldStrength = (mat: Material, duration: "short" | "medium" | "long") => {
  const yield_MPa =
    mat.strength.compressive_yield_MPa ??
    mat.strength.yield_MPa ??
    pickSigmaAllow(mat, duration);
  return yield_MPa * 1e6;
};

export const pickTensileYieldStrength = (
  mat: Material,
  duration: "short" | "medium" | "long"
) => {
  const yield_MPa =
    mat.strength.yield_MPa ??
    mat.strength.ultimate_MPa ??
    pickTensileSigmaAllow(mat, duration);
  return yield_MPa * 1e6;
};

export const kdfPresetValue = (preset: "ideal" | "good" | "hobby" | "rough") => {
  switch (preset) {
    case "ideal":
      return 1.0;
    case "good":
      return 0.4;
    case "hobby":
      return 0.2;
    case "rough":
      return 0.1;
  }
};

export const computeDpLimits = (
  geom: Geometry,
  mat: Material,
  options: {
    endCondition: EndCondition;
    planeMode: PlaneMode;
    pressureMode?: PressureMode;
    duration: "short" | "medium" | "long";
    kdfGamma: number;
    wAllow_m?: number | null;
  }
): Record<Mode, number> => {
  const pressureMode = options.pressureMode ?? "external";
  const sigmaAllow_Pa =
    (pressureMode === "internal"
      ? pickTensileSigmaAllow(mat, options.duration)
      : pickSigmaAllow(mat, options.duration)) * 1e6;
  const Eeff_Pa = mat.elastic.E_GPa * 1e9 * creepEfactor(mat, options.duration);
  const nu = mat.elastic.nu;

  const results: Record<Mode, number> = {
    tube_yield: Number.POSITIVE_INFINITY,
    tube_buckling: Number.POSITIVE_INFINITY,
    plate_stress: Number.POSITIVE_INFINITY,
    plate_deflection: Number.POSITIVE_INFINITY,
    plate_hole_stress: Number.POSITIVE_INFINITY,
    panel_stress: Number.POSITIVE_INFINITY,
    panel_deflection: Number.POSITIVE_INFINITY,
    dome_buckling: Number.POSITIVE_INFINITY,
    dome_yield: Number.POSITIVE_INFINITY,
  };

  if (geom.shape === "cylinder") {
    const a = geom.Di_m / 2;
    const b = a + geom.t_m;
    const kVm = tubeMaxVonMisesPerPa({ a, b }, options.endCondition, pressureMode);
    results.tube_yield = sigmaAllow_Pa / kVm;
    if (pressureMode === "external") {
      const rm = (a + b) / 2;
      results.tube_buckling =
        options.kdfGamma *
        tubeBucklingPressureFiniteLength(
          { radius_m: rm, thickness_m: geom.t_m, length_m: geom.L_m },
          Eeff_Pa,
          nu
        );
    }
    if (geom.hasPlate) {
      const plateProps = { a, t: geom.plate_t_m, E_Pa: Eeff_Pa, nu };
      const { maxVonMises } = plateMaxStressPerPa(plateProps);
      results.plate_stress = sigmaAllow_Pa / maxVonMises;
      const wPerPa = plateDeflectionPerPa(plateProps);
      if (options.wAllow_m) {
        results.plate_deflection = options.wAllow_m / wPerPa;
      }
    }
  }

  if (geom.shape === "plate") {
    const plateProps = { a: geom.radius_m, t: geom.t_m, E_Pa: Eeff_Pa, nu };
    const { maxVonMises } = plateMaxStressPerPa(plateProps);
    results.plate_stress = sigmaAllow_Pa / maxVonMises;
    const wPerPa = plateDeflectionPerPa(plateProps);
    if (options.wAllow_m) {
      results.plate_deflection = options.wAllow_m / wPerPa;
    }
  }

  if (geom.shape === "plate_penetrators") {
    const plateProps = { a: geom.radius_m, t: geom.t_m, E_Pa: Eeff_Pa, nu };
    const { maxVonMises } = plateMaxStressPerPa(plateProps);
    results.plate_stress = sigmaAllow_Pa / maxVonMises;
    const wPerPa = plateDeflectionPerPa(plateProps);
    if (options.wAllow_m) {
      results.plate_deflection = options.wAllow_m / wPerPa;
    }
    const holes = analyzePlateWithHoles({
      plate: plateProps,
      holeCount: geom.hole_count,
      holeForbid_m: geom.hole_forbid_m,
      kt: geom.hole_kt,
      sigmaAllow_Pa,
    });
    if (holes.layout.fits) {
      results.plate_hole_stress = holes.dpLimit_holes_Pa;
    }
  }

  if (geom.shape === "box") {
    const plateProps = { a: geom.a_m, b: geom.b_m, t: geom.t_m, E_Pa: Eeff_Pa, nu };
    const { maxVonMises } = rectPlateMaxStressPerPa(plateProps, 51);
    results.panel_stress = sigmaAllow_Pa / maxVonMises;
    const wPerPa = rectPlateMaxDeflectionPerPa(plateProps, 51);
    if (options.wAllow_m) {
      results.panel_deflection = options.wAllow_m / wPerPa;
    }
  }

  if (geom.shape === "dome") {
    if (pressureMode === "external") {
      const buckling = domeBucklingPressure(geom, Eeff_Pa, nu);
      results.dome_buckling = (buckling * options.kdfGamma) / geom.sfBuckling;
      const sigmaY_Pa = pickYieldStrength(mat, options.duration);
      const yieldLimit = domeYieldPressure(geom, sigmaY_Pa);
      results.dome_yield = yieldLimit / geom.sfYield;
    } else {
      const sigmaAllowLimit = domeYieldPressure(geom, sigmaAllow_Pa);
      const tensileYieldLimit = domeYieldPressure(
        geom,
        pickTensileYieldStrength(mat, options.duration)
      ) / geom.sfYield;
      results.dome_yield = Math.min(sigmaAllowLimit, tensileYieldLimit);
    }
  }

  return results;
};

export const pickOverallLimit = (dps: Record<Mode, number>): LimitResult => {
  let bestMode: Mode = "tube_yield";
  let best = dps[bestMode];
  for (const [mode, value] of Object.entries(dps) as [Mode, number][]) {
    if (value < best) {
      best = value;
      bestMode = mode;
    }
  }
  return { dpLimit_Pa: best, mode: bestMode, details: dps };
};

export const tubeDisplacementPerPa = (
  geom: CylinderGeometry,
  mat: Material,
  planeMode: PlaneMode,
  pressureMode: PressureMode = "external"
) => {
  const a = geom.Di_m / 2;
  const b = a + geom.t_m;
  return tubeOuterDisplacementPerPa(
    { a, b },
    mat.elastic.nu,
    mat.elastic.E_GPa * 1e9,
    planeMode,
    pressureMode
  );
};
