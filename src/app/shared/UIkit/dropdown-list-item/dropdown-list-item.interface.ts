import { IconType } from '../../icons/_base/icon-type-def';

export interface IDropdownListItem {
  icon?: IconType;
  icon_alt?: string;
  title: string;
  description?: string;
  inputs?: { [key: string]: any };
}
