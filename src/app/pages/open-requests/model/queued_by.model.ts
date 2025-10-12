import { IQueuedBy } from './responses/queued-by.interface';
import { getRandomAvatarSrc } from '../../usersettings/constants/avatars';
import { getRandomTrueOrFalse } from '../../../shared/lib/randoms.lib';

export class QueuedBy {
  username: string;
  profileimage?: null | string;
  organization_image: null | string;
  organization_id: number;
  user_image: string;
  user_id: number;
}

export const createQueuedBy = (src: IQueuedBy) => {
  const dst = new QueuedBy();
  Object.assign(dst, src);
  if (!dst.profileimage && !dst.organization_image) {
    dst.profileimage = getRandomTrueOrFalse() ? getRandomAvatarSrc() : null;
    dst.organization_image = getRandomAvatarSrc(dst.organization_id);
  }
  return dst;
};
