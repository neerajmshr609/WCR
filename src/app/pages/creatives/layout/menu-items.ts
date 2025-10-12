import { IMenuItem } from 'src/app/main-content-menu/model/menu-item';

export const MENU_ITEMS: IMenuItem[] = [
  {
    title: 'menu.latest',
    param: '',
    icon: 'assets/creatives/latest.svg',
  },
  {
    title: 'menu.review_queue',
    param: 'reviewqueue',
    icon: 'assets/creatives/queue.svg',
    description: 'some-description MOCK TEXT',
  },
  {
    title: 'menu.drafts',
    param: 'drafts',
    icon: 'assets/creatives/drafts.svg',
    description: '2 some-description MOCK TEXT',
  },
  {
    title: 'menu.highest_review_price',
    param: 'inspiringrate',
    icon: 'assets/creatives/highest-price.svg',
    description: 'some-description MOCK TEXT',
  },
  {
    title: 'menu.highest_payment_frequency',
    param: 'highest_payment',
    icon: 'assets/creatives/highest-frequency.svg',
    description: 'some-description MOCK TEXT',
  },
  {
    title: 'menu.highest_rated_projects',
    param: 'highest_rated',
    icon: 'assets/creatives/highest-rated.svg',
    description: 'some-description MOCK TEXT',
  },
  {
    title: 'menu.lowest_rated_projects',
    param: 'lowest_rated',
    icon: 'assets/creatives/lowest-rated.svg',
    description: 'some-description MOCK TEXT',
  },
  {
    title: 'menu.most_often_reviewed',
    param: 'often_reviewed',
    icon: 'assets/creatives/often-reviewed.svg',
  },
  {
    title: 'menu.paid_feedback_requests',
    param: 'is_project_advisor',
    icon: 'assets/creatives/requests.svg',
  },
];
