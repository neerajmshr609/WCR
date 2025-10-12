export enum ColorsMain {
  green = '#00C67E',
  blue = '#00AFFE',
  mustard = '#E3BE30',
  red = '#D9593C',
}

export const avFileState = {
  notloaded: 0,
  loaded: 1,
  paused: 2,
};

export enum avFileStateEnum {
  notloaded = 0,
  loaded = 1,
  paused = 2,
  playing = 3,
}

export enum avYTStateEnum {
  unstarted = -1,
  ended = 0,
  playing = 1,
  paused = 2,
  buffering = 3,
  cued = 5,
}

export enum ProjectInfoCardTypeEnum {
  title_card = 'title_card',
  description_card = 'description_card',
  category_card = 'category_card',
  purpose_card = 'purpose_card',
  skill_card = 'skill_card',
  feedback_focus_card = 'feedback_focus_card',
}

export const WhyCardType = {
  video_intro_card: 'video_intro_card',
  how_intro_card: 'how_intro_card',
  intro_card: 'intro_card',
  intro_category_card: 'intro_category_card',
  slider_card: 'slider_card',
  step_card: 'step_card',
  slider_manifest_card: 'slider_manifest_card',
  video_card: 'video_card',
  skip_card: 'skip_card',
  types_of_advice_card: 'types_of_advice_card',
  step_card_long_terms: 'step_card_long_terms',
  step_card_quick_advice: 'step_card_quick_advice',
};

export enum WhyCardTypeEnum {
  intro_card = 'intro_card',
  video_intro_card = 'video_intro_card',
  how_intro_card = 'how_intro_card',
  intro_category_card = 'intro_category_card',
  slider_card = 'slider_card',
  step_card = 'step_card',
  slider_manifest_card = 'slider_manifest_card',
  video_card = 'video_card',
  skip_card = 'skip_card',
  step_card_quick_advice = 'step_card_quick_advice',
  step_card_long_terms = 'step_card_long_terms',
  whycard__menu = 'whycard--menu',
  whycard__submenu = 'whycard--submenu',
  whycard = 'whycard',
  how_intro_card__menu = 'how_intro_card__menu',
  types_of_advice_card = 'types_of_advice_card',
}

export enum HowCardCategories {
  artist = 'artist',
  advisers = 'advisers',
  companies = 'companies',
}

export enum InsightsChannelEnum {
  newsfeed = 'newsfeed',
  newsfeed_following = 'newsfeed_following',
  latest = 'latest',
  inbox = 'inbox',
  inspiring = 'inspiring',
  helpful = 'helpful',
  unhelpful = 'unhelpful',
  discouraging = 'discouraging',
  strengths = 'strengths',
  weaknesses = 'weaknesses',
  nextsteps = 'nextsteps',
  links = 'links',
  choosethebest = 'choosethebest',
  presenterquestion = 'presenterquestion',
}

export enum NewsfeedQuestionType {
  guess_feedback_category = 'guess_feedback_category',
  guess_rateback = 'guess_rateback',
  guess_comment_lane = 'guess_comment_lane',
  choose_the_best = 'choose_the_best',
  presenter_question = 'presenter_question',
  feedback = 'feedback',
  feedback_rateback_stage = 'feedback_rateback_stage',
}

export enum ProjectRatingType {
  project = 'project',
  info = 'info',
  files = 'files',
}

export enum ProjectfileKind {
  audio = 'audio',
  video = 'video',
  hostedvideo = 'hostedvideo',
  image = 'image',
}

export enum FlexfeedbackFirstTabFunctionality {
  info = 'info',
  resort = 'resort',
  av = 'av',
}

export enum PaymentSessionStatuses {
  created = 'created',
  awaitingPayment = 'awaiting_payment',
  approved = 'approved', // paid
  denied = 'denied',
}

export enum TipsTypes {
  'lesson' = 'lesson',
  'messagePaymentSession' = 'message_payment_session',
  'feedbackSession' = 'feedbacksession',
  'iceBreaker' = 'icebreaker_member',
}
