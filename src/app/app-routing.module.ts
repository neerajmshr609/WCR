import { NgModule } from '@angular/core';
import {
  provideRouter,
  RouterModule,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { MetaGuard } from '@ngx-meta/core';
import { GuestGuard } from './auth/guest.guard';
import {
  HOME_PAGE_ROUTE,
  PRIVACY_POLICY_ROUTE,
  TERMS_OF_SERVICE_ROUTE,
  IMPRINT_ROUTE,
  DATA_DELETION_ROUTE,
} from '../config/shared-routes';
import { AdminGuard } from './shared/guards/admin.guard';
import { CONVERSATIONS_PATH } from './pages/conversations/conversations-routing.module';
import { NewChatComponent } from './pages/new-chat/new-chat.component';
import { PAGE_NOT_FOUND_PATH } from './pages/page-not-found/page-not-found-path';
import { PROFILE_PATH } from './pages/profile/routing/profile.paths';
import { ICE_BREAKER_PATH } from './ice-breaker/routing/ice-breaker.paths';
import { GET_HELP_PATH } from './pages/get-help/get-help-routing.module';
import { AUTH_MODULE_PATH } from './auth/auth-routing.module';
import { COUNSELLOR_DESK_PATH } from './pages/counsellor-desk/counsellor-desk-routing.module';
import { ACCEPT_ORG_INVITATION_PATH } from './pages/organization-invitation/routing/organization-invitation-routing.module';
import { SETTINGS_MODULE_PATH } from './pages/usersettings/routing/paths';

const routes: Routes = [
  {
    path: '',
    redirectTo: `/${HOME_PAGE_ROUTE}`,
    pathMatch: 'full',
  },
  {
    path: 'publicfeed',
    loadChildren: () =>
      import('./pages/newsfeed/newsfeed.module').then((m) => m.NewsfeedModule),
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'Overview of all your Feedback',
        description: 'Overview of all your Feedback',
      },
      pathTitle: 'news-line',
    },
  },
  {
    path: 'open-requests',
    loadChildren: () =>
      import('./pages/open-requests/open-requests.module').then(
        (m) => m.OpenRequestsModule,
      ),
    data: {
      pathTitle: 'request_desk-line',
      meta: {
        title: 'Collective Action Hub',
        description: 'Collective Action Hub',
      },
    },
  },

  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog.component').then((m) => m.BlogComponent),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'blog',
      meta: {
        title: 'NGO Blog Chain',
        description: 'NGO Blog Chain',
      },
    },
  },
  {
    path: GET_HELP_PATH,
    loadChildren: () =>
      import('./pages/get-help/get-help.module').then((m) => m.GetHelpModule),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'get-help-line',
      meta: {
        title: 'Find the right counsellor',
        description: 'Find the right counsellor',
      },
    },
  },
  {
    path: 'rateflow',
    loadChildren: () =>
      import('./pages/rateflow/rateflow.module').then((m) => m.RateflowModule),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'shape_impact',
      meta: {
        title: 'Help us to improve WCR',
        description: 'Help us to improve WCR',
      },
    },
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./pages/transactions/transactions.module').then(
        (m) => m.TransactionsModule,
      ),
  },
  {
    path: 'insights',
    loadChildren: () =>
      import('./pages/my-projects/my-projects.module').then(
        (m) => m.MyProjectsModule,
      ),
    canActivate: [MetaGuard, AdminGuard],
    data: {
      pathTitle: 'insights-mobile',
      meta: {
        keywords: 'My Projects',
        title: 'My Projects',
        description: 'My projects',
      },
    },
  },
  {
    path: 'insights',
    loadChildren: () =>
      import('./pages/insights/insights.module').then((m) => m.InsightsModule),
    canActivate: [MetaGuard, AdminGuard],
    data: {
      pathTitle: 'insights-mobile',
      meta: {
        keywords: 'My Projects',
        title: 'My Projects',
        description: 'My projects',
      },
    },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AdminGuard],
    data: {
      pathTitle: 'menu.open_admin',
    },
  },
  {
    path: 'upload',
    loadChildren: () =>
      import('./pages/upload/upload.module').then((m) => m.UploadModule),
    data: {
      pathTitle: 'menu.upload',
      meta: {
        keywords: 'Upload',
        title: 'All Your Feedback in one Place',
        description: 'All Your Feedback in one Place',
      },
    },
  },
  {
    path: SETTINGS_MODULE_PATH,
    loadChildren: () =>
      import('./pages/usersettings/usersettings.module').then(
        (m) => m.UsersettingsModule,
      ),
    canActivate: [MetaGuard, AuthGuard],
    data: {
      pathTitle: 'menu.settings',
      meta: {
        keywords: 'Settings',
        title: 'Adjust to your needs',
        description: 'Adjust to your needs',
      },
    },
  },
  {
    path: PROFILE_PATH.routerPath,
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'profile-title',
      meta: {
        keywords: 'Profile',
        title: 'Profile',
        description: 'profile',
      },
    },
  },
  {
    path: 'why',
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutModule),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'menu.signed_in_as',
      meta: {
        title: '',
        description: '',
      },
    },
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./pages/contact-us/contact-us.module').then(
        (m) => m.ContactUsModule,
      ),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'contact-us',
      meta: {
        keywords: 'Contact Us',
        title: 'Contact Us',
        description: 'Contact us',
      },
    },
  },
  {
    path: TERMS_OF_SERVICE_ROUTE,
    loadChildren: () =>
      import('./pages/terms/terms.module').then((m) => m.TermsModule),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'terms',
      meta: {
        keywords: 'Terms of Service',
        title: 'Terms of Service',
        description: 'Terms of Service',
      },
    },
  },
  {
    path: PRIVACY_POLICY_ROUTE,
    loadChildren: () =>
      import('./pages/policy/policy.module').then((m) => m.PolicyModule),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'privacy-policy',
      meta: {
        keywords: 'Privacy Policy',
        title: 'Privacy Policy',
        description: 'Privacy Policy',
      },
    },
  },
  {
    path: IMPRINT_ROUTE,
    loadChildren: () =>
      import('./pages/imprint/imprint.module').then((m) => m.ImprintModule),
    canActivate: [MetaGuard],
    data: {
      meta: {
        keywords: 'Imprint',
        title: 'Imprint',
        description: 'Imprint',
      },
    },
  },

  {
    path: DATA_DELETION_ROUTE,
    loadChildren: () =>
      import(
        './pages/data-deletion-instructions/data-deletion-instructions.module'
      ).then((m) => m.DataDeletionInstructionsModule),
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'data-deletion-instructions',
      meta: {
        keywords: 'Data Deletion Instructions',
        title: 'Data Deletion Instructions',
        description:
          'Instructions on how to request data deletion from Getme.global.',
      },
    },
  },

  {
    path: 'creatives',
    canActivate: [MetaGuard],
    loadChildren: () =>
      import('./pages/creatives/creatives.module').then(
        (m) => m.CreativesModule,
      ),
    data: {
      meta: {
        keywords: 'Find Creatives, Find Artists',
        title: 'Find your Creatives!',
        description:
          'Connect with artists open-minded to inspiring reviews. Choose your favorites and give them paid feedback that can make a difference in their works.',
      },
    },
  },
  {
    path: 'advisors',
    loadChildren: () =>
      import('./pages/advisors/advisors.module').then((m) => m.AdvisorsModule),
    canActivate: [MetaGuard],
    data: {
      advisorFilter: true,
      meta: {
        keywords: 'Find Art Advice, Find Art Advisors, Find Art Experts',
        title: 'Find your Art Advice!',
        description:
          'Learn from human advice around ideas, skills or tools you are blocked. Once you contact the expert advisor, solve your problem by chat or video stream.',
      },
    },
  },
  {
    path: 'stripe/token',
    loadChildren: () =>
      import('./auth/stripe/stripe.module').then((m) => m.StripeModule),
  },
  {
    path: 'registrationconfirm',
    loadChildren: () =>
      import('./auth/confirm/confirm.module').then((m) => m.ConfirmModule),
  },
  {
    path: 'confirmreset',
    loadChildren: () =>
      import('./auth/confirmreset/confirmreset.module').then(
        (m) => m.ConfirmresetModule,
      ),
  },
  {
    path: ACCEPT_ORG_INVITATION_PATH,
    loadChildren: () =>
      import(
        './pages/organization-invitation/organization-invitation.module'
      ).then((m) => m.OrganizationInvitationModule),
  },
  {
    path: 'auth/login_with_token',
    loadComponent: () =>
      import('./pages/confirm-token/confirm-token.component')
        .then((m) => m.ConfirmTokenComponent)
        .then(),
  },
  {
    path: AUTH_MODULE_PATH,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: AUTH_MODULE_PATH,
    outlet: 'modal',
    canLoad: [GuestGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: HOME_PAGE_ROUTE,
    loadChildren: () =>
      import('./pages/why/why.module').then((m) => m.WhyModule),
    data: {
      pathTitle: 'home',
      home: {
        meta: {
          title: 'From Care to Community',
          description: 'From Care to Community',
        },
      },
      howtouse: {
        meta: {
          title: 'How to use We Care Remote',
          description: 'How to use We Care Remote',
        },
      },
      fullstory: {
        meta: {
          keywords: 'Creative Marketplace, Art Industries',
          title: 'The Creative Marketplace for Art Industries',
          description:
            'The unique online marketplace where feedback and inspiration bring creatives together to drive ideas in areas like photography, film, music or commerce.',
        },
      },
    },
  },
  {
    path: 'why-pr',
    loadChildren: () =>
      import('./pages/why/why.module').then((m) => m.WhyModule),
    data: {
      whyjoin: {
        meta: {
          title: '',
          description: '',
        },
      },
      howtouse: {
        meta: {
          keywords: 'Art Consultation, Art Platform',
          title:
            'The Art Consultation Platform for Creatives, Advisors and Companies',
          description:
            'Upload your artwork to the platform, ask specific questions and give feedback to others. Getting quality reviews in a safe environment is now a reality.',
        },
      },
      fullstory: {
        meta: {
          keywords: 'Creative Marketplace, Art Industries',
          title: 'The Creative Marketplace for Art Industries',
          description:
            'The unique online marketplace where feedback and inspiration bring creatives together to drive ideas in areas like photography, film, music or commerce.',
        },
      },
    },
  },
  {
    path: CONVERSATIONS_PATH,
    canActivate: [MetaGuard],
    data: {
      pathTitle: 'inbox',
      meta: {
        title: 'All Platform Dialogues',
        description: 'All Platform Dialogues',
      },
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/conversations/conversations.module').then(
            (m) => m.ConversationsModule,
          ),
      },
      {
        path: 'newconversation',
        loadChildren: () =>
          import('./pages/conversation/conversation.module').then(
            (m) => m.ConversationModule,
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./pages/conversation/conversation.module').then(
            (m) => m.ConversationModule,
          ),
      },
    ],
  },
  {
    path: ICE_BREAKER_PATH.routerPath,
    loadChildren: () =>
      import('./ice-breaker/ice-breaker.module').then(
        (m) => m.IceBreakerModule,
      ),
    data: {
      pathTitle: 'capsule',
    },
  },
  {
    path: 'org',
    loadChildren: () =>
      import('./pages/organizations/organizations.module').then(
        (m) => m.OrganizationsModule,
      ),
  },
  {
    path: PAGE_NOT_FOUND_PATH.routerPath,
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
  },
  {
    path: 'new-chat',
    component: NewChatComponent,
  },
  {
    path: COUNSELLOR_DESK_PATH,
    loadChildren: () =>
      import('./pages/counsellor-desk/counsellor-desk.module').then(
        (m) => m.CounsellorDeskModule,
      ),

    data: {
      pathTitle: 'counsellor_desk-line',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64],
    }),
  ],
  providers: [provideRouter(routes, withComponentInputBinding())],
  exports: [RouterModule],
})
export class AppRoutingModule {}
