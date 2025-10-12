export const toMeaningfulStr = (str: string) =>
  str.replace(/\s/g, '').toLowerCase();

export const isStringType = (str: unknown) => typeof str === 'string';

export const isNotEmptyString = (str: unknown) =>
  isStringType(str) && (str as string).length > 0;
