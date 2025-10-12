import { UserSkill } from '../models/UserSkill.model';
import { User } from '../models/user.model';

export const getUserSeoData = (
  user: User,
): {
  title: string;
  description: string;
  url: string;
  image: string;
  userName: string;
} => {
  const userName = user.display_name;
  const availableStatus = user.online
    ? 'is NOW LIVE & Available For Quick Questions'
    : 'is available for Quick Questions';
  const image = `/assets/share-img.png`;
  const originUrl = window.location.origin;
  return {
    title: `${userName} ${availableStatus}`,
    description: `${user.city || 'Global'}`,
    url: `https://getme.global/profile/${user.sharetoken}`,
    userName,
    image,
  };
};
