import { plateVonMisesPerPaAtRadius, type PlateProps } from "@/calc/models/plateCircularClamped";

export type HoleCenter = {
  x: number;
  y: number;
  r: number;
  theta_rad: number;
};

export type HoleLayoutResult = {
  centers: HoleCenter[];
  fits: boolean;
};

export type HoleStressResult = HoleCenter & {
  vmPerPa: number;
  dpLimit_Pa: number;
};

export type PlateHoleAnalysis = {
  holes: HoleStressResult[];
  dpLimit_holes_Pa: number;
  worstHole: HoleStressResult | null;
  layout: HoleLayoutResult;
};

const distance = (a: HoleCenter, b: HoleCenter) => Math.hypot(a.x - b.x, a.y - b.y);

export const computeHoleCentersHexPack = (N: number, a: number, D_forbid: number): HoleLayoutResult => {
  if (N <= 0) return { centers: [], fits: true };
  if (!(a > 0) || !(D_forbid > 0)) return { centers: [], fits: false };

  const pitch = D_forbid;
  const dy = D_forbid * Math.sqrt(3) / 2;
  const maxR = a - D_forbid / 2;
  if (maxR <= 0) return { centers: [], fits: false };

  const candidates: HoleCenter[] = [];
  candidates.push({ x: 0, y: 0, r: 0, theta_rad: 0 });
  let row = 0;
  for (let y = -maxR; y <= maxR + 1e-12; y += dy) {
    const offset = row % 2 === 0 ? 0 : pitch / 2;
    for (let x = -maxR + offset; x <= maxR + 1e-12; x += pitch) {
      const r = Math.hypot(x, y);
      if (r <= maxR + 1e-12) {
        candidates.push({ x, y, r, theta_rad: Math.atan2(y, x) });
      }
    }
    row += 1;
  }

  candidates.sort((aPoint, bPoint) => {
    if (aPoint.r !== bPoint.r) return aPoint.r - bPoint.r;
    if (aPoint.y !== bPoint.y) return aPoint.y - bPoint.y;
    return aPoint.x - bPoint.x;
  });

  const selected: HoleCenter[] = [];
  for (const candidate of candidates) {
    if (selected.length >= N) break;
    const ok = selected.every((chosen) => distance(candidate, chosen) >= D_forbid - 1e-9);
    if (ok) selected.push(candidate);
  }

  return { centers: selected, fits: selected.length >= N };
};

export const analyzePlateWithHoles = (params: {
  plate: PlateProps;
  holeCount: number;
  holeForbid_m: number;
  kt: number;
  sigmaAllow_Pa: number;
}): PlateHoleAnalysis => {
  const layout = computeHoleCentersHexPack(params.holeCount, params.plate.a, params.holeForbid_m);
  if (!layout.fits) {
    return { holes: [], dpLimit_holes_Pa: Number.POSITIVE_INFINITY, worstHole: null, layout };
  }

  const holes: HoleStressResult[] = layout.centers.map((hole) => {
    const vmPerPa = plateVonMisesPerPaAtRadius(hole.r, params.plate);
    const dpLimit_Pa = params.sigmaAllow_Pa / (params.kt * vmPerPa);
    return { ...hole, vmPerPa, dpLimit_Pa };
  });

  let worstHole: HoleStressResult | null = null;
  let dpLimit_holes_Pa = Number.POSITIVE_INFINITY;
  for (const hole of holes) {
    if (hole.dpLimit_Pa < dpLimit_holes_Pa) {
      dpLimit_holes_Pa = hole.dpLimit_Pa;
      worstHole = hole;
    }
  }

  return { holes, dpLimit_holes_Pa, worstHole, layout };
};
