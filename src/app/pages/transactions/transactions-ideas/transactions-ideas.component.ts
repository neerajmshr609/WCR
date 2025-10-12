import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-transactions-ideas',
  templateUrl: './transactions-ideas.component.html',
  styleUrls: ['./transactions-ideas.component.scss'],
})
export class TransactionsIdeasComponent implements OnInit {
  @ViewChild('buttonElement', { static: false }) buttonElement: ElementRef;

  referral_link: string;
  currentUser: User;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.userSubject$.subscribe((user) => {
      if (!user) {
        return;
      }

      this.authService.fetchUser(user.id).subscribe((usr) => {
        this.currentUser = usr;
        this.referral_link =
          'https://getme.global/publicfeed?rf=' +
          this.currentUser.referral_token;
      });
    });
  }

  copyToClipboard() {
    this.buttonElement.nativeElement.innerText = 'Copied!';
    this.analyticsService.trackEvent('Wallet', 'copy-referral-link');
  }
}
