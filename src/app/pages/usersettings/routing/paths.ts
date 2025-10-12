import { generalMenuItem, skillsMenuItem } from '../constants/menu-items';
import { Params } from '@angular/router';

export const SETTINGS_MODULE_PATH = 'settings';

export const SKILLS_SETTINGS_PAGE_QUERY_PARAM: Params = { type: skillsMenuItem.param };
export const GENERAL_SETTINGS_PAGE_QUERY_PARAM: Params = { type: generalMenuItem.param };