import { describe, expect, it } from "vitest";
import { computeHoleCentersHexPack, analyzePlateWithHoles } from "@/calc/models/plateCircularClampedWithHoles";
import { plateVonMisesPerPaAtRadius } from "@/calc/models/plateCircularClamped";

describe("plate with penetrators", () => {
  it("enforces D_forbid spacing", () => {
    const a = 0.08;
    const D = 0.018;
    const { centers, fits } = computeHoleCentersHexPack(10, a, D);
    expect(fits).toBe(true);
    centers.forEach((center, i) => {
      expect(center.r).toBeLessThanOrEqual(a - D / 2 + 1e-9);
      centers.slice(i + 1).forEach((other) => {
        const dist = Math.hypot(center.x - other.x, center.y - other.y);
        expect(dist).toBeGreaterThanOrEqual(D - 1e-9);
      });
    });
  });

  it("scales hole limit inversely with Kt", () => {
    const plate = { a: 0.06, t: 0.006, E_Pa: 70e9, nu: 0.33 };
    const base = analyzePlateWithHoles({
      plate,
      holeCount: 1,
      holeForbid_m: 0.01,
      kt: 3,
      sigmaAllow_Pa: 200e6,
    });
    const high = analyzePlateWithHoles({
      plate,
      holeCount: 1,
      holeForbid_m: 0.01,
      kt: 4,
      sigmaAllow_Pa: 200e6,
    });
    expect(base.dpLimit_holes_Pa / high.dpLimit_holes_Pa).toBeCloseTo(4 / 3, 3);
  });

  it("clamped edge stress exceeds center stress", () => {
    const props = { a: 0.06, t: 0.006, E_Pa: 70e9, nu: 0.33 };
    const vmCenter = plateVonMisesPerPaAtRadius(0, props);
    const vmEdge = plateVonMisesPerPaAtRadius(props.a, props);
    expect(vmCenter).toBeLessThan(vmEdge);
  });
});
