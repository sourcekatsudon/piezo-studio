export const formatNumber = (value: number, digits = 2) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

export const formatCompact = (value: number, digits = 1) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: digits,
  }).format(value);

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const roundTo = (value: number, step: number) =>
  Math.round(value / step) * step;
