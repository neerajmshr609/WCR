export const isArrayAndHasItems = (arr: unknown[]) =>
  Array.isArray(arr) && arr.length > 0;

export const castToArray = <T>(arr: unknown) =>
  (Array.isArray(arr) ? arr : arr ? [arr] : []) as T[];
