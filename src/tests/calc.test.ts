import { describe, expect, it } from "vitest";
import {
  lameConstants,
  stressAtRadius,
  tubeBucklingPressureFiniteLength,
  tubeBucklingPressureLong,
  tubeMaxVonMisesPerPa,
  tubeOuterDisplacementPerPa,
} from "@/calc/models/cylinder";
import { plateDeflectionPerPa, plateMaxStressPerPa } from "@/calc/models/plateCircularClamped";
import { rectPlateMaxDeflectionPerPa, rectPlateMaxStressPerPa } from "@/calc/models/rectPlateSimplySupported";
import { deriveDomeGeometry, domeBucklingPressure, domeDisplacementPerPa } from "@/calc/models/dome";
import { computeDpLimits, pickTensileSigmaAllow } from "@/calc/failureModes";
import { materialCurveInfo, rambergOsgoodStrain } from "@/calc/materialCurve";
import materialsData from "@/data/materials.json";
import type { Material } from "@/lib/types";

const materials = materialsData as Material[];

describe("cylinder lame", () => {
  it("matches boundary conditions for external pressure", () => {
    const a = 0.05;
    const b = 0.06;
    const { A, B } = lameConstants(a, b, 0, 1);
    const outer = stressAtRadius(b, { A, B });
    const inner = stressAtRadius(a, { A, B });
    expect(outer.sigma_r).toBeCloseTo(-1, 6);
    expect(inner.sigma_r).toBeCloseTo(0, 6);
  });

  it("outer displacement is negative under external pressure", () => {
    const disp = tubeOuterDisplacementPerPa({ a: 0.05, b: 0.06 }, 0.33, 70e9, "plane_strain");
    expect(disp).toBeLessThan(0);
  });

  it("matches boundary conditions for internal pressure", () => {
    const a = 0.05;
    const b = 0.06;
    const { A, B } = lameConstants(a, b, 1, 0);
    const outer = stressAtRadius(b, { A, B });
    const inner = stressAtRadius(a, { A, B });
    expect(inner.sigma_r).toBeCloseTo(-1, 6);
    expect(outer.sigma_r).toBeCloseTo(0, 6);
  });

  it("outer displacement is positive under internal pressure", () => {
    const disp = tubeOuterDisplacementPerPa(
      { a: 0.05, b: 0.06 },
      0.33,
      70e9,
      "plane_strain",
      "internal"
    );
    expect(disp).toBeGreaterThan(0);
  });

  it("finite-length shell buckling converges to long-cylinder value", () => {
    const long = tubeBucklingPressureLong(0.05, 0.002, 70e9, 0.33);
    const finite = tubeBucklingPressureFiniteLength(
      { radius_m: 0.05, thickness_m: 0.002, length_m: 10 },
      70e9,
      0.33
    );
    expect(finite / long).toBeGreaterThan(0.99);
    expect(finite / long).toBeLessThan(1.05);
  });

  it("finite-length shell buckling gives short cylinders higher elastic pressure", () => {
    const long = tubeBucklingPressureLong(0.05, 0.002, 70e9, 0.33);
    const short = tubeBucklingPressureFiniteLength(
      { radius_m: 0.05, thickness_m: 0.002, length_m: 0.05 },
      70e9,
      0.33
    );
    expect(short).toBeGreaterThan(long);
  });
});

