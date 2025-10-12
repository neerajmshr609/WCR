import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { RateflowService } from 'src/app/services/rateflow.service';
import { Project } from 'src/app/shared/models/project.model';
import { User } from 'src/app/shared/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-advisor-info-card',
  templateUrl: './advisor-info-card.component.html',
  styleUrls: ['./advisor-info-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdvisorInfoCardComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() isInUserActionMode = false;
  @Input() currentUser: User;
  @Input() addToAdvisorsDidChange$: Observable<number>;
  @Input() project: Project;

  @Output() didSendStart = new EventEmitter();
  @Output() didSendClose = new EventEmitter();

  isInUserActionInFlightMode = false;
  advisorId: number;
  adviser: User;
  isRemove: boolean;
  private destroyRef = inject(DestroyRef);

  constructor(
    private rateflowService: RateflowService,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.addToAdvisorsDidChange$) {
      this.addToAdvisorsDidChange$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((advisorID) => {
          console.log('advisorID', advisorID);
          if (advisorID) {
            this.advisorId = advisorID;
            this.addToAdvisorsDidClick(advisorID);
          }
        });
    }
  }

  addToAdvisorsDidClick(adviserID: number) {
    this.isRemove = this.currentUser.adviserIDs.includes(adviserID);

    this.isInUserActionInFlightMode = true;
    this.authService
      .fetchUser(adviserID)
      .pipe(
        switchMap((res: User) => {
          this.adviser = res;
          this.didSendStart.emit();
          this.isInUserActionMode = true;
          if (this.isRemove) {
            return this.rateflowService
              .removeAdviserFromFavorites(adviserID, this.currentUser.id)
              .pipe(
                tap(
                  () =>
                    (this.currentUser.adviserIDs =
                      this.currentUser.adviserIDs.filter(
                        (obj) => obj !== adviserID,
                      )),
                ),
              );
          } else {
            return this.rateflowService
              .addAdviserToFavorites(adviserID, this.currentUser.id)
              .pipe(tap(() => this.currentUser.adviserIDs.push(adviserID)));
          }
        }),
        finalize(() => (this.isInUserActionInFlightMode = false)),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {}

  close() {
    this.isInUserActionMode = false;
    this.didSendClose.emit();
  }
}
