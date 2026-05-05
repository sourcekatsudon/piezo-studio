"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import citations from "@/data/citations.json";
import type { Material } from "@/lib/types";
import type { AppCopy } from "@/lib/i18n";

export default function AssumptionsSheet({
  material,
  copy,
}: {
  material: Material;
  copy: AppCopy["assumptions"];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          {copy.trigger}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{copy.title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 pt-6 text-sm">
          <div className="space-y-2">
            <h3 className="font-medium">{copy.scopeTitle}</h3>
            <p className="text-muted-foreground">{copy.scopeText}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{copy.creepTitle}</h3>
            <p className="text-muted-foreground">{copy.creepText}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{copy.formulaTitle}</h3>
            <div className="rounded-xl border border-border bg-white/70 p-3 text-xs text-muted-foreground">
              <p>{"\\(\\sigma_r = A - B/r^2\\), \\(\\sigma_\\theta = A + B/r^2\\)"}</p>
              <p>{"\\(A=(a^2 p_i - b^2 p_o)/(b^2-a^2)\\)"}</p>
              <p>{"\\(p_{cr}=\\gamma\\,E/(4(1-\\nu^2))(t/r)^3\\)"}</p>
              <p>{"\\(w_0 = q a^4/(64 D)\\), \\(D=E t^3/(12(1-\\nu^2))\\)"}</p>
              <p>{"\\(\\delta r = (1-\\nu) p R_m^2 / (2 E t)\\)"}</p>
              <p>{"\\(p_{cr,sph} = (2E/\\sqrt{3(1-\\nu^2)})(t/R_m)^2\\)"}</p>
              <p>{"\\(p_{y} = (2 t / R_m)\\sigma_y\\)"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{copy.domeTitle}</h3>
            <p className="text-muted-foreground">{copy.domeText}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{copy.penetratorTitle}</h3>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              {copy.penetratorNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{copy.sourcesTitle}</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                {citations.cylinder.title} — {citations.cylinder.source}
                <div className="break-all">{citations.cylinder.url}</div>
              </li>
              <li>
                {citations.buckling.title} — {citations.buckling.source}
                <div className="break-all">{citations.buckling.url}</div>
              </li>
              <li>
                {citations.sphericalShell.title} — {citations.sphericalShell.source}
                <div className="break-all">{citations.sphericalShell.url}</div>
              </li>
              <li>
                {citations.plate.title} — {citations.plate.source}
                <div className="break-all">{citations.plate.url}</div>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{copy.materialTitle}</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {material.sources.map((source) => (
                <li key={source.title}>
                  <div className="font-medium text-foreground">{source.title}</div>
                  <div className="break-all">{source.url}</div>
                  <ul className="list-disc pl-4">
                    {source.fields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
