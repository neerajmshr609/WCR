import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../../../../../shared/models/user.model';
import { UserSkill } from '../../../../../../../shared/models/UserSkill.model';

@Pipe({
  name: 'userSkill',
})
export class UserSkillPipe implements PipeTransform {
  transform(id: number, user: User): UserSkill {
    return user.user_skills.find((userSkill: UserSkill) => userSkill.id === id);
  }
}
