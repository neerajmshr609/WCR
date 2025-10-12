import { createPath } from '@helpers-lib/routing-paths.helpers';

export const ICE_BREAKER_PATH = createPath('ice-breakers');
export const ICE_BREAKER_CREATE_PATH = createPath({
  pathSegments: 'create',
  pathParam: 'userSkillId',
  parentSegment: ICE_BREAKER_PATH,
});
