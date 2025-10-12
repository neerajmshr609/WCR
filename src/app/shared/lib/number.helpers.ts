export const isPositiveInteger = (value: unknown) =>
  Number.isInteger(value) && (value as number) > 0;
export const castToIntegerOrZero = (value: unknown, radix = 10) => {
  const parsed = parseInt(value + '', radix);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toCoefficient = (percent: number) => {
  const positiveValue = Math.abs(percent);
  return positiveValue <= 1 ? positiveValue : (positiveValue % 100) / 100;
};

export const valuesBetween = (
  value1: number,
  value2: number,
  coefficient: number,
) => {
  const parsedCoefficient = toCoefficient(coefficient);
  const delta = Math.abs(Math.abs(value1) - Math.abs(value2)) * coefficient;
  return Math.min(value1, value2) + delta;
};
