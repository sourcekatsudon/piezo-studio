"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { EndCondition, Geometry, PlaneMode, PressureMode, ShapeType } from "@/lib/types";
import SliderField from "./SliderField";
import { mmToM, mToMm } from "@/calc/units";
import { deriveDomeGeometry } from "@/calc/models/dome";

type Props = {
  shape: ShapeType;
  geometry: Geometry;
  endCondition: EndCondition;
  planeMode: PlaneMode;
  pressureMode: PressureMode;
  mode: "beginner" | "pro";
  holeLayoutFits?: boolean;
  copy: {
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
  onShapeChange: (shape: ShapeType) => void;
  onGeometryChange: (geom: Geometry) => void;
  onEndConditionChange: (value: EndCondition) => void;
  onPlaneModeChange: (value: PlaneMode) => void;
};

export default function GeometryTab({
  shape,
  geometry,
  endCondition,
  planeMode,
  pressureMode,
  mode,
  holeLayoutFits,
  copy,
  onShapeChange,
  onGeometryChange,
  onEndConditionChange,
  onPlaneModeChange,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Select value={shape} onValueChange={(value) => onShapeChange(value as ShapeType)}>
          <SelectTrigger>
            <SelectValue placeholder={copy.shape} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cylinder">{copy.shapeCylinder}</SelectItem>
            <SelectItem value="plate">{copy.shapePlate}</SelectItem>
            <SelectItem value="plate_penetrators">
              <div className="flex items-center gap-2">
                <span>{copy.shapePlatePenetrators}</span>
                <Badge variant="secondary">{copy.beta}</Badge>
              </div>
            </SelectItem>
            <SelectItem value="box">
              <div className="flex items-center gap-2">
                <span>{copy.shapeBox}</span>
                <Badge variant="secondary">{copy.beta}</Badge>
              </div>
            </SelectItem>
            <SelectItem value="dome">
              <div className="flex items-center gap-2">
                <span>{copy.shapeDome}</span>
                <Badge variant="secondary">{copy.beta}</Badge>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {shape === "cylinder" && geometry.shape === "cylinder" && (
        <div className="space-y-4">
          <SliderField
            label={copy.innerDiameter}
            value={mToMm(geometry.Di_m)}
            min={10}
            max={500}
            step={1}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, Di_m: mmToM(v) })}
          />
          <SliderField
            label={copy.length}
            value={mToMm(geometry.L_m)}
            min={10}
            max={1000}
            step={1}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, L_m: mmToM(v) })}
          />
          <SliderField
            label={copy.thickness}
            value={mToMm(geometry.t_m)}
            min={1}
            max={100}
            step={0.2}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, t_m: mmToM(v) })}
          />
          <div className="flex items-center justify-between rounded-xl border border-border bg-white/70 px-3 py-2">
            <div>
              <p className="text-sm font-medium">{copy.endcap}</p>
              <p className="text-xs text-muted-foreground">{copy.endcapHint}</p>
            </div>
            <Switch
              checked={geometry.hasPlate}
              onCheckedChange={(checked) =>
                onGeometryChange({ ...geometry, hasPlate: checked })
              }
            />
          </div>
          {geometry.hasPlate && (
            <SliderField
              label={copy.plateThickness}
              value={mToMm(geometry.plate_t_m)}
              min={2}
              max={25}
              step={0.2}
              unit="mm"
              onChange={(v) => onGeometryChange({ ...geometry, plate_t_m: mmToM(v) })}
            />
          )}
          {mode === "pro" && (
            <div className="grid gap-4 rounded-xl border border-border bg-white/70 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{copy.endCondition}</p>
                  <p className="text-xs text-muted-foreground">{copy.endConditionHint}</p>
                </div>
                <Select value={endCondition} onValueChange={(v) => onEndConditionChange(v as EndCondition)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="closed">{copy.endConditionClosed}</SelectItem>
                    <SelectItem value="open">{copy.endConditionOpen}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{copy.planeMode}</p>
                  <p className="text-xs text-muted-foreground">{copy.planeModeHint}</p>
                </div>
                <Select value={planeMode} onValueChange={(v) => onPlaneModeChange(v as PlaneMode)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plane_strain">{copy.planeStrain}</SelectItem>
                    <SelectItem value="plane_stress">{copy.planeStress}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      )}

      {shape === "plate" && geometry.shape === "plate" && (
        <div className="space-y-4">
          <SliderField
            label={copy.plateRadius}
            value={mToMm(geometry.radius_m)}
            min={30}
            max={200}
            step={1}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, radius_m: mmToM(v) })}
          />
          <SliderField
            label={copy.plateThickness}
            value={mToMm(geometry.t_m)}
            min={2}
            max={25}
            step={0.2}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, t_m: mmToM(v) })}
          />
          <div className="rounded-xl border border-border bg-white/70 p-3 text-xs text-muted-foreground">
            {copy.plateBoundaryNote}
          </div>
        </div>
      )}

      {shape === "plate_penetrators" && geometry.shape === "plate_penetrators" && (
        <div className="space-y-4">
          <SliderField
            label={copy.plateRadius}
            value={mToMm(geometry.radius_m)}
            min={30}
            max={200}
            step={1}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, radius_m: mmToM(v) })}
          />
          <SliderField
            label={copy.plateThickness}
            value={mToMm(geometry.t_m)}
            min={2}
            max={25}
            step={0.2}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, t_m: mmToM(v) })}
          />
          <SliderField
            label={copy.plateHoleCount}
            value={geometry.hole_count}
            min={1}
            max={24}
            step={1}
            onChange={(v) => onGeometryChange({ ...geometry, hole_count: Math.round(v) })}
          />
          <SliderField
            label={copy.plateHoleDiameter}
            value={mToMm(geometry.hole_d_m)}
            min={4}
            max={50}
            step={0.5}
            unit="mm"
            onChange={(v) => {
              const minGap = mmToM(1);
              const hole_d_m = mmToM(v);
              const hole_forbid_m = Math.max(geometry.hole_forbid_m, hole_d_m + minGap);
              onGeometryChange({ ...geometry, hole_d_m, hole_forbid_m });
            }}
          />
          <SliderField
            label={copy.plateHoleForbid}
            value={mToMm(geometry.hole_forbid_m)}
            min={6}
            max={120}
            step={0.5}
            unit="mm"
            onChange={(v) => {
              const minGap = mmToM(1);
              const hole_forbid_m = Math.max(mmToM(v), geometry.hole_d_m + minGap);
              onGeometryChange({ ...geometry, hole_forbid_m });
            }}
          />
          <div className="space-y-2">
            <Label className="text-sm font-medium">{copy.plateHoleKt}</Label>
            <Select
              value={geometry.hole_kt_mode === "manual" ? "manual" : String(geometry.hole_kt_preset)}
              onValueChange={(value) => {
                if (value === "manual") {
                  onGeometryChange({ ...geometry, hole_kt_mode: "manual" });
                  return;
                }
                const preset = Number(value) as typeof geometry.hole_kt_preset;
                onGeometryChange({
                  ...geometry,
                  hole_kt_mode: "preset",
                  hole_kt_preset: preset,
                  hole_kt: preset,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">{copy.plateHoleKtPreset} 3.0</SelectItem>
                <SelectItem value="3.5">{copy.plateHoleKtPreset} 3.5</SelectItem>
                <SelectItem value="4">{copy.plateHoleKtPreset} 4.0</SelectItem>
                <SelectItem value="manual">{copy.plateHoleKtManual}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{copy.plateHoleKtHint}</p>
          </div>
          {geometry.hole_kt_mode === "manual" && (
            <SliderField
              label={copy.plateHoleKtManual}
              value={geometry.hole_kt}
              min={2}
              max={6}
              step={0.1}
              onChange={(v) => onGeometryChange({ ...geometry, hole_kt: v })}
            />
          )}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{copy.plateHoleKtVar}</Label>
            <Select
              value={geometry.hole_kt_variation}
              onValueChange={(value) =>
                onGeometryChange({ ...geometry, hole_kt_variation: value as typeof geometry.hole_kt_variation })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">{copy.plateHoleKtVarOff}</SelectItem>
                <SelectItem value="uniform">{copy.plateHoleKtVarUniform}</SelectItem>
                <SelectItem value="triangular">{copy.plateHoleKtVarTriangular}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {geometry.hole_kt_variation !== "off" && (
            <SliderField
              label={copy.plateHoleKtVarPct}
              value={geometry.hole_kt_var_pct}
              min={1}
              max={30}
              step={1}
              unit="%"
              onChange={(v) => onGeometryChange({ ...geometry, hole_kt_var_pct: v })}
            />
          )}
          <div className="flex items-center justify-between rounded-xl border border-border bg-white/70 px-3 py-2">
            <div>
              <p className="text-sm font-medium">{copy.plateDeflectionLimit}</p>
              <p className="text-xs text-muted-foreground">{copy.plateDeflectionLimitHint}</p>
            </div>
            <Switch
              checked={geometry.w_allow_m !== null}
              onCheckedChange={(checked) =>
                onGeometryChange({ ...geometry, w_allow_m: checked ? mmToM(1) : null })
              }
            />
          </div>
          {geometry.w_allow_m !== null && (
            <SliderField
              label={copy.plateDeflectionLimitValue}
              value={mToMm(geometry.w_allow_m)}
              min={0.1}
              max={5}
              step={0.1}
              unit="mm"
              onChange={(v) => onGeometryChange({ ...geometry, w_allow_m: mmToM(v) })}
            />
          )}
          <div className="flex items-center justify-between rounded-xl border border-border bg-white/70 px-3 py-2">
            <div>
              <p className="text-sm font-medium">{copy.platePenetratorAttach}</p>
              <p className="text-xs text-muted-foreground">{copy.platePenetratorAttachHint}</p>
            </div>
            <Switch
              checked={geometry.attachToCylinder}
              onCheckedChange={(checked) => onGeometryChange({ ...geometry, attachToCylinder: checked })}
            />
          </div>
          {geometry.attachToCylinder && (
            <SliderField
              label={copy.platePenetratorCylinderLength}
              value={mToMm(geometry.cylinderLength_m)}
              min={20}
              max={400}
              step={5}
              unit="mm"
              onChange={(v) => onGeometryChange({ ...geometry, cylinderLength_m: mmToM(v) })}
            />
          )}
          <div className="rounded-xl border border-border bg-white/70 p-3 text-xs text-muted-foreground">
            {copy.plateBoundaryNote}
          </div>
          <details className="rounded-xl border border-border bg-white/70 p-3 text-xs text-muted-foreground">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              {copy.platePenetratorNotesTitle}
            </summary>
            <div className="mt-2 space-y-1">
              {copy.platePenetratorNotes.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </details>
          {holeLayoutFits === false && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {copy.platePenetratorLayoutError}
            </div>
          )}
        </div>
      )}

      {shape === "box" && geometry.shape === "box" && (
        <div className="space-y-4">
          <SliderField
            label={copy.panelA}
            value={mToMm(geometry.a_m)}
            min={40}
            max={300}
            step={1}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, a_m: mmToM(v) })}
          />
          <SliderField
            label={copy.panelB}
            value={mToMm(geometry.b_m)}
            min={40}
            max={300}
            step={1}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, b_m: mmToM(v) })}
          />
          <SliderField
            label={copy.panelThickness}
            value={mToMm(geometry.t_m)}
            min={2}
            max={20}
            step={0.2}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, t_m: mmToM(v) })}
          />
          <div className="rounded-xl border border-border bg-white/70 p-3 text-xs text-muted-foreground">
            {copy.panelNote}
          </div>
        </div>
      )}

      {shape === "dome" && geometry.shape === "dome" && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label className="text-sm font-medium">{copy.domeMode}</Label>
            <Select
              value={geometry.mode}
              onValueChange={(value) => {
                const mode = value as typeof geometry.mode;
                const derived = deriveDomeGeometry({ ...geometry, mode });
                onGeometryChange({ ...geometry, mode, h_m: derived.h_m });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hemi">{copy.domeModeHemi}</SelectItem>
                <SelectItem value="cap">{copy.domeModeCap}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SliderField
            label={copy.innerDiameter}
            value={mToMm(geometry.Di_m)}
            min={60}
            max={500}
            step={1}
            unit="mm"
            onChange={(v) => {
              const Di = mmToM(v);
              const next = { ...geometry, Di_m: Di };
              const derived = deriveDomeGeometry(next);
              onGeometryChange({ ...next, h_m: derived.h_m });
            }}
          />
          <SliderField
            label={copy.thickness}
            value={mToMm(geometry.t_m)}
            min={2}
            max={40}
            step={0.2}
            unit="mm"
            onChange={(v) => onGeometryChange({ ...geometry, t_m: mmToM(v) })}
          />
          {geometry.mode === "cap" && (
            <SliderField
              label={copy.domeHeight}
              value={mToMm(geometry.h_m)}
              min={10}
              max={mToMm(geometry.Di_m) / 2}
              step={1}
              unit="mm"
              onChange={(v) => onGeometryChange({ ...geometry, h_m: mmToM(v) })}
            />
          )}
          {geometry.mode === "hemi" && (
            <div className="rounded-xl border border-border bg-white/70 p-3 text-xs text-muted-foreground">
              {copy.domeHeight}: {mToMm(deriveDomeGeometry(geometry).h_m).toFixed(1)} mm
            </div>
          )}
          <div className="flex items-center justify-between rounded-xl border border-border bg-white/70 px-3 py-2">
            <div>
              <p className="text-sm font-medium">{copy.domeAttach}</p>
              <p className="text-xs text-muted-foreground">{copy.domeAttachHint}</p>
            </div>
            <Switch
              checked={geometry.attachToCylinder}
              onCheckedChange={(checked) =>
                onGeometryChange({ ...geometry, attachToCylinder: checked })
              }
            />
          </div>
          {geometry.attachToCylinder && (
            <SliderField
              label={copy.domeCylinderLength}
              value={mToMm(geometry.cylinderLength_m)}
              min={40}
              max={800}
              step={1}
              unit="mm"
              onChange={(v) => onGeometryChange({ ...geometry, cylinderLength_m: mmToM(v) })}
            />
          )}
          {pressureMode === "external" && (
            <div className="grid gap-2 rounded-xl border border-border bg-white/70 p-3">
              <Label className="text-sm font-medium">{copy.domeKdf}</Label>
              <Select
                value={geometry.kdfMode}
                onValueChange={(value) =>
                  onGeometryChange({ ...geometry, kdfMode: value as typeof geometry.kdfMode })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preset">{copy.domeKdfPreset}</SelectItem>
                  <SelectItem value="manual">{copy.domeKdfManual}</SelectItem>
                </SelectContent>
              </Select>
              {geometry.kdfMode === "preset" ? (
                <Select
                  value={geometry.kdfPreset}
                  onValueChange={(value) =>
                    onGeometryChange({ ...geometry, kdfPreset: value as typeof geometry.kdfPreset })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideal">{copy.domeKdfIdeal}</SelectItem>
                    <SelectItem value="good">{copy.domeKdfGood}</SelectItem>
                    <SelectItem value="hobby">{copy.domeKdfHobby}</SelectItem>
                    <SelectItem value="rough">{copy.domeKdfRough}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <SliderField
                  label={copy.domeKdfManual}
                  value={geometry.kdfManual}
                  min={0.05}
                  max={1}
                  step={0.01}
                  onChange={(v) => onGeometryChange({ ...geometry, kdfManual: v })}
                />
              )}
              <p className="text-xs text-muted-foreground">{copy.domeKdfHint}</p>
            </div>
          )}
          {pressureMode === "external" && (
            <SliderField
              label={copy.domeSfBuckling}
              value={geometry.sfBuckling}
              min={1}
              max={4}
              step={0.1}
              onChange={(v) => onGeometryChange({ ...geometry, sfBuckling: v })}
            />
          )}
          <SliderField
            label={copy.domeSfYield}
            value={geometry.sfYield}
            min={1}
            max={3}
            step={0.1}
            onChange={(v) => onGeometryChange({ ...geometry, sfYield: v })}
          />
        </div>
      )}
    </div>
  );
}
