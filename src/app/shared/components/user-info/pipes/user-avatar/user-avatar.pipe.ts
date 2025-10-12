import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../../models/user.model';
import { newAvatarsImages } from '../../../../../pages/usersettings/constants/avatars';

@Pipe({
  name: 'userAvatar',
})
export class UserAvatarPipe implements PipeTransform {
  private avatars = newAvatarsImages;

  transform(user: User): string {
    if (user.image) {
      return user.image;
    }

    return this.avatars[user.id % this.avatars.length];
  }
}
