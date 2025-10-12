import { createPath } from '@helpers-lib/routing-paths.helpers';
import { ICE_BREAKER_PATH } from 'src/app/ice-breaker/routing/ice-breaker.paths';

export const PROFILE_PATH = createPath({
  pathSegments: 'profile',
  pathParam: 'profileToken',
});

export const WEBLINKS_CHILD_PATH = createPath({
  pathSegments: 'weblinks',
  parentSegment: PROFILE_PATH,
});
export const ASK_A_QUESTION_CHILD_PATH = createPath({
  pathSegments: 'ask-a-question',
  parentSegment: PROFILE_PATH,
});
export const CAPSULE_CHILD_PATH = createPath({
  pathSegments: ICE_BREAKER_PATH.toRelativeUrl(),
  pathParam: 'capsuleId',
  parentSegment: PROFILE_PATH,
});
export const ORGANIZATIONS_CHILD_PATH = createPath({
  pathSegments: 'organizations',
  parentSegment: PROFILE_PATH,
});
