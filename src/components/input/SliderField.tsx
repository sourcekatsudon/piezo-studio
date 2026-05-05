"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  hint?: string;
};

export default function SliderField({ label, value, min, max, step, unit, onChange, hint }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={Number.isFinite(value) ? value : 0}
            step={step}
            min={min}
            max={max}
            onChange={(event) => onChange(Number(event.target.value))}
            className="h-9 w-24 text-right text-sm"
          />
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0] ?? value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
