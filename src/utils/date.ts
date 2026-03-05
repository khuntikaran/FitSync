export function toIsoDate(value: Date): string {
  return value.toISOString().split('T')[0];
}

export function diffInSeconds(startIso: string, endIso: string): number {
  return Math.max(0, Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 1000));
}
