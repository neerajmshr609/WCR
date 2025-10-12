export interface RatebackObject {
  helpful?: number;
  unhelpful?: number;
  discouraging?: number;
  inspiring?: number;
  strengths?: number;
  weaknesses?: number;
  nextsteps?: number;
  links?: number;
}

export interface ParsedRatebackObject {
  type: string;
  name: string;
  count: number;
  value: number;
}
