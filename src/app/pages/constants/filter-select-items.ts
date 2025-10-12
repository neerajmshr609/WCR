import { ConversationType } from '../../shared/models/conversation.model';
import { ConversationFilterItem } from '../../shared/models/conversation-filter-item';

export const filterSelectItems: ConversationFilterItem[] = [
  // {
  //   name: 'scheduled',
  //   title: 'Scheduled',
  // },
  {
    name: ConversationType.DIRECT_CHAT,
    title: 'Direct Messages',
  },
  {
    name: 'requests',
    title: 'Requests',
  },
  {
    name: 'we_care',
    title: 'We Care',
  },
  {
    name: 'get_support',
    title: 'Get Support',
  },
  {
    name: ConversationType.ORG_CHAT,
    title: 'Org Chat',
  },
  {
    name: ConversationType.COMMUNITY_CHAT,
    title: 'Communities',
  },
  // {
  //   name: ConversationType.FEEDBACK_CHAT,
  //   title: 'Feedback Chat',
  // },
];
export const clientFilterSelectItems: ConversationFilterItem[] = [
  // {
  //   name: 'scheduled',
  //   title: 'Scheduled',
  // },
  {
    name: ConversationType.DIRECT_CHAT,
    title: 'Direct Messages',
  },
  {
    name: 'requests',
    title: 'Requests',
  },
  {
    name: 'get_support',
    title: 'Get Support',
  },
  {
    name: ConversationType.ORG_CHAT,
    title: 'Org Chat',
  },
  {
    name: ConversationType.COMMUNITY_CHAT,
    title: 'Communities',
  },
  // {
  //   name: ConversationType.FEEDBACK_CHAT,
  //   title: 'Feedback Chat',
  // },
];
