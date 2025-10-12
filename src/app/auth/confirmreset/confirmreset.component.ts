import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterService } from '../../services/footer/footer.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-confirmreset',
  templateUrl: './confirmreset.component.html',
  styleUrls: ['./confirmreset.component.scss'],
})
export class ConfirmresetComponent implements OnInit {
  private resetToken = signal<string>(null);
  private destroyRef = inject(DestroyRef);

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private footerService: FooterService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.footerService.hideFooter();

    const params = this.activatedRoute.snapshot.queryParams;
    if (params.reset_password_token) {
      this.resetToken.set(params.reset_password_token);
    }

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      autoFocus: false,
      width: '100%',
      maxWidth: '466px',
      maxHeight: '90vh',
      panelClass: 'auth-modal',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['home']);
      });
  }
}
