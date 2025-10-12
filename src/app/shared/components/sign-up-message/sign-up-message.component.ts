import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  templateUrl: './sign-up-message.component.html',
  styleUrls: ['./sign-up-message.component.scss'],
})
export class SignUpMessageComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public msg: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  onSignUp() {
    this.router.navigate(['/auth'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        mode: 'signup',
      },
    });
  }

  onSignIn() {
    this.router.navigate(['/auth'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        mode: 'login',
      },
    });
  }
}
