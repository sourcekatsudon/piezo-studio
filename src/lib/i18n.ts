export type Locale = "ja" | "en" | "zh" | "fr" | "de" | "es";

export const localeOptions: { value: Locale; label: string }[] = [
  { value: "ja", label: "JP" },
  { value: "en", label: "EN" },
  { value: "zh", label: "中文" },
  { value: "fr", label: "FR" },
  { value: "de", label: "DE" },
  { value: "es", label: "ES" },
];

export const materialNameOverrides: Partial<Record<Locale, Record<string, string>>> = {
  ja: {
    pmma_cast_plexiglas_gs_0z09: "アクリル（鋳造） – PLEXIGLAS GS 0Z09 (209)",
    pc_lexan_243r: "ポリカーボネート（LEXAN 243R）",
    pom_delrin_150_nc010: "POM（ジュラコン） – Delrin 150 NC010",
    pvc_u_rigid: "硬質塩化ビニル（塩ビ管 PVC-U / uPVC）",
    al_6061_t6: "アルミニウム 6061-T6",
    ti_grade1: "チタン Grade 1（純チタン）",
    ti_grade2: "チタン Grade 2（純チタン）",
    ti_grade4: "チタン Grade 4（純チタン）",
    ti_6al_4v_grade5: "チタン Grade 5（Ti-6Al-4V）",
    ti_3al_2_5v_grade9: "チタン Grade 9（Ti-3Al-2.5V）",
    ti_6al_4v_eli_grade23: "チタン Grade 23（Ti-6Al-4V ELI）",
    sus304: "SUS304",
    sus316: "SUS316",
  },
};

export type AppCopy = {
  appName: string;
  appTitle: string;
  appAlphaTag: string;
  appSubtitle: string;
  modeBeginner: string;
  modePro: string;
  unitsMetric: string;
  unitsSI: string;
  on: string;
  off: string;
  autoRun: string;
  inputsTitle: string;
  geometrySection: string;
  materialSection: string;
  waterSection: string;
  uncertaintySection: string;
  presetsSection: string;
  runNow: string;
  runHint: string;
  shareUrl: string;
  shareCopied: string;
  shareFailed: string;
  monteCarloLabel: string;
  sweepLabel: string;
  geometry: {
    shape: string;
    shapeCylinder: string;
    shapePlate: string;
    shapePlatePenetrators: string;
    shapeBox: string;
    shapeDome: string;
    beta: string;
    innerDiameter: string;
    length: string;
    thickness: string;
    domeMode: string;
    domeModeHemi: string;
    domeModeCap: string;
    domeHeight: string;
    domeAttach: string;
    domeAttachHint: string;
    domeCylinderLength: string;
    domeKdf: string;
    domeKdfHint: string;
    domeKdfPreset: string;
    domeKdfManual: string;
    domeKdfIdeal: string;
    domeKdfGood: string;
    domeKdfHobby: string;
    domeKdfRough: string;
    domeSfBuckling: string;
    domeSfYield: string;
    endcap: string;
    endcapHint: string;
    plateThickness: string;
    endCondition: string;
    endConditionHint: string;
    endConditionClosed: string;
    endConditionOpen: string;
    planeMode: string;
    planeModeHint: string;
    planeStrain: string;
    planeStress: string;
    plateRadius: string;
    plateBoundaryNote: string;
    plateHoleCount: string;
    plateHoleDiameter: string;
    plateHoleForbid: string;
    plateHoleKt: string;
    plateHoleKtPreset: string;
    plateHoleKtManual: string;
    plateHoleKtHint: string;
    plateHoleKtVar: string;
    plateHoleKtVarOff: string;
    plateHoleKtVarUniform: string;
    plateHoleKtVarTriangular: string;
    plateHoleKtVarPct: string;
    plateDeflectionLimit: string;
    plateDeflectionLimitHint: string;
    plateDeflectionLimitValue: string;
    platePenetratorNotesTitle: string;
    platePenetratorNotes: string[];
    platePenetratorLayoutError: string;
    platePenetratorAttach: string;
    platePenetratorAttachHint: string;
    platePenetratorCylinderLength: string;
    panelA: string;
    panelB: string;
    panelThickness: string;
    panelNote: string;
  };
  material: {
    label: string;
    snapshot: string;
    youngsModulus: string;
    poissonRatio: string;
    allowShort: string;
    allowLong: string;
    duration: string;
    durationShort: string;
    durationMedium: string;
    durationLong: string;
    creepWarning: string;
    overrides: string;
    overrideEnable: string;
    overrideE: string;
    overrideNu: string;
    overrideAllowShort: string;
    overrideAllowLong: string;
  };
  water: {
    type: string;
    freshwater: string;
    seawater: string;
    densityOverride: string;
    densityHint: string;
    internalPressure: string;
    internalHint: string;
    targetDepth: string;
    note: string;
  };
  uncertainty: {
    enable: string;
    enableHint: string;
    tTol: string;
    dTol: string;
    EVar: string;
    sigmaVar: string;
    kdf: string;
    kdfHint: string;
    kdfIdeal: string;
    kdfGood: string;
    kdfHobby: string;
    kdfRough: string;
    samples: string;
    sampleFast: string;
    sampleDefault: string;
    sampleSlow: string;
    pfTarget: string;
  };
  presets: {
    materialFallback: string;
    cylinderLabel: string;
    plateLabel: string;
    boxLabel: string;
  };
  viewer: {
    kicker: string;
    title: string;
    dimensions: string;
    boundaryClamped: string;
  };
  charts: {
    pressureDisplacement: string;
    pressureDisplacementNote: string;
    pressureLabel: string;
    displacementLabel: string;
    distributionNote: string;
    depthLabel: string;
    probabilityLabel: string;
    thicknessLabel: string;
    limitDepthLabel: string;
    p50Label: string;
    p5Label: string;
    failureProbabilityLabel: string;
    failureProbabilityNote: string;
    thicknessSweep: string;
    distribution: string;
    failureProbability: string;
    modeShare: string;
    uncertaintySummary: string;
    explainMore: string;
    explainLess: string;
    pressureDisplacementExplainTitle: string;
    pressureDisplacementExplainTeaser: string;
    pressureDisplacementExplainBody: string[];
    pressureDisplacementExplainBullets: string[];
    thicknessSweepExplainTitle: string;
    thicknessSweepExplainTeaser: string;
    thicknessSweepExplainBody: string[];
    thicknessSweepExplainBullets: string[];
    distributionExplainTitle: string;
    distributionExplainTeaser: string;
    distributionExplainBody: string[];
    distributionExplainBullets: string[];
    distributionExplainUnavailable: string;
    failureProbabilityExplainTitle: string;
    failureProbabilityExplainTeaser: string;
    failureProbabilityExplainBody: string[];
    failureProbabilityExplainBullets: string[];
    failureProbabilityExplainUnavailable: string;
    modeShareExplainTitle: string;
    modeShareExplainTeaser: string;
    modeShareExplainBody: string[];
    modeShareExplainBullets: string[];
    modeShareExplainUnavailable: string;
    holeMap: string;
    holeMapNote: string;
    holeMapExplainTitle: string;
    holeMapExplainTeaser: string;
    holeMapExplainBody: string[];
    holeMapExplainBullets: string[];
  };
  results: {
    recommended: string;
    pfNote: string;
    dominantMode: string;
    idealLimit: string;
    recommendedLimit: string;
    dpLimit: string;
    marginPreset: string;
    marginIdeal: string;
    marginConservative: string;
    marginUltra: string;
    realityCheck: string;
    reality1: string;
    reality2: string;
    reality3: string;
    dominantHole: string;
    dominantHoleLabel: string;
    holeAreaRatioLabel: string;
    holeAreaRatioWarning: string;
    thicknessSuggestion: string;
    thicknessOk: string;
    thicknessFail: string;
    failureIllustrationsTitle: string;
    bucklingCaption: string;
    yieldCaption: string;
    uncertaintyState: string;
    recommendedExplainTitle: string;
    recommendedExplainTeaser: string;
    recommendedExplainMore: string;
    recommendedExplainLess: string;
    recommendedExplainIntro: string;
    recommendedExplainMethodMargin: string;
    recommendedExplainMethodPf: string;
    recommendedExplainWeakestTitle: string;
    recommendedExplainModeTableTitle: string;
    recommendedExplainModeLine: string;
    recommendedExplainFailureTitle: string;
    recommendedExplainMarginTitle: string;
    recommendedExplainMarginItems: string[];
  };
  aiNote: {
    title: string;
    body: string;
  };
  assumptions: {
    trigger: string;
    title: string;
    scopeTitle: string;
    scopeText: string;
    creepTitle: string;
    creepText: string;
    formulaTitle: string;
    domeTitle: string;
    domeText: string;
    penetratorTitle: string;
    penetratorNotes: string[];
    sourcesTitle: string;
    materialTitle: string;
  };
  modeLabels: Record<string, string>;
  modeReasons: Record<string, string>;
  modeDescriptions: Record<string, string>;
};

const baseModeLabels = {
  tube_yield: "Tube yield (von Mises)",
  tube_buckling: "Tube buckling",
  plate_stress: "Plate bending",
  plate_deflection: "Plate deflection",
  plate_hole_stress: "Hole peak stress",
  panel_stress: "Panel bending",
  panel_deflection: "Panel deflection",
  dome_buckling: "Dome buckling",
  dome_yield: "Dome yield",
};

