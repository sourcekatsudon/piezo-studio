import type { DomeGeometry } from "@/lib/types";

export type DomeDerived = {
  a_m: number;
  h_m: number;
  Ri_m: number;
  Rm_m: number;
  Ro_m: number;
  theta0_rad: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const deriveDomeGeometry = (geom: DomeGeometry): DomeDerived => {
  const a = geom.Di_m / 2;
  const safeA = Math.max(a, 1e-6);
  const hTarget = geom.mode === "hemi" ? safeA : geom.h_m;
  const h = clamp(hTarget, safeA * 1e-3, safeA);
  const Ri = geom.mode === "hemi" ? safeA : (safeA * safeA + h * h) / (2 * h);
  const Rm = Ri + geom.t_m / 2;
  const Ro = Ri + geom.t_m;
  const theta0 = Math.asin(clamp(safeA / Ri, 0, 1));
  return { a_m: safeA, h_m: h, Ri_m: Ri, Rm_m: Rm, Ro_m: Ro, theta0_rad: theta0 };
};

export const domeDisplacementPerPa = (geom: DomeGeometry, E_Pa: number, nu: number) => {
  const { Rm_m } = deriveDomeGeometry(geom);
  if (geom.t_m <= 0 || E_Pa <= 0) return 0;
  return -((1 - nu) * Rm_m * Rm_m) / (2 * E_Pa * geom.t_m);
};

export const domeBucklingPressure = (geom: DomeGeometry, E_Pa: number, nu: number) => {
  const { Rm_m } = deriveDomeGeometry(geom);
  if (geom.t_m <= 0 || Rm_m <= 0) return 0;
  return (2 * E_Pa) / Math.sqrt(3 * (1 - nu * nu)) * Math.pow(geom.t_m / Rm_m, 2);
};

export const domeYieldPressure = (geom: DomeGeometry, sigmaY_Pa: number) => {
  const { Rm_m } = deriveDomeGeometry(geom);
  if (geom.t_m <= 0 || Rm_m <= 0) return 0;
  return (2 * geom.t_m * sigmaY_Pa) / Rm_m;
};
