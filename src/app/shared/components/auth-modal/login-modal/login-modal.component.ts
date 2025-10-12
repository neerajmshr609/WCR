import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteModule } from '../../../UIkit/autocomplete/autocomplete.module';
import { ButtonComponent } from '../../../UIkit/button/button.component';
import { CoreModule } from '../../../modules/core.module';
import { InputComponent } from '../../../UIkit/input/input.component';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SearchIconComponent } from '../../../icons/search-icon/search-icon.component';
import { SmallSpinnerModule } from '../../small-spinner/small-spinner.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AuthService } from '../../../../auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { WebsocketService } from '../../../../services/websocket.service';
import { OnlineService } from '../../../../services/online.service';
import { OpenHeartIconComponent } from '../../../icons/open-heart-icon/open-heart-icon.component';
import { LoginIconComponent } from '@icons/login-icon/login-icon.component';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    AutocompleteModule,
    ButtonComponent,
    CoreModule,
    InputComponent,
    MatCheckbox,
    ReactiveFormsModule,
    SearchIconComponent,
    SmallSpinnerModule,
    TranslateModule,
    OpenHeartIconComponent,
    LoginIconComponent,
  ],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  public form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  public conversationId = input<number>();
  public error = signal<string>(null);
  public shouldShowResendConfirmation = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);
  public closeModal = output<void>();

  constructor(
    private authService: AuthService,
    private webSocketService: WebsocketService,
    private onlineService: OnlineService,
  ) {}

  public onSubmit() {
    this.signin();
  }

  private signin() {
    if (this.form.invalid) {
      return;
    }
    this.webSocketService.closeConnection();
    const value = {
      ...this.form.value,
      conversation_id: this.conversationId(),
    } as { email: string; password: string; conversation_id: number };
    this.authService
      .login(value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.error = err.error.errors?.[0];
          this.shouldShowResendConfirmation.set(
            this.error().includes('confirmation'),
          );
          return throwError(err);
        }),
        tap(() => {
          this.form.reset();
          this.closeModal.emit();
        }),
        switchMap(() => this.onlineService.subscribeToOnline()),
      )
      .subscribe();
  }

  public didRequestConfirmation(email: string) {
    this.authService
      .requestConfirmationEmail(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.error.set('Confirmation email sent to ' + email);
      });
  }

  public close() {
    this.closeModal.emit();
  }
}
