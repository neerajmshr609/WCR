import { IDropdownListItem } from '../../UIkit/dropdown-list-item/dropdown-list-item.interface';
import { IMenuItem } from '../../../main-content-menu/model/menu-item';

export type DropdownListItem = IDropdownListItem & Pick<IMenuItem, 'param'>;
export type AlignBy = 'center' | 'right';
export type PositionBy = 'top' | 'bottom';
export type Theme = 'light' | 'dark';
