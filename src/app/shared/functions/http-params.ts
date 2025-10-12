import { HttpParams } from '@angular/common/http';

type HttpParamsOptions =
  | string
  | {
      [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>;
    };

const cloneDefinedOnly = <T extends object>(src: T) => {
  const dst: { [key in keyof T]?: NonNullable<T[keyof T]> } = {};
  for (const key in src) {
    const value = src[key];
    if (value) {
      dst[key] = value;
    }
  }

  return dst;
};

export const createHttpParams = (
  objectOrString: HttpParamsOptions,
): HttpParams | never => {
  let params;

  if (typeof objectOrString === 'string') {
    params = new HttpParams({
      fromString: objectOrString,
    });
  } else if (typeof objectOrString === 'object') {
    params = new HttpParams({
      fromObject: cloneDefinedOnly(objectOrString),
    });
  } else {
    throw new Error(
      `Unexpected type of HttpParamsOptions. Expected object or string; Got: ${typeof objectOrString}`,
    );
  }

  return params;
};
