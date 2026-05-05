import { z } from "zod";

export const materialSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["metal", "plastic"]),
  density_kg_m3: z.number().nullable(),
  elastic: z.object({ E_GPa: z.number(), nu: z.number() }),
  strength: z.object({
    yield_MPa: z.number().nullable(),
    ultimate_MPa: z.number().nullable(),
    compressive_yield_MPa: z.number().nullable(),
    design_allow_MPa_short: z.number(),
    design_allow_MPa_long: z.number(),
  }),
  creep: z.object({
    isCreepSensitive: z.boolean(),
    longTermFactorDefault: z.number(),
    notes: z.string(),
  }),
  notes: z.string().optional(),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      fields: z.array(z.string()),
    })
  ),
});

export const materialsSchema = z.array(materialSchema);
