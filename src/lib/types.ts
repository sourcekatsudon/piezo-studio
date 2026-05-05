export type MaterialCategory = "metal" | "plastic";

export type Material = {
  id: string;
  name: string;
  category: MaterialCategory;
  density_kg_m3: number | null;
  elastic: { E_GPa: number; nu: number };
  strength: {
    yield_MPa: number | null;
    ultimate_MPa: number | null;
    compressive_yield_MPa: number | null;
    design_allow_MPa_short: number;
    design_allow_MPa_long: number;
  };
  creep: {
    isCreepSensitive: boolean;
    longTermFactorDefault: number;
    notes: string;
  };
  notes?: string;
  sources: { title: string; url: string; fields: string[] }[];
};

export type DurationMode = "short" | "medium" | "long";
export type PressureMode = "external" | "internal";
export type WaterType = "freshwater" | "seawater";
export type ShapeType = "cylinder" | "plate" | "plate_penetrators" | "box" | "dome";
export type EndCondition = "closed" | "open";
export type PlaneMode = "plane_strain" | "plane_stress";

export type CylinderGeometry = {
  shape: "cylinder";
  Di_m: number;
  t_m: number;
  L_m: number;
  hasPlate: boolean;
  plate_t_m: number;
};

export type PlateGeometry = {
  shape: "plate";
  radius_m: number;
  t_m: number;
};

export type PlatePenetratorsGeometry = {
  shape: "plate_penetrators";
  radius_m: number;
  t_m: number;
  hole_count: number;
  hole_d_m: number;
  hole_forbid_m: number;
  hole_kt: number;
  hole_kt_mode: "preset" | "manual";
  hole_kt_preset: 3.0 | 3.5 | 4.0;
  hole_kt_variation: "off" | "uniform" | "triangular";
  hole_kt_var_pct: number;
  w_allow_m: number | null;
  attachToCylinder: boolean;
  cylinderLength_m: number;
};

export type BoxGeometry = {
  shape: "box";
  a_m: number;
  b_m: number;
  t_m: number;
};

export type DomeMode = "hemi" | "cap";

export type DomeGeometry = {
  shape: "dome";
  mode: DomeMode;
  Di_m: number;
  t_m: number;
  h_m: number;
  kdfMode: "preset" | "manual";
  kdfPreset: "ideal" | "good" | "hobby" | "rough";
  kdfManual: number;
  sfBuckling: number;
  sfYield: number;
  attachToCylinder: boolean;
  cylinderLength_m: number;
  connection: "integral";
};

export type Geometry =
  | CylinderGeometry
  | PlateGeometry
  | PlatePenetratorsGeometry
  | BoxGeometry
  | DomeGeometry;

export type UncertaintyConfig = {
  enabled: boolean;
  t_tol_m: number;
  d_tol_m: number;
  E_var_pct: number;
  sigma_var_pct: number;
  kdfPreset: "ideal" | "good" | "hobby" | "rough";
  samples: 200 | 2000 | 10000;
  gamma_ln_sigma: number;
};

export type InputState = {
  pressureMode: PressureMode;
  shape: ShapeType;
  geometry: Geometry;
  endCondition: EndCondition;
  planeMode: PlaneMode;
  water: WaterType;
  rho_kg_m3: number;
  internalPressure_Pa: number;
  targetPressure_Pa: number;
  depthTarget_m: number;
  duration: DurationMode;
  uncertainty: UncertaintyConfig;
  mode: "beginner" | "pro";
  units: "metric" | "si";
  autoRun: boolean;
  marginPreset: "ideal" | "conservative" | "ultra";
  pfTarget: number;
};

export type Mode =
  | "tube_yield"
  | "tube_buckling"
  | "plate_stress"
  | "plate_deflection"
  | "plate_hole_stress"
  | "panel_stress"
  | "panel_deflection"
  | "dome_buckling"
  | "dome_yield";

export type LimitResult = {
  dpLimit_Pa: number;
  mode: Mode;
  details: Record<Mode, number>;
};

export type PiezoShape = "disk" | "ring" | "plate" | "tube" | "unknown";
export type PiezoMedium = "air" | "water" | "case" | "unknown";
export type PiezoPurpose = "tx" | "rx" | "trx";
export type PiezoMode = "radial" | "thickness" | "bending" | "higher";
export type ResonanceKind = "main" | "spurious" | "antiresonance";
export type UnderstandingStage =
  | "未同定"
  | "共振候補あり"
  | "等価回路推定済み"
  | "モード仮説あり"
  | "ソナー評価済み";

export type PiezoProfile = {
  name: string;
  shape: PiezoShape;
  diameterMm: number;
  thicknessMm: number;
  medium: PiezoMedium;
  purpose: PiezoPurpose;
};

export type ImpedancePoint = {
  frequencyKhz: number;
  impedanceOhm: number;
  phaseDeg: number;
};

export type ResonancePeak = {
  frequencyKhz: number;
  kind: ResonanceKind;
  strength: "強" | "中" | "弱";
  estimatedMode: string;
  confidence: number;
  comment: string;
};

export type BvdParameters = {
  c0Nf: number;
  rmOhm: number;
  lmMh: number;
  cmPf: number;
  frKhz: number;
  faKhz: number;
  q: number;
  kEff: number;
};

export type SonarParams = {
  medium: "water" | "air";
  driveVoltage: number;
  burstCycles: number;
  targetDistanceM: number;
  requiredResolutionCm: number;
  receiverGainDb: number;
  adcSamplingKhz: number;
  q: number;
  frequencyKhz: number;
  spuriousCount: number;
};

export type SonarResult = {
  recommendedFrequencyKhz: number;
  recommendedBurstCycles: number;
  ringdownMs: number;
  deadZoneCm: number;
  rangeResolutionCm: number;
  score: number;
  notes: string[];
};
