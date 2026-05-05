import type { BvdParameters, ImpedancePoint, ResonancePeak, SonarParams, SonarResult } from "@/lib/types";

export function generateSampleImpedanceData(): ImpedancePoint[] {
  const points: ImpedancePoint[] = [];
  for (let frequencyKhz = 10; frequencyKhz <= 500; frequencyKhz += 0.2) {
    const mainDip = 1620 * Math.exp(-((frequencyKhz - 62.4) ** 2) / 70);
    const spurDip = 520 * Math.exp(-((frequencyKhz - 181.2) ** 2) / 180);
    const antiPeak = 2100 * Math.exp(-((frequencyKhz - 318.6) ** 2) / 220);
    const baseline = 1850 + 0.9 * frequencyKhz + 120 * Math.sin(frequencyKhz / 28);
    const impedanceOhm = Math.max(70, baseline - mainDip - spurDip + antiPeak);
    const phaseDeg =
      18 * Math.sin(frequencyKhz / 34) -
      68 * Math.exp(-((frequencyKhz - 62.4) ** 2) / 120) -
      28 * Math.exp(-((frequencyKhz - 181.2) ** 2) / 230) +
      54 * Math.exp(-((frequencyKhz - 318.6) ** 2) / 260);
    points.push({
      frequencyKhz: Number(frequencyKhz.toFixed(1)),
      impedanceOhm: Number(impedanceOhm.toFixed(1)),
      phaseDeg: Number(phaseDeg.toFixed(1)),
    });
  }
  return points;
}

export function detectResonancePeaks(data: ImpedancePoint[]): ResonancePeak[] {
  if (data.length < 5) return [];

  const localMinimums = data
    .slice(1, -1)
    .filter((point, index) => {
      const previous = data[index];
      const next = data[index + 2];
      return point.impedanceOhm < previous.impedanceOhm && point.impedanceOhm < next.impedanceOhm;
    })
    .sort((a, b) => a.impedanceOhm - b.impedanceOhm);

  const antiresonance = data.reduce((best, point) =>
    point.impedanceOhm > best.impedanceOhm && point.frequencyKhz > 180 ? point : best
  );

  const main = localMinimums[0] ?? data[0];
  const spur = localMinimums.find((point) => Math.abs(point.frequencyKhz - main.frequencyKhz) > 70) ?? data[85];

  return [
    {
      frequencyKhz: Number(main.frequencyKhz.toFixed(1)),
      kind: "main",
      strength: "強",
      estimatedMode: "径方向モード",
      confidence: 72,
      comment: "ソナー駆動候補。電気エネルギーが機械振動へ変換されやすい点です。",
    },
    {
      frequencyKhz: Number(spur.frequencyKhz.toFixed(1)),
      kind: "spurious",
      strength: "中",
      estimatedMode: "高次モード",
      confidence: 45,
      comment: "ケースや固定条件の影響も疑います。水中で再測定すると切り分けやすいです。",
    },
    {
      frequencyKhz: Number(antiresonance.frequencyKhz.toFixed(1)),
      kind: "antiresonance",
      strength: "中",
      estimatedMode: "電気機械結合の評価点",
      confidence: 61,
      comment: "BVDモデル推定に使う反共振候補です。",
    },
  ];
}

export function estimateQ(data: ImpedancePoint[], peakFrequencyKhz: number): number {
  const peak = data.reduce((best, point) =>
    Math.abs(point.frequencyKhz - peakFrequencyKhz) < Math.abs(best.frequencyKhz - peakFrequencyKhz) ? point : best
  );
  const surrounding = data.filter((point) => Math.abs(point.frequencyKhz - peakFrequencyKhz) < 32);
  const maxInBand = Math.max(...surrounding.map((point) => point.impedanceOhm));
  const halfLevel = peak.impedanceOhm + (maxInBand - peak.impedanceOhm) / 2;
  const left = surrounding.filter((point) => point.frequencyKhz < peakFrequencyKhz && point.impedanceOhm >= halfLevel).at(-1);
  const right = surrounding.find((point) => point.frequencyKhz > peakFrequencyKhz && point.impedanceOhm >= halfLevel);
  const bandwidth = right && left ? right.frequencyKhz - left.frequencyKhz : 4.8;
  return Number(Math.max(8, Math.min(90, peakFrequencyKhz / bandwidth)).toFixed(1));
}

