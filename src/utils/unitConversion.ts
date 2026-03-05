export const UnitConverter = {
  kgToLbs: (kg: number): number => Math.round(kg * 2.20462 * 10) / 10,
  lbsToKg: (lbs: number): number => Math.round((lbs / 2.20462) * 10) / 10,

  cmToInches: (cm: number): number => Math.round((cm / 2.54) * 10) / 10,
  inchesToCm: (inches: number): number => Math.round(inches * 2.54 * 10) / 10,

  cmToFtIn: (cm: number): { ft: number; inches: number } => ({
    ft: Math.floor(cm / 30.48),
    inches: Math.round((cm % 30.48) / 2.54),
  }),

  ftInToCm: (ft: number, inches: number): number =>
    Math.round(ft * 30.48 + inches * 2.54),

  kmToMiles: (km: number): number => Math.round(km * 0.621371 * 10) / 10,
  milesToKm: (miles: number): number => Math.round((miles / 0.621371) * 10) / 10,

  formatWeight: (kg: number, unitSystem: 'metric' | 'imperial'): string =>
    unitSystem === 'imperial'
      ? `${UnitConverter.kgToLbs(kg)} lbs`
      : `${kg} kg`,
};
