import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RequestsIconComponent } from '../../icons/requests-icon/requests-icon.component';
import { HeaderNavBarItemComponent } from './header-nav-bar-item/header-nav-bar-item.component';
import { HomeIconComponent } from '../../icons/home-icon/home-icon.component';
import { NewsIconComponent } from '../../icons/news-icon/news-icon.component';
import { BlogIconComponent } from '../../icons/blog-icon/blog-icon.component';
import { RequestIconComponent } from '../../icons/request-icon/request-icon.component';
import { CounsellorDeskIconComponent } from '../../icons/counsellor-desk-icon/counsellor-desk-icon.component';
import { ConversationsIconComponent } from '../../icons/conversations-icon/conversations-icon.component';
import { SunflawerIconComponent } from '../../icons/sunflawer-icon/sunflawer-icon.component';
import { NgoLogoIconComponent } from '../../icons/ngo-logo-icon/ngo-logo-icon.component';
import { LoginIconComponent } from '../../icons/login-icon/login-icon.component';
import { CommunitiesIconComponent } from '../../icons/communities-icon/communities-icon.component';
import { MembersIconComponent } from '../../icons/members-icon/members-icon.component';
import { AddMembersIconComponent } from '../../icons/add-members-icon/add-members-icon.component';
import { LikeIconComponent } from '../../icons/like-icon/like-icon.component';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { UploadIconComponent } from '../../icons/upload-icon/upload-icon.component';
import { MobileCurrentRouteComponent } from './mobile-current-route/mobile-current-route.component';
import { DropDownMenuComponent } from './drop-down-menu/drop-down-menu.component';
import { IconIceBreakerComponent } from '../../icons/icon-ice-breaker/icon-ice-breaker.component';
import { IconOptionComponent } from '../../icons/icon-option/icon-option.component';
import { GiveFeedbackIconComponent } from '../../icons/give-feedback-icon/give-feedback-icon.component';
import { IconGlobeComponent } from '../../icons/icon-globe/icon-globe.component';
import { IconAboutUsComponent } from '../../icons/icon-about-us/icon-about-us.component';
import {
  MinimizedInvitationPageComponent
} from '../../../pages/organization-invitation/components/minimized-invitation-page/minimized-invitation-page.component';

@NgModule({
  declarations: [HeaderComponent, HeaderNavBarItemComponent],
  imports: [
    MatButtonModule,
    MatMenuModule,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    NgIf,
    AsyncPipe,
    NgClass,
    MatIconModule,
    MatDividerModule,
    SharedModule,
    TranslateModule,
    RequestsIconComponent,
    HomeIconComponent,
    NewsIconComponent,
    BlogIconComponent,
    RequestIconComponent,
    CounsellorDeskIconComponent,
    ConversationsIconComponent,
    SunflawerIconComponent,
    NgoLogoIconComponent,
    LoginIconComponent,
    CommunitiesIconComponent,
    MembersIconComponent,
    AddMembersIconComponent,
    LikeIconComponent,
    ButtonComponent,
    UploadIconComponent,
    MobileCurrentRouteComponent,
    DropDownMenuComponent,
    IconIceBreakerComponent,
    IconOptionComponent,
    GiveFeedbackIconComponent,
    IconGlobeComponent,
    IconAboutUsComponent,
    MinimizedInvitationPageComponent,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
