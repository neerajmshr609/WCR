import { IMenuItem } from '../../../main-content-menu/model/menu-item';
import { IconSettingsGearComponent } from '../../../shared/icons/icon-settings-gear/icon-settings-gear.component';

export const skillsMenuItem = {
  title: 'menu.my_topics.name',
  param: 'skills',
  description: 'menu.my_topics.text',
  icon: 'assets/user-settings/menu/myTopics.svg',
};

export const generalMenuItem = {
  title: 'menu.individual.name',
  param: 'general',
  description: 'menu.individual.text',
  icon: IconSettingsGearComponent,
};

export const MENU_ITEMS_FOR_ORG_ADMIN: IMenuItem[] = [
  generalMenuItem,
  {
    title: 'menu.organization.name',
    param: 'organization',
    description: 'menu.organization.text',
    icon: 'assets/user-settings/menu/ngo.svg',
  },
  skillsMenuItem,
  {
    title: 'menu.user-management.name',
    param: 'user-managemaent',
    description: 'menu.user-management.text',
    icon: 'assets/user-settings/menu/myTopics.svg',
  },
  {
    title: 'menu.notifications.name',
    param: 'notifications',
    description: 'menu.notifications.text',
    icon: 'assets/user-settings/menu/notifications.svg',
  },
];

export const MENU_ITEMS_FOR_CONSULT_AND_ORG_MEMBER: IMenuItem[] = [
  generalMenuItem,
  skillsMenuItem,
  {
    title: 'menu.notifications.name',
    param: 'notifications',
    description: 'menu.notifications.text',
    icon: 'assets/user-settings/menu/notifications.svg',
  },
];

export const MENU_ITEMS_FOR_USER_WITHOUT_PERMISSIONS: IMenuItem[] = [
  generalMenuItem,
  {
    title: 'menu.notifications.name',
    param: 'notifications',
    description: 'menu.notifications.text',
    icon: 'assets/user-settings/menu/notifications.svg',
  },
];

export const CREATE_ORG: IMenuItem = {
  title: 'menu.create-organisation.name',
  param: 'create-organisation',
  description: 'menu.create-organisation.text',
  icon: 'assets/user-settings/menu/create-org.svg',
};
