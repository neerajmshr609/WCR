import { environment } from 'src/environments/environment';

export const BASE_URL = environment.baseUrl;
export const API_URL = BASE_URL + 'api/v1/';
export const ADMIN_URL = API_URL + 'admin/';
export const COMPANION_URL = BASE_URL + 'uploader/';

// AUTH
export const AUTH_URL = API_URL + 'auth/';
export const SIGN_IN_URL = AUTH_URL + 'sign_in/';
export const UPDATE_PASSWORD_URL = API_URL + 'users/update_user_password';
export const PASSWORD_URL = `${API_URL}users/reset_user_password`;
export const VALIDATE_TOKEN_URL = AUTH_URL + 'validate_token/';
export const SWITCH_EMAIL_NOTIFICATIONS = `${API_URL}mute_unmute_conversations`;
export const AUTH_MAGIC_LINK_URL = BASE_URL + 'sign_up_with_magic_link';
export const RESEND_MAGIC_LINK =
  API_URL + 'resend_sign_up_magic_link_confirmation';
export const sign_in_with_token = BASE_URL + 'sign_in_with_token/';
export const RESEND_CONFIRMATION_URL = API_URL + 'resend_confirmation/';
export const REGISTER_REFERRAL_URL = API_URL + 'register_referral/';

// PROJECTS
export const PROJECTS_URL = API_URL + 'projects/';
export const PROJECT_URL = (id: number) => PROJECTS_URL + id + '/';
export const PROJECTS_FEEDBACK_URL = PROJECTS_URL + 'projectsfeedback/';

export const ADD_TO_REVIEW_QUEUE_URL = API_URL + 'add_to_reviewqueue/';
export const REMOVE_FROM_REVIEW_QUEUE_URL =
  API_URL + 'remove_from_reviewqueue/';
export const MY_CHOOSE_THE_BEST_PROJECTS =
  API_URL + 'my_choosethebest_projects/';

// RATINGS
export const RATINGS_URL = API_URL + 'ratings/';

// ADVISORS
export const ADVISOR_PROFILE_URL = API_URL + 'advisor_user_profile/';
export const ADVISOR_DATES_URL = API_URL + 'advisordates/';

// USER PROFILE
export const WEBLINKS_URL = API_URL + 'weblinks/';
export const USER_URL = (id: number) => API_URL + 'users/' + id + '/';
export const USER_PERSONAL_INFO_DELETE_URL = (id: number) =>
  API_URL + `users/${id}`;

// RATE
export const DISCONNECTED_USERS_URL = API_URL + 'disconnected_users/';

// FEEDBACKS
export const FEEDBACKS_URL = API_URL + 'feedbacks/';
export const FEEDBACK_URL = (id: number) => FEEDBACKS_URL + id + '/';

// FEEDBACK SESSION
export const FEEDBACK_SESSIONS_URL = API_URL + 'feedbacksessions/';
export const FEEDBACK_SESSION_URL = (id: number) =>
  FEEDBACK_SESSIONS_URL + id + '/';
export const FEEDBACK_SESSIONS_STATUS_UPDATE_URL =
  FEEDBACK_SESSIONS_URL + 'update_status/';
export const FEEDBACK_SESSIONS_INTENT =
  API_URL + 'create_payment_intent_for_paid_project_feedback/';
export const DEANON_FEEDBACK_URL = FEEDBACK_SESSIONS_URL + 'deanon/';

// ANON
export const ANON_USER_ID = 156;

// CONVERSATIONS
export const CONVERSATIONS_URL = API_URL + 'conversations/';
export const FILTERED_CONVERSATIONS_URL = API_URL + 'filtered_conversations/';
export const CONVERSATION_URL = (id) => CONVERSATIONS_URL + id + '/';
export const ANONYMOUS_CONVERSATION_URL = API_URL + 'anonymous_conversation/';
export const CONVERSATION_FOR_ANONYMOUS_USER_URL =
  API_URL + 'user_conversation';
export const LIST_USERS_TO_ADD_URL = `${API_URL}users_search`;
export const ADD_CONVERSATION_MEMBER_URL = `${API_URL}add_conversation_member`;
export const CREATE_NEW_CONVERSATION = `${API_URL}create_new_chat`;
export const END_QUESTIONNARE = `${API_URL}end_questionnaire`;
export const CONNECT_TO_CONVERSATION = `${API_URL}connect_to_conversation`;
export const ADD_CONVERSATION_MEMBER = `${API_URL}add_conversation_member`;

// setFirstInQueue
export const SET_FIRST_IN_QUEUE = API_URL + 'set_first_in_queue/';

// MY ACTIVITY
export const FUNNELS_URL = API_URL + 'funnels/';
export const FUNNEL_URL = (id) => FUNNELS_URL + id + '/';

// MESSAGES
export const UNREAD_MESSAGES_URL =
  API_URL + 'conversations/unread_messages_count/';
export const MESSAGES_URL = API_URL + 'messages/';
export const MESSAGE_URL = (id: number) => API_URL + 'messages/' + id + '/';

export const SOFT_DELETE_MESSAGE_URL = API_URL + 'delete_message/';

// REVIEWS
export const REVIEWS_URL = API_URL + 'my_activities/students_reviews';

// FEEDBACK ACTIVITY
export const FEEDBACK_ACTIVITY_URL = API_URL + 'feedback_activity';

// FUNNEL POSITION FOR ADVISOR
export const FUNNEL_FOR_ADVISOR_URL = API_URL + 'funnelforadvisor';

// FUNNEL FOR STUDENT
export const FUNNEL_FOR_STUDENT_URL = API_URL + 'funnelforstudent';

// FEEDBACK RECEIVER
export const FEEDBACK_RECEIVERS_URL = API_URL + 'users?feedbackreceiver=true';