export function estimateBvdParameters(data: ImpedancePoint[]): BvdParameters {
  const peaks = detectResonancePeaks(data);
  const frKhz = peaks[0]?.frequencyKhz ?? 62.4;
  const faKhz = peaks[2]?.frequencyKhz ?? 318.6;
  const q = estimateQ(data, frKhz);
  const minZ = Math.min(...data.map((point) => point.impedanceOhm));
  const c0Nf = 2.4;

  // ここは将来、実測ベースのフィッティングに置き換える。
  return {
    c0Nf,
    rmOhm: Number(Math.max(24, minZ * 0.34).toFixed(1)),
    lmMh: Number((q * 0.62).toFixed(1)),
    cmPf: Number((18 / Math.max(q, 1)).toFixed(2)),
    frKhz,
    faKhz,
    q,
    kEff: Number(Math.min(0.42, Math.sqrt(Math.max(0.01, (faKhz - frKhz) / faKhz)) * 0.42).toFixed(2)),
  };
}

export function estimateDeadZone(q: number, frequencyKhz: number): number {
  // ここは将来、実測ベースのフィッティングに置き換える。
  const ringCycles = Math.max(1, q / 2.8);
  const wavelengthCm = 150000 / (frequencyKhz * 1000);
  return Number((ringCycles * wavelengthCm * 0.5).toFixed(1));
}

export function estimateRangeResolution(medium: "water" | "air", bandwidthKhz: number): number {
  // ここは将来、実測ベースのフィッティングに置き換える。
  const soundSpeed = medium === "water" ? 1500 : 343;
  return Number(((soundSpeed / (2 * bandwidthKhz * 1000)) * 100).toFixed(1));
}

export function calculateSonarScore(params: SonarParams): SonarResult {
  const bandwidthKhz = Math.max(4, params.frequencyKhz / Math.max(params.q, 1));
  const deadZoneCm = estimateDeadZone(params.q, params.frequencyKhz);
  const rangeResolutionCm = estimateRangeResolution(params.medium, bandwidthKhz);
  const ringdownMs = Number(((params.q / (Math.PI * params.frequencyKhz)) * 1000).toFixed(2));

  let score = 62;
  score += params.driveVoltage >= 20 ? 10 : 2;
  score += params.q > 12 && params.q < 55 ? 14 : -8;
  score += params.spuriousCount <= 1 ? 8 : -8;
  score += rangeResolutionCm <= params.requiredResolutionCm ? 8 : -10;
  score += params.medium === "water" ? 6 : -4;
  score -= deadZoneCm > params.targetDistanceM * 100 * 0.18 ? 12 : 0;
  score = Math.max(0, Math.min(100, Math.round(score)));

  // ここは将来、実測ベースのフィッティングに置き換える。
  return {
    recommendedFrequencyKhz: params.medium === "water" ? Number((params.frequencyKhz * 0.88).toFixed(1)) : params.frequencyKhz,
    recommendedBurstCycles: params.q > 45 ? Math.max(3, params.burstCycles - 2) : params.burstCycles,
    ringdownMs,
    deadZoneCm,
    rangeResolutionCm,
    score,
    notes: [
      params.q > 45 ? "Qが高いため、近距離では送信後の残響が受信窓に入りやすいです。" : "Qは扱いやすい範囲で、バースト駆動の評価に進めます。",
      params.spuriousCount > 1 ? "スプリアスが多いので、固定方法を変えた再測定を推奨します。" : "主共振が比較的明瞭で、送波用途の候補になります。",
      params.medium === "water" ? "水中では負荷で共振周波数とQが下がる前提で見てください。" : "空中評価は素子の素性把握に向きますが、ソナー判断には媒質を合わせた測定が必要です。",
    ],
  };
}
