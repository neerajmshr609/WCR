import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AUTH_TEXT_CONTENT } from './auth-text-content';

@Component({
  selector: 'app-fifth-card',
  templateUrl: './fifth-card.component.html',
  styleUrls: ['./fifth-card.component.scss'],
})
export class FifthCardComponent {
  @Input() isLoading: boolean;
  @Input() form: UntypedFormGroup;
  @Input() error: string;

  @Output() signup = new EventEmitter();
  @Output() signIn = new EventEmitter();
  title = AUTH_TEXT_CONTENT.SIGN_IN.title;
  subtitle = AUTH_TEXT_CONTENT.SIGN_IN.subtitle;
  mode: 'singUp' | 'signIn' = 'singUp';

  switchToSignIn(): void {
    this.mode = 'signIn';
    this.title = AUTH_TEXT_CONTENT.SIGN_IN.title;
    this.subtitle = AUTH_TEXT_CONTENT.SIGN_IN.subtitle;
    this.form.reset();
    this.form.get('username').clearValidators();
    this.form.get('username').updateValueAndValidity();
  }

  switchToSignUp(): void {
    this.title = AUTH_TEXT_CONTENT.SIGN_UP.title;
    this.subtitle = AUTH_TEXT_CONTENT.SIGN_UP.subtitle;
    this.mode = 'singUp';
    this.form.addControl(
      'username',
      new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9_]*$/),
      ]),
    );
    this.form.reset();
  }
}
