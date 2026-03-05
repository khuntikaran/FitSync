export function assertFiniteNumber(value: number, field: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${field} must be a finite number.`);
  }
}

export function assertInRange(value: number, field: string, min: number, max: number): void {
  assertFiniteNumber(value, field);
  if (value < min || value > max) {
    throw new Error(`${field} must be between ${min} and ${max}.`);
  }
}

export function assertPositive(value: number, field: string): void {
  assertFiniteNumber(value, field);
  if (value <= 0) {
    throw new Error(`${field} must be positive.`);
  }
}
