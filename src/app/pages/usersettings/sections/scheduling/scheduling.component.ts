import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TZone } from 'moment-timezone-picker';
import { DaysWeek } from 'src/app/shared/constants';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ruleset } from 'src/app/shared/models/ruleset';
import { User } from 'src/app/shared/models/user.model';
import { Week } from 'src/app/shared/models/week';
import { Scheduling } from '../../interfaces';
import { tap } from 'rxjs';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.scss'],
})
export class SchedulingComponent implements OnInit {
  @Input() userData: User;
  @Input() schedulingData: Scheduling;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSave = new EventEmitter<User>();

  newStudent: boolean;
  interestedStudent: boolean;
  regularStudent: boolean;

  timeStart: string;
  timeEnd: string;
  scheduling;
  days: Week[] = DaysWeek;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.newStudent = true;
    this.interestedStudent = true;
    this.regularStudent = true;
    this.timeStart = '07:00';
    this.timeEnd = '23:00';
  }

  getTimeForScheduling() {
    return this.authService.getListScheduling().pipe(
      tap((list) => {
        this.scheduling = list;
      }),
    );
  }

  createTimeForScheduling(data: Ruleset): void {
    this.authService.createScheduling(data).subscribe(
      () => {
        this.getTimeForScheduling();
      },
      (res) => {
        const errors = res.error.weekdays || res.error.error;
        this.snackBar.open(errors, null, {
          duration: 2500,
        });
      },
    );
  }

  updateUserForScheduling(data: User): void {
    // this.currentUser = data;
    this.onSave.emit({ ...data });
  }

  selectTimeZone(zone: TZone) {
    this.userData.time_zone = zone.nameValue;
    // this.updateUserData(this.userData);
  }

  changeUserSettings(element: number): void {
    switch (element) {
      case 1:
        this.userData.video_chat_allowed = !this.userData.video_chat_allowed;
        break;
      case 2:
        this.userData.appointments_auto_confirmation =
          !this.userData.appointments_auto_confirmation;
        break;
      case 3:
        this.userData.live_chat_allowed = !this.userData.live_chat_allowed;
        break;
    }
    // this.updateUserData.(this.userData);
  }

  checkoutUser(element: number): void {
    switch (element) {
      case 1:
        this.newStudent = !this.newStudent;
        break;
      case 2:
        this.interestedStudent = !this.interestedStudent;
        break;
      case 3:
        this.regularStudent = !this.regularStudent;
        break;
    }
  }

  addChangeData() {
    const weekday = [];
    this.days.map((day, index) => {
      if (day.status) {
        weekday.push(index);
      }
    });

    const ruleset: Ruleset = {
      id: this.userData.id,
      for_new: this.newStudent,
      for_interested: this.interestedStudent,
      for_regular: this.regularStudent,
      weekdays: weekday,
      time_from: this.timeStart,
      time_until: this.timeEnd,
    };

    this.authService.createScheduling(ruleset).subscribe(
      () => {
        this.schedulingData.rulesets.push(ruleset);
        this.clearData();
      },
      (res) => {
        const errors = res.error.weekdays || res.error.error;
        this.snackBar.open(errors, null, {
          duration: 2500,
        });
      },
    );
  }

  selectDay(index: number) {
    this.days[index].status = !this.days[index].status;
  }

  deleteSchedulingItem(i: number) {
    const id = this.schedulingData.rulesets[i].id;

    this.authService.deleteItemScheduling(id).subscribe(() => {
      this.schedulingData.rulesets.splice(i, 1);
    });
  }

  clearData() {
    this.newStudent = false;
    this.interestedStudent = false;
    this.regularStudent = false;
    this.timeStart = '07:00';
    this.timeEnd = '23:00';
    this.days.forEach((day) => (day.status = false));
  }
}