describe("internal pressure limits", () => {
  it("uses tensile allowable and removes external buckling for cylinders", () => {
    const acrylic = materials.find((mat) => mat.id === "pmma_cast_plexiglas_gs_0z09");
    expect(acrylic).toBeDefined();
    const material = acrylic!;
    const geom = {
      shape: "cylinder" as const,
      Di_m: 0.1,
      t_m: 0.008,
      L_m: 0.2,
      hasPlate: false,
      plate_t_m: 0.01,
    };
    const limits = computeDpLimits(geom, material, {
      endCondition: "closed",
      planeMode: "plane_strain",
      pressureMode: "internal",
      duration: "short",
      kdfGamma: 0.2,
    });
    const tensileAllow = pickTensileSigmaAllow(material, "short");
    const expected =
      (tensileAllow * 1e6) /
      tubeMaxVonMisesPerPa({ a: geom.Di_m / 2, b: geom.Di_m / 2 + geom.t_m }, "closed", "internal");
    expect(tensileAllow).toBeLessThan(material.strength.compressive_yield_MPa ?? Infinity);
    expect(limits.tube_yield).toBeCloseTo(expected, 6);
    expect(limits.tube_buckling).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("circular plate", () => {
  it("deflection and stress are positive for unit load", () => {
    const props = { a: 0.05, t: 0.006, E_Pa: 3e9, nu: 0.37 };
    const w0 = plateDeflectionPerPa(props);
    const { maxVonMises } = plateMaxStressPerPa(props);
    expect(w0).toBeGreaterThan(0);
    expect(maxVonMises).toBeGreaterThan(0);
  });
});

describe("rectangular plate", () => {
  it("returns positive deflection and stress", () => {
    const props = { a: 0.2, b: 0.15, t: 0.008, E_Pa: 70e9, nu: 0.33 };
    const w0 = rectPlateMaxDeflectionPerPa(props, 11);
    const { maxVonMises } = rectPlateMaxStressPerPa(props, 11);
    expect(w0).toBeGreaterThan(0);
    expect(maxVonMises).toBeGreaterThan(0);
  });
});

describe("dome (hemisphere)", () => {
  it("matches classical buckling pressure formula", () => {
    const geom = {
      shape: "dome" as const,
      mode: "hemi" as const,
      Di_m: 0.1,
      t_m: 0.005,
      h_m: 0.05,
      kdfMode: "preset" as const,
      kdfPreset: "good" as const,
      kdfManual: 0.3,
      sfBuckling: 2,
      sfYield: 1.5,
      attachToCylinder: false,
      cylinderLength_m: 0.1,
      connection: "integral" as const,
    };
    const E = 200e9;
    const nu = 0.3;
    const derived = deriveDomeGeometry(geom);
    const expected = (2 * E) / Math.sqrt(3 * (1 - nu * nu)) * (geom.t_m / derived.Rm_m) ** 2;
    const pc = domeBucklingPressure(geom, E, nu);
    expect(pc).toBeCloseTo(expected, 6);
  });

  it("uses thin shell radial displacement per Pa", () => {
    const geom = {
      shape: "dome" as const,
      mode: "hemi" as const,
      Di_m: 0.1,
      t_m: 0.005,
      h_m: 0.05,
      kdfMode: "preset" as const,
      kdfPreset: "good" as const,
      kdfManual: 0.3,
      sfBuckling: 2,
      sfYield: 1.5,
      attachToCylinder: false,
      cylinderLength_m: 0.1,
      connection: "integral" as const,
    };
    const E = 70e9;
    const nu = 0.33;
    const derived = deriveDomeGeometry(geom);
    const expected = -((1 - nu) * derived.Rm_m * derived.Rm_m) / (2 * E * geom.t_m);
    const perPa = domeDisplacementPerPa(geom, E, nu);
    expect(perPa).toBeCloseTo(expected, 6);
    expect(perPa).toBeLessThan(0);
  });
});

describe("material stress-strain curve", () => {
  it("places the 0.2% proof point above the elastic strain", () => {
    const aluminum = materials.find((mat) => mat.id === "al_6061_t6");
    expect(aluminum).toBeDefined();
    const material = aluminum!;
    const info = materialCurveInfo(material);
    const proofStrain = rambergOsgoodStrain(info.proofStress_MPa, material);
    const elasticStrain = info.proofStress_MPa / (material.elastic.E_GPa * 1000);
    expect(proofStrain - elasticStrain).toBeCloseTo(0.002, 6);
  });

  it("includes CP titanium grades in the material database", () => {
    expect(materials.some((mat) => mat.id === "ti_grade1")).toBe(true);
    expect(materials.some((mat) => mat.id === "ti_grade4")).toBe(true);
  });

  it("includes common rigid PVC pipe material", () => {
    const pvc = materials.find((mat) => mat.id === "pvc_u_rigid");
    expect(pvc).toBeDefined();
    expect(pvc?.name).toContain("PVC-U");
    expect(pvc?.creep.isCreepSensitive).toBe(true);
    expect(pvc?.sources.length).toBeGreaterThan(0);
  });
});
