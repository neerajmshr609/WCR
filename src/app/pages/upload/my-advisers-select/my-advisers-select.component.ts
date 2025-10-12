import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Project } from 'src/app/shared/models/project.model';
import { Projectadvisor } from 'src/app/shared/models/Projectadvisor.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-my-advisers-select',
  templateUrl: './my-advisers-select.component.html',
  styleUrls: ['./my-advisers-select.component.scss'],
})
export class MyAdvisersSelectComponent implements OnInit {
  @Input() project: Project;
  @Input() adviserIDs: number[];

  @Output() selectedAdvisersChanged = new EventEmitter<User[]>();

  isLoading: boolean;
  loadedAdvisers: User[];
  selectedAdvisers: User[] = [];

  public get sortedAdvisors(): User[] {
    return this.loadedAdvisers?.sort((a) => {
      if (this.selectedAdvisers.includes(a)) {
        return -1;
      }
    });
  }

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    if (!this.adviserIDs?.length) {
      return;
    }

    this.isLoading = true;

    const calls = [];
    this.adviserIDs = [...new Set(this.adviserIDs)];
    this.adviserIDs.forEach((advID) => {
      calls.push(this.authService.fetchUser(advID));
    });

    forkJoin(calls).subscribe((res) => {
      this.loadedAdvisers = res as User[];

      if (this.project.projectadvisors?.length) {
        const adviserUserIDs = this.project.projectadvisors.map(
          (advisor) => advisor.adviser_user_id,
        );

        adviserUserIDs.forEach((id) => {
          const filteredObj = this.loadedAdvisers.find(
            (advisor) => advisor.id === id,
          );
          this.selectedAdvisers.push(filteredObj);
        });
      }

      this.isLoading = false;
    });
  }

  didToggleAdviser(advisor: User) {
    if (this.selectedAdvisers.find((obj) => obj.id === advisor.id)) {
      this.selectedAdvisers = this.selectedAdvisers.filter((obj) => {
        return obj.id !== advisor.id;
      });
    } else {
      this.selectedAdvisers.push(advisor);
    }

    const projectAdvisers = [];
    this.selectedAdvisers.forEach((adv) => {
      const projAdv = new Projectadvisor();
      projAdv.project_id = this.project.id;
      projAdv.myadviser_id = adv.id;

      projectAdvisers.push(projAdv);
    });

    this.selectedAdvisersChanged.emit(projectAdvisers);
  }

  shoeshineForBadge(price: number) {
    if (price <= this.project.inspiringrate) {
      return '0px 0px 3px #4EEEB5';
    }

    if (price > this.project.inspiringrate * 2) {
      return '0px 0px 3px #F17E7E';
    } else if (price > this.project.inspiringrate) {
      return '0px 0px 3px #F2994A';
    }
  }

  colorForBadge(price: number) {
    if (price <= this.project.inspiringrate) {
      return '#72D4BB';
    }

    if (price > this.project.inspiringrate * 2) {
      return '#F17E7E';
    } else if (price > this.project.inspiringrate) {
      return '#F2994A';
    }
  }
}
