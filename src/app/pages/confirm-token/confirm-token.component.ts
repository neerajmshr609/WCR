import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { OnlineService } from '../../services/online.service';

const defaultErrorMessage = 'Something went wrong, try again later';

@Component({
  selector: 'app-confirm-token',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-token.component.html',
  styleUrls: ['./confirm-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmTokenComponent implements OnInit {
  private subscribeToOnline = new Subject<void>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private onlineService: OnlineService,
  ) {}

  ngOnInit(): void {
    this.subscribeToOnline
      .pipe(switchMap(() => this.onlineService.subscribeToOnline()))
      .subscribe();
    this.handleToken();
  }

  private handleToken(): void {
    const token = this.activatedRoute.snapshot.queryParams.token;
    const orgName = this.activatedRoute.snapshot.queryParams.organization_name;
    if (token) {
      this.authService
        .signInWithToken(token)
        .pipe(
          catchError((error) => {
            let errorMessage =
              error?.error?.error || error?.error?.errors?.full_messages[0];
            this.snackBar.open(
              errorMessage ? errorMessage : defaultErrorMessage,
              null,
              {
                duration: 1500,
              },
            );
            this.router.navigate(['home']);
            return EMPTY;
          }),
        )
        .subscribe((res) => {
          if (!res.success) {
            this.snackBar.open(defaultErrorMessage, null, {
              duration: 1500,
            });
            this.router.navigate(['home']);
          } else {
            this.subscribeToOnline.next();
            this.handleNavigate(orgName);
          }
        });
    } else {
      this.snackBar.open(defaultErrorMessage, null, {
        duration: 1500,
      });
      this.router.navigate(['home']);
    }
  }

  private handleNavigate(orgName?: string): void {
    if (orgName) {
      this.router.navigate(['settings'], {
        queryParams: {
          organization_name: orgName,
          type: 'create-organisation',
        },
      });
      return;
    }
    this.router.navigate(['home']);
  }
}
