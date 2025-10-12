export interface Ruleset {
  id: number;
  for_new: boolean;
  for_interested: boolean;
  for_regular: boolean;
  time_from: string;
  time_until: string;
  weekdays: number[];
}
