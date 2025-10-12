import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { catchError, finalize, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { cardFlip } from '../../animations';
import { OnlineService } from '../../../services/online.service';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-onboarding-modal',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.scss'],
  animations: [cardFlip],
})
export class OnboardingModalComponent implements OnInit {
  @HostBinding('class.h-100') h100 = false;
  @Output() showIframe = new EventEmitter();

  isLoading: boolean;
  error: string;
  step: number;
  initialStep: number;
  state = 'default';

  form = new UntypedFormGroup({
    username: new UntypedFormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9_]*$/),
    ]),
    email: new UntypedFormControl(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new UntypedFormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
    isteam: new UntypedFormControl(null),
  });

  constructor(
    private dialogRef: MatDialogRef<OnboardingModalComponent>,
    private authService: AuthService,
    private rateflowService: RateflowService,
    private router: Router,
    private onlineService: OnlineService,
    private webSocketService: WebsocketService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.step = this.data.step;
    this.h100 = this.step === 6;
    this.initialStep = this.step;
  }

  signIn() {
    this.isLoading = true;
    this.webSocketService.closeConnection();
    const { email, password } = this.form.value;

    this.authService
      .login({ email, password })
      .pipe(
        switchMap(() => {
          this.isLoading = false;
          this.dialogRef.close();
          return this.onlineService.subscribeToOnline();
        }),
        catchError((err: HttpErrorResponse) => {
          this.error = err.error.errors?.[0];
          this.isLoading = false;
          return throwError(err);
        }),
      )
      .subscribe();
  }

  signup(isRedirect = true, reveal = false) {
    this.isLoading = true;
    const value = this.form.value;

    this.authService
      .signUp({
        username: value.username,
        email: value.email,
        password: value.password,
      })
      .pipe(
        finalize(() => (this.isLoading = false)),
        mergeMap(() => {
          if (reveal) {
            return this.rateflowService.deanonFeedback(
              this.data.feedbackSessionId,
            );
          }

          return of(null);
        }),
        catchError((err: HttpErrorResponse) => {
          this.error = err.error.errors?.full_messages?.[0] || 'Error';
          return throwError(err);
        }),
      )
      .subscribe(() => {
        this.dialogRef.close(true);
        // this.step = 2;
        // this.changeState();
        // this.form.reset();
        // const modal = document.querySelector('.modal') as HTMLElement;
        // modal.style.height = '580px';
        // modal.style.width = '520px';
        //
        // if (isRedirect) {
        //   this.router.navigate(['rateflow']);
        // }
      });
  }

  selectThird() {
    this.step = 3;
    this.changeState();
  }

  changeState() {
    this.state = this.state === 'default' ? 'flipped' : 'default';
  }
}