// PROJECTS FOR MY ACTIVITY
export const MY_PROJECTS = API_URL + 'studentprojects';

// USERS FOR MY ACTIVITY
export const MY_USERS = (type: string) =>
  API_URL + 'my_activities/' + type + '/';

// USER STATS AS ADVISOR
export const USER_STAT_ADVISORS = API_URL + 'my_activities/advisors_stats';

// USER STATS AS STUDENT
export const USER_STAT_STUDENTS = API_URL + 'my_activities/students_stats';

// PAYMENT SESSION
export const PAYMENT_SESSIONS_URL = API_URL + 'message_payment_sessions/';
export const PAYMENT_SESSIONS_STATUS_UPDATE_URL =
  PAYMENT_SESSIONS_URL + 'update_status/';
export const PAYMENT_SESSION_URL = (id: number) =>
  PAYMENT_SESSIONS_URL + id + '/';
export const PAYMENT_SESSION_INTENT =
  API_URL + 'create_payment_intent_for_paid_message/';

// LESSON
export const LESSONS_URL = API_URL + 'lessons/';
export const LESSON_URL = (id: number) => LESSONS_URL + id + '/';
export const LESSON_PAYMENT_STATUS_UPDATE_URL = LESSONS_URL + 'update_status/';
export const PAYMENT_LESSON_INTENT =
  API_URL + 'create_payment_intent_for_lesson/';

// TIPS
export const TIPS_URL = API_URL + 'tips/';

// FEEDBACK DRAFTS
export const FEEDBACK_DRAFTS_URL = API_URL + 'feedback_drafts/';
export const FEEDBACK_DRAFT_URL = (id: number) =>
  FEEDBACK_DRAFTS_URL + id + '/';

// ADVISOR PAYMENTS
export const ADVISOR_PAYMENTS_URL = API_URL + 'advisor_payments/';

// PAYOUT REQUESTS
export const PAYOUT_REQUESTS_URL = API_URL + 'payout_requests/';
export const CURRENT_PAYOUT_REQUEST_URL = PAYOUT_REQUESTS_URL + 'current/';
export const PAYOUT_REQUEST_URL = (id: number) =>
  PAYOUT_REQUESTS_URL + id + '/';
export const PAYOUT = API_URL + 'payout/';
export const INVOICES_LIST = API_URL + 'invoices_list';

// ADMIN PAYOUT REQUESTS
export const ADMIN_PAYOUT_REQUESTS_URL = ADMIN_URL + 'payout_requests/';
export const ADMIN_PAYOUT_REQUEST_URL = (id: number) =>
  ADMIN_PAYOUT_REQUESTS_URL + id + '/';
export const ADMIN_PAYOUT_REQUEST_STATUS_URL = (id: number) =>
  ADMIN_PAYOUT_REQUEST_URL(id) + 'status/';

// USER PERMISSIONS
export const PERMISSIONS_URL = API_URL + 'user_permissions/';
export const PERMISSION_URL = (id: number) =>
  PERMISSIONS_URL + `?user_id=${id}`;
export const PERMISSION_DELETE_URL = (permission: string, id: number) =>
  PERMISSIONS_URL + `?permission=${permission}&user_id=${id}`;

//REGISTERED USER
export const REGISTERED_USER_URL = (active: boolean) =>
  API_URL + 'get_registered_users/' + `?active=${active}`;

// USER MANAGEMENT
export const INVITE_USER = `${API_URL}invites`;

//ORGANIZATIONS
export const ORGANIZATIONS_URL = API_URL + 'organizations';
export const ORGANIZATION_URL = (id: number) => ORGANIZATIONS_URL + `/${id}`;
export const ORGANIZATION_DELETE_URL = (id: number) =>
  ORGANIZATIONS_URL + `/${id}`;
export const ORGANIZATION_PROFILE_URL =
  ORGANIZATIONS_URL + '/configure_org_with_short_name/';
export const PENDING_ORGANIZATIONS_URL = ADMIN_URL + 'organizations';
export const PENDING_ORGANIZATION_URL = (organization_id: number) =>
  PENDING_ORGANIZATIONS_URL + `/${organization_id}`;
export const ORGANIZATION_SKILL_URL = API_URL + 'add_skill';

export const ORGANIZATIONS_SKILLS_URL = API_URL + 'organizations_skills';
export const ORGANIZATION_SKILLS_URL = (id: number) =>
  ORGANIZATIONS_SKILLS_URL + `/${id}`;
export const ORGANIZATION_SKILLS_DELETE_URL = (
  organization_id: number,
  skill_id: number,
) =>
  ORGANIZATIONS_SKILLS_URL +
  `?organization_id=${organization_id}&skill_id=${skill_id}`;

//PARTNERS
export const ORG_PARTNERS_URL = API_URL + 'org_partners';
export const ORG_PARTNERS_UPDATE_URL = (id: number) =>
  ORG_PARTNERS_URL + `/${id}`;
export const ORG_PARTNER_URL = (id: number) => ORG_PARTNERS_URL + `/${id}`;
export const ORG_PARTNER_GET_URL = (organization_id: number) =>
  ORG_PARTNERS_URL + `?organization_id=${organization_id}`;

//ORG MEMBERS
export const ORG_MEMBERS_URL = API_URL + 'org_members';
export const ORG_MEMBER_URL = (id: number) => ORG_MEMBERS_URL + `/${id}`;
export const FREE_CONSULTANTS = (id: number) =>
  API_URL + 'free_consultants_auths' + `/${id}`;

export const ACCEPT_CASE_URL = API_URL + 'take_case';
export const REJECT_CASE_URL = API_URL + 'reject_case';
export const ESCALATE_REQUEST = API_URL + 'requests/escalate_request';
