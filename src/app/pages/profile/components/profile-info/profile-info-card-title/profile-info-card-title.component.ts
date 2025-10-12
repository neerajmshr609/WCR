import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ConversationImageType } from '../../../../../shared/model-based-components/conversation-image/conversation-image.interface';
import { getRandomAvatarSrc } from '../../../../usersettings/constants/avatars';
import { UserProfile } from '../../../model/user-profile.model';

@Component({
  selector: 'app-profile-info-card-title',
  templateUrl: './profile-info-card-title.component.html',
  styleUrls: ['./profile-info-card-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoCardTitleComponent {
  readonly profile = input.required<UserProfile>();
  readonly isOrganizationMember = computed(() =>
    this.profile()?.isOrganizationMember(),
  );
  readonly images = computed<ConversationImageType>(() => {
    const profile = this.profile();
    const images = [];
    // TODO: Profile data should contains info about organization (image + org name)
    // if (profile.isOrganizationMember()) {
    //   images.push({
    // src: profile.organization_image,
    // alt: `Avatar of ${profile.organization_name}`,
    // });
    // }
    if (profile.isOrganizationMember()) {
      images.push({
        src:
          profile.org_member.org_logo ||
          getRandomAvatarSrc(profile?.org_member.organization_id),
        alt: `Avatar of ${profile.org_member.org_legal_name}`,
      });
    }

    images.push({
      src: profile?.image || getRandomAvatarSrc(profile?.id),
      alt: `Avatar of ${profile?.username}`,
    });
    return images;
  });
  readonly name = computed(() => {
    const profile = this.profile();
    // TODO: Profile data should contains info about organization (image + org name)
    // return profile.organization_name || profile.display_name;
    return profile?.isOrganizationMember()
      ? profile.org_member.org_legal_name
      : profile?.display_name;
  });

  readonly subName = computed(() => {
    const profile = this.profile();
    // TODO: Profile data should contains info about organization (image + org name)
    return (
      (profile?.isOrganizationMember()
        ? profile?.display_name
        : profile?.country) || ''
    );
  });

}
