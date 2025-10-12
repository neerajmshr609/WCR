import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { avatarsImages } from 'src/app/pages/usersettings/constants';
import { User } from '../../models/user.model';
import { IConversationUserInfo } from '../../models/conversation.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  @Input() private userId: number;
  @Input() private user: IConversationUserInfo;

  @Input() public noName: boolean;
  @Input() public isWhite: boolean;
  @Input() public isGrey = false;
  @Input() public isRight: boolean;
  @Input() public isRound: boolean;
  @Input() public noBorder = true;
  @Input() public disableLink: boolean;

  @Input() public borderWidth = 3;
  @Input() public borderColor = '#E9E9E9';

  public loadedUser: IConversationUserInfo | User;
  public isAnon: boolean;

  private avatars = avatarsImages;
  public avatar: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId =
      'user_id' in this.user
        ? (this.user as IConversationUserInfo).user_id
        : (this.user as User).id;
    this.isAnon = this.authService.isAnon(this.userId || userId);
    if (this.isAnon) {
      this.getAvatar();
      return;
    }
    if (this.user) {
      this.loadedUser = this.user;
      this.getAvatar();
      return;
    }

    this.authService.fetchUser(this.userId).subscribe((res) => {
      this.loadedUser = res;
      this.getAvatar();
    });
  }

  private getAvatar() {
    const userId =
      'user_id' in this.user
        ? (this.user as IConversationUserInfo).user_id
        : (this.user as User).id;
    if (this.isAnon) {
      this.avatar = 'assets/anon.png';
      return;
    }

    if (this.loadedUser.image) {
      this.avatar = this.loadedUser.image;
      return;
    }

    this.avatar = this.avatars[userId % this.avatars.length];
  }
}
