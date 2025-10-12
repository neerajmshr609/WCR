import { Router, UrlSegment } from '@angular/router';
import { castToArray } from './array-helpers.lib';
import { isNotEmptyString, isStringType } from './string-helpers';
import { th } from 'date-fns/locale';

type PathSegment = string | UrlSegment | RoutingPathsHelper;

interface IRoutingPathsHelperParams {
  pathSegments: PathSegment[];
  parentSegment?: RoutingPathsHelper;
  pathParam?: string;
}

type AcceptableRoutingPathsParamsExtended =
  | IRoutingPathsHelperParams
  | ({ pathSegments: PathSegment } & Omit<
      IRoutingPathsHelperParams,
      'pathSegments'
    >);
type AcceptableRoutingPathsParams =
  | AcceptableRoutingPathsParamsExtended
  | string;

const pathSegmentToRouterPath = (segment: PathSegment) => {
  switch (true) {
    case typeof segment === 'string':
      return segment;
    case segment instanceof RoutingPathsHelper:
      return segment.routerPath;
    default:
      return segment.toString();
  }
};

class RoutingPathsHelper {
  private readonly _pathSegments: PathSegment[];
  private readonly _pathParam?: string;
  private readonly _parentSegment?: RoutingPathsHelper;

  private _routerPath: string | null = null;

  private _toRouterPath() {
    const segments = this._pathSegments.map(pathSegmentToRouterPath);
    if (this._pathParam) {
      segments.push(this.pathParamAsRouterPath);
    }
    return segments.join('/');
  }

  get routerPath() {
    return this._routerPath || (this._routerPath = this._toRouterPath());
  }
  get pathParamAsRouterPath() {
    return this._pathParam ? `:${this._pathParam}` : '';
  }
  constructor(params: IRoutingPathsHelperParams) {
    this._pathSegments = [...params.pathSegments];
    this._pathParam = params.pathParam;
    this._parentSegment = params.parentSegment;
  }

  private _getParamValue(pathParams?: { [paramName: string]: unknown }) {
    let paramValue: string | null = null;
    const hasPathParam = isNotEmptyString(this._pathParam);
    if (pathParams && hasPathParam) {
      if (Object.hasOwn(pathParams, this._pathParam)) {
        paramValue = pathParams[this._pathParam].toString();
      } else {
        throw new Error(
          `Path param ${this._pathParam} is not provided for ${this.toRelativeUrl()}`,
        );
      }
    }

    return paramValue;
  }
  private _toSegemntsWithParam(pathParams?: { [paramName: string]: unknown }) {
    const segmants = this._pathSegments.map((_) => _.toString());
    const paramValue = this._getParamValue(pathParams);

    if (paramValue) {
      segmants.push(paramValue);
    }

    return segmants;
  }

  fromRootSegemntsWithParam(pathParams?: { [paramName: string]: unknown }) {
    const reversedSegmants: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let currentSegment: RoutingPathsHelper | null = this;
    do {
      const currentSegments = currentSegment
        ._toSegemntsWithParam(pathParams)
        .reverse();

      reversedSegmants.push(...currentSegments);

      currentSegment = currentSegment._parentSegment || null;
    } while (currentSegment);

    return reversedSegmants.reverse();
  }

  toStringUrl(pathParams?: { [paramName: string]: unknown }) {
    return this.fromRootSegemntsWithParam(pathParams).join('/');
  }

  toRelativeUrl(pathParams?: { [paramName: string]: unknown }) {
    return this._toSegemntsWithParam(pathParams).join('/');
  }

  createUrlTree(router: Router) {
    return router.createUrlTree(this.fromRootSegemntsWithParam());
  }
}

const parseParams = (
  params: AcceptableRoutingPathsParams,
): IRoutingPathsHelperParams => {
  const isString = isStringType(params);

  const pathSegments = isString
    ? [params as string]
    : castToArray<PathSegment>(
        (params as AcceptableRoutingPathsParamsExtended).pathSegments,
      );

  const parsedParams: IRoutingPathsHelperParams = { pathSegments };

  if (!isString) {
    const objParam = params as AcceptableRoutingPathsParamsExtended;

    if (isNotEmptyString(objParam?.pathParam)) {
      parsedParams.pathParam = objParam.pathParam;
    }

    if (objParam?.parentSegment) {
      parsedParams.parentSegment = objParam.parentSegment;
    }
  }

  return parsedParams;
};

export const createPath = (params: AcceptableRoutingPathsParams) => {
  const parsedParams = parseParams(params);
  return new RoutingPathsHelper(parsedParams);
};
