import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { RatebackObject } from 'src/app/shared/models/rateback-object';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-creatives-warning-modal',
  templateUrl: './creatives-warning-modal.component.html',
  styleUrls: ['./creatives-warning-modal.component.scss'],
})
export class CreativesWarningModalComponent implements OnInit, AfterViewInit {
  public currentUser: User;
  public ratebacks: RatebackObject = {
    inspiring: 5,
    discouraging: 0,
    helpful: 4,
    unhelpful: 6,
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.userSubject$.value;
  }

  ngAfterViewInit(): void {
    const items = document.querySelectorAll('.ratebacks__item');
    Array.from(items).forEach((item, index) => {
      if (index === 3) {
        return;
      }
      item.classList.add('disabled');
    });
  }

  public toggleUserTutorials() {
    this.currentUser.showtutorials = !this.currentUser.showtutorials;
    this.authService.updateUser(this.currentUser).subscribe();
  }
}