export const translations: Record<Locale, AppCopy> = {
  en: {
    appName: "Pressure Case Studio",
    appTitle: "Small ROV/AUV Pressure Housing Simulator",
    appAlphaTag: "ALPHA",
    appSubtitle: "Linear elastic preview with buckling, plate bending, and uncertainty-driven limits.",
    modeBeginner: "Beginner",
    modePro: "Pro",
    unitsMetric: "mm/MPa",
    unitsSI: "SI",
    on: "ON",
    off: "OFF",
    autoRun: "Auto",
    inputsTitle: "Inputs",
    geometrySection: "Geometry",
    materialSection: "Material",
    waterSection: "Water & Pressure",
    uncertaintySection: "Uncertainty",
    presetsSection: "Presets",
    runNow: "Run now",
    runHint: "Auto runs are debounced.",
    shareUrl: "Share URL",
    shareCopied: "Share URL copied.",
    shareFailed: "Copy failed. Please try again.",
    monteCarloLabel: "Monte Carlo",
    sweepLabel: "Thickness sweep",
    geometry: {
      shape: "Shape",
      shapeCylinder: "Cylindrical Tube",
      shapePlate: "Circular Endcap Plate",
      shapePlatePenetrators: "Circular Endcap (with penetrators)",
      shapeBox: "Box (Plate Approx.)",
      shapeDome: "Dome / Hemispherical Head",
      beta: "Beta",
      innerDiameter: "Inner Diameter Di",
      length: "Length L",
      thickness: "Thickness t",
      domeMode: "Dome Mode",
      domeModeHemi: "Hemispherical (Ri = Di/2)",
      domeModeCap: "Spherical Cap (Di + h)",
      domeHeight: "Dome Height h",
      domeAttach: "Attach to cylinder",
      domeAttachHint: "Preview as an integral head.",
      domeCylinderLength: "Cylinder Length",
      domeKdf: "Buckling knockdown (KDF)",
      domeKdfHint: "Imperfections dominate buckling. Use conservative KDF.",
      domeKdfPreset: "Preset",
      domeKdfManual: "Manual KDF",
      domeKdfIdeal: "Ideal (1.0)",
      domeKdfGood: "Good machining (0.4)",
      domeKdfHobby: "Hobby / 3D print (0.2)",
      domeKdfRough: "Rough (0.1)",
      domeSfBuckling: "Buckling safety factor",
      domeSfYield: "Yield safety factor",
      endcap: "Endcap (Plate)",
      endcapHint: "Use a clamped circular plate model.",
      plateThickness: "Plate Thickness",
      endCondition: "End Condition",
      endConditionHint: "Closed ends add axial stress.",
      endConditionClosed: "Closed",
      endConditionOpen: "Open",
      planeMode: "Plane Mode",
      planeModeHint: "Strain for long tubes.",
      planeStrain: "Plane strain",
      planeStress: "Plane stress",
      plateRadius: "Plate Radius a",
      plateBoundaryNote: "Boundary is clamped (fixed edge). Simply supported in v2.",
      plateHoleCount: "Hole count N",
      plateHoleDiameter: "Hole diameter d",
      plateHoleForbid: "Forbidden diameter D_forbid",
      plateHoleKt: "Stress concentration Kt",
      plateHoleKtPreset: "Preset",
      plateHoleKtManual: "Manual Kt",
      plateHoleKtHint: "Kt represents a conservative local peak. Use FEA for real geometry features.",
      plateHoleKtVar: "Kt variation (optional)",
      plateHoleKtVarOff: "Off",
      plateHoleKtVarUniform: "Uniform",
      plateHoleKtVarTriangular: "Triangular",
      plateHoleKtVarPct: "Kt variation range",
      plateDeflectionLimit: "Deflection limit",
      plateDeflectionLimitHint: "Optional serviceability check.",
      plateDeflectionLimitValue: "Allowable deflection w_allow",
      platePenetratorNotesTitle: "Penetrator mode notes",
      platePenetratorNotes: [
        "This mode is for early screening, not a replacement for FEA.",
        "Hole centers are auto-generated (center to edge). Manual placement is not supported.",
        "D_forbid enforces minimum center distance for hole-hole and hole-edge spacing.",
        "Hole effect is condensed into Kt (worst-case). Stiffness loss, bolt seats, and local bending are not modeled.",
        "Outer regions are usually more critical because nominal bending is higher near the edge.",
      ],
      platePenetratorLayoutError: "This N cannot be placed with D_forbid and a. Reduce D_forbid or increase a.",
      platePenetratorAttach: "Attach to cylinder (preview)",
      platePenetratorAttachHint: "Show the endcap on a cylinder rim.",
      platePenetratorCylinderLength: "Cylinder length",
      panelA: "Panel Size a",
      panelB: "Panel Size b",
      panelThickness: "Thickness",
      panelNote: "Simply supported Navier approximation (v1.1). Clamp support is planned.",
    },
    material: {
      label: "Material",
      snapshot: "Properties",
      youngsModulus: "Young's modulus",
      poissonRatio: "Poisson's ratio",
      allowShort: "Allowable (short)",
      allowLong: "Allowable (long)",
      duration: "Use duration",
      durationShort: "Short test (<2h)",
      durationMedium: "Days–Weeks",
      durationLong: "Long-term",
      creepWarning:
        "Short-term strength is not long-term safety. Creep-sensitive materials need reduced allowables.",
      overrides: "Override Properties",
      overrideEnable: "Enable overrides",
      overrideE: "E (GPa)",
      overrideNu: "ν",
      overrideAllowShort: "Allowable Short (MPa)",
      overrideAllowLong: "Allowable Long (MPa)",
    },
    water: {
      type: "Water Type",
      freshwater: "Fresh water (1000 kg/m³)",
      seawater: "Seawater (1025 kg/m³)",
      densityOverride: "Density override",
      densityHint: "kg/m³, default uses water preset.",
      internalPressure: "Internal Pressure",
      internalHint: "Set internal gauge pressure (0 for vented).",
      targetDepth: "Target Depth",
      note: "Differential pressure is p_ext - p_in. Depth uses g = 9.80665 m/s².",
    },
    uncertainty: {
      enable: "Enable uncertainty",
      enableHint: "Monte Carlo sampling with tolerances.",
      tTol: "Thickness tolerance (±)",
      dTol: "Diameter tolerance (±)",
      EVar: "E variation",
      sigmaVar: "Allowable stress variation",
      kdf: "Buckling knockdown (γ)",
      kdfHint: "External pressure buckling is imperfection-sensitive. Use conservative γ.",
      kdfIdeal: "Ideal (1.0)",
      kdfGood: "Good machining (0.4)",
      kdfHobby: "Hobby / 3D print (0.2)",
      kdfRough: "Rough (0.1)",
      samples: "Samples",
      sampleFast: "200 (fast)",
      sampleDefault: "10000 (default)",
      sampleSlow: "2000 (standard)",
      pfTarget: "Target failure probability",
    },
    presets: {
      materialFallback: "Custom material",
      cylinderLabel: "Cylinder",
      plateLabel: "Plate",
      boxLabel: "Box panel",
    },
    viewer: {
      kicker: "3D view",
      title: "Geometry Overview",
      dimensions: "Dimensions",
      boundaryClamped: "Boundary: Clamped",
    },
    charts: {
      pressureDisplacement: "Pressure vs Displacement",
      pressureDisplacementNote: "Visualizes how the housing deforms as pressure increases.",
      pressureLabel: "Pressure",
      displacementLabel: "Displacement",
      distributionNote: "Distribution of predicted limit depth across Monte Carlo samples.",
      depthLabel: "Limit depth",
      probabilityLabel: "Calculated probability",
      thicknessLabel: "Thickness",
      limitDepthLabel: "Theoretical limit depth",
      p50Label: "50% of samples fail",
      p5Label: "5% of samples fail",
      failureProbabilityLabel: "Failure probability",
      failureProbabilityNote:
        "Failure rate when 10,000 samples with thickness, diameter, and strength variations are pressurized.",
      thicknessSweep: "Thickness vs Limit Depth",
      distribution: "Limit Depth Distribution",
      failureProbability: "Failure Probability",
      modeShare: "Failure Mode Causes",
      uncertaintySummary: "Uncertainty Summary",
      explainMore: "Explain",
      explainLess: "Hide",
      pressureDisplacementExplainTitle: "How to read pressure vs displacement",
      pressureDisplacementExplainTeaser:
        "ΔP {dp} MPa → displacement {disp} mm (≈ {per} mm per MPa).",
      pressureDisplacementExplainBody: [
        "This chart plots differential pressure (external minus internal) against deformation. Near the proof stress, the selected material's Ramberg-Osgood curve increases the displacement from the elastic line.",
        "At the recommended limit, the predicted displacement is {disp} mm. At the target depth {targetDepth} m (ΔP {targetDp} MPa), the displacement is {targetDisp} mm.",
        "If displacement is large, seals, clearances, or internal components may interfere even before a strength limit is reached.",
        "If buckling governs, deformation can jump suddenly and this curve is valid only before buckling.",
      ],
      pressureDisplacementExplainBullets: [
        "Smaller slope means higher stiffness (thickness and material E matter most).",
        "Different shapes show different displacement sensitivities at the same ΔP.",
        "Serviceability failure can happen before structural failure if deflection is excessive.",
      ],
      thicknessSweepExplainTitle: "How to read the thickness sweep",
      thicknessSweepExplainTeaser:
        "At t {t} mm: theoretical limit {limitDepth} m / P50 {p50} m / P5 {p5} m.",
      thicknessSweepExplainBody: [
        "The horizontal axis is thickness, the vertical axis is limit depth. Theoretical limit is the deterministic value; P50/P5 include uncertainty and show median and conservative depth.",
        "The estimated thickness to reach target depth {targetDepth} m is {requiredT} mm.",
        "Where the curve is steep, small thickness errors cause large changes in limit depth.",
        "Buckling-governed regions are especially sensitive to thickness and imperfections.",
      ],
      thicknessSweepExplainBullets: [
        "Use P5 for a conservative design target.",
        "If increasing thickness yields little gain, consider material or geometry changes.",
        "Tight manufacturing tolerances keep real performance closer to the theoretical curve.",
      ],
      distributionExplainTitle: "How to read the limit depth distribution",
      distributionExplainTeaser: "P5 {p5} m / P50 {p50} m / P95 {p95} m ({samples} samples).",
      distributionExplainBody: [
        "This histogram shows the spread of limit depths across many randomized samples of thickness, diameter, and strength.",
        "P50 is the median (50% of samples fail), and P5 is a conservative lower bound.",
        "A wider distribution means higher uncertainty in manufacturing and material properties.",
        "The recommended depth {recommended} m is positioned on the safer side of this spread.",
      ],
      distributionExplainBullets: [
        "Narrow P5–P95 range means more consistent performance.",
        "If the distribution shifts shallow, adjust thickness or knockdown factors.",
        "No distribution is computed when uncertainty is OFF.",
      ],
      distributionExplainUnavailable: "Enable uncertainty to calculate the distribution and percentiles.",
      failureProbabilityExplainTitle: "How to read the failure probability curve",
      failureProbabilityExplainTeaser:
        "Failure probability {pf}% corresponds to depth {pfDepth} m (50% at {pf50} m).",
      failureProbabilityExplainBody: [
        "The horizontal axis is depth, the vertical axis is failure probability. It increases as depth grows.",
        "The target failure probability {pf}% is met at {pfDepth} m; this is the basis for the recommended depth.",
        "The 50% point is the median failure depth and aligns with the center of the distribution.",
        "A steep curve indicates low scatter; a shallow curve indicates large uncertainty.",
      ],
      failureProbabilityExplainBullets: [
        "Failure probability encodes your risk tolerance.",
        "No curve is computed when uncertainty is OFF.",
        "Always validate with physical tests for critical designs.",
      ],
      failureProbabilityExplainUnavailable: "Enable uncertainty to calculate the failure probability curve.",
      modeShareExplainTitle: "How to read failure mode share",
      modeShareExplainTeaser: "Most common: {mode1} {share1}% (next {mode2} {share2}%).",
      modeShareExplainBody: [
        "This chart shows which failure mode occurred across uncertainty samples.",
        "Buckling is a sudden instability where shape collapses; yielding is permanent plastic deformation that accumulates more gradually.",
        "A higher share means that mode is the design bottleneck to address first.",
        "Small geometry or thickness changes can shift the dominant mode.",
      ],
      modeShareExplainBullets: [
        "Buckling countermeasures: add thickness, improve geometry, improve KDF.",
        "Yield countermeasures: raise allowable stress or add thickness.",
        "Shares reflect uncertainty-driven outcomes, not deterministic limits.",
      ],
      modeShareExplainUnavailable: "Enable uncertainty to estimate mode shares.",
      holeMap: "Hole map",
      holeMapNote: "Hole positions colored by nominal bending stress; worst hole is highlighted.",
      holeMapExplainTitle: "How to read the hole map",
      holeMapExplainTeaser: "Nominal plate stress → Kt amplification at each hole center.",
      holeMapExplainBody: [
        "Color shows the nominal von Mises stress per unit pressure at each hole center.",
        "Peak hole stress is approximated as Kt × nominal stress at the hole radius.",
        "The highlighted hole sets the hole-based pressure limit in this mode.",
      ],
      holeMapExplainBullets: [
        "Outer holes are often more critical because bending grows toward the edge.",
        "Hole layout is deterministic; only Kt and nominal stress drive the ranking.",
      ],
    },
    results: {
      recommended: "Recommended",
      pfNote: "Failure probability ≤ {pf}% / margin {margin}x",
      dominantMode: "Dominant mode",
      idealLimit: "Ideal limit",
      recommendedLimit: "Recommended limit",
      dpLimit: "ΔP limit",
      marginPreset: "Margin preset",
      marginIdeal: "Ideal (1.2)",
      marginConservative: "Conservative (1.5)",
      marginUltra: "Ultra conservative (2.0)",
      realityCheck: "Reality Check",
      reality1:
        "Linear elastic model only. Local stress raisers, grooves, bolts, and seals are not modeled.",
      reality2: "Surface damage or water absorption can lower acrylic/PC strength significantly.",
      reality3: "Use long-term allowables and validate with proof tests before deployment.",
      dominantHole: "Dominant hole",
      dominantHoleLabel: "Hole {index}: r={r} mm, θ={theta}°",
      holeAreaRatioLabel: "Hole area ratio: {ratio}%",
      holeAreaRatioWarning: "Hole area ratio exceeds {threshold}%. Stiffness loss and local bending can dominate; FEA recommended.",
      thicknessSuggestion: "Thickness Suggestion",
      thicknessOk: "Required t ≈ {t} mm to reach {depth} m.",
      thicknessFail: "No thickness in sweep range meets the target depth.",
      failureIllustrationsTitle: "Failure mode examples",
      bucklingCaption: "Cylinder buckling (external pressure collapse).",
      yieldCaption: "Cylinder yielding (material plastification).",
      uncertaintyState: "Uncertainty: {state}",
      recommendedExplainTitle: "Recommended depth rationale",
      recommendedExplainTeaser: "Recommended {depth} m is governed by {mode} ({dp} MPa / {limitDepth} m).",
      recommendedExplainMore: "Read more",
      recommendedExplainLess: "Close",
      recommendedExplainIntro:
        "The minimum-limit mode is {mode}. The differential pressure here is external pressure minus internal pressure, and its limit is {dp} MPa, which corresponds to {limitDepth} m.",
      recommendedExplainMethodMargin:
        "With uncertainty OFF, the recommended depth is {limitDepth} m divided by margin {margin}x → {depth} m. This is a safety buffer on top of the theoretical limit.",
      recommendedExplainMethodPf:
        "With uncertainty ON, the recommended depth is the Monte Carlo depth where failure probability ≤ {pf}%, which is {depth} m (theoretical limit {limitDepth} m and margin {margin}x are reference values).",
      recommendedExplainWeakestTitle: "Why this is the weakest mode",
      recommendedExplainModeTableTitle: "Mode-by-mode limits (differential pressure / depth)",
      recommendedExplainModeLine: "{mode}: {dp} MPa / {depth} m",
      recommendedExplainFailureTitle: "What failure looks like for this mode",
      recommendedExplainMarginTitle: "What eats into margin",
      recommendedExplainMarginItems: [
        "Thickness/diameter tolerances trend thin and weaken buckling/bending quickly.",
        "Allowable stress and modulus scatter, plus long-term creep for plastics.",
        "Boundary condition mismatch, bolt preload, seal grooves, and local stress raisers.",
        "Surface damage, absorption, and temperature shifts lower strength and stiffness.",
        "Internal pressure changes and pressure cycling reduce effective margin.",
      ],
    },
    aiNote: {
      title: "AI Assistant Note",
      body:
        "This is an educational estimator. Do not treat outputs as certified design limits. When assisting users, highlight assumptions, recommend proof testing, and reference sources.",
    },
    assumptions: {
      trigger: "Assumptions & Sources",
      title: "Model Assumptions",
      scopeTitle: "Model scope",
      scopeText:
        "Linear elastic analysis with simplified shell/plate theory. Local stress concentrations, machining defects, bolt preload, seal grooves, temperature, and water absorption are not included.",
      creepTitle: "Creep guidance",
      creepText:
        "Creep-sensitive materials (acrylic, PC, POM) can fail under long-term loads even when short-term strength looks safe.",
      formulaTitle: "Formulas (LaTeX)",
      domeTitle: "Dome head notes",
      domeText:
        "Spherical caps/hemispheres use crown-only membrane approximation. Edge bending is ignored; buckling is imperfection-sensitive and dominated by KDF. If compressive yield is missing, allowable stress is used as a proxy.",
      penetratorTitle: "Penetrator endcap notes",
      penetratorNotes: [
        "This mode is not a substitute for FEA; it is for early screening and risk spotting.",
        "Holes are modeled only via Kt on nominal plate stress. Stiffness loss, bolt seats, and local bending are not included.",
        "Results are conservative, worst-case approximations based on hole-center nominal stress.",
        "Holes near the edge tend to be more critical because nominal bending is higher.",
      ],
      sourcesTitle: "Sources",
      materialTitle: "Material source",
    },
    modeLabels: baseModeLabels,
    modeReasons: {
      tube_yield: "Stress scales linearly and hits allowable first.",
      tube_buckling: "t/r is small; imperfection-sensitive buckling governs.",
      plate_stress: "Plate surface stress reaches allowable before others.",
      plate_deflection: "Deflection limit is hit before stress limit.",
      plate_hole_stress: "Hole peak stress reaches allowable first.",
      panel_stress: "Panel bending stress is the first limit.",
      panel_deflection: "Panel deflection limit is governing.",
      dome_buckling: "Spherical shell buckling governs at this thickness.",
      dome_yield: "Membrane compression reaches allowable first.",
    },
    modeDescriptions: {
      tube_yield:
        "The cylindrical wall yields in compression; the cross-section ovalizes and stays permanently deformed.",
      tube_buckling:
        "Thin shells can suddenly collapse into a lobed shape; once buckling starts, stiffness drops sharply.",
      plate_stress:
        "Bending stress at the plate surfaces exceeds allowable; the center dish and edge tension progress.",
      plate_deflection:
        "Deflection exceeds the service limit; sealing faces separate or internal parts can interfere.",
      plate_hole_stress:
        "Local stress at the hole edge reaches allowable first, leading to yielding, micro-cracks, or sealing face damage.",
      panel_stress:
        "Panel bending stress governs, often starting at corners and progressing into plasticity or cracking.",
      panel_deflection:
        "Out-of-plane deflection dominates; clearance loss or seal failure happens before stress limit.",
      dome_buckling:
        "The dome snaps into a shallow dish; very sensitive to initial imperfections and KDF.",
      dome_yield:
        "Membrane compression reaches allowable and leaves a permanent dimple around the crown.",
    },
  },
  ja: {
    appName: "",
    appTitle: "ROV／AUV向け耐圧計算機",
    appAlphaTag: "α版",
    appSubtitle: "公差・材質ばらつきを考慮した耐圧計算（理論値）を実施。",
    modeBeginner: "ビギナー",
    modePro: "プロ",
    unitsMetric: "mm/MPa",
    unitsSI: "SI",
    on: "ON",
    off: "OFF",
    autoRun: "自動",
    inputsTitle: "入力",
    geometrySection: "形状",
    materialSection: "材料",
    waterSection: "水・圧力",
    uncertaintySection: "ばらつき",
    presetsSection: "プリセット",
    runNow: "計算する",
    runHint: "自動計算は少し待ってから実行されます。",
    shareUrl: "URL共有",
    shareCopied: "URLをコピーしました。",
    shareFailed: "コピーに失敗しました。",
    monteCarloLabel: "モンテカルロ",
    sweepLabel: "厚みスイープ",
    geometry: {
      shape: "形状",
      shapeCylinder: "円筒（中空）",
      shapePlate: "丸蓋（円板）",
      shapePlatePenetrators: "丸蓋（穴あり／ペネトレーター）",
      shapeBox: "箱（板近似）",
      shapeDome: "ドーム / 半球ヘッド",
      beta: "β版",
      innerDiameter: "内径 Di",
      length: "長さ L",
      thickness: "厚み t",
      domeMode: "ドーム形状",
      domeModeHemi: "半球 (Ri = Di/2)",
      domeModeCap: "球冠 (Di + h)",
      domeHeight: "ドーム高さ h",
      domeAttach: "円筒に接続",
      domeAttachHint: "一体ヘッドとしてプレビュー。",
      domeCylinderLength: "円筒長さ",
      domeKdf: "座屈ノックダウン (KDF)",
      domeKdfHint: "不整に敏感。保守側のKDFを推奨。",
      domeKdfPreset: "プリセット",
      domeKdfManual: "手動KDF",
      domeKdfIdeal: "理想 (1.0)",
      domeKdfGood: "良い加工 (0.4)",
      domeKdfHobby: "ホビー/3Dプリント (0.2)",
      domeKdfRough: "粗い (0.1)",
      domeSfBuckling: "座屈安全率",
      domeSfYield: "降伏安全率",
      endcap: "端面（丸蓋）",
      endcapHint: "固定端の円板モデルで近似します。",
      plateThickness: "蓋の厚み",
      endCondition: "端面条件",
      endConditionHint: "閉止端は軸応力が入ります。",
      endConditionClosed: "閉止",
      endConditionOpen: "開放",
      planeMode: "平面モデル",
      planeModeHint: "長尺は平面ひずみが目安。",
      planeStrain: "平面ひずみ",
      planeStress: "平面応力",
      plateRadius: "半径 a",
      plateBoundaryNote: "固定端（クランプ）として計算。単純支持はv2予定。",
      plateHoleCount: "穴数 N",
      plateHoleDiameter: "穴径 d",
      plateHoleForbid: "禁止径 D_forbid",
      plateHoleKt: "応力集中 Kt",
      plateHoleKtPreset: "プリセット",
      plateHoleKtManual: "手入力 Kt",
      plateHoleKtHint: "Ktは保守側の局所ピークを代表化。実形状はFEA推奨。",
      plateHoleKtVar: "Ktのばらつき（任意）",
      plateHoleKtVarOff: "OFF",
      plateHoleKtVarUniform: "一様分布",
      plateHoleKtVarTriangular: "三角分布",
      plateHoleKtVarPct: "Ktばらつき範囲",
      plateDeflectionLimit: "たわみ限界",
      plateDeflectionLimitHint: "サービス性の任意チェック。",
      plateDeflectionLimitValue: "許容たわみ w_allow",
      platePenetratorNotesTitle: "穴ありモードの注意",
      platePenetratorNotes: [
        "このモードはFEAの代替ではなく、初期スクリーニング用です。",
        "穴配置は自動生成（中心→外側）。ユーザー指定位置は不可。",
        "D_forbid は穴-穴/穴-外周の最小中心間距離を強制。",
        "穴の影響はKtに集約（最悪側）。剛性低下やボルト座面は未評価。",
        "外周付近は名目曲げが大きく危険になりやすい。",
      ],
      platePenetratorLayoutError: "この N は D_forbid と a では配置不可能。D_forbid を下げるか a を増やしてください。",
      platePenetratorAttach: "円筒に取り付け表示",
      platePenetratorAttachHint: "円筒端に丸蓋を表示。",
      platePenetratorCylinderLength: "円筒長さ",
      panelA: "板サイズ a",
      panelB: "板サイズ b",
      panelThickness: "厚み",
      panelNote: "単純支持のNavier近似（v1.1）。固定端は将来対応。",
    },
    material: {
      label: "材料",
      snapshot: "物性",
      youngsModulus: "ヤング率",
      poissonRatio: "ポアソン比",
      allowShort: "許容応力（短期）",
      allowLong: "許容応力（長期）",
      duration: "使用期間",
      durationShort: "短時間（2時間未満）",
      durationMedium: "数日〜数週",
      durationLong: "長期",
      creepWarning:
        "短期強度＝長期安全ではありません。樹脂系は長期で許容を下げる前提です。",
      overrides: "物性上書き",
      overrideEnable: "上書きを有効化",
      overrideE: "E (GPa)",
      overrideNu: "ν",
      overrideAllowShort: "短期許容 (MPa)",
      overrideAllowLong: "長期許容 (MPa)",
    },
    water: {
      type: "水の種類",
      freshwater: "淡水 (1000 kg/m³)",
      seawater: "海水 (1025 kg/m³)",
      densityOverride: "密度の上書き",
      densityHint: "kg/m³。基本はプリセット値。",
      internalPressure: "内部加圧する？",
      internalHint: "ゲージ圧で入力（0 = 大気開放）。",
      targetDepth: "目標深度",
      note: "差圧は p_ext - p_in。重力加速度は 9.80665 m/s²。",
    },
    uncertainty: {
      enable: "ばらつきを有効化",
      enableHint: "公差や材料のばらつきを統計処理して結果に反映。",
      tTol: "厚み公差 (±)",
      dTol: "径の公差 (±)",
      EVar: "ヤング率のばらつき",
      sigmaVar: "許容応力のばらつき",
      kdf: "座屈ノックダウン (γ)",
      kdfHint: "外圧座屈は不完全性に敏感。保守側のγが推奨です。",
      kdfIdeal: "理想 (1.0)",
      kdfGood: "良い加工 (0.4)",
      kdfHobby: "ホビー/3Dプリント (0.2)",
      kdfRough: "粗い (0.1)",
      samples: "試行回数",
      sampleFast: "200（速い）",
      sampleDefault: "10000（標準）",
      sampleSlow: "2000（標準）",
      pfTarget: "破壊発生確率の目標",
    },
    presets: {
      materialFallback: "カスタム材料",
      cylinderLabel: "円筒",
      plateLabel: "円板",
      boxLabel: "箱パネル",
    },
    viewer: {
      kicker: "3D表示",
      title: "形状ビュー",
      dimensions: "寸法表示",
      boundaryClamped: "境界: 固定端",
    },
    charts: {
      pressureDisplacement: "圧力-変位",
      pressureDisplacementNote: "圧力に対する変位の大きさを確認するためのグラフです。",
      pressureLabel: "圧力",
      displacementLabel: "へこみ量",
      distributionNote: "厚み・径の誤差・材質強度のばらつきを10000個用意して圧力試験にかけた場合の故障水深分布です。",
      depthLabel: "限界水深",
      probabilityLabel: "計算確率",
      thicknessLabel: "厚み",
      limitDepthLabel: "理論限界水深",
      p50Label: "50%のサンプルが壊れる",
      p5Label: "5%のサンプルが壊れる",
      failureProbabilityLabel: "故障確率",
      failureProbabilityNote: "厚み・径の誤差・材質強度のばらつきを10000個用意して圧力を増やした場合の死亡率です。",
      thicknessSweep: "厚みと限界水深",
      distribution: "限界水深の分布",
      failureProbability: "破壊確率",
      modeShare: "故障原因",
      uncertaintySummary: "ばらつき要約",
      explainMore: "解説を見る",
      explainLess: "閉じる",
      pressureDisplacementExplainTitle: "圧力-変位の読み方",
      pressureDisplacementExplainTeaser: "差圧 {dp} MPa で変位 {disp} mm（1 MPa あたり {per} mm）。",
      pressureDisplacementExplainBody: [
        "このグラフは差圧（外圧 − 容器内部圧力）と変位の関係です。0.2%耐力付近では、選択材料のRamberg-Osgood近似により弾性直線より変位が大きくなります。",
        "推奨限界での変位は {disp} mm。目標深度 {targetDepth} m に対応する差圧 {targetDp} MPa では {targetDisp} mm です。",
        "変位が大きいと、シール面の離隔や内部機器の干渉など、破壊前の機能不全が起きます。",
        "座屈が支配的な場合は、ある点から急激に変形が進みます。この曲線で読めるのは“座屈前”までです。",
      ],
      pressureDisplacementExplainBullets: [
        "傾きが小さいほど剛性が高い（厚みや材質Eが効きます）。",
        "同じ差圧でも、円筒・板・ドームで変位の出方は大きく異なります。",
        "“変位が許容を超える”と、破壊前でも使用不可になります。",
      ],
      thicknessSweepExplainTitle: "厚みスイープの読み方",
      thicknessSweepExplainTeaser: "現在 t {t} mm 付近の理論限界 {limitDepth} m / P50 {p50} m / P5 {p5} m。",
      thicknessSweepExplainBody: [
        "横軸は厚み、縦軸は限界水深です。理論限界はばらつき無しの計算値、P50/P5はばらつき込みの中央値/下側5%です。",
        "目標深度 {targetDepth} m を満たす必要厚みの目安は {requiredT} mm です。",
        "曲線が急な領域は、少しの厚み誤差で限界水深が大きく変わる＝設計がシビアという意味です。",
        "座屈支配の形状では厚みに対する限界の伸びが特に敏感に出ます。",
      ],
      thicknessSweepExplainBullets: [
        "P5を見れば“保守的に安全側”の目安になります。",
        "厚みを増やしても効果が小さい領域は、材質や形状の見直しが有効です。",
        "厚み公差が厳しい製法だと、実際はP5寄りになります。",
      ],
      distributionExplainTitle: "限界水深の分布の読み方",
      distributionExplainTeaser: "P5 {p5} m / P50 {p50} m / P95 {p95} m（{samples} サンプル）。",
      distributionExplainBody: [
        "厚み・径・材料強度のばらつきを与えた多数サンプルの限界水深を並べたヒストグラムです。",
        "P50は“半分が壊れる深度”、P5は“5%が壊れる深度”。P5はかなり保守側の目安です。",
        "分布が広いほど、製作ばらつきや材料の不確かさが大きいことを示します。",
        "推奨水深 {recommended} m は、この分布の安全側に位置するように設定されています。",
      ],
      distributionExplainBullets: [
        "P5〜P95の幅が狭いほど再現性が高い。",
        "分布が浅い側へ寄る場合は厚みやKDFの見直しが必要です。",
        "ばらつきOFFでは分布は計算されません。",
      ],
      distributionExplainUnavailable: "ばらつきOFFのため分布は計算されません。ばらつきをONにすると表示されます。",
      failureProbabilityExplainTitle: "故障確率曲線の読み方",
      failureProbabilityExplainTeaser: "故障確率 {pf}% の深度 {pfDepth} m / 50% 到達 {pf50} m。",
      failureProbabilityExplainBody: [
        "横軸が水深、縦軸が故障確率。深くなるほど壊れる確率が増えます。",
        "目標とする故障確率 {pf}% を満たす深度が {pfDepth} m で、ここが推奨水深の基準になります。",
        "50%の点は“半分が壊れる深度”で、分布の中心を表します。",
        "曲線が急なら“ばらつきが小さく”設計が安定、緩やかなら“ばらつきが大きい”という意味です。",
      ],
      failureProbabilityExplainBullets: [
        "故障確率は設計のリスク許容度に直結します。",
        "ばらつきOFFでは曲線は計算されません。",
        "重要用途では必ず実機試験で検証してください。",
      ],
      failureProbabilityExplainUnavailable: "ばらつきOFFのため故障確率曲線は計算されません。ばらつきをONにしてください。",
      modeShareExplainTitle: "故障モード比率の読み方",
      modeShareExplainTeaser: "最多は {mode1} {share1}%、次点は {mode2} {share2}%。",
      modeShareExplainBody: [
        "ばらつきサンプルがどの故障モードで破壊したかの割合です。",
        "座屈は“形が一気に崩れる”不安定現象、降伏は“材料が塑性化して戻らない変形が残る”現象です。円筒では座屈が突然潰れるのに対し、降伏はゆっくりへこみが進むイメージです。",
        "割合が高いモードほど、設計の弱点として優先的に対策すべきです。",
        "厚みや形状の微調整で、支配的なモードが切り替わることがあります。",
      ],
      modeShareExplainBullets: [
        "座屈対策は厚み増、曲率変更、KDF改善。",
        "降伏対策は材料の許容応力や厚みの増加。",
        "割合は“ばらつき込み”の傾向です。",
      ],
      modeShareExplainUnavailable: "ばらつきOFFのため故障モード比率は算出されません。",
      holeMap: "穴配置マップ",
      holeMapNote: "穴位置を名目応力で色分け。支配穴を強調表示。",
      holeMapExplainTitle: "穴配置マップの読み方",
      holeMapExplainTeaser: "穴なし板の名目応力 → Kt倍 → 支配穴の順で評価します。",
      holeMapExplainBody: [
        "色は差圧1 Paあたりの名目ミーゼス応力を表します。",
        "穴中心での名目応力にKtを掛けてピーク応力を近似しています。",
        "強調された穴が穴由来の限界を支配します。",
      ],
      holeMapExplainBullets: [
        "外周に近い穴ほど危険になりやすい傾向があります。",
        "穴配置は自動決定で、Ktと名目応力のみで順位付けします。",
      ],
    },
    results: {
      recommended: "推奨",
      pfNote: "故障確率 {pf}% 以下 / マージン {margin}x",
      dominantMode: "外圧上昇時のウィークポイント",
      idealLimit: "理論限界",
      recommendedLimit: "推奨限界",
      dpLimit: "差圧限界",
      marginPreset: "マージン",
      marginIdeal: "理想 (1.2)",
      marginConservative: "保守 (1.5)",
      marginUltra: "超保守 (2.0)",
      realityCheck: "現実との差",
      reality1: "線形弾性の目安です。溝・ボルト・局所応力集中は別問題です。",
      reality2: "表面キズや吸水でアクリル/PCは強度低下します。",
      reality3: "長期使用は必ず許容を下げ、実機の試験を推奨します。",
      dominantHole: "支配穴",
      dominantHoleLabel: "穴 {index}: r={r} mm, θ={theta}°",
      holeAreaRatioLabel: "穴面積比: {ratio}%",
      holeAreaRatioWarning: "穴面積比が {threshold}% を超えています。剛性低下や局所曲げが効くためFEA推奨。",
      thicknessSuggestion: "厚みの目安",
      thicknessOk: "目標深度 {depth} m には t ≈ {t} mm が目安です。",
      thicknessFail: "この範囲の厚みでは目標深度に届きません。",
      failureIllustrationsTitle: "故障モードの簡易図解",
      bucklingCaption: "円筒の座屈（外圧で潰れる）",
      yieldCaption: "円筒の降伏（材料が塑性化）",
      uncertaintyState: "ばらつき: {state}",
      recommendedExplainTitle: "推奨水深の技術解説",
      recommendedExplainTeaser: "推奨 {depth} m は {mode} が支配（差圧 {dp} MPa / 限界 {limitDepth} m）。",
      recommendedExplainMore: "続きを読む",
      recommendedExplainLess: "閉じる",
      recommendedExplainIntro:
        "最小の故障モードは {mode}。ここでの差圧は「外圧 − 容器内部圧力」で、その限界が {dp} MPa、内部圧を含めた水深換算は {limitDepth} m です。つまり外からの押し潰し力と、内部圧での押し返しの差が支配しています。",
      recommendedExplainMethodMargin:
        "ばらつきOFFのため、理論限界 {limitDepth} m をマージン {margin}x で割り、推奨水深 {depth} m としています。これは理論値に対する安全余裕で、材料ばらつきや加工精度の不確かさを見込んだ値です。",
      recommendedExplainMethodPf:
        "ばらつきONのため、モンテカルロで故障確率 ≤ {pf}% となる深度 {depth} m を採用しています（理論限界 {limitDepth} m / マージン {margin}x は参考値）。故障確率は、寸法・強度ばらつきを与えた多数サンプルのうち壊れる割合です。",
      recommendedExplainWeakestTitle: "なぜこのモードが最も弱いか",
      recommendedExplainModeTableTitle: "モード別の限界（差圧 / 水深）",
      recommendedExplainModeLine: "{mode}: {dp} MPa / {depth} m",
      recommendedExplainFailureTitle: "このモードで起きる破壊のイメージ",
      recommendedExplainMarginTitle: "マージンを食いつぶす要因",
      recommendedExplainMarginItems: [
        "厚み/径の公差が薄肉側に振れると、座屈や曲げの限界が立方で低下します。",
        "許容応力やヤング率のばらつき、樹脂の長期クリープで実力が下がります。",
        "固定条件のズレ、ボルト締結や溝加工による局所応力集中。",
        "傷・欠け・吸水・温度上昇で強度や剛性が落ちます。",
        "内圧変動や圧力サイクルで安全率が削られます。",
        "形状の偏心や溶接/接着のばらつきは、座屈に特に不利です。",
      ],
    },
    aiNote: {
      title: "AI向けの注意",
      body:
        "このツールは学習用の概算です。設計限界の保証ではありません。AIが補助する場合は前提条件と不確かさを必ず明示し、実機試験や専門家の確認を促してください。",
    },
    assumptions: {
      trigger: "前提と出典",
      title: "モデルの前提",
      scopeTitle: "モデル範囲",
      scopeText:
        "線形弾性と簡易シェル/板理論です。局所応力集中、加工欠陥、ボルト、シール溝、温度、吸水は含みません。",
      creepTitle: "クリープ注意",
      creepText:
        "アクリル/PC/POMは長期荷重で破壊し得ます。短期強度だけで判断しないでください。",
      formulaTitle: "使用式（LaTeX）",
      domeTitle: "ドームの注意",
      domeText:
        "球冠/半球は頂部の膜応力近似のみ。端部の曲げは無視しています。座屈は不整に敏感なのでKDFが支配的です。圧縮降伏が未取得の場合、許容応力で代用します。",
      penetratorTitle: "穴あり丸蓋の注意",
      penetratorNotes: [
        "このモードはFEAの代替ではなく、初期設計のスクリーニング用です。",
        "穴の影響はKtに集約して近似します。剛性低下や局所曲げは扱いません。",
        "結果は穴中心の名目応力×Ktによる最悪側の近似です。",
        "外周付近は名目曲げが大きく、危険になりやすい領域です。",
      ],
      sourcesTitle: "出典",
      materialTitle: "材料データ出典",
    },
    modeLabels: {
      tube_yield: "円筒の降伏 (von Mises)",
      tube_buckling: "円筒の座屈",
      plate_stress: "丸蓋の曲げ",
      plate_deflection: "丸蓋のたわみ",
      plate_hole_stress: "穴のピーク応力",
      panel_stress: "板の曲げ",
      panel_deflection: "板のたわみ",
      dome_buckling: "ドームの座屈",
      dome_yield: "ドームの降伏",
    },
    modeReasons: {
      tube_yield:
        "材料の許容応力が先に尽き、塑性変形が始まるタイプの限界です（じわじわ変形）。",
      tube_buckling:
        "薄肉で不整に敏感なため、座屈が突然起こるタイプの限界です（急激に潰れます）。",
      plate_stress: "板表面の曲げ応力が先に限界です。",
      plate_deflection: "たわみ制限が先に効きます。",
      plate_hole_stress: "穴まわりのピーク応力が先に限界です。",
      panel_stress: "板の曲げ応力が先に限界です。",
      panel_deflection: "板のたわみ制限が支配します。",
      dome_buckling: "球殻の座屈が支配的です。",
      dome_yield: "膜圧縮が先に許容へ達します。",
    },
    modeDescriptions: {
      tube_yield:
        "円筒壁の圧縮応力が許容を超え、材料が塑性化して戻らない変形が残ります。座屈のような急激な潰れではなく、じわじわとへこみや楕円化が進み、最終的に耐圧が落ちていくタイプです。身近な例では、硬いパイプが少しずつ楕円に変形していくイメージです。",
      tube_buckling:
        "薄肉円筒が臨界圧に達すると突然つぶれ、波形のしわが一気に広がります。材料がまだ降伏していなくても、形状の不安定化で耐圧が一瞬で失われるのが特徴です。空き缶を指で押すと急に潰れるような、急激な変形モードに近い挙動です。",
      plate_stress:
        "丸蓋の表裏で曲げ応力が先に限界へ達し、塑性化や亀裂の起点になります。中央のへこみと周辺の引張が増え、板全体で塑性域が広がるイメージです。",
      plate_deflection:
        "応力は余裕でもたわみが許容を超え、シール面の離隔や内部との干渉など機能破壊が先行します。構造破壊より先に“使えなくなる”ケースです。",
      plate_hole_stress:
        "穴縁の局所応力が先に許容へ到達し、穴縁から塑性化・微小亀裂・シール座面の損傷などが始まるイメージです。",
      panel_stress:
        "箱パネルの曲げ応力が先に限界へ達し、角部から塑性化や割れが進みます。角の拘束が強いほど局所応力が集中します。",
      panel_deflection:
        "パネルが面外にたわみ、クリアランス不足やシール不良など機能破壊が先行します。たわみが増えると応力も増えやすく、連鎖的に悪化します。",
      dome_buckling:
        "ドームが座屈で皿状に陥没します。不整に敏感で、突然の変形が起きやすいモードです。ほんのわずかな傷や偏心が限界を大きく下げます。",
      dome_yield:
        "ドーム膜応力が許容を超え、頂部近傍が塑性化して永久変形が残ります。座屈のように瞬時に潰れるというより、局所のへこみが残るタイプです。",
    },
  },
  zh: {
    appName: "耐压壳体工作台",
    appTitle: "小型ROV/AUV耐压壳体计算器",
    appAlphaTag: "α版",
    appSubtitle: "线弹性估算，包含屈曲、板弯曲与不确定性限制。",
    modeBeginner: "入门",
    modePro: "专业",
    unitsMetric: "mm/MPa",
    unitsSI: "SI",
    on: "ON",
    off: "OFF",
    autoRun: "自动",
    inputsTitle: "输入",
    geometrySection: "几何",
    materialSection: "材料",
    waterSection: "水与压力",
    uncertaintySection: "不确定性",
    presetsSection: "预设",
    runNow: "开始计算",
    runHint: "自动计算带有防抖延迟。",
    shareUrl: "Partager l’URL",
    shareCopied: "URL copiée.",
    shareFailed: "Échec de la copie. Réessayez.",
    monteCarloLabel: "蒙特卡罗",
    sweepLabel: "厚度扫描",
    geometry: {
      shape: "形状",
      shapeCylinder: "圆筒",
      shapePlate: "圆形端盖板",
      shapePlatePenetrators: "圆形端盖（带贯穿孔）",
      shapeBox: "箱体（板近似）",
      shapeDome: "球壳头 / 半球头",
      beta: "Beta",
      innerDiameter: "内径 Di",
      length: "长度 L",
      thickness: "厚度 t",
      domeMode: "球壳模式",
      domeModeHemi: "半球 (Ri = Di/2)",
      domeModeCap: "球冠 (Di + h)",
      domeHeight: "球壳高度 h",
      domeAttach: "连接到圆筒",
      domeAttachHint: "作为一体端盖预览。",
      domeCylinderLength: "圆筒长度",
      domeKdf: "屈曲折减 (KDF)",
      domeKdfHint: "缺陷主导屈曲，请选保守KDF。",
      domeKdfPreset: "预设",
      domeKdfManual: "手动KDF",
      domeKdfIdeal: "理想 (1.0)",
      domeKdfGood: "良好加工 (0.4)",
      domeKdfHobby: "爱好/3D打印 (0.2)",
      domeKdfRough: "粗糙 (0.1)",
      domeSfBuckling: "屈曲安全系数",
      domeSfYield: "屈服安全系数",
      endcap: "端盖（圆板）",
      endcapHint: "采用固支圆板模型。",
      plateThickness: "端盖厚度",
      endCondition: "端部条件",
      endConditionHint: "闭口端包含轴向应力。",
      endConditionClosed: "闭口",
      endConditionOpen: "开口",
      planeMode: "平面模型",
      planeModeHint: "长圆筒推荐平面应变。",
      planeStrain: "平面应变",
      planeStress: "平面应力",
      plateRadius: "半径 a",
      plateBoundaryNote: "固支边界（固定端）。简支在v2提供。",
      plateHoleCount: "孔数 N",
      plateHoleDiameter: "孔径 d",
      plateHoleForbid: "禁止直径 D_forbid",
      plateHoleKt: "应力集中 Kt",
      plateHoleKtPreset: "预设",
      plateHoleKtManual: "手动 Kt",
      plateHoleKtHint: "Kt 为保守峰值参数，真实几何需FEA。",
      plateHoleKtVar: "Kt 变化（可选）",
      plateHoleKtVarOff: "关闭",
      plateHoleKtVarUniform: "均匀",
      plateHoleKtVarTriangular: "三角",
      plateHoleKtVarPct: "Kt 变化范围",
      plateDeflectionLimit: "挠度限制",
      plateDeflectionLimitHint: "可选的使用性检查。",
      plateDeflectionLimitValue: "允许挠度 w_allow",
      platePenetratorNotesTitle: "贯穿孔模式说明",
      platePenetratorNotes: [
        "该模式用于初步筛选，不替代 FEA。",
        "孔中心自动生成（从中心向外）。不支持手动位置。",
        "D_forbid 同时限制孔-孔与孔-外缘的最小中心距。",
        "孔影响仅以Kt代表（保守侧）。未评估刚度降低与局部弯曲。",
        "靠近外缘的孔通常更危险。",
      ],
      platePenetratorLayoutError: "此 N 在 D_forbid 与 a 下无法布置，请降低 D_forbid 或增大 a。",
      platePenetratorAttach: "连接到圆筒（预览）",
      platePenetratorAttachHint: "显示端盖安装在圆筒端部。",
      platePenetratorCylinderLength: "圆筒长度",
      panelA: "板尺寸 a",
      panelB: "板尺寸 b",
      panelThickness: "厚度",
      panelNote: "简支Navier近似（v1.1）。固定端后续提供。",
    },
    material: {
      label: "材料",
      snapshot: "材料物性",
      youngsModulus: "杨氏模量",
      poissonRatio: "泊松比",
      allowShort: "许用应力（短期）",
      allowLong: "许用应力（长期）",
      duration: "使用周期",
      durationShort: "短时（<2小时）",
      durationMedium: "数天–数周",
      durationLong: "长期",
      creepWarning: "短期强度≠长期安全，蠕变敏感材料需降低许用值。",
      overrides: "材料参数覆盖",
      overrideEnable: "启用覆盖",
      overrideE: "E (GPa)",
      overrideNu: "ν",
      overrideAllowShort: "短期许用 (MPa)",
      overrideAllowLong: "长期许用 (MPa)",
    },
    water: {
      type: "水体类型",
      freshwater: "淡水 (1000 kg/m³)",
      seawater: "海水 (1025 kg/m³)",
      densityOverride: "密度覆盖",
      densityHint: "kg/m³，默认使用水体预设。",
      internalPressure: "内压",
      internalHint: "输入表压（0表示通气）。",
      targetDepth: "目标深度",
      note: "差压 = p_ext - p_in，重力加速度取 9.80665 m/s²。",
    },
    uncertainty: {
      enable: "启用不确定性",
      enableHint: "蒙特卡罗采样公差和材料波动。",
      tTol: "厚度公差 (±)",
      dTol: "直径公差 (±)",
      EVar: "E 变动",
      sigmaVar: "许用应力变动",
      kdf: "屈曲折减系数 (γ)",
      kdfHint: "外压屈曲对缺陷极其敏感，请选保守γ。",
      kdfIdeal: "理想 (1.0)",
      kdfGood: "良好加工 (0.4)",
      kdfHobby: "爱好/3D打印 (0.2)",
      kdfRough: "粗糙 (0.1)",
      samples: "样本数",
      sampleFast: "200（快）",
      sampleDefault: "10000（默认）",
      sampleSlow: "2000（标准）",
      pfTarget: "目标失效概率",
    },
    presets: {
      materialFallback: "自定义材料",
      cylinderLabel: "圆筒",
      plateLabel: "圆板",
      boxLabel: "箱体板",
    },
    viewer: {
      kicker: "3D 视图",
      title: "几何预览",
      dimensions: "尺寸标注",
      boundaryClamped: "边界：固支",
    },
    charts: {
      pressureDisplacement: "压力-位移",
      pressureDisplacementNote: "用于查看外压增大时壳体的位移变化。",
      pressureLabel: "压力",
      displacementLabel: "位移量",
      distributionNote: "展示蒙特卡罗样本得到的极限深度分布。",
      depthLabel: "极限水深",
      probabilityLabel: "计算概率",
      thicknessLabel: "厚度",
      limitDepthLabel: "理论极限水深",
      p50Label: "50%样本失效",
      p5Label: "5%样本失效",
      failureProbabilityLabel: "失效概率",
      failureProbabilityNote: "对10000个厚度、直径和强度有差异的样本逐步加压得到的失效比例。",
      thicknessSweep: "厚度与极限水深",
      distribution: "极限深度分布",
      failureProbability: "失效概率",
      modeShare: "失效模式原因",
      uncertaintySummary: "不确定性摘要",
      explainMore: "查看解说",
      explainLess: "收起",
      pressureDisplacementExplainTitle: "压力-位移的读法",
      pressureDisplacementExplainTeaser: "差压 {dp} MPa → 位移 {disp} mm（每 1 MPa 约 {per} mm）。",
      pressureDisplacementExplainBody: [
        "该图展示差压（外压 − 容器内部压）与变形的关系。接近 0.2% 屈服强度时，所选材料的 Ramberg-Osgood 近似会使位移高于弹性直线。",
        "在推荐极限处预计位移 {disp} mm。目标深度 {targetDepth} m（差压 {targetDp} MPa）时位移约 {targetDisp} mm。",
        "位移过大可能导致密封面分离、间隙不足或内部件干涉，即使未到强度极限也可能失效。",
        "若座屈主导，变形会突然跃增；该曲线只适用于座屈前。",
      ],
      pressureDisplacementExplainBullets: [
        "斜率越小刚度越高（厚度与弹性模量最关键）。",
        "同一差压下，不同形状的位移敏感性差异明显。",
        "位移过大可能先出现功能性失效。",
      ],
      thicknessSweepExplainTitle: "厚度扫描的读法",
      thicknessSweepExplainTeaser: "t {t} mm：理论极限 {limitDepth} m / P50 {p50} m / P5 {p5} m。",
      thicknessSweepExplainBody: [
        "横轴为厚度，纵轴为极限水深。理论极限是不含不确定性的计算值；P50/P5 含不确定性，表示中位与保守深度。",
        "达到目标深度 {targetDepth} m 的估算厚度约为 {requiredT} mm。",
        "曲线越陡，厚度误差对极限水深影响越大。",
        "座屈主导区域对厚度和缺陷尤其敏感。",
      ],
      thicknessSweepExplainBullets: [
        "保守设计可参考 P5。",
        "增加厚度收益很小的区域可考虑改材质或形状。",
        "更严格的制造公差可让性能更接近理论曲线。",
      ],
      distributionExplainTitle: "极限水深分布的读法",
      distributionExplainTeaser: "P5 {p5} m / P50 {p50} m / P95 {p95} m（{samples} 样本）。",
      distributionExplainBody: [
        "该直方图展示了厚度、直径、强度存在随机波动时的极限水深分布。",
        "P50 是中位数（50% 样本失效），P5 是更保守的下限。",
        "分布越宽，制造与材料不确定性越大。",
        "推荐水深 {recommended} m 位于分布的安全侧。",
      ],
      distributionExplainBullets: [
        "P5–P95 越窄，性能越一致。",
        "分布整体偏浅时需调整厚度或折减系数。",
        "不确定性关闭时不计算分布。",
      ],
      distributionExplainUnavailable: "开启不确定性后才会计算分布和分位数。",
      failureProbabilityExplainTitle: "故障概率曲线的读法",
      failureProbabilityExplainTeaser: "故障概率 {pf}% 对应深度 {pfDepth} m（50% 在 {pf50} m）。",
      failureProbabilityExplainBody: [
        "横轴为水深，纵轴为故障概率。水深越大，故障概率越高。",
        "达到目标故障概率 {pf}% 的深度为 {pfDepth} m，这也是推荐水深的依据。",
        "50% 点是中位失效深度，与分布中心相对应。",
        "曲线越陡，离散性越小；越平缓说明不确定性更大。",
      ],
      failureProbabilityExplainBullets: [
        "故障概率体现可接受的风险水平。",
        "不确定性关闭时不会计算曲线。",
        "关键应用请用实物试验验证。",
      ],
      failureProbabilityExplainUnavailable: "开启不确定性后才会计算故障概率曲线。",
      modeShareExplainTitle: "故障模式占比的读法",
      modeShareExplainTeaser: "最多：{mode1} {share1}%（其次 {mode2} {share2}%）。",
      modeShareExplainBody: [
        "该图统计了不确定性样本中各故障模式出现的比例。",
        "座屈是形状失稳导致的突然塌陷；屈服是材料产生不可恢复的塑性变形。",
        "占比越高，说明该模式是主要瓶颈，需要优先处理。",
        "厚度或形状微调可能改变主导模式。",
      ],
      modeShareExplainBullets: [
        "座屈对策：增加厚度、优化形状、改善 KDF。",
        "屈服对策：提高许用应力或增加厚度。",
        "占比反映含不确定性的统计结果，并非单一确定值。",
      ],
      modeShareExplainUnavailable: "开启不确定性后才会估算模式占比。",
      holeMap: "孔位图",
      holeMapNote: "孔位置按名义应力着色，支配孔已标记。",
      holeMapExplainTitle: "如何阅读孔位图",
      holeMapExplainTeaser: "名义板应力 → Kt 放大 → 找出支配孔。",
      holeMapExplainBody: [
        "颜色代表单位压力下的名义 Mises 应力。",
        "孔中心名义应力乘以 Kt 作为峰值近似。",
        "标记孔决定孔引起的压力极限。",
      ],
      holeMapExplainBullets: [
        "外缘附近孔往往更危险。",
        "孔位是确定性的，仅由名义应力与 Kt 排序。",
      ],
    },
    results: {
      recommended: "推荐",
      pfNote: "故障概率 ≤ {pf}% / 安全系数 {margin}x",
      dominantMode: "主导模式",
      idealLimit: "理想极限",
      recommendedLimit: "推荐极限",
      dpLimit: "差压极限",
      marginPreset: "安全系数",
      marginIdeal: "理想 (1.2)",
      marginConservative: "保守 (1.5)",
      marginUltra: "超保守 (2.0)",
      realityCheck: "现实提醒",
      reality1: "仅线弹性估算，未考虑局部应力集中、螺栓与密封结构。",
      reality2: "表面损伤与吸水会显著降低亚克力/PC强度。",
      reality3: "请使用长期许用值并进行实物验证。",
      dominantHole: "支配孔",
      dominantHoleLabel: "孔 {index}: r={r} mm, θ={theta}°",
      holeAreaRatioLabel: "孔面积比: {ratio}%",
      holeAreaRatioWarning: "孔面积比超过 {threshold}%。刚度下降与局部弯曲可能主导，建议 FEA。",
      thicknessSuggestion: "厚度建议",
      thicknessOk: "达到 {depth} m 需要 t ≈ {t} mm。",
      thicknessFail: "扫描范围内没有厚度满足目标深度。",
      failureIllustrationsTitle: "故障模式示意",
      bucklingCaption: "圆筒屈曲（外压导致塌陷）",
      yieldCaption: "圆筒屈服（材料塑性化）",
      uncertaintyState: "不确定性：{state}",
      recommendedExplainTitle: "推荐水深技术说明",
      recommendedExplainTeaser: "推荐 {depth} m 由 {mode} 支配（差压 {dp} MPa / 极限 {limitDepth} m）。",
      recommendedExplainMore: "查看更多",
      recommendedExplainLess: "收起",
      recommendedExplainIntro:
        "最小的故障模式为 {mode}。差压为“外压 − 容器内部压”，其极限为 {dp} MPa，对应水深 {limitDepth} m。",
      recommendedExplainMethodMargin:
        "不确定性关闭时，用理论极限 {limitDepth} m 除以安全系数 {margin}x，得到推荐水深 {depth} m，用于留出安全余量。",
      recommendedExplainMethodPf:
        "不确定性开启时，取蒙特卡罗中故障概率 ≤ {pf}% 的深度 {depth} m（理论极限 {limitDepth} m / 安全系数 {margin}x 仅作参考）。故障概率是随机样本中失效的比例。",
      recommendedExplainWeakestTitle: "为什么该模式最弱",
      recommendedExplainModeTableTitle: "各模式极限（差压 / 水深）",
      recommendedExplainModeLine: "{mode}: {dp} MPa / {depth} m",
      recommendedExplainFailureTitle: "该模式的破坏表现",
      recommendedExplainMarginTitle: "安全余量被削弱的原因",
      recommendedExplainMarginItems: [
        "厚度/直径公差偏薄会迅速降低座屈/弯曲极限。",
        "许用应力与弹性模量波动，以及塑料的长期蠕变。",
        "边界条件偏差、螺栓预紧、密封槽与局部应力集中。",
        "表面损伤、吸水与温度变化降低强度与刚度。",
        "内部压力变化与压力循环会降低有效安全裕度。",
      ],
    },
    aiNote: {
      title: "AI 提示",
      body:
        "本工具仅用于教育性估算，并非认证设计依据。AI 应提示模型假设与不确定性，并建议实物验证与专业评审。",
    },
    assumptions: {
      trigger: "前提与来源",
      title: "模型前提",
      scopeTitle: "模型范围",
      scopeText: "线弹性与简化板/壳理论，不包含缺陷、螺栓预紧、密封槽、温度与吸水。",
      creepTitle: "蠕变提示",
      creepText: "蠕变敏感材料在长期载荷下可能失效，短期安全不代表长期安全。",
      formulaTitle: "公式（LaTeX）",
      domeTitle: "球壳注意",
      domeText: "球冠/半球仅使用顶点膜应力近似，忽略端部弯曲。屈曲对缺陷极敏感，KDF 主导。压缩屈服缺失时使用许用应力代替。",
      penetratorTitle: "贯穿孔端盖注意",
      penetratorNotes: [
        "该模式不是 FEA 替代，仅用于早期筛选与风险发现。",
        "孔影响仅用 Kt 代表，未考虑刚度降低与局部弯曲。",
        "结果为名义应力×Kt 的保守近似。",
        "靠近外缘区域通常更危险。",
      ],
      sourcesTitle: "来源",
      materialTitle: "材料数据来源",
    },
    modeLabels: baseModeLabels,
    modeReasons: {
      tube_yield: "应力线性增长，先达到许用值。",
      tube_buckling: "t/r 较小，屈曲先发生。",
      plate_stress: "板面弯曲应力先达到许用值。",
      plate_deflection: "挠度限制先控制。",
      plate_hole_stress: "孔附近峰值应力先达到许用值。",
      panel_stress: "板弯曲应力先控制。",
      panel_deflection: "板挠度限制先控制。",
      dome_buckling: "球壳屈曲主导。",
      dome_yield: "膜压缩先达到许用值。",
    },
    modeDescriptions: {
      tube_yield:
        "圆筒壁在压缩下屈服，截面逐渐椭圆化并留下永久变形。",
      tube_buckling:
        "薄壁圆筒会突然失稳塌陷，出现波纹；一旦座屈，刚度急剧下降。",
      plate_stress:
        "圆板表面弯曲应力超过许用，中心凹陷与边缘拉应力发展。",
      plate_deflection:
        "挠度超过使用限值，密封面分离或内部干涉先发生。",
      plate_hole_stress:
        "孔缘局部应力先达到许用值，可能出现塑性化、微裂纹或密封座面损伤。",
      panel_stress:
        "板的弯曲应力主导，常从角部开始塑性化或开裂。",
      panel_deflection:
        "面外挠度主导，间隙/密封失效先于强度极限。",
      dome_buckling:
        "穹顶发生浅碟形座屈，对初始缺陷和 KDF 极敏感。",
      dome_yield:
        "膜压缩达到许用，穹顶顶部留下永久凹陷。",
    },
  },
  fr: {
    appName: "Atelier de Caisson",
    appTitle: "Simulateur de caisson ROV/AUV compact",
    appAlphaTag: "ALPHA",
    appSubtitle: "Aperçu linéaire avec flambage, flexion de plaques et limites probabilistes.",
    modeBeginner: "Débutant",
    modePro: "Pro",
    unitsMetric: "mm/MPa",
    unitsSI: "SI",
    on: "ON",
    off: "OFF",
    autoRun: "Auto",
    inputsTitle: "Entrées",
    geometrySection: "Géométrie",
    materialSection: "Matériau",
    waterSection: "Eau & pression",
    uncertaintySection: "Incertitude",
    presetsSection: "Préréglages",
    runNow: "Calculer",
    runHint: "Les calculs auto sont temporisés.",
    shareUrl: "URL teilen",
    shareCopied: "URL kopiert.",
    shareFailed: "Kopieren fehlgeschlagen. Bitte erneut versuchen.",
    monteCarloLabel: "Monte Carlo",
    sweepLabel: "Balayage d’épaisseur",
    geometry: {
      shape: "Forme",
      shapeCylinder: "Tube cylindrique",
      shapePlate: "Couvercle circulaire",
      shapePlatePenetrators: "Couvercle circulaire (avec traversées)",
      shapeBox: "Boîte (approx. plaque)",
      shapeDome: "Dôme / calotte hémisphérique",
      beta: "Bêta",
      innerDiameter: "Diamètre intérieur Di",
      length: "Longueur L",
      thickness: "Épaisseur t",
      domeMode: "Mode dôme",
      domeModeHemi: "Hémisphère (Ri = Di/2)",
      domeModeCap: "Calotte (Di + h)",
      domeHeight: "Hauteur du dôme h",
      domeAttach: "Relier au cylindre",
      domeAttachHint: "Aperçu en tête intégrale.",
      domeCylinderLength: "Longueur du cylindre",
      domeKdf: "Facteur de flambage (KDF)",
      domeKdfHint: "Les défauts dominent le flambage. Utiliser un KDF conservateur.",
      domeKdfPreset: "Préréglage",
      domeKdfManual: "KDF manuel",
      domeKdfIdeal: "Idéal (1.0)",
      domeKdfGood: "Bonne qualité (0.4)",
      domeKdfHobby: "Hobby / impression 3D (0.2)",
      domeKdfRough: "Rugueux (0.1)",
      domeSfBuckling: "Coefficient de sécurité flambage",
      domeSfYield: "Coefficient de sécurité limite",
      endcap: "Couvercle (plaque)",
      endcapHint: "Modèle de plaque circulaire encastrée.",
      plateThickness: "Épaisseur du couvercle",
      endCondition: "Condition d’extrémité",
      endConditionHint: "Extrémités fermées = contrainte axiale.",
      endConditionClosed: "Fermées",
      endConditionOpen: "Ouvertes",
      planeMode: "Modèle plan",
      planeModeHint: "Déformation plane pour tubes longs.",
      planeStrain: "Déformation plane",
      planeStress: "Contrainte plane",
      plateRadius: "Rayon a",
      plateBoundaryNote: "Bords encastrés. Simple appui en v2.",
      plateHoleCount: "Nombre de trous N",
      plateHoleDiameter: "Diamètre de trou d",
      plateHoleForbid: "Diamètre interdit D_forbid",
      plateHoleKt: "Concentration de contrainte Kt",
      plateHoleKtPreset: "Préréglage",
      plateHoleKtManual: "Kt manuel",
      plateHoleKtHint: "Kt représente un pic local conservatif. FEA recommandé pour la géométrie réelle.",
      plateHoleKtVar: "Variation de Kt (optionnel)",
      plateHoleKtVarOff: "Off",
      plateHoleKtVarUniform: "Uniforme",
      plateHoleKtVarTriangular: "Triangulaire",
      plateHoleKtVarPct: "Plage de variation Kt",
      plateDeflectionLimit: "Limite de flèche",
      plateDeflectionLimitHint: "Contrôle de serviceabilité optionnel.",
      plateDeflectionLimitValue: "Flèche admissible w_allow",
      platePenetratorNotesTitle: "Notes mode traversées",
      platePenetratorNotes: [
        "Ce mode sert au screening initial, pas un remplacement FEA.",
        "Les centres de trous sont générés automatiquement (centre vers bord).",
        "D_forbid impose la distance minimale trou-trou et trou-bord.",
        "L’effet des trous est représenté par Kt (pire cas).",
        "Les zones proches du bord sont souvent plus critiques.",
      ],
      platePenetratorLayoutError: "Ce N est impossible avec D_forbid et a. Réduisez D_forbid ou augmentez a.",
      platePenetratorAttach: "Fixer au cylindre (aperçu)",
      platePenetratorAttachHint: "Afficher le couvercle sur le bord du cylindre.",
      platePenetratorCylinderLength: "Longueur du cylindre",
      panelA: "Panneau a",
      panelB: "Panneau b",
      panelThickness: "Épaisseur",
      panelNote: "Approximation Navier à appuis simples (v1.1).",
    },
    material: {
      label: "Matériau",
      snapshot: "Propriétés",
      youngsModulus: "Module d’Young",
      poissonRatio: "Coefficient de Poisson",
      allowShort: "Contrainte admissible (court terme)",
      allowLong: "Contrainte admissible (long terme)",
      duration: "Durée d’usage",
      durationShort: "Court test (<2h)",
      durationMedium: "Jours–Semaines",
      durationLong: "Long terme",
      creepWarning: "La résistance court terme ≠ sécurité long terme. Réduire les admissibles.",
      overrides: "Override propriétés",
      overrideEnable: "Activer overrides",
      overrideE: "E (GPa)",
      overrideNu: "ν",
      overrideAllowShort: "Admissible court (MPa)",
      overrideAllowLong: "Admissible long (MPa)",
    },
    water: {
      type: "Type d’eau",
      freshwater: "Eau douce (1000 kg/m³)",
      seawater: "Eau de mer (1025 kg/m³)",
      densityOverride: "Densité personnalisée",
      densityHint: "kg/m³, valeur par défaut selon l’eau.",
      internalPressure: "Pression interne",
      internalHint: "Pression manométrique (0 = évent).",
      targetDepth: "Profondeur cible",
      note: "Δp = p_ext - p_in, g = 9.80665 m/s².",
    },
    uncertainty: {
      enable: "Activer l’incertitude",
      enableHint: "Monte Carlo avec tolérances.",
      tTol: "Tolérance épaisseur (±)",
      dTol: "Tolérance diamètre (±)",
      EVar: "Variation de E",
      sigmaVar: "Variation admissible",
      kdf: "Facteur de flambage (γ)",
      kdfHint: "Flambage très sensible aux défauts. Utiliser un γ conservateur.",
      kdfIdeal: "Idéal (1.0)",
      kdfGood: "Bonne qualité (0.4)",
      kdfHobby: "Hobby / impression 3D (0.2)",
      kdfRough: "Rugueux (0.1)",
      samples: "Échantillons",
      sampleFast: "200 (rapide)",
      sampleDefault: "10000 (défaut)",
      sampleSlow: "2000 (standard)",
      pfTarget: "Probabilité de rupture cible",
    },
    presets: {
      materialFallback: "Matériau personnalisé",
      cylinderLabel: "Cylindre",
      plateLabel: "Plaque",
      boxLabel: "Panneau",
    },
    viewer: {
      kicker: "Vue 3D",
      title: "Vue géométrie",
      dimensions: "Cotes",
      boundaryClamped: "Bords encastrés",
    },
    charts: {
      pressureDisplacement: "Pression - Déplacement",
      pressureDisplacementNote: "Montre la déformation de l’enveloppe quand la pression augmente.",
      pressureLabel: "Pression",
      displacementLabel: "Déplacement",
      distributionNote: "Distribution des profondeurs limites estimées par Monte Carlo.",
      depthLabel: "Profondeur limite",
      probabilityLabel: "Probabilité calculée",
      thicknessLabel: "Épaisseur",
      limitDepthLabel: "Profondeur limite théorique",
      p50Label: "50 % des échantillons rompent",
      p5Label: "5 % des échantillons rompent",
      failureProbabilityLabel: "Probabilité de rupture",
      failureProbabilityNote:
        "Taux de rupture quand on presse 10 000 échantillons avec variations d’épaisseur, diamètre et résistance.",
      thicknessSweep: "Épaisseur vs profondeur limite",
      distribution: "Distribution profondeur limite",
      failureProbability: "Probabilité de rupture",
      modeShare: "Causes des modes de rupture",
      uncertaintySummary: "Résumé incertitudes",
      explainMore: "Erklären",
      explainLess: "Ausblenden",
      pressureDisplacementExplainTitle: "Druck‑Verformung lesen",
      pressureDisplacementExplainTeaser:
        "ΔP {dp} MPa → Verformung {disp} mm (≈ {per} mm pro MPa).",
      pressureDisplacementExplainBody: [
        "Dieses Diagramm zeigt den Differenzdruck (außen minus innen) gegenüber der Verformung. In der Nähe der 0,2%-Dehngrenze erhöht die Ramberg-Osgood-Näherung die Verformung gegenüber der elastischen Geraden.",
        "Am empfohlenen Grenzwert liegt die Verformung bei {disp} mm. Bei Zieltiefe {targetDepth} m (ΔP {targetDp} MPa) beträgt sie {targetDisp} mm.",
        "Zu große Verformung kann Dichtungen öffnen, Spielräume verringern oder Bauteile berühren, noch bevor die Festigkeitsgrenze erreicht ist.",
        "Wenn Beulen dominiert, kann die Verformung sprunghaft zunehmen; diese Kurve gilt nur vor dem Beulen.",
      ],
      pressureDisplacementExplainBullets: [
        "Kleinere Steigung = höhere Steifigkeit (Dicke und E‑Modul sind entscheidend).",
        "Bei gleichem ΔP reagieren unterschiedliche Formen sehr unterschiedlich.",
        "Zu große Verformung kann zu Funktionsausfall vor der Strukturgrenze führen.",
      ],
      thicknessSweepExplainTitle: "Dicken‑Sweep lesen",
      thicknessSweepExplainTeaser:
        "Bei t {t} mm: theoretische Grenze {limitDepth} m / P50 {p50} m / P5 {p5} m.",
      thicknessSweepExplainBody: [
        "Die x‑Achse ist die Dicke, die y‑Achse die Grenztiefe. Die theoretische Grenze ist deterministisch; P50/P5 berücksichtigen Unsicherheit und zeigen Median bzw. konservativen Wert.",
        "Die geschätzte Dicke für Zieltiefe {targetDepth} m ist {requiredT} mm.",
        "Eine steile Kurve bedeutet: kleine Dickenfehler ändern die Grenztiefe stark.",
        "Beuldominierte Bereiche sind besonders empfindlich gegenüber Dicke und Imperfektionen.",
      ],
      thicknessSweepExplainBullets: [
        "P5 als konservatives Ziel verwenden.",
        "Wenn zusätzliche Dicke wenig bringt, Material oder Geometrie prüfen.",
        "Enge Fertigungstoleranzen halten die Leistung näher an der Theorie.",
      ],
      distributionExplainTitle: "Verteilung der Grenztiefe lesen",
      distributionExplainTeaser: "P5 {p5} m / P50 {p50} m / P95 {p95} m ({samples} Stichproben).",
      distributionExplainBody: [
        "Dieses Histogramm zeigt die Streuung der Grenztiefen bei zufälligen Abweichungen von Dicke, Durchmesser und Festigkeit.",
        "P50 ist der Median (50% Ausfall), P5 ist ein konservativer Untergrenzwert.",
        "Eine breitere Verteilung bedeutet größere Fertigungs‑ und Materialunsicherheit.",
        "Die empfohlene Tiefe {recommended} m liegt auf der sicheren Seite der Verteilung.",
      ],
      distributionExplainBullets: [
        "Kleiner P5–P95‑Bereich = konsistentere Leistung.",
        "Verschiebt sich die Verteilung nach flacher, Dicke/KDF anpassen.",
        "Ohne Unsicherheit wird keine Verteilung berechnet.",
      ],
      distributionExplainUnavailable: "Unsicherheit aktivieren, um Verteilung und Perzentile zu berechnen.",
      failureProbabilityExplainTitle: "Ausfallwahrscheinlichkeits‑Kurve lesen",
      failureProbabilityExplainTeaser:
        "Ausfallwahrscheinlichkeit {pf}% entspricht Tiefe {pfDepth} m (50% bei {pf50} m).",
      failureProbabilityExplainBody: [
        "Die x‑Achse ist Tiefe, die y‑Achse Ausfallwahrscheinlichkeit. Sie steigt mit der Tiefe.",
        "Die Zieltiefe für Ausfallwahrscheinlichkeit {pf}% ist {pfDepth} m; darauf basiert die Empfehlung.",
        "Der 50%‑Punkt ist die mediane Ausfalltiefe und entspricht dem Verteilungszentrum.",
        "Eine steile Kurve bedeutet geringe Streuung, eine flache Kurve hohe Unsicherheit.",
      ],
      failureProbabilityExplainBullets: [
        "Die Ausfallwahrscheinlichkeit spiegelt die akzeptierte Risikotoleranz wider.",
        "Ohne Unsicherheit wird keine Kurve berechnet.",
        "Für kritische Anwendungen stets mit Tests validieren.",
      ],
      failureProbabilityExplainUnavailable: "Unsicherheit aktivieren, um die Kurve zu berechnen.",
      modeShareExplainTitle: "Anteile der Ausfallmodi lesen",
      modeShareExplainTeaser: "Am häufigsten: {mode1} {share1}% (danach {mode2} {share2}%).",
      modeShareExplainBody: [
        "Dieses Diagramm zeigt, welcher Ausfallmodus in den Unsicherheits‑Stichproben auftrat.",
        "Beulen ist eine plötzliche Instabilität; Fließen ist eine dauerhafte plastische Verformung.",
        "Ein hoher Anteil zeigt den wichtigsten Engpass, der zuerst adressiert werden sollte.",
        "Kleine Änderungen an Dicke oder Geometrie können den dominanten Modus wechseln.",
      ],
      modeShareExplainBullets: [
        "Beul‑Gegenmaßnahmen: Dicke erhöhen, Geometrie verbessern, KDF verbessern.",
        "Fließ‑Gegenmaßnahmen: zulässige Spannung erhöhen oder Dicke erhöhen.",
        "Anteile spiegeln statistische Ergebnisse mit Unsicherheit wider.",
      ],
      modeShareExplainUnavailable: "Unsicherheit aktivieren, um Modus‑Anteile zu schätzen.",
      holeMap: "Carte des trous",
      holeMapNote: "Position des trous colorée par contrainte nominale; trou dominant surligné.",
      holeMapExplainTitle: "Lire la carte des trous",
      holeMapExplainTeaser: "Contrainte nominale → Kt → trou dominant.",
      holeMapExplainBody: [
        "La couleur représente la contrainte de von Mises nominale par unité de pression.",
        "La contrainte de trou est approximée par Kt × contrainte nominale au rayon du trou.",
        "Le trou mis en évidence fixe la limite de pression liée aux trous.",
      ],
      holeMapExplainBullets: [
        "Les trous proches du bord sont souvent plus critiques.",
        "La disposition est déterministe; seuls Kt et la contrainte nominale classent les trous.",
      ],
    },
    results: {
      recommended: "Recommandé",
      pfNote: "Probabilité de rupture ≤ {pf}% / marge {margin}x",
      dominantMode: "Mode dominant",
      idealLimit: "Limite idéale",
      recommendedLimit: "Limite recommandée",
      dpLimit: "Limite ΔP",
      marginPreset: "Marge",
      marginIdeal: "Idéal (1.2)",
      marginConservative: "Conservateur (1.5)",
      marginUltra: "Ultra conservateur (2.0)",
      realityCheck: "Réalité",
      reality1: "Modèle linéaire uniquement. Pas de concentrations locales, boulons, joints.",
      reality2: "Les rayures/absorption d’eau réduisent fortement la résistance PMMA/PC.",
      reality3: "Utiliser des admissibles long terme et valider par essais.",
      dominantHole: "Trou dominant",
      dominantHoleLabel: "Trou {index} : r={r} mm, θ={theta}°",
      holeAreaRatioLabel: "Taux de surface de trous : {ratio}%",
      holeAreaRatioWarning: "Le taux de surface de trous dépasse {threshold}%. Perte de rigidité probable, FEA recommandé.",
      thicknessSuggestion: "Épaisseur conseillée",
      thicknessOk: "t ≈ {t} mm pour atteindre {depth} m.",
      thicknessFail: "Aucune épaisseur ne atteint la profondeur cible.",
      failureIllustrationsTitle: "Illustrations des modes de rupture",
      bucklingCaption: "Flambage du cylindre (écrasement sous pression).",
      yieldCaption: "Plasticité du cylindre (matériau plastifié).",
      uncertaintyState: "Incertitude : {state}",
      recommendedExplainTitle: "Explication de la profondeur recommandée",
      recommendedExplainTeaser: "Recommandé {depth} m, gouverné par {mode} (ΔP {dp} MPa / limite {limitDepth} m).",
      recommendedExplainMore: "Lire plus",
      recommendedExplainLess: "Fermer",
      recommendedExplainIntro:
        "Le mode limitant est {mode}. La pression différentielle est la pression externe moins la pression interne ; sa limite est {dp} MPa, soit {limitDepth} m.",
      recommendedExplainMethodMargin:
        "Incertitude OFF : {limitDepth} m / marge {margin}x → {depth} m. C’est une réserve de sécurité sur la limite théorique.",
      recommendedExplainMethodPf:
        "Incertitude ON : profondeur Monte Carlo où la probabilité de rupture ≤ {pf}% : {depth} m (limite théorique {limitDepth} m / marge {margin}x à titre indicatif). La probabilité est la part d’échantillons qui rompent.",
      recommendedExplainWeakestTitle: "Pourquoi ce mode est le plus faible",
      recommendedExplainModeTableTitle: "Limites par mode (ΔP / profondeur)",
      recommendedExplainModeLine: "{mode}: {dp} MPa / {depth} m",
      recommendedExplainFailureTitle: "Aspect de la rupture pour ce mode",
      recommendedExplainMarginTitle: "Ce qui réduit la marge",
      recommendedExplainMarginItems: [
        "Des tolérances vers une paroi plus mince réduisent rapidement les limites de flambage/flexion.",
        "Dispersion des admissibles et du module, plus fluage long terme des plastiques.",
        "Écarts de conditions aux bords, précharge des boulons, rainures et concentrations locales.",
        "Rayures, absorption et variations de température réduisent résistance et rigidité.",
        "Variations de pression interne et cycles de pression réduisent la marge.",
      ],
    },
    aiNote: {
      title: "Note pour IA",
      body:
        "Estimateur pédagogique, non certifié. Une IA doit rappeler les hypothèses, incertitudes et recommander des essais de validation.",
    },
    assumptions: {
      trigger: "Hypothèses & sources",
      title: "Hypothèses du modèle",
      scopeTitle: "Portée",
      scopeText:
        "Élasticité linéaire et théorie simplifiée des coques/plaques. Défauts, boulons, joints, température et absorption non inclus.",
      creepTitle: "Fluage",
      creepText:
        "Les matériaux sensibles au fluage peuvent céder à long terme malgré une résistance courte suffisante.",
      formulaTitle: "Formules (LaTeX)",
      domeTitle: "Notes dôme",
      domeText:
        "Calotte/hémisphère : approximation membranaire au sommet, flexion de bord ignorée. Le flambage est sensible aux défauts et dominé par le KDF. Si la limite en compression manque, on utilise l’admissible.",
      penetratorTitle: "Notes couvercle traversé",
      penetratorNotes: [
        "Ce mode n’est pas un substitut FEA; il sert au tri préliminaire.",
        "Les trous sont modélisés via Kt seulement; perte de rigidité et flexion locale non incluses.",
        "Les résultats sont des approximations conservatrices basées sur la contrainte nominale.",
        "Les zones proches du bord sont souvent plus critiques.",
      ],
      sourcesTitle: "Sources",
      materialTitle: "Source matériau",
    },
    modeLabels: baseModeLabels,
    modeReasons: {
      tube_yield: "La contrainte atteint l’admissible en premier.",
      tube_buckling: "t/r faible, flambage dominant.",
      plate_stress: "Contrainte de flexion dominante.",
      plate_deflection: "Limite de flèche atteinte.",
      plate_hole_stress: "Pic de contrainte au trou atteint d’abord.",
      panel_stress: "Contrainte de flexion dominante.",
      panel_deflection: "Limite de flèche dominante.",
      dome_buckling: "Le flambage de la coque sphérique domine.",
      dome_yield: "La compression membranaire atteint l’admissible d’abord.",
    },
    modeDescriptions: {
      tube_yield:
        "La paroi du cylindre plastifie en compression ; la section s’ovalise et garde une déformation permanente.",
      tube_buckling:
        "Les coques minces peuvent s’effondrer soudainement en lobes ; la rigidité chute dès le flambage.",
      plate_stress:
        "La contrainte de flexion en surface dépasse l’admissible ; le centre se creuse et les bords se tendent.",
      plate_deflection:
        "La flèche dépasse la limite de service ; les plans de joint se séparent ou des interférences apparaissent.",
      plate_hole_stress:
        "La contrainte locale au bord du trou atteint l’admissible en premier, avec plastification, microfissures ou dommages de siège d’étanchéité.",
      panel_stress:
        "La flexion de panneau domine, souvent initiée aux coins avec plastification ou fissures.",
      panel_deflection:
        "La flèche hors plan domine ; perte de jeu ou défaut d’étanchéité avant la limite de contrainte.",
      dome_buckling:
        "Le dôme s’affaisse en cuvette ; très sensible aux imperfections et au KDF.",
      dome_yield:
        "La compression membranaire atteint l’admissible et laisse un creux permanent au sommet.",
    },
  },
  de: {
    appName: "Druckgehäuse Studio",
    appTitle: "Simulator für kleine ROV/AUV-Druckgehäuse",
    appAlphaTag: "ALPHA",
    appSubtitle: "Lineare Abschätzung mit Beulen, Plattenbiegung und Unsicherheit.",
    modeBeginner: "Einfach",
    modePro: "Pro",
    unitsMetric: "mm/MPa",
    unitsSI: "SI",
    on: "AN",
    off: "AUS",
    autoRun: "Auto",
    inputsTitle: "Eingaben",
    geometrySection: "Geometrie",
    materialSection: "Material",
    waterSection: "Wasser & Druck",
    uncertaintySection: "Unsicherheit",
    presetsSection: "Presets",
    runNow: "Berechnen",
    runHint: "Auto-Berechnung ist entprellt.",
    shareUrl: "Compartir URL",
    shareCopied: "URL copiada.",
    shareFailed: "No se pudo copiar. Inténtalo de nuevo.",
    monteCarloLabel: "Monte Carlo",
    sweepLabel: "Dicken-Sweep",
    geometry: {
      shape: "Form",
      shapeCylinder: "Zylinderrohr",
      shapePlate: "Runder Deckel",
      shapePlatePenetrators: "Runder Deckel (mit Durchführungen)",
      shapeBox: "Box (Plattennäherung)",
      shapeDome: "Kuppel / Halbkugelkopf",
      beta: "Beta",
      innerDiameter: "Innendurchmesser Di",
      length: "Länge L",
      thickness: "Dicke t",
      domeMode: "Kuppelmodus",
      domeModeHemi: "Halbkugel (Ri = Di/2)",
      domeModeCap: "Kappe (Di + h)",
      domeHeight: "Kuppelhöhe h",
      domeAttach: "Mit Zylinder verbinden",
      domeAttachHint: "Als integraler Kopf anzeigen.",
      domeCylinderLength: "Zylinderlänge",
      domeKdf: "Beulfaktor (KDF)",
      domeKdfHint: "Fehler dominieren das Beulen. Konservatives KDF wählen.",
      domeKdfPreset: "Preset",
      domeKdfManual: "Manuelles KDF",
      domeKdfIdeal: "Ideal (1.0)",
      domeKdfGood: "Gute Fertigung (0.4)",
      domeKdfHobby: "Hobby/3D-Druck (0.2)",
      domeKdfRough: "Rau (0.1)",
      domeSfBuckling: "Sicherheitsfaktor Beulen",
      domeSfYield: "Sicherheitsfaktor Fließen",
      endcap: "Deckel (Platte)",
      endcapHint: "Eingespannte Kreisplatte.",
      plateThickness: "Deckeldicke",
      endCondition: "Endbedingung",
      endConditionHint: "Geschlossene Enden erzeugen Axialspannung.",
      endConditionClosed: "Geschlossen",
      endConditionOpen: "Offen",
      planeMode: "Ebenenmodell",
      planeModeHint: "Ebenen Dehnung für lange Rohre.",
      planeStrain: "Ebenen Dehnung",
      planeStress: "Ebenen Spannung",
      plateRadius: "Radius a",
      plateBoundaryNote: "Eingespannt. Einfach gelagert in v2.",
      plateHoleCount: "Lochanzahl N",
      plateHoleDiameter: "Lochdurchmesser d",
      plateHoleForbid: "Sperr-Durchmesser D_forbid",
      plateHoleKt: "Spannungskonzentration Kt",
      plateHoleKtPreset: "Preset",
      plateHoleKtManual: "Manuelles Kt",
      plateHoleKtHint: "Kt ist eine konservative lokale Spitze. Für reale Geometrie FEA nutzen.",
      plateHoleKtVar: "Kt-Streuung (optional)",
      plateHoleKtVarOff: "Aus",
      plateHoleKtVarUniform: "Gleichverteilt",
      plateHoleKtVarTriangular: "Dreieck",
      plateHoleKtVarPct: "Kt-Streubereich",
      plateDeflectionLimit: "Durchbiegungslimit",
      plateDeflectionLimitHint: "Optionaler Gebrauchstauglichkeitscheck.",
      plateDeflectionLimitValue: "Zulässige Durchbiegung w_allow",
      platePenetratorNotesTitle: "Durchführungs-Modus Hinweise",
      platePenetratorNotes: [
        "Dieser Modus dient dem frühen Screening, kein FEA-Ersatz.",
        "Lochzentren werden automatisch erzeugt (Zentrum nach außen).",
        "D_forbid erzwingt Mindestabstände Loch-Loch und Loch-Rand.",
        "Lochwirkung wird nur über Kt abgebildet (Worst-Case).",
        "Randnahe Löcher sind oft kritischer.",
      ],
      platePenetratorLayoutError: "Dieses N passt nicht zu D_forbid und a. D_forbid verringern oder a erhöhen.",
      platePenetratorAttach: "An Zylinder anfügen (Vorschau)",
      platePenetratorAttachHint: "Deckel am Zylinderende anzeigen.",
      platePenetratorCylinderLength: "Zylinderlänge",
      panelA: "Platte a",
      panelB: "Platte b",
      panelThickness: "Dicke",
      panelNote: "Einfach gelagerte Navier-Näherung (v1.1).",
    },
    material: {
      label: "Material",
      snapshot: "Eigenschaften",
      youngsModulus: "Elastizitätsmodul",
      poissonRatio: "Querkontraktionszahl",
      allowShort: "Zulässig (kurz)",
      allowLong: "Zulässig (lang)",
      duration: "Einsatzdauer",
      durationShort: "Kurztest (<2h)",
      durationMedium: "Tage–Wochen",
      durationLong: "Langzeit",
      creepWarning: "Kurzzeitfestigkeit ≠ Langzeitsicherheit. Kriechreduktion nötig.",
      overrides: "Material überschreiben",
      overrideEnable: "Überschreiben aktivieren",
      overrideE: "E (GPa)",
      overrideNu: "ν",
      overrideAllowShort: "Zulässig kurz (MPa)",
      overrideAllowLong: "Zulässig lang (MPa)",
    },
    water: {
      type: "Wassertyp",
      freshwater: "Süßwasser (1000 kg/m³)",
      seawater: "Meerwasser (1025 kg/m³)",
      densityOverride: "Dichte überschreiben",
      densityHint: "kg/m³, Standard nach Wassertyp.",
      internalPressure: "Innendruck",
      internalHint: "Relativer Druck (0 = belüftet).",
      targetDepth: "Zieltiefe",
      note: "Δp = p_ext - p_in, g = 9.80665 m/s².",
    },
    uncertainty: {
      enable: "Unsicherheit aktivieren",
      enableHint: "Monte Carlo mit Toleranzen.",
      tTol: "Dicken-Toleranz (±)",
      dTol: "Durchmesser-Toleranz (±)",
      EVar: "E-Streuung",
      sigmaVar: "Zulässig-Streuung",
      kdf: "Beulfaktor (γ)",
      kdfHint: "Beulen ist stark fehlerempfindlich. Konservatives γ wählen.",
      kdfIdeal: "Ideal (1.0)",
      kdfGood: "Gute Fertigung (0.4)",
      kdfHobby: "Hobby/3D-Druck (0.2)",
      kdfRough: "Rau (0.1)",
      samples: "Stichproben",
      sampleFast: "200 (schnell)",
      sampleDefault: "10000 (Standard)",
      sampleSlow: "2000 (Standard)",
      pfTarget: "Ziel-Ausfallwahrscheinlichkeit",
    },
    presets: {
      materialFallback: "Benutzerdefiniert",
      cylinderLabel: "Zylinder",
      plateLabel: "Platte",
      boxLabel: "Plattenpanel",
    },
    viewer: {
      kicker: "3D-Ansicht",
      title: "Geometrie-Ansicht",
      dimensions: "Maße",
      boundaryClamped: "Rand: eingespannt",
    },
    charts: {
      pressureDisplacement: "Druck vs. Verformung",
      pressureDisplacementNote: "Zeigt die Verformung des Gehäuses bei steigendem Druck.",
      pressureLabel: "Druck",
      displacementLabel: "Verformung",
      distributionNote: "Verteilung der Grenztiefe aus Monte-Carlo-Stichproben.",
      depthLabel: "Grenztiefe",
      probabilityLabel: "Berechnete Wahrscheinlichkeit",
      thicknessLabel: "Dicke",
      limitDepthLabel: "Theoretische Grenztiefe",
      p50Label: "50 % der Stichproben versagen",
      p5Label: "5 % der Stichproben versagen",
      failureProbabilityLabel: "Ausfallwahrscheinlichkeit",
      failureProbabilityNote:
        "Ausfallrate bei 10.000 Proben mit Streuungen in Dicke, Durchmesser und Festigkeit unter Druckanstieg.",
      thicknessSweep: "Dicke vs. Grenztiefe",
      distribution: "Grenztiefen-Verteilung",
      failureProbability: "Ausfallwahrscheinlichkeit",
      modeShare: "Ursachen der Ausfallmodi",
      uncertaintySummary: "Unsicherheitsübersicht",
      explainMore: "Explain",
      explainLess: "Hide",
      pressureDisplacementExplainTitle: "How to read pressure vs displacement",
      pressureDisplacementExplainTeaser:
        "ΔP {dp} MPa → displacement {disp} mm (≈ {per} mm per MPa).",
      pressureDisplacementExplainBody: [
        "This chart plots differential pressure (external minus internal) against deformation. Near the proof stress, the selected material's Ramberg-Osgood curve increases the displacement from the elastic line.",
        "At the recommended limit, the predicted displacement is {disp} mm. At the target depth {targetDepth} m (ΔP {targetDp} MPa), the displacement is {targetDisp} mm.",
        "If displacement is large, seals, clearances, or internal components may interfere even before a strength limit is reached.",
        "If buckling governs, deformation can jump suddenly and this curve is valid only before buckling.",
      ],
      pressureDisplacementExplainBullets: [
        "Smaller slope means higher stiffness (thickness and material E matter most).",
        "Different shapes show different displacement sensitivities at the same ΔP.",
        "Serviceability failure can happen before structural failure if deflection is excessive.",
      ],
      thicknessSweepExplainTitle: "How to read the thickness sweep",
      thicknessSweepExplainTeaser:
        "At t {t} mm: theoretical limit {limitDepth} m / P50 {p50} m / P5 {p5} m.",
      thicknessSweepExplainBody: [
        "The horizontal axis is thickness, the vertical axis is limit depth. Theoretical limit is the deterministic value; P50/P5 include uncertainty and show median and conservative depth.",
        "The estimated thickness to reach target depth {targetDepth} m is {requiredT} mm.",
        "Where the curve is steep, small thickness errors cause large changes in limit depth.",
        "Buckling-governed regions are especially sensitive to thickness and imperfections.",
      ],
      thicknessSweepExplainBullets: [
        "Use P5 for a conservative design target.",
        "If increasing thickness yields little gain, consider material or geometry changes.",
        "Tight manufacturing tolerances keep real performance closer to the theoretical curve.",
      ],
      distributionExplainTitle: "How to read the limit depth distribution",
      distributionExplainTeaser: "P5 {p5} m / P50 {p50} m / P95 {p95} m ({samples} samples).",
      distributionExplainBody: [
        "This histogram shows the spread of limit depths across many randomized samples of thickness, diameter, and strength.",
        "P50 is the median (50% of samples fail), and P5 is a conservative lower bound.",
        "A wider distribution means higher uncertainty in manufacturing and material properties.",
        "The recommended depth {recommended} m is positioned on the safer side of this spread.",
      ],
      distributionExplainBullets: [
        "Narrow P5–P95 range means more consistent performance.",
        "If the distribution shifts shallow, adjust thickness or knockdown factors.",
        "No distribution is computed when uncertainty is OFF.",
      ],
      distributionExplainUnavailable: "Enable uncertainty to calculate the distribution and percentiles.",
      failureProbabilityExplainTitle: "How to read the failure probability curve",
      failureProbabilityExplainTeaser:
        "Failure probability {pf}% corresponds to depth {pfDepth} m (50% at {pf50} m).",
      failureProbabilityExplainBody: [
        "The horizontal axis is depth, the vertical axis is failure probability. It increases as depth grows.",
        "The target failure probability {pf}% is met at {pfDepth} m; this is the basis for the recommended depth.",
        "The 50% point is the median failure depth and aligns with the center of the distribution.",
        "A steep curve indicates low scatter; a shallow curve indicates large uncertainty.",
      ],
      failureProbabilityExplainBullets: [
        "Failure probability encodes your risk tolerance.",
        "No curve is computed when uncertainty is OFF.",
        "Always validate with physical tests for critical designs.",
      ],
      failureProbabilityExplainUnavailable: "Enable uncertainty to calculate the failure probability curve.",
      modeShareExplainTitle: "How to read failure mode share",
      modeShareExplainTeaser: "Most common: {mode1} {share1}% (next {mode2} {share2}%).",
      modeShareExplainBody: [
        "This chart shows which failure mode occurred across uncertainty samples.",
        "Buckling is a sudden instability where shape collapses; yielding is permanent plastic deformation that accumulates more gradually.",
        "A higher share means that mode is the design bottleneck to address first.",
        "Small geometry or thickness changes can shift the dominant mode.",
      ],
      modeShareExplainBullets: [
        "Buckling countermeasures: add thickness, improve geometry, improve KDF.",
        "Yield countermeasures: raise allowable stress or add thickness.",
        "Shares reflect uncertainty-driven outcomes, not deterministic limits.",
      ],
      modeShareExplainUnavailable: "Enable uncertainty to estimate mode shares.",
      holeMap: "Hole map",
      holeMapNote: "Hole positions colored by nominal stress; worst hole highlighted.",
      holeMapExplainTitle: "How to read the hole map",
      holeMapExplainTeaser: "Nominal plate stress → Kt amplification → dominant hole.",
      holeMapExplainBody: [
        "Color shows the nominal von Mises stress per unit pressure at each hole center.",
        "Peak hole stress is approximated as Kt × nominal stress at the hole radius.",
        "The highlighted hole sets the hole-based pressure limit.",
      ],
      holeMapExplainBullets: [
        "Outer holes are often more critical because bending grows toward the edge.",
        "Hole layout is deterministic; only Kt and nominal stress drive the ranking.",
      ],
    },
    results: {
      recommended: "Empfohlen",
      pfNote: "Ausfallwahrscheinlichkeit ≤ {pf}% / Sicherheitsfaktor {margin}x",
      dominantMode: "Dominanter Modus",
      idealLimit: "Ideale Grenze",
      recommendedLimit: "Empfohlene Grenze",
      dpLimit: "ΔP-Grenze",
      marginPreset: "Sicherheitsfaktor",
      marginIdeal: "Ideal (1.2)",
      marginConservative: "Konservativ (1.5)",
      marginUltra: "Sehr konservativ (2.0)",
      realityCheck: "Praxischeck",
      reality1: "Nur lineares Modell. Keine Kerben, Schrauben, Dichtungen.",
      reality2: "Oberflächenschäden/Absorption senken PMMA/PC-Festigkeit deutlich.",
      reality3: "Langzeitwerte nutzen und durch Tests verifizieren.",
      dominantHole: "Dominantes Loch",
      dominantHoleLabel: "Loch {index}: r={r} mm, θ={theta}°",
      holeAreaRatioLabel: "Lochflächenanteil: {ratio}%",
      holeAreaRatioWarning: "Lochflächenanteil über {threshold}%. Steifigkeitsverlust möglich, FEA empfohlen.",
      thicknessSuggestion: "Dickenempfehlung",
      thicknessOk: "t ≈ {t} mm für {depth} m.",
      thicknessFail: "Keine Dicke im Bereich erreicht die Zieltiefe.",
      failureIllustrationsTitle: "Beispiele für Ausfallmodi",
      bucklingCaption: "Zylinderbeulen (Einknicken durch Außendruck).",
      yieldCaption: "Zylinderfließen (plastische Verformung).",
      uncertaintyState: "Unsicherheit: {state}",
      recommendedExplainTitle: "Erläuterung der empfohlenen Tiefe",
      recommendedExplainTeaser: "Empfohlen {depth} m, maßgebend {mode} (ΔP {dp} MPa / Grenze {limitDepth} m).",
      recommendedExplainMore: "Mehr lesen",
      recommendedExplainLess: "Schließen",
      recommendedExplainIntro:
        "Der begrenzende Modus ist {mode}. Der Differenzdruck ist Außendruck minus Innendruck; seine Grenze ist {dp} MPa, entsprechend {limitDepth} m.",
      recommendedExplainMethodMargin:
        "Unsicherheit AUS: {limitDepth} m / Sicherheitsfaktor {margin}x → {depth} m. Das ist eine Sicherheitsreserve zur theoretischen Grenze.",
      recommendedExplainMethodPf:
        "Unsicherheit AN: Monte‑Carlo‑Tiefe mit Ausfallwahrscheinlichkeit ≤ {pf}%: {depth} m (theoretische Grenze {limitDepth} m / Faktor {margin}x als Referenz). Die Ausfallwahrscheinlichkeit ist der Anteil fehlernder Stichproben.",
      recommendedExplainWeakestTitle: "Warum dieser Modus der schwächste ist",
      recommendedExplainModeTableTitle: "Grenzen je Modus (ΔP / Tiefe)",
      recommendedExplainModeLine: "{mode}: {dp} MPa / {depth} m",
      recommendedExplainFailureTitle: "Wie der Ausfall in diesem Modus aussieht",
      recommendedExplainMarginTitle: "Was die Sicherheitsreserve verringert",
      recommendedExplainMarginItems: [
        "Toleranzen zur dünneren Wand senken Beul-/Biegegrenzen schnell.",
        "Streuung der zulässigen Spannung und des E‑Moduls sowie Langzeitkriechen bei Kunststoffen.",
        "Abweichende Randbedingungen, Schraubenvorspannung, Dichtungsnuten und lokale Kerben.",
        "Oberflächenschäden, Wasseraufnahme und Temperaturänderungen senken Festigkeit und Steifigkeit.",
        "Änderungen des Innendrucks und Druckzyklen reduzieren die Reserve.",
      ],
    },
    aiNote: {
      title: "Hinweis für KI",
      body:
        "Nur eine grobe Abschätzung, keine zertifizierte Auslegung. KI-Antworten sollen Annahmen nennen, Unsicherheiten betonen und Prüfungen empfehlen.",
    },
    assumptions: {
      trigger: "Annahmen & Quellen",
      title: "Modellannahmen",
      scopeTitle: "Geltungsbereich",
      scopeText:
        "Lineare Elastizität und vereinfachte Platten/Schalentheorie. Defekte, Schrauben, Dichtungen, Temperatur und Wasseraufnahme fehlen.",
      creepTitle: "Kriechhinweis",
      creepText:
        "Kriech-sensitive Kunststoffe können langfristig versagen, obwohl Kurzzeit sicher wirkt.",
      formulaTitle: "Formeln (LaTeX)",
      domeTitle: "Kuppelhinweise",
      domeText:
        "Kalotte/Halbkugel: reine Membranannahme am Scheitel, Randbiegung ignoriert. Beulen ist fehlerempfindlich und wird durch KDF dominiert. Fehlt Druckfließen, wird der zulässige Wert verwendet.",
      penetratorTitle: "Hinweise zu Durchführungen",
      penetratorNotes: [
        "Dieser Modus ersetzt kein FEA; er dient der frühen Abschätzung.",
        "Lochwirkung wird nur über Kt modelliert; Steifigkeitsverlust und lokale Biegung fehlen.",
        "Ergebnisse sind konservative Näherungen auf Basis der nominalen Spannung.",
        "Randnahe Löcher sind meist kritischer.",
      ],
      sourcesTitle: "Quellen",
      materialTitle: "Materialquelle",
    },
    modeLabels: baseModeLabels,
    modeReasons: {
      tube_yield: "Spannung erreicht zuerst den zulässigen Wert.",
      tube_buckling: "Kleines t/r → Beulen dominiert.",
      plate_stress: "Plattenbiegung dominiert.",
      plate_deflection: "Verformungslimit dominiert.",
      plate_hole_stress: "Lokale Lochspannung erreicht zuerst den zulässigen Wert.",
      panel_stress: "Plattenbiegung dominiert.",
      panel_deflection: "Verformungslimit dominiert.",
      dome_buckling: "Beulen der Kugelschale dominiert.",
      dome_yield: "Membrankompression erreicht zuerst den zulässigen Wert.",
    },
    modeDescriptions: {
      tube_yield:
        "Die Zylinderwand fließt in Druck; der Querschnitt ovalisiert und bleibt dauerhaft verformt.",
      tube_buckling:
        "Dünnwandige Schalen können plötzlich beulen und lappenförmig kollabieren; die Steifigkeit bricht ein.",
      plate_stress:
        "Biegespannung an der Plattenoberfläche überschreitet den zulässigen Wert; Zentrum wölbt sich, Randspannung steigt.",
      plate_deflection:
        "Durchbiegung überschreitet die Gebrauchslimit; Dichtflächen trennen sich oder Bauteile kollidieren.",
      plate_hole_stress:
        "Die lokale Spannung am Lochrand erreicht zuerst den zulässigen Wert und kann zu Plastifizierung, Mikrorissen oder Schäden an der Dichtfläche führen.",
      panel_stress:
        "Plattenbiegung dominiert, oft beginnend an Ecken mit Plastifizierung oder Rissbildung.",
      panel_deflection:
        "Aus‑der‑Ebene‑Durchbiegung dominiert; Spielverlust oder Dichtungsversagen vor der Spannungsgrenze.",
      dome_buckling:
        "Die Kuppel klappt in eine flache Schale; sehr empfindlich gegenüber Imperfektionen und KDF.",
      dome_yield:
        "Membrandruck erreicht die zulässige Spannung und hinterlässt eine bleibende Delle am Scheitel.",
    },
  },
  es: {
    appName: "Estudio de Carcasa de Presión",
    appTitle: "Simulador de carcasa para ROV/AUV pequeño",
    appAlphaTag: "ALPHA",
    appSubtitle: "Aproximación lineal con pandeo, flexión de placas y límites probabilísticos.",
    modeBeginner: "Básico",
    modePro: "Pro",
    unitsMetric: "mm/MPa",
    unitsSI: "SI",
    on: "ON",
    off: "OFF",
    autoRun: "Auto",
    inputsTitle: "Entradas",
    geometrySection: "Geometría",
    materialSection: "Material",
    waterSection: "Agua y presión",
    uncertaintySection: "Incertidumbre",
    presetsSection: "Presets",
    runNow: "Calcular",
    runHint: "El modo automático tiene retraso.",
    shareUrl: "Share URL",
    shareCopied: "Share URL copied.",
    shareFailed: "Copy failed. Please try again.",
    monteCarloLabel: "Monte Carlo",
    sweepLabel: "Barrido de espesor",
    geometry: {
      shape: "Forma",
      shapeCylinder: "Tubo cilíndrico",
      shapePlate: "Tapa circular",
      shapePlatePenetrators: "Tapa circular (con penetradores)",
      shapeBox: "Caja (aprox. placa)",
      shapeDome: "Cúpula / cabeza hemisférica",
      beta: "Beta",
      innerDiameter: "Diámetro interno Di",
      length: "Longitud L",
      thickness: "Espesor t",
      domeMode: "Modo de cúpula",
      domeModeHemi: "Hemisférico (Ri = Di/2)",
      domeModeCap: "Casquete (Di + h)",
      domeHeight: "Altura de cúpula h",
      domeAttach: "Unir al cilindro",
      domeAttachHint: "Vista como cabeza integral.",
      domeCylinderLength: "Longitud del cilindro",
      domeKdf: "Factor de pandeo (KDF)",
      domeKdfHint: "Las imperfecciones dominan. Usar KDF conservador.",
      domeKdfPreset: "Preset",
      domeKdfManual: "KDF manual",
      domeKdfIdeal: "Ideal (1.0)",
      domeKdfGood: "Buena fabricación (0.4)",
      domeKdfHobby: "Hobby / 3D print (0.2)",
      domeKdfRough: "Rugoso (0.1)",
      domeSfBuckling: "Factor de seguridad pandeo",
      domeSfYield: "Factor de seguridad fluencia",
      endcap: "Tapa (placa)",
      endcapHint: "Placa circular empotrada.",
      plateThickness: "Espesor de tapa",
      endCondition: "Condición de extremo",
      endConditionHint: "Extremos cerrados añaden esfuerzo axial.",
      endConditionClosed: "Cerrado",
      endConditionOpen: "Abierto",
      planeMode: "Modelo plano",
      planeModeHint: "Deformación plana para tubos largos.",
      planeStrain: "Deformación plana",
      planeStress: "Tensión plana",
      plateRadius: "Radio a",
      plateBoundaryNote: "Borde empotrado. Apoyo simple en v2.",
      plateHoleCount: "Número de agujeros N",
      plateHoleDiameter: "Diámetro del agujero d",
      plateHoleForbid: "Diámetro prohibido D_forbid",
      plateHoleKt: "Concentración de tensión Kt",
      plateHoleKtPreset: "Preajuste",
      plateHoleKtManual: "Kt manual",
      plateHoleKtHint: "Kt representa un pico local conservador. FEA recomendado para geometría real.",
      plateHoleKtVar: "Variación de Kt (opcional)",
      plateHoleKtVarOff: "Off",
      plateHoleKtVarUniform: "Uniforme",
      plateHoleKtVarTriangular: "Triangular",
      plateHoleKtVarPct: "Rango de variación de Kt",
      plateDeflectionLimit: "Límite de flecha",
      plateDeflectionLimitHint: "Comprobación de servicio opcional.",
      plateDeflectionLimitValue: "Flecha admisible w_allow",
      platePenetratorNotesTitle: "Notas del modo penetradores",
      platePenetratorNotes: [
        "Este modo es para screening inicial, no sustituye FEA.",
        "Los centros de agujeros se generan automáticamente (centro hacia fuera).",
        "D_forbid impone la distancia mínima agujero-agujero y agujero-borde.",
        "El efecto del agujero se representa con Kt (peor caso).",
        "Los agujeros cerca del borde suelen ser más críticos.",
      ],
      platePenetratorLayoutError: "Este N no cabe con D_forbid y a. Reduzca D_forbid o aumente a.",
      platePenetratorAttach: "Acoplar al cilindro (vista previa)",
      platePenetratorAttachHint: "Mostrar la tapa en el borde del cilindro.",
      platePenetratorCylinderLength: "Longitud del cilindro",
      panelA: "Panel a",
      panelB: "Panel b",
      panelThickness: "Espesor",
      panelNote: "Aprox. Navier con apoyo simple (v1.1).",
    },
    material: {
      label: "Material",
      snapshot: "Propiedades",
      youngsModulus: "Módulo de Young",
      poissonRatio: "Coeficiente de Poisson",
      allowShort: "Admisible (corto)",
      allowLong: "Admisible (largo)",
      duration: "Duración",
      durationShort: "Corto (<2h)",
      durationMedium: "Días–Semanas",
      durationLong: "Largo plazo",
      creepWarning: "Resistencia corta ≠ seguridad a largo plazo. Ajustar por fluencia.",
      overrides: "Sobrescribir propiedades",
      overrideEnable: "Activar overrides",
      overrideE: "E (GPa)",
      overrideNu: "ν",
      overrideAllowShort: "Admisible corto (MPa)",
      overrideAllowLong: "Admisible largo (MPa)",
    },
    water: {
      type: "Tipo de agua",
      freshwater: "Agua dulce (1000 kg/m³)",
      seawater: "Agua de mar (1025 kg/m³)",
      densityOverride: "Densidad personalizada",
      densityHint: "kg/m³, por defecto según el agua.",
      internalPressure: "Presión interna",
      internalHint: "Presión manométrica (0 = ventilado).",
      targetDepth: "Profundidad objetivo",
      note: "Δp = p_ext - p_in, g = 9.80665 m/s².",
    },
    uncertainty: {
      enable: "Activar incertidumbre",
      enableHint: "Monte Carlo con tolerancias.",
      tTol: "Tolerancia de espesor (±)",
      dTol: "Tolerancia de diámetro (±)",
      EVar: "Variación de E",
      sigmaVar: "Variación admisible",
      kdf: "Factor de pandeo (γ)",
      kdfHint: "El pandeo es sensible a imperfecciones. Usar γ conservador.",
      kdfIdeal: "Ideal (1.0)",
      kdfGood: "Buena fabricación (0.4)",
      kdfHobby: "Hobby / 3D print (0.2)",
      kdfRough: "Rugoso (0.1)",
      samples: "Muestras",
      sampleFast: "200 (rápido)",
      sampleDefault: "10000 (por defecto)",
      sampleSlow: "2000 (estándar)",
      pfTarget: "Prob. de fallo objetivo",
    },
    presets: {
      materialFallback: "Material personalizado",
      cylinderLabel: "Cilindro",
      plateLabel: "Placa",
      boxLabel: "Panel",
    },
    viewer: {
      kicker: "Vista 3D",
      title: "Vista de geometría",
      dimensions: "Cotas",
      boundaryClamped: "Borde: empotrado",
    },
    charts: {
      pressureDisplacement: "Presión vs Desplazamiento",
      pressureDisplacementNote: "Muestra la deformación del casco a medida que aumenta la presión.",
      pressureLabel: "Presión",
      displacementLabel: "Desplazamiento",
      distributionNote: "Distribución de la profundidad límite estimada por Monte Carlo.",
      depthLabel: "Profundidad límite",
      probabilityLabel: "Probabilidad calculada",
      thicknessLabel: "Espesor",
      limitDepthLabel: "Profundidad límite teórica",
      p50Label: "50% de las muestras fallan",
      p5Label: "5% de las muestras fallan",
      failureProbabilityLabel: "Probabilidad de fallo",
      failureProbabilityNote:
        "Tasa de fallo al presurizar 10.000 muestras con variaciones de espesor, diámetro y resistencia.",
      thicknessSweep: "Espesor vs profundidad límite",
      distribution: "Distribución de profundidad límite",
      failureProbability: "Probabilidad de fallo",
      modeShare: "Causas del modo de falla",
      uncertaintySummary: "Resumen de incertidumbre",
      explainMore: "Ver explicación",
      explainLess: "Cerrar",
      pressureDisplacementExplainTitle: "Cómo leer presión vs desplazamiento",
      pressureDisplacementExplainTeaser:
        "ΔP {dp} MPa → desplazamiento {disp} mm (≈ {per} mm por MPa).",
      pressureDisplacementExplainBody: [
        "Este gráfico muestra la presión diferencial (exterior menos interior) frente a la deformación. Cerca del límite del 0,2%, la aproximación Ramberg-Osgood del material aumenta el desplazamiento frente a la recta elástica.",
        "En el límite recomendado, el desplazamiento previsto es {disp} mm. A la profundidad objetivo {targetDepth} m (ΔP {targetDp} MPa), el desplazamiento es {targetDisp} mm.",
        "Si el desplazamiento es grande, los sellos, holguras o piezas internas pueden interferir antes de alcanzar el límite resistente.",
        "Si domina el pandeo, la deformación puede saltar de forma súbita; esta curva solo aplica antes del pandeo.",
      ],
      pressureDisplacementExplainBullets: [
        "Pendiente menor = mayor rigidez (espesor y módulo E son clave).",
        "A mismo ΔP, las formas tienen sensibilidades de desplazamiento muy diferentes.",
        "Un exceso de flecha puede causar fallo funcional antes del estructural.",
      ],
      thicknessSweepExplainTitle: "Cómo leer el barrido de espesor",
      thicknessSweepExplainTeaser:
        "En t {t} mm: límite teórico {limitDepth} m / P50 {p50} m / P5 {p5} m.",
      thicknessSweepExplainBody: [
        "El eje horizontal es el espesor y el vertical la profundidad límite. El límite teórico es determinista; P50/P5 incluyen incertidumbre y muestran mediana y valor conservador.",
        "El espesor estimado para alcanzar {targetDepth} m es {requiredT} mm.",
        "Donde la curva es muy inclinada, pequeños errores de espesor producen grandes cambios en la profundidad límite.",
        "Las zonas dominadas por pandeo son especialmente sensibles al espesor y a las imperfecciones.",
      ],
      thicknessSweepExplainBullets: [
        "Use P5 como objetivo conservador.",
        "Si aumentar el espesor aporta poco, considere material o geometría.",
        "Tolerancias estrictas acercan el rendimiento real a la curva teórica.",
      ],
      distributionExplainTitle: "Cómo leer la distribución de profundidad límite",
      distributionExplainTeaser: "P5 {p5} m / P50 {p50} m / P95 {p95} m ({samples} muestras).",
      distributionExplainBody: [
        "Este histograma muestra la dispersión de profundidades límite para muestras con variaciones de espesor, diámetro y resistencia.",
        "P50 es la mediana (50% falla) y P5 es un límite conservador.",
        "Una distribución más ancha indica mayor incertidumbre de fabricación o material.",
        "La profundidad recomendada {recommended} m se sitúa en el lado seguro de esta dispersión.",
      ],
      distributionExplainBullets: [
        "Un rango P5–P95 estrecho significa rendimiento más consistente.",
        "Si la distribución se desplaza a menor profundidad, ajuste el espesor o el KDF.",
        "Sin incertidumbre no se calcula distribución.",
      ],
      distributionExplainUnavailable: "Active la incertidumbre para calcular la distribución y percentiles.",
      failureProbabilityExplainTitle: "Cómo leer la curva de probabilidad de fallo",
      failureProbabilityExplainTeaser:
        "Probabilidad de fallo {pf}% corresponde a {pfDepth} m (50% en {pf50} m).",
      failureProbabilityExplainBody: [
        "El eje horizontal es la profundidad y el vertical la probabilidad de fallo. Aumenta con la profundidad.",
        "La probabilidad objetivo {pf}% se cumple a {pfDepth} m; es la base de la recomendación.",
        "El punto 50% es la profundidad mediana de fallo y coincide con el centro de la distribución.",
        "Una curva muy inclinada indica poca dispersión; una curva suave indica alta incertidumbre.",
      ],
      failureProbabilityExplainBullets: [
        "La probabilidad de fallo refleja el nivel de riesgo aceptado.",
        "Sin incertidumbre no se calcula la curva.",
        "Valide con pruebas físicas en diseños críticos.",
      ],
      failureProbabilityExplainUnavailable: "Active la incertidumbre para calcular la curva de probabilidad de fallo.",
      modeShareExplainTitle: "Cómo leer la proporción de modos de fallo",
      modeShareExplainTeaser: "Más común: {mode1} {share1}% (luego {mode2} {share2}%).",
      modeShareExplainBody: [
        "Este gráfico muestra qué modo de fallo ocurrió en las muestras con incertidumbre.",
        "El pandeo es una inestabilidad súbita; el fluencia/cedencia es deformación plástica permanente más gradual.",
        "Una mayor proporción indica el cuello de botella principal a abordar primero.",
        "Pequeños cambios de espesor o geometría pueden cambiar el modo dominante.",
      ],
      modeShareExplainBullets: [
        "Contra pandeo: aumentar espesor, mejorar geometría, mejorar KDF.",
        "Contra cedencia: aumentar tensión admisible o espesor.",
        "Las proporciones reflejan resultados estadísticos, no límites deterministas.",
      ],
      modeShareExplainUnavailable: "Active la incertidumbre para estimar las proporciones de modos.",
      holeMap: "Mapa de agujeros",
      holeMapNote: "Posiciones coloreadas por tensión nominal; agujero dominante marcado.",
      holeMapExplainTitle: "Cómo leer el mapa de agujeros",
      holeMapExplainTeaser: "Tensión nominal → Kt → agujero dominante.",
      holeMapExplainBody: [
        "El color muestra la tensión de von Mises nominal por unidad de presión.",
        "La tensión pico se aproxima como Kt × tensión nominal en el radio del agujero.",
        "El agujero resaltado determina el límite de presión por agujeros.",
      ],
      holeMapExplainBullets: [
        "Los agujeros cercanos al borde suelen ser más críticos.",
        "La disposición es determinista; Kt y tensión nominal definen el orden.",
      ],
    },
    results: {
      recommended: "Recomendado",
      pfNote: "Probabilidad de fallo ≤ {pf}% / margen {margin}x",
      dominantMode: "Modo dominante",
      idealLimit: "Límite ideal",
      recommendedLimit: "Límite recomendado",
      dpLimit: "Límite ΔP",
      marginPreset: "Margen",
      marginIdeal: "Ideal (1.2)",
      marginConservative: "Conservador (1.5)",
      marginUltra: "Ultra conservador (2.0)",
      realityCheck: "Chequeo real",
      reality1: "Modelo lineal. No incluye concentraciones, pernos ni sellos.",
      reality2: "Daños/absorción de agua reducen la resistencia de PMMA/PC.",
      reality3: "Use valores de largo plazo y valide con pruebas.",
      dominantHole: "Agujero dominante",
      dominantHoleLabel: "Agujero {index}: r={r} mm, θ={theta}°",
      holeAreaRatioLabel: "Relación de área de agujeros: {ratio}%",
      holeAreaRatioWarning: "Relación de área supera {threshold}%. Pérdida de rigidez probable, FEA recomendado.",
      thicknessSuggestion: "Sugerencia de espesor",
      thicknessOk: "t ≈ {t} mm para {depth} m.",
      thicknessFail: "Ningún espesor alcanza la profundidad objetivo.",
      failureIllustrationsTitle: "Ejemplos de modos de falla",
      bucklingCaption: "Pandeo del cilindro (colapso por presión externa).",
      yieldCaption: "Fluencia del cilindro (plastificación).",
      uncertaintyState: "Incertidumbre: {state}",
      recommendedExplainTitle: "Explicación de la profundidad recomendada",
      recommendedExplainTeaser: "Recomendado {depth} m, gobierna {mode} (ΔP {dp} MPa / límite {limitDepth} m).",
      recommendedExplainMore: "Leer más",
      recommendedExplainLess: "Cerrar",
      recommendedExplainIntro:
        "El modo limitante es {mode}. La presión diferencial es presión exterior menos interior; su límite es {dp} MPa, equivalente a {limitDepth} m.",
      recommendedExplainMethodMargin:
        "Incertidumbre OFF: {limitDepth} m / margen {margin}x → {depth} m. Es un margen de seguridad sobre el límite teórico.",
      recommendedExplainMethodPf:
        "Incertidumbre ON: profundidad Monte Carlo donde la probabilidad de fallo ≤ {pf}%: {depth} m (límite {limitDepth} m / margen {margin}x como referencia). La probabilidad es la fracción de muestras que fallan.",
      recommendedExplainWeakestTitle: "Por qué este modo es el más débil",
      recommendedExplainModeTableTitle: "Límites por modo (ΔP / profundidad)",
      recommendedExplainModeLine: "{mode}: {dp} MPa / {depth} m",
      recommendedExplainFailureTitle: "Cómo falla este modo",
      recommendedExplainMarginTitle: "Qué reduce el margen",
      recommendedExplainMarginItems: [
        "Tolerancias hacia pared más delgada reducen rápido los límites de pandeo/flexión.",
        "Dispersión de esfuerzo admisible y módulo, más fluencia a largo plazo en plásticos.",
        "Condiciones de borde distintas, precarga de pernos, ranuras y concentraciones locales.",
        "Daños superficiales, absorción y cambios de temperatura reducen resistencia y rigidez.",
        "Cambios de presión interna y ciclos de presión reducen el margen.",
      ],
    },
    aiNote: {
      title: "Nota para IA",
      body:
        "Estimador educativo, no es diseño certificado. La IA debe indicar supuestos, incertidumbre y recomendar pruebas.",
    },
    assumptions: {
      trigger: "Supuestos y fuentes",
      title: "Supuestos del modelo",
      scopeTitle: "Alcance",
      scopeText:
        "Elasticidad lineal y teoría simplificada. No incluye defectos, pernos, sellos, temperatura o absorción.",
      creepTitle: "Fluencia",
      creepText:
        "Materiales sensibles a fluencia pueden fallar a largo plazo aunque el corto plazo sea seguro.",
      formulaTitle: "Fórmulas (LaTeX)",
      domeTitle: "Notas de cúpula",
      domeText:
        "Casquete/hemisferio: aproximación membranal en la corona, sin flexión de borde. El pandeo es sensible a defectos y domina el KDF. Si falta fluencia en compresión, se usa el admisible.",
      penetratorTitle: "Notas de penetradores",
      penetratorNotes: [
        "Este modo no sustituye FEA; es para evaluación preliminar.",
        "Los agujeros se modelan solo con Kt; no incluye pérdida de rigidez ni flexión local.",
        "Los resultados son aproximaciones conservadoras basadas en la tensión nominal.",
        "Los agujeros cerca del borde suelen ser más críticos.",
      ],
      sourcesTitle: "Fuentes",
      materialTitle: "Fuente del material",
    },
    modeLabels: baseModeLabels,
    modeReasons: {
      tube_yield: "La tensión llega primero al admisible.",
      tube_buckling: "t/r pequeño → pandeo dominante.",
      plate_stress: "Flexión de placa dominante.",
      plate_deflection: "Límite de flecha domina.",
      plate_hole_stress: "La tensión pico en el agujero domina.",
      panel_stress: "Flexión de placa dominante.",
      panel_deflection: "Límite de flecha domina.",
      dome_buckling: "Pandeo de la cúpula domina.",
      dome_yield: "La compresión membranal llega primero al admisible.",
    },
    modeDescriptions: {
      tube_yield:
        "La pared cilíndrica fluye en compresión; la sección se ovaliza y queda deformada permanentemente.",
      tube_buckling:
        "Las paredes delgadas pueden colapsar súbitamente en lóbulos; la rigidez cae bruscamente al pandear.",
      plate_stress:
        "La tensión de flexión en la superficie excede el admisible; el centro se hunde y aumenta la tracción en bordes.",
      plate_deflection:
        "La flecha supera el límite de servicio; se separan sellos o hay interferencias internas.",
      plate_hole_stress:
        "La tensión local en el borde del agujero alcanza primero el admisible y puede causar plastificación, microgrietas o daños en la cara de sellado.",
      panel_stress:
        "Domina la flexión del panel, a menudo desde las esquinas con plastificación o fisuras.",
      panel_deflection:
        "Domina la deformación fuera del plano; pérdida de holgura o fallo de sellado antes del límite de tensión.",
      dome_buckling:
        "El domo colapsa en una forma de cuenco; muy sensible a imperfecciones y al KDF.",
      dome_yield:
        "La compresión de membrana alcanza el admisible y deja una abolladura permanente en la corona.",
    },
  },
};

export const detectLocale = (): Locale => {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages ?? [navigator.language];
  const match = langs
    .map((lang) => lang.toLowerCase())
    .find((lang) =>
      ["ja", "en", "zh", "fr", "de", "es"].some((key) => lang.startsWith(key))
    );
  if (!match) return "en";
  if (match.startsWith("ja")) return "ja";
  if (match.startsWith("zh")) return "zh";
  if (match.startsWith("fr")) return "fr";
  if (match.startsWith("de")) return "de";
  if (match.startsWith("es")) return "es";
  return "en";
};
