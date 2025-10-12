export const isObjectType = (value: unknown) => typeof value === 'object';

export function areEqual(obj1: object, obj2: object) {
  const keys = Object.keys(obj1);
  let equal = true;
  for (const key of keys) {
    const value1 = obj1[key];
    const value2 = obj2[key];
    const type1 = typeof value1;
    const type2 = typeof value2;
    if (type1 === 'object' && type2 === 'object') {
      equal = areEqual(value1, value2);
    } else if (type1 !== type2 || value1 !== value2) {
      equal = false;
    }
    if (!equal) {
      break;
    }
  }
  return equal;
}