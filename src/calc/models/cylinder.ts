import type { EndCondition, PlaneMode, PressureMode } from "@/lib/types";

export type CylinderGeom = {
  a: number;
  b: number;
};

export type LameConstants = {
  A: number;
  B: number;
};

export const lameConstants = (a: number, b: number, pi: number, po: number): LameConstants => {
  const denom = b * b - a * a;
  const A = (a * a * pi - b * b * po) / denom;
  const B = (a * a * b * b * (pi - po)) / denom;
  return { A, B };
};

export const stressAtRadius = (r: number, constants: LameConstants) => {
  const { A, B } = constants;
  const sigma_r = A - B / (r * r);
  const sigma_theta = A + B / (r * r);
  return { sigma_r, sigma_theta };
};

export const sigmaZ = (A: number, endCondition: EndCondition) =>
  endCondition === "closed" ? A : 0;

export const displacementAtRadius = (
  r: number,
  constants: LameConstants,
  E_Pa: number,
  nu: number,
  planeMode: PlaneMode
) => {
  const { A, B } = constants;
  if (planeMode === "plane_stress") {
    return ((1 - nu) * A * r + (1 + nu) * (B / r)) / E_Pa;
  }
  return ((1 + nu) * ((1 - 2 * nu) * A * r + B / r)) / E_Pa;
};

export const vonMises = (sigma_r: number, sigma_theta: number, sigma_z: number) => {
  return Math.sqrt(
    0.5 *
      ((sigma_r - sigma_theta) ** 2 +
        (sigma_theta - sigma_z) ** 2 +
        (sigma_z - sigma_r) ** 2)
  );
};

export const principalMax = (sigma_r: number, sigma_theta: number, sigma_z: number) => {
  return Math.max(sigma_r, sigma_theta, sigma_z);
};

const pressurePair = (pressureMode: PressureMode) =>
  pressureMode === "internal" ? { pi: 1, po: 0 } : { pi: 0, po: 1 };

export const tubeMaxVonMisesPerPa = (
  geom: CylinderGeom,
  endCondition: EndCondition,
  pressureMode: PressureMode = "external"
) => {
  const { a, b } = geom;
  const { pi, po } = pressurePair(pressureMode);
  const constants = lameConstants(a, b, pi, po);
  const sz = sigmaZ(constants.A, endCondition);
  let maxVm = 0;
  const steps = 64;
  for (let i = 0; i <= steps; i += 1) {
    const r = a + ((b - a) * i) / steps;
    const { sigma_r, sigma_theta } = stressAtRadius(r, constants);
    const vm = vonMises(sigma_r, sigma_theta, sz);
    if (vm > maxVm) maxVm = vm;
  }
  return maxVm;
};

export const tubeMaxPrincipalPerPa = (
  geom: CylinderGeom,
  endCondition: EndCondition,
  pressureMode: PressureMode = "external"
) => {
  const { a, b } = geom;
  const { pi, po } = pressurePair(pressureMode);
  const constants = lameConstants(a, b, pi, po);
  const sz = sigmaZ(constants.A, endCondition);
  let maxPrincipal = -Infinity;
  const steps = 64;
  for (let i = 0; i <= steps; i += 1) {
    const r = a + ((b - a) * i) / steps;
    const { sigma_r, sigma_theta } = stressAtRadius(r, constants);
    const principal = principalMax(sigma_r, sigma_theta, sz);
    if (principal > maxPrincipal) maxPrincipal = principal;
  }
  return maxPrincipal;
};

export const tubeBucklingPressureLong = (
  radius_m: number,
  thickness_m: number,
  E_Pa: number,
  nu: number
) => {
  if (!(radius_m > 0) || !(thickness_m > 0) || !(E_Pa > 0)) return 0;
  return (E_Pa / (4 * (1 - nu * nu))) * Math.pow(thickness_m / radius_m, 3);
};

export const tubeBucklingPressureFiniteLength = (
  params: {
    radius_m: number;
    thickness_m: number;
    length_m: number;
  },
  E_Pa: number,
  nu: number
) => {
  const { radius_m: r, thickness_m: t, length_m: L } = params;
  if (!(r > 0) || !(t > 0) || !(L > 0) || !(E_Pa > 0)) {
    return tubeBucklingPressureLong(r, t, E_Pa, nu);
  }

  const nEstimate = 2.7 * Math.sqrt(r / L) * Math.pow(r / t, 0.25);
  const nMax = Math.max(12, Math.ceil(nEstimate * 4 + 8));
  let best = Number.POSITIVE_INFINITY;
  for (let n = 2; n <= nMax; n += 1) {
    const shellTerm = ((n * n - 1) * t) / (12 * (1 - nu * nu) * r);
    const lengthTerm = (Math.PI ** 4 * r ** 5) / (L ** 4 * t * n ** 6);
    const pressure = (shellTerm + lengthTerm) * E_Pa * (t / r) ** 2;
    if (pressure < best) best = pressure;
  }

  return best;
};

export const tubeOuterDisplacementPerPa = (
  geom: CylinderGeom,
  nu: number,
  E_Pa: number,
  planeMode: PlaneMode,
  pressureMode: PressureMode = "external"
) => {
  const { pi, po } = pressurePair(pressureMode);
  const constants = lameConstants(geom.a, geom.b, pi, po);
  return displacementAtRadius(geom.b, constants, E_Pa, nu, planeMode);
};
