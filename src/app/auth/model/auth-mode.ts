import { ValuesUnion } from '../../shared/lib/ts-utils.lib';

export const AUTH_MODE = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  RESET_PASSWORD: 'reset-password',
} as const;

export type AuthMode = ValuesUnion<typeof AUTH_MODE>;