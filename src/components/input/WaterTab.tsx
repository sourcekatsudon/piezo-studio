"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SliderField from "./SliderField";
import { atmToPa, PaToAtm, PaToMPa, MPaToPa } from "@/calc/units";
import type { PressureMode } from "@/lib/types";

export type WaterProps = {
  pressureMode: PressureMode;
  water: "freshwater" | "seawater";
  rho_kg_m3: number;
  internalPressure_Pa: number;
  targetPressure_Pa: number;
  targetDepth_m: number;
  onWaterChange: (water: "freshwater" | "seawater") => void;
  onRhoChange: (rho: number) => void;
  onInternalPressureChange: (pa: number) => void;
  onTargetPressureChange: (pa: number) => void;
  onTargetDepthChange: (depth: number) => void;
  copy: {
    type: string;
    freshwater: string;
    seawater: string;
    densityOverride: string;
    densityHint: string;
    internalPressure: string;
    internalHint: string;
    targetPressure: string;
    targetPressureHint: string;
    targetDepth: string;
    note: string;
    internalModeNote: string;
  };
};

export default function WaterTab({
  pressureMode,
  water,
  rho_kg_m3,
  internalPressure_Pa,
  targetPressure_Pa,
  targetDepth_m,
  onWaterChange,
  onRhoChange,
  onInternalPressureChange,
  onTargetPressureChange,
  onTargetDepthChange,
  copy,
}: WaterProps) {
  if (pressureMode === "internal") {
    const targetPressureAtm = PaToAtm(targetPressure_Pa);
    const targetPressureMPa = PaToMPa(targetPressure_Pa);

    return (
      <div className="space-y-4">
        <SliderField
          label={copy.targetPressure}
          value={targetPressureAtm}
          min={0.1}
          max={200}
          step={0.1}
          unit="atm"
          onChange={(value) => onTargetPressureChange(atmToPa(value))}
          hint={`${copy.targetPressureHint} (${targetPressureMPa.toFixed(3)} MPa)`}
        />
        <div className="rounded-xl border border-border bg-white/70 p-3 text-xs text-muted-foreground">
          {copy.internalModeNote}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">{copy.type}</Label>
        <Select value={water} onValueChange={(value) => onWaterChange(value as WaterProps["water"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="freshwater">{copy.freshwater}</SelectItem>
            <SelectItem value="seawater">{copy.seawater}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label className="text-sm font-medium">{copy.densityOverride}</Label>
        <Input
          type="number"
          value={rho_kg_m3}
          onChange={(event) => onRhoChange(Number(event.target.value))}
        />
        <p className="text-xs text-muted-foreground">{copy.densityHint}</p>
      </div>
      <SliderField
        label={copy.internalPressure}
        value={PaToMPa(internalPressure_Pa)}
        min={0}
        max={1.0}
        step={0.01}
        unit="MPa"
        onChange={(value) => onInternalPressureChange(MPaToPa(value))}
        hint={copy.internalHint}
      />
      <SliderField
        label={copy.targetDepth}
        value={targetDepth_m}
        min={5}
        max={2000}
        step={1}
        unit="m"
        onChange={onTargetDepthChange}
      />
      <div className="rounded-xl border border-border bg-white/70 p-3 text-xs text-muted-foreground">
        {copy.note}
      </div>
    </div>
  );
}
