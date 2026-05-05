"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SliderField from "./SliderField";

export type UncertaintyProps = {
  enabled: boolean;
  t_tol_mm: number;
  d_tol_mm: number;
  E_var_pct: number;
  sigma_var_pct: number;
  kdfPreset: "ideal" | "good" | "hobby" | "rough";
  showKdf?: boolean;
  samples: 200 | 2000 | 10000;
  pfTarget: number;
  onChange: (next: Partial<UncertaintyProps>) => void;
  copy: {
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
};

export default function UncertaintyTab({
  enabled,
  t_tol_mm,
  d_tol_mm,
  E_var_pct,
  sigma_var_pct,
  kdfPreset,
  showKdf = true,
  samples,
  pfTarget,
  onChange,
  copy,
}: UncertaintyProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-white/70 p-3">
        <div>
          <p className="text-sm font-medium">{copy.enable}</p>
          <p className="text-xs text-muted-foreground">{copy.enableHint}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={(checked) => onChange({ enabled: checked })} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <SliderField
            label={copy.tTol}
            value={t_tol_mm}
            min={0}
            max={1}
            step={0.05}
            unit="mm"
            onChange={(value) => onChange({ t_tol_mm: value })}
          />
          <SliderField
            label={copy.dTol}
            value={d_tol_mm}
            min={0}
            max={1}
            step={0.05}
            unit="mm"
            onChange={(value) => onChange({ d_tol_mm: value })}
          />
          <SliderField
            label={copy.EVar}
            value={E_var_pct}
            min={0}
            max={50}
            step={1}
            unit="%"
            onChange={(value) => onChange({ E_var_pct: value })}
          />
          <SliderField
            label={copy.sigmaVar}
            value={sigma_var_pct}
            min={0}
            max={50}
            step={1}
            unit="%"
            onChange={(value) => onChange({ sigma_var_pct: value })}
          />
          {showKdf && (
            <div className="grid gap-2">
              <Label className="text-sm font-medium">{copy.kdf}</Label>
              <Select value={kdfPreset} onValueChange={(value) => onChange({ kdfPreset: value as UncertaintyProps["kdfPreset"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ideal">{copy.kdfIdeal}</SelectItem>
                  <SelectItem value="good">{copy.kdfGood}</SelectItem>
                  <SelectItem value="hobby">{copy.kdfHobby}</SelectItem>
                  <SelectItem value="rough">{copy.kdfRough}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {copy.kdfHint}
              </p>
            </div>
          )}
          <div className="grid gap-2">
            <Label className="text-sm font-medium">{copy.samples}</Label>
            <Select value={String(samples)} onValueChange={(value) => onChange({ samples: Number(value) as UncertaintyProps["samples"] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="200">{copy.sampleFast}</SelectItem>
              <SelectItem value="2000">{copy.sampleSlow}</SelectItem>
              <SelectItem value="10000">{copy.sampleDefault}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-medium">{copy.pfTarget}</Label>
            <Select value={String(pfTarget)} onValueChange={(value) => onChange({ pfTarget: Number(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.1">10%</SelectItem>
                <SelectItem value="0.01">1%</SelectItem>
                <SelectItem value="0.001">0.1%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
