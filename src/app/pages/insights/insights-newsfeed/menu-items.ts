import { InsightsChannelEnum } from 'src/app/shared/enums';
import { IMenuItem } from '../../../main-content-menu/model/menu-item';

export const MENU_ITEMS: IMenuItem[] = [
  {
    title: 'Inbox',
    param: InsightsChannelEnum.inbox,
  },
  {
    title: 'Latest',
    param: InsightsChannelEnum.latest,
  },
  {
    title: 'Brilliant insight',
    param: InsightsChannelEnum.inspiring,
  },
  {
    title: 'Helpful',
    param: InsightsChannelEnum.helpful,
  },
  {
    title: 'Unhelpful',
    param: InsightsChannelEnum.unhelpful,
  },
  {
    title: 'Disrespectful',
    param: InsightsChannelEnum.discouraging,
  },
  {
    title: 'Strengths',
    param: InsightsChannelEnum.strengths,
  },
  {
    title: 'Weaknesses',
    param: InsightsChannelEnum.weaknesses,
  },
  {
    title: 'Next steps',
    param: InsightsChannelEnum.nextsteps,
  },
  {
    title: 'Links',
    param: InsightsChannelEnum.links,
  },
];
