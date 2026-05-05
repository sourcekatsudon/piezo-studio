export const G = 9.80665;

export const waterDensity = {
  freshwater: 1000,
  seawater: 1025,
};

export const mmToM = (mm: number) => mm / 1000;
export const mToMm = (m: number) => m * 1000;

export const MPaToPa = (mpa: number) => mpa * 1e6;
export const kPaToPa = (kpa: number) => kpa * 1e3;
export const PaToMPa = (pa: number) => pa / 1e6;
export const atmToPa = (atm: number) => atm * 101325;
export const PaToAtm = (pa: number) => pa / 101325;
export const MPaToAtm = (mpa: number) => PaToAtm(MPaToPa(mpa));
export const atmToMPa = (atm: number) => PaToMPa(atmToPa(atm));

export const depthToPressure = (depth_m: number, rho_kg_m3: number) =>
  rho_kg_m3 * G * depth_m;
export const pressureToDepth = (p_pa: number, rho_kg_m3: number) =>
  p_pa / (rho_kg_m3 * G);
