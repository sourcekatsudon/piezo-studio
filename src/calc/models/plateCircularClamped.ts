export type PlateProps = {
  a: number;
  t: number;
  E_Pa: number;
  nu: number;
};

const flexuralRigidity = (E_Pa: number, t: number, nu: number) =>
  (E_Pa * t ** 3) / (12 * (1 - nu ** 2));

const derivatives = (r: number, a: number, D: number, q: number) => {
  const coeff = q / (64 * D);
  const df = -4 * r * (a * a - r * r);
  const d2f = -4 * a * a + 12 * r * r;
  const dw = coeff * df;
  const d2w = coeff * d2f;
  return { dw, d2w };
};

export const plateDeflectionPerPa = (props: PlateProps) => {
  const D = flexuralRigidity(props.E_Pa, props.t, props.nu);
  return (props.a ** 4) / (64 * D);
};

export const plateMoments = (r: number, props: PlateProps, q: number) => {
  const D = flexuralRigidity(props.E_Pa, props.t, props.nu);
  const { dw, d2w } = derivatives(r, props.a, D, q);
  const rSafe = Math.max(r, 1e-6);
  const oneOverRdw = r < 1e-6 ? (q / (64 * D)) * (-4 * props.a * props.a) : dw / rSafe;
  const M_r = -D * (d2w + props.nu * oneOverRdw);
  const M_theta = -D * (props.nu * d2w + oneOverRdw);
  return { M_r, M_theta };
};

export const plateStressAtRadius = (r: number, props: PlateProps, q: number) => {
  const { M_r, M_theta } = plateMoments(r, props, q);
  const sigma_r = (6 * M_r) / (props.t ** 2);
  const sigma_theta = (6 * M_theta) / (props.t ** 2);
  return { sigma_r, sigma_theta };
};

const vonMisesPlane = (sigma_r: number, sigma_theta: number) =>
  Math.sqrt(sigma_r ** 2 - sigma_r * sigma_theta + sigma_theta ** 2);

export const plateVonMisesPerPaAtRadius = (r: number, props: PlateProps) => {
  const { sigma_r, sigma_theta } = plateStressAtRadius(r, props, 1);
  return vonMisesPlane(sigma_r, sigma_theta);
};

export const plateMaxStressPerPa = (props: PlateProps) => {
  const steps = 120;
  let maxVm = 0;
  let maxPrincipal = -Infinity;
  for (let i = 0; i <= steps; i += 1) {
    const r = (props.a * i) / steps;
    const { sigma_r, sigma_theta } = plateStressAtRadius(r, props, 1);
    const vm = vonMisesPlane(sigma_r, sigma_theta);
    const principal = Math.max(sigma_r, sigma_theta);
    if (vm > maxVm) maxVm = vm;
    if (principal > maxPrincipal) maxPrincipal = principal;
  }
  return { maxVonMises: maxVm, maxPrincipal };
};
