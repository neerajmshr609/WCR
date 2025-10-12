import { ValuesUnion } from '../../../shared/lib/ts-utils.lib';

export const ConditionsStatus = {
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  PENDING: 'PENDING',
} as const;

export type ConditionsStatus = ValuesUnion<typeof ConditionsStatus>;