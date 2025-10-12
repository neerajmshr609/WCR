import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { ProfileStoreService } from '../../../../../pages/profile/rudimentary/profile-store.service';
import { AuthService } from '../../../../../auth/auth.service';
import { UserSkill } from '../../../../../shared/models/UserSkill.model';
import { IceBreakerService } from '../../../../service/ice-breaker.service';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { User } from '../../../../../shared/models/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IceBreaker } from 'src/app/ice-breaker/modules/ice-breaker-template/ice-breaker-template-messages';
import { getUserSeoData } from '../../../../../shared/functions/get-user-seo-data';
import { SeoService } from '../../../../../services/seo.service';
import { PreselectedIceBreakerPipe } from '../../pipes/preselected-ice-breaker.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ice-breaker-list',
  templateUrl: './ice-breaker-list.component.html',
  styleUrls: ['./ice-breaker-list.component.scss'],
})
export class IceBreakerListComponent implements OnInit, OnDestroy {
  publicProfile$ = this.profileStore.publicProfile$;
  currentUser$ = this.authService.userSubject$;
  pickedSkill$: Observable<UserSkill> = this.profileStore.pickedSkill$;
  isOwner$ = combineLatest([
    this.authService.userSubject$,
    this.profileStore.publicProfile$,
  ]).pipe(
    map(
      ([currentUser, publicProfile]: [User, User]) =>
        currentUser?.id === publicProfile.id,
    ),
  );
  selectedIceBreaker: number;
  private unsubscribe$ = new Subject<unknown>();
  trackById = (index: number, entity: IceBreaker) => entity.id;

  constructor(
    private readonly profileStore: ProfileStoreService,
    private readonly iceBreakerService: IceBreakerService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly preselectedIceBreaker: PreselectedIceBreakerPipe,
    private readonly seoService: SeoService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.queryParams,
      this.profileStore.publicProfile$,
    ])
      .pipe(
        tap(([params, user]: [Params, User]) => {
          this.selectedIceBreaker = +params.id;
          if (user && +params.id) {
            // @ts-ignore
            const iceBreaker = this.preselectedIceBreaker.transform(
              user.icebreakers,
              +params.id,
            );
            const title = 'Getme';
            const { url, image, userName } = getUserSeoData(user);
            const description = `${userName} wants to share this Capsule with you: “${iceBreaker[0].title}”`;
            this.seoService.setSettings({
              title,
              image,
              description,
              url: `${url}/ice-breakers?id=${params.id}`,
            });
          }
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();
  }

  showAll(): void {
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        id: null,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
    this.selectedIceBreaker = null;
  }

  removeIceBreaker(id: number, shareToken): void {
    this.iceBreakerService
      .delete(id)
      .pipe(
        switchMap(() => this.profileStore.getPublicProfile(shareToken)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.showAll();
      });
  }

  changePrice(price: number, id: number): void {
    this.iceBreakerService
      .updateTitlePrice(id, { price })
      .pipe(
        switchMap(() =>
          this.profileStore.getPublicProfile(
            this.authService.userSubject$.value.sharetoken,
          ),
        ),
        catchError((err) => {
          console.warn(err);
          this.snackBar.open('Something went wrong!');
          return EMPTY;
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();
  }

  joinToIceBreaker(iceBreaker: IceBreaker): void {
    // if (!this.authService.userIsSignedIn()) {
    //   this.dialog.open(OnboardingModalComponent, {
    //     maxWidth: '92vw',
    //     width: '360px',
    //     height: '760px',
    //     maxHeight: '92vh',
    //     autoFocus: false,
    //     panelClass: 'modal',
    //     data: { step: 5 },
    //   });
    //   return;
    // }
    this.profileStore.updateIceBreakerLoadingState(iceBreaker.id, true);
    this.iceBreakerService
      .join(iceBreaker)
      .pipe(
        tap(() =>
          this.profileStore.updateIceBreakerLoadingState(iceBreaker.id, false),
        ),
        catchError((e) => {
          this.profileStore.updateIceBreakerLoadingState(iceBreaker.id, false);
          return EMPTY;
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.profileStore.pickSkill(null);
    this.unsubscribe$.next(null);
    this.unsubscribe$.unsubscribe();
  }
}
