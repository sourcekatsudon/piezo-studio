import type { Material } from "@/lib/types";

export type StressStrainPoint = {
  strain_pct: number;
  stress_MPa: number;
  linearStress_MPa: number;
};

export type MaterialCurveInfo = {
  proofStress_MPa: number;
  ultimateStress_MPa: number;
  proofStrain_pct: number;
  exponent: number;
};

export const materialProofStressMPa = (material: Material) => {
  return (
    material.strength.yield_MPa ??
    material.strength.ultimate_MPa ??
    material.strength.compressive_yield_MPa ??
    material.strength.design_allow_MPa_short * 1.5
  );
};

export const materialUltimateStressMPa = (material: Material) => {
  const proof = materialProofStressMPa(material);
  return Math.max(material.strength.ultimate_MPa ?? proof * 1.15, proof * 1.02);
};

export const rambergOsgoodExponent = (material: Material) => {
  if (material.id.startsWith("sus")) return 6;
  if (material.id.startsWith("ti_")) return 10;
  if (material.id.startsWith("al_")) return 12;
  if (material.category === "plastic") return 4;
  return 8;
};

export const rambergOsgoodStrain = (
  stress_MPa: number,
  material: Material
) => {
  const stress = Math.max(0, Math.abs(stress_MPa));
  const E_MPa = material.elastic.E_GPa * 1000;
  const proof = materialProofStressMPa(material);
  if (!(stress > 0) || !(E_MPa > 0) || !(proof > 0)) return 0;

  return stress / E_MPa + 0.002 * Math.pow(stress / proof, rambergOsgoodExponent(material));
};

export const strainAmplificationForStress = (
  stress_Pa: number,
  material: Material
) => {
  const stress_MPa = Math.abs(stress_Pa) / 1e6;
  const E_MPa = material.elastic.E_GPa * 1000;
  if (!(stress_MPa > 0) || !(E_MPa > 0)) return 1;

  const elasticStrain = stress_MPa / E_MPa;
  const totalStrain = rambergOsgoodStrain(stress_MPa, material);
  return Math.min(20, Math.max(1, totalStrain / elasticStrain));
};

export const materialCurveInfo = (material: Material): MaterialCurveInfo => {
  const proofStress_MPa = materialProofStressMPa(material);
  const ultimateStress_MPa = materialUltimateStressMPa(material);
  const proofStrain_pct = rambergOsgoodStrain(proofStress_MPa, material) * 100;
  return {
    proofStress_MPa,
    ultimateStress_MPa,
    proofStrain_pct,
    exponent: rambergOsgoodExponent(material),
  };
};

export const buildStressStrainCurve = (
  material: Material,
  pointCount = 80
): StressStrainPoint[] => {
  const { ultimateStress_MPa } = materialCurveInfo(material);
  const E_MPa = material.elastic.E_GPa * 1000;
  const maxStress = ultimateStress_MPa * 1.02;
  const points: StressStrainPoint[] = [];

  for (let i = 0; i <= pointCount; i += 1) {
    const stress_MPa = (maxStress * i) / pointCount;
    const strain = rambergOsgoodStrain(stress_MPa, material);
    points.push({
      strain_pct: strain * 100,
      stress_MPa,
      linearStress_MPa: Math.min(maxStress, strain * E_MPa),
    });
  }

  return points;
};
