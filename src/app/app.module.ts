import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import {
  HTTP_INTERCEPTORS,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { ServerErrorInterceptor } from './shared/interceptors/server-error.interceptor';

import { ServiceWorkerModule } from '@angular/service-worker';
import { NgPipesModule } from 'ngx-pipes';
import { TranslateModule } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';

import { ActionCableService } from 'angular2-actioncable';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { SharedModule } from './shared/shared.module';
import { CookieNotificationComponent } from './shared/components/cookie-notification/cookie-notification.component';
import { ShareModule } from 'ngx-sharebuttons';
import { WebPushPlayerIdInterceptor } from './shared/interceptors/web-push-player-id.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { MessageNotificationModule } from './shared/components/message-notification/message-notification.module';
import { HeaderModule } from './shared/modules/header/header.module';
import { SortablejsModule } from 'ngx-sortablejs-v16';
import { AuthService } from './auth/auth.service';
import { initUserData } from './shared/functions/init-user-data';
import { LanguageService } from './services/language.service';
import { LanguageInterceptor } from './shared/interceptors/language.interceptor';
import { translationConfigInitializeFactory } from './shared/app-language/init-config-factory';
import { createForRootProviderConfig } from './shared/app-language/translate-module-provider-config.factory';
import { ResizeService } from './services/resize.service';
import { NewChatModule } from './pages/new-chat/new-chat.module';
import { LupaiChatEffects } from './store/lupai-chat/lupai-chat.effects';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiButtonModule,
  TuiAlertModule,
  TUI_SANITIZER,
} from '@taiga-ui/core';
import { TuiStepperModule } from '@taiga-ui/kit';

@NgModule({
  declarations: [AppComponent, CookieNotificationComponent],
  imports: [
    SortablejsModule.forRoot({ animation: 150 }),
    HttpClientJsonpModule,
    NgPipesModule,
    RouterModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TuiStepperModule,
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    LayoutModule,
    ShareModule,
    MessageNotificationModule,
    TranslateModule.forRoot(createForRootProviderConfig()),
    HeaderModule,
    NewChatModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([LupaiChatEffects]),
    TuiRootModule,
    TuiDialogModule,
    TuiButtonModule,
    TuiStepperModule,
    TuiAlertModule,
  ],
  providers: [
    ActionCableService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WebPushPlayerIdInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translationConfigInitializeFactory,
      deps: [LanguageService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initUserData,
      deps: [AuthService],
      multi: true,
    },
    ResizeService,
    {
      provide: 'SIGN_OUT_URL',
      useValue: environment.apiUrl + 'auth/sign_out',
    },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    if (!environment.production) {
      console.log(`App running in ${environment.mode}`);
      console.log(`App revision: ${environment.revision}`);
    }
  }
}
