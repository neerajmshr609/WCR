import { User } from '../user.model';

export class AnonymousUser extends User {
  readonly username = 'Anonymous';
  conversation_ids = [];
  image = '';
  isAnonymous = true;
}

export const createAnonymousUser = (id: number) => {
  const user = new AnonymousUser();
  user.id = id;
  return user;
};
