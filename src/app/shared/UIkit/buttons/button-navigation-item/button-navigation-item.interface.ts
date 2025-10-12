import { IconType } from '../../../icons/_base/icon-type-def';
import { NavigationBehaviorOptions } from '@angular/router';

export interface IButtonNavigationItem {
  icon: IconType;
  icon_alt?: string;
  title: string;
  path: string;
  permission?: string[];
  navigateByUrl?: {
    url: string;
    extras?: NavigationBehaviorOptions;
  };
}
