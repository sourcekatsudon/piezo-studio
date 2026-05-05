import { generateSampleImpedanceData } from "@/lib/analysis";
import type { PiezoProfile } from "@/lib/types";

export const samplePiezoProfile: PiezoProfile = {
  name: "謎ピエゾ A-62",
  shape: "disk",
  diameterMm: 28,
  thicknessMm: 2.1,
  medium: "water",
  purpose: "trx",
};

export const sampleImpedanceData = generateSampleImpedanceData();
