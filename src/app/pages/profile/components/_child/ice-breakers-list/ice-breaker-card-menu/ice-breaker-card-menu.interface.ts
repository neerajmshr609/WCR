import { DropdownListItem } from '@ui-components/dropdown-list/dropdown-list.interface';

export interface IIceBreakerCardDropdownMenuItem extends DropdownListItem {
  action: () => void;
}
