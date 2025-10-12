import { IconType } from '../../shared/icons/_base/icon-type-def';

export interface IMenuItem {
  title: string;
  param: string;
  disabled?: boolean;
  description?: string;
  icon?: IconType;
  icon_alt?: string;
  id?: string | number;
}
