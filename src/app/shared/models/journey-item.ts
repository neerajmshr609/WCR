export interface JourneyItem {
  key: string;
  class: string;
  count: number;
  name: string;
  icon: {
    display: boolean;
    reverted: boolean;
  };
  funnel_type: string;
}
