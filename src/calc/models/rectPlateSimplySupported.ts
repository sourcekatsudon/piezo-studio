export type RectPlateProps = {
  a: number;
  b: number;
  t: number;
  E_Pa: number;
  nu: number;
};

const flexuralRigidity = (E_Pa: number, t: number, nu: number) =>
  (E_Pa * t ** 3) / (12 * (1 - nu ** 2));

export const rectPlateMaxDeflectionPerPa = (props: RectPlateProps, terms = 51) => {
  const D = flexuralRigidity(props.E_Pa, props.t, props.nu);
  const a = props.a;
  const b = props.b;
  let sum = 0;
  for (let m = 1; m <= terms; m += 2) {
    const sinMx = Math.sin((m * Math.PI) / 2);
    for (let n = 1; n <= terms; n += 2) {
      const sinNy = Math.sin((n * Math.PI) / 2);
      const denom = (m * n) * ((m * m) / (a * a) + (n * n) / (b * b)) ** 2;
      sum += (sinMx * sinNy) / denom;
    }
  }
  return (16 / (Math.PI ** 6)) * (1 / D) * sum;
};

export const rectPlateMaxStressPerPa = (props: RectPlateProps, terms = 51) => {
  const D = flexuralRigidity(props.E_Pa, props.t, props.nu);
  const a = props.a;
  const b = props.b;
  let d2w_dx2 = 0;
  let d2w_dy2 = 0;
  for (let m = 1; m <= terms; m += 2) {
    const sinMx = Math.sin((m * Math.PI) / 2);
    for (let n = 1; n <= terms; n += 2) {
      const sinNy = Math.sin((n * Math.PI) / 2);
      const denom = (m * n) * ((m * m) / (a * a) + (n * n) / (b * b)) ** 2;
      const coeff = (16 / (Math.PI ** 6)) * (1 / D) * (sinMx * sinNy) / denom;
      d2w_dx2 += coeff * (-((m * Math.PI / a) ** 2));
      d2w_dy2 += coeff * (-((n * Math.PI / b) ** 2));
    }
  }
  const Mx = -D * (d2w_dx2 + props.nu * d2w_dy2);
  const My = -D * (d2w_dy2 + props.nu * d2w_dx2);
  const sigma_x = (6 * Mx) / (props.t ** 2);
  const sigma_y = (6 * My) / (props.t ** 2);
  const vonMises = Math.sqrt(sigma_x ** 2 - sigma_x * sigma_y + sigma_y ** 2);
  const maxPrincipal = Math.max(sigma_x, sigma_y);
  return { maxVonMises: vonMises, maxPrincipal };
};
