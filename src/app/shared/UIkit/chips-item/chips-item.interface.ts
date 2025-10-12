export interface IChipsItem {
  id?: number;
  name: string;
  isEqualTo?: (item: IChipsItem) => boolean;
}