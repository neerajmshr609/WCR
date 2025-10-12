import { IChipsItem } from '../../UIkit/chips-item/chips-item.interface';

export interface IFilterPanelOutput<F extends IChipsItem> {
  selectedFilters: F[];
  textFilter: string;
}