import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, userFactory } from '../../../shared/models/user.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { AdvisorsService } from '../../../services/advisors.service';
import { Skill } from '../../../shared/models/skill.model';
import { IceBreaker } from '../../../ice-breaker/ice-breaker-template/ice-breaker-template-messages';

@Injectable({
  providedIn: 'root',
})
export class ProfileStoreService {
  private readonly _publicProfile$ = new BehaviorSubject<User>(null);
  readonly publicProfile$ = this._publicProfile$.asObservable();
  private pickedSkill = new BehaviorSubject<Skill>(null);
  pickedSkill$ = this.pickedSkill.asObservable();

  constructor(
    private readonly authService: AuthService,
    private readonly advisorsService: AdvisorsService,
  ) {}

  getPublicProfile(userShareToken: string): Observable<any> {
    return this.authService.fetchUserForProfileToken(userShareToken).pipe(
      switchMap((user) => this.advisorsService.fetchAdvisorProfile(user.id)),
      map((_) => userFactory(_)),
      tap((user) => this._publicProfile$.next(user)),
    );
  }

  updateIceBreakerLoadingState(id: number, loading: boolean): void {
    // const iceBreakers = this.publicProfile.value.icebreakers.map(
    //   (iceBreaker: IceBreaker) => {
    //     if (iceBreaker.id === id) {
    //       return { ...iceBreaker, loading };
    //     }
    //
    //     return iceBreaker;
    //   },
    // );
    // this.publicProfile.next({
    //   ...this.publicProfile.value,
    //   icebreakers: iceBreakers,
    // });
  }

  pickSkill(skill: Skill): void {
    this.pickedSkill.next(skill);
  }
}
