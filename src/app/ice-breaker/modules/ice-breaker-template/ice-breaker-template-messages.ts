import { SafeHtml } from '@angular/platform-browser';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { Message } from 'src/app/shared/models/message.model';
import { IceBreakerPaymentRequest } from 'src/app/shared/models/payment-request';
import { Tip } from 'src/app/shared/models/tip.model';

export enum IceBreakerType {
  I_WILL_PAY = 'owner_pay',
  OTHERS_PAY_ME = 'others_pay',
}

export type PriceConditionsResult = { price: number; countOfPeople: number };

export interface IceBreakerTemplateMessage extends Message {
  isOwner: boolean;
  isTitle?: boolean;
  isDescription?: boolean;
  isAllowOrgLevel?: boolean;
  isAllowPlatformLevel?: boolean;
  isQuestion?: boolean;
  isRichMedia?: boolean;
  subtitle?: string;
  body: any;
  translateParams?: Record<string, string | number>;
  paymentRequest?: IceBreakerPaymentRequest;
  created_at?: string;
}

export interface StepQuestionTemplate {
  id: number;
  questions: IceBreakerTemplateMessage[];
}

export interface IceBreaker {
  id?: number;
  title: string;
  description?: string;
  allowOrgLevel: boolean;
  allowPlatformLevel: boolean;
  price?: number;
  user_skill_id?: number;
  questions: StepQuestionTemplate[];
  icebreaker_member?: CreatedIceBreaker;
  loading?: boolean;
  preview_media_url?: string;
  allow_quantity?: number;
  icebreaker_type?: IceBreakerType;
}

export interface CreatedIceBreaker {
  id: number;
  icebreaker_id: number;
  conversation_id: number;
  step: number;
  paid: boolean;
  internal_chat_id: number;
}

export interface IcebreakerMember {
  id: number;
  icebreaker_id: number;
  complete: boolean;
  current_step: number;
  total_questions: number;
  title: string;
  conversation_id?: number;
  tip: Tip | null;
  lesson?: Lesson;
  owner_id: number;
  questions: StepQuestionTemplate[];
}

export const ICEBREAKER_TEMPLATE_MESSAGES: IceBreakerTemplateMessage[][] = [
  [
    {
      isOwner: false,
      body: 'template-messages.hi-there',
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    },
    {
      isOwner: false,
      body: 'template-messages.start-asking',
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    },
  ],
  [
    {
      isOwner: false,
      body: 'template-messages.good-start',
      message_screenshots_attributes: [],
      message_screenshots: [],
      isTitle: false,
    },
    {
      isOwner: false,
      body: 'template-messages.once-done',
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    },
  ],
];

export const ICEBREAKER_TEMPLATE_TITLE_MESSAGES: IceBreakerTemplateMessage[] = [
  {
    isOwner: false,
    body: 'template-messages.well-done',
    message_screenshots_attributes: [
      // {
      //   url: 'assets/ice-breaker/giphy.gif',
      // },
    ],
    message_screenshots: [],
    isTitle: false,
  },
  {
    isOwner: false,
    body: 'template-messages.choose-title',
    message_screenshots: [],
    message_screenshots_attributes: [],
    isTitle: false,
  },
];

export const ICEBREAKER_TEMPLATE_DESCRIPTION_MESSAGES: IceBreakerTemplateMessage[] =
  [
    {
      isOwner: false,
      body: 'template-messages.set-description',
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    },
  ];

export const ICEBREAKER_TEMPLATE_ALLOW_ORG_LEVEL_MESSAGES: IceBreakerTemplateMessage[] =
  [
    {
      isOwner: false,
      body: 'template-messages.allow-org-level',
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    },
  ];

export const ICEBREAKER_TEMPLATE_ALLOW_PLATFORM_LEVEL_MESSAGES: IceBreakerTemplateMessage[] =
  [
    {
      isOwner: false,
      body: 'template-messages.allow-platform-level',
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    },
  ];

export const LAST_MESSAGE: IceBreakerTemplateMessage[] = [
  {
    isOwner: false,
    body: 'template-messages.you-reade',
    message_screenshots_attributes: [
      // {
      //   url: 'assets/ice-breaker/ezgif.com-gif-maker.gif',
      // },
    ],
    isTitle: false,
  },
];

export const getRegularNextQuestionMessage = (
  step: number,
): IceBreakerTemplateMessage[] => {
  return [
    {
      isOwner: false,
      body: 'template-messages.next-question',
      translateParams: { stepNumber: step },
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    },
  ];
};

export const getRegularSetValidUrlMessage: IceBreakerTemplateMessage[] = [
  {
    isOwner: false,
    body: 'template-messages.link-not-supported',
    message_screenshots: [],
    message_screenshots_attributes: [],
    isTitle: false,
  },
];

export const successValidUrlMessage = (
  embedHtml: SafeHtml,
): IceBreakerTemplateMessage[] => {
  // @ts-ignore
  return [
    {
      isOwner: false,
      isQuestion: false,
      isRichMedia: true,
      body: `${embedHtml}`,
      subtitle: 'template-messages.excellent',
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    },
  ];
};

export const setNewTitleMessage: IceBreakerTemplateMessage = {
  isOwner: false,
  body: 'template-messages.no-problem',
  message_screenshots: [],
  message_screenshots_attributes: [],
  isTitle: false,
};

export const finishAddNewQuestions: IceBreakerTemplateMessage = {
  isOwner: false,
  body: 'template-messages.perfect',
  message_screenshots_attributes: [
    {
      url: 'assets/ice-breaker/shareagain_2.png',
    },
  ],
  message_screenshots: [],
  isTitle: false,
};

export const invoicePaymentRequestMessage = (
  paymentRequest: IceBreakerPaymentRequest,
): IceBreakerTemplateMessage => {
  return {
    isOwner: true,
    isQuestion: false,
    isRichMedia: false,
    body: '',
    message_screenshots: [],
    message_screenshots_attributes: [],
    isTitle: false,
    paymentRequest,
  };
};
