import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AUTH_MODE } from './model/auth-mode';
import { ConfirmTokenComponent } from '../pages/confirm-token/confirm-token.component';

const routes: Routes = [
  {
    path: ':authMode',
    component: AuthComponent,
    data: {
      [AUTH_MODE.SIGNUP]: {
        meta: {
          keywords: 'Sign up',
          title: 'Sign up to We Care Remote',
          description: 'Sign up to We Care Remote',
        },
      },
      [AUTH_MODE.LOGIN]: {
        meta: {
          keywords: 'Sign in',
          title: 'Login to We Care Remote',
          description: 'Login to We Care Remote',
        },
      },
      [AUTH_MODE.RESET_PASSWORD]: {
        meta: {
          keywords: 'Reset Password',
          title: 'Reset Password',
          description: 'Reset password',
        },
      },
    },
  },
  {
    path: 'sign_up_with_magic_link/',
    component: ConfirmTokenComponent,
    pathMatch: 'full',
  },
];

export const AUTH_MODULE_PATH = 'auth';
export const LOGIN_PAGE_PATH_SEGMENTS = [AUTH_MODULE_PATH, AUTH_MODE.LOGIN];
export const SIGNUP_PAGE_PATH_SEGMENTS = [AUTH_MODULE_PATH, AUTH_MODE.SIGNUP];
export const RESET_PASSWORD_PAGE_PATH_SEGMENTS = [
  AUTH_MODULE_PATH,
  AUTH_MODE.RESET_PASSWORD,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
