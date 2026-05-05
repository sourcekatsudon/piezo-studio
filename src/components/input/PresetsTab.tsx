"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Material, Geometry } from "@/lib/types";
import { mmToM } from "@/calc/units";

export type Preset = {
  id: string;
  name: string;
  tags: string[];
  shape: "cylinder" | "plate" | "box";
  geometry: {
    Di_mm?: number;
    t_mm?: number;
    L_mm?: number;
    hasPlate?: boolean;
    plate_t_mm?: number;
    radius_mm?: number;
    a_mm?: number;
    b_mm?: number;
  };
  materialId: string;
  water: "freshwater" | "seawater";
  internalPressure_kPa: number;
  duration: "short" | "medium" | "long";
  uncertainty: {
    enabled: boolean;
    t_tol_mm: number;
    d_tol_mm: number;
    E_var_pct: number;
    sigma_var_pct: number;
    kdfPreset: "ideal" | "good" | "hobby" | "rough";
    samples: 200 | 2000 | 10000;
  };
};

export type PresetSelection = {
  preset: Preset;
  geometry: Geometry;
};

type Props = {
  presets: Preset[];
  materials: Material[];
  onApply: (preset: Preset, geometry: Geometry) => void;
  copy: {
    materialFallback: string;
    cylinderLabel: string;
    plateLabel: string;
    boxLabel: string;
  };
};

const buildGeometry = (preset: Preset): Geometry => {
  if (preset.shape === "cylinder") {
    return {
      shape: "cylinder",
      Di_m: mmToM(preset.geometry.Di_mm ?? 100),
      t_m: mmToM(preset.geometry.t_mm ?? 6),
      L_m: mmToM(preset.geometry.L_mm ?? 200),
      hasPlate: preset.geometry.hasPlate ?? true,
      plate_t_m: mmToM(preset.geometry.plate_t_mm ?? preset.geometry.t_mm ?? 6),
    };
  }
  if (preset.shape === "plate") {
    return {
      shape: "plate",
      radius_m: mmToM(preset.geometry.radius_mm ?? 60),
      t_m: mmToM(preset.geometry.t_mm ?? 6),
    };
  }
  return {
    shape: "box",
    a_m: mmToM(preset.geometry.a_mm ?? 120),
    b_m: mmToM(preset.geometry.b_mm ?? 80),
    t_m: mmToM(preset.geometry.t_mm ?? 6),
  };
};

export default function PresetsTab({ presets, materials, onApply, copy }: Props) {
  return (
    <div className="grid gap-3">
      {presets.map((preset) => {
        const material = materials.find((m) => m.id === preset.materialId);
        return (
          <Card
            key={preset.id}
            className="cursor-pointer border border-border bg-white/80 transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => onApply(preset, buildGeometry(preset))}
          >
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{preset.name}</p>
                <div className="flex flex-wrap gap-1">
                  {preset.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{material?.name ?? copy.materialFallback}</p>
              <p className="text-xs text-muted-foreground">
                {preset.shape === "cylinder" && copy.cylinderLabel}
                {preset.shape === "plate" && copy.plateLabel}
                {preset.shape === "box" && copy.boxLabel}
                {preset.geometry.Di_mm ? ` · Di ${preset.geometry.Di_mm} mm` : ""}
                {preset.geometry.radius_mm ? ` · a ${preset.geometry.radius_mm} mm` : ""}
                {preset.geometry.t_mm ? ` · t ${preset.geometry.t_mm} mm` : ""}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
