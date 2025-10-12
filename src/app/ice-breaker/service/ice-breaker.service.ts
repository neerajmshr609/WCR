import { computed, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ICreateNewChat } from '../model/response/create-new-chat.interface';

import { toSignal } from '@angular/core/rxjs-interop';
import { IAllIceBreakers } from '../model/response/all-ice-breakers.interface';
import {
  IceBreaker,
  iceBreakerFactory,
} from '../model/response/ice-breaker.model';
import { AuthService } from '../../auth/auth.service';
import { SkillsService } from '../../services/skill/skills.service';
import { API_URL } from '../../../config/config';
import { GET_HELP_PATH } from '../../pages/get-help/get-help-routing.module';
import { PROFILE_PATH } from '../../pages/profile/routing/profile.paths';
import { Stripeintent } from '../../shared/models/stripeintent.model';

import {
  IceBreakerConversation,
  RequestType,
} from '../../shared/models/conversation.model';
import { BasePaymentRequest } from '../../shared/models/payment-request';
import { isNotLoading } from '../../shared/lib/api-interaction.helpers';

import { MatDialog } from '@angular/material/dialog';
import { ShareIceBreakerModalComponent } from '../modules/share-ice-breaker-modal/share-ice-breaker-modal.component';
import { IShareIceBreakerModal } from '../modules/share-ice-breaker-modal/share-ice-breaker-modal.interface';
import {
  CreatedIceBreaker,
  IcebreakerMember,
  IceBreakerTemplateMessage,
} from '../modules/ice-breaker-template/ice-breaker-template-messages';
import { CreateCapsuleModalComponent } from '../modules/create-capsule-modal/create-capsule-modal.component';
import { ICE_BREAKER_CREATE_PATH } from '../routing/ice-breaker.paths';

@Injectable({
  providedIn: 'any',
})
export class IceBreakerService {
  private readonly _notAuthorizedUser = toSignal(
    this._authService.authorizedUser$.pipe(map((_) => !_)),
  );
  private readonly _anonUserId = toSignal(this._authService.anonymousUserId$);
  private readonly _notAuthorizedOrAnonymousUser = computed(
    () => this._notAuthorizedUser() || this._anonUserId(),
  );
  private readonly _hasAuthorizationData = toSignal(
    this._authService.hasAuthorizationData$,
  );

  private readonly _iceBreakers$ = new BehaviorSubject<IAllIceBreakers[]>([]);
  readonly iceBreakers$ = combineLatest([
    this._iceBreakers$.asObservable(),
    this._skillsService.skills$,
  ]).pipe(
    map(([iceBreakers, skills]) => {
      return iceBreakers.map((ib) => iceBreakerFactory(ib, skills));
    }),
  );
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoading$.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private matSnackBar: MatSnackBar,
    private readonly _authService: AuthService,
    private readonly _skillsService: SkillsService,
    private readonly _dialog: MatDialog,
  ) {}

  createIceBreaker(iceBreaker: IceBreaker): Observable<any> {
    return this.http.post(`${API_URL}icebreakers`, { ...iceBreaker }).pipe(
      catchError((err) => {
        console.error(err);
        this.matSnackBar.open('Sorry. Something went wrong!');
        return throwError(err);
      }),
    );
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${API_URL}icebreakers/${id}`);
  }

  // Determine the scope based on the current URL
  private _determineRequestType(): RequestType {
    const currentUrl = this.router.url;

    if (currentUrl.includes(`/${GET_HELP_PATH}`)) {
      return RequestType.PLATFORM;
    } else if (currentUrl.includes('/org/')) {
      return RequestType.ORGANIZATION_DIRECT;
    } else if (currentUrl.includes(`/profile`)) {
      return RequestType.CONSULT_DIRECT;
    }

    // Default scope if no specific page context is determined
    return RequestType.PLATFORM;
  }
  join(iceBreaker: IceBreaker, orgId?: number): Observable<void> {
    // if (iceBreaker.icebreaker_member?.paid && iceBreaker.price) {
    //   return this.createConversation(iceBreaker.icebreaker_member);
    // }
    const anonymousUserParams = this._notAuthorizedOrAnonymousUser()
      ? {
          conversation_status: 'no_stage',
          user_anonymous_id: this._anonUserId(),
        }
      : {};

    // Determine the scope based on the current page
    const request_type = this._determineRequestType();

    // Prepare the request payload
    const payload: any = {
      icebreaker_id: iceBreaker.id,
      conversation_type: 'client_chat',
      request_type,
      ...anonymousUserParams,
    };

    // Add organization_id parameter if we're on the organization page
    if (request_type === RequestType.ORGANIZATION_DIRECT && orgId) {
      payload.organization_id = orgId;
    }

    return this.http
      .post<ICreateNewChat>(`${API_URL}create_new_chat`, payload)
      .pipe(
        tap((_) => {
          if (
            !this._hasAuthorizationData() &&
            Number.isInteger(_.conversation.user_anonymous_id)
          ) {
            // @ts-ignore
            this._authService.setAnonymousUser(_.conversation);
          }
          this.router.navigate([`/conversations/${_.conversation.id}`]);
          // console.log('Navigating to conversation '+ _.conversation.id);

          // return this.buyIceBreaker(createdIceBreaker.id).pipe(
          //   switchMap((res: Stripeintent) => {
          //     if (!res) {
          //       return this.createConversation(createdIceBreaker);
          //     }
          //     return this.dialog
          //       .open(BankCardFormModalComponent, {
          //         maxWidth: '500px',
          //         width: '100%',
          //         height: '220px',
          //         data: res.client_secret,
          //       })
          //       .afterClosed()
          //       .pipe(
          //         filter((isPaid) => isPaid),
          //         switchMap(() =>
          //           this.updatePaymentStatus(res.payment_id).pipe(
          //             switchMap((iceBreakerCreated: CreatedIceBreaker) =>
          //               this.createConversation(iceBreakerCreated),
          //             ),
          //           ),
          //         ),
          //       );
          //   }),
          // );
        }),
        catchError((err) => {
          console.warn(err);
          this.matSnackBar.open(err.error.error, '', {
            duration: 4000,
          });
          return of(err);
        }),
      );
  }

  private buyIceBreaker(iceBreakerMemberId: number): Observable<Stripeintent> {
    return this.http.post<Stripeintent>(`${API_URL}icebreaker_member_payment`, {
      icebreaker_member_id: iceBreakerMemberId,
    });
  }

  // tslint:disable-next-line:variable-name
  private updatePaymentStatus(
    payment_id: string,
  ): Observable<CreatedIceBreaker> {
    return this.http.put<CreatedIceBreaker>(
      `${API_URL}icebreaker_members/update_status`,
      {
        payment_id,
      },
    );
  }

  private createConversation(
    createdIceBreaker: CreatedIceBreaker,
  ): Observable<void> {
    return this.http
      .post<CreatedIceBreaker>(
        `${API_URL}icebreaker_members/add_conversation/${createdIceBreaker.id}`,
        {},
      )
      .pipe(
        map(
          ({ conversation_id }) =>
            void this.router.navigate([`/conversations/${conversation_id}`]),
        ),
      );
  }

  nexIcebreakerQuestion(conversation: IceBreakerConversation) {
    const params = this._notAuthorizedOrAnonymousUser()
      ? {
          user_anonymous_id: this._anonUserId(),
        }
      : {};
    return this.http
      .post<IcebreakerMember>(
        `${API_URL}icebreaker_members/next_step/${conversation.icebreakerId}`,
        params,
      )
      .pipe(map((_) => conversation.updateIcebreakerMember(_)));
  }

  completeIcebreaker(conversation: IceBreakerConversation) {
    const params = this._notAuthorizedOrAnonymousUser()
      ? {
          user_anonymous_id: this._anonUserId(),
        }
      : {};
    return this.http
      .put(
        `${API_URL}icebreaker_members/complete/${conversation.icebreakerId}`,
        params,
      )
      .pipe(map(() => conversation.completeIcebreaker()));
  }

  updateIceBreaker(update: {
    icebreaker_member_id: number;
    step_id: number;
    icebreaker_id: number;
    questions: IceBreakerTemplateMessage[];
  }): Observable<any> {
    return this.http.put(`${API_URL}icebreakers/questions`, update);
  }

  addNewQuestionsToIceBreaker(request: any): Observable<any> {
    return this.http.put(`${API_URL}icebreakers/questions`, request);
  }

  updateTitlePrice(
    id: number,
    body: { title?: string; price?: number; preview_media_url?: string },
  ): Observable<any> {
    const filteredParams = JSON.parse(JSON.stringify(body));
    return this.http.put(`${API_URL}icebreakers/${id}`, filteredParams);
  }

  getIceBreakerInvoiceInfo(
    amount: number,
    allow_quantity: number,
  ): Observable<BasePaymentRequest> {
    return this.http.get<BasePaymentRequest>(`${API_URL}icebreakers/invoice`, {
      params: { amount, allow_quantity },
    });
  }

  private _startLoading() {
    this._isLoading$.next(true);
  }

  private _completeLoading() {
    this._isLoading$.next(false);
  }

  fetchAllIceBreakers() {
    isNotLoading(this)
      .pipe(
        switchMap(() => {
          this._startLoading();
          return this.http.get<IAllIceBreakers[]>(
            API_URL + 'icebreakers/all_icebreakers',
          );
        }),
        finalize(() => this._completeLoading()),
      )
      .subscribe((_) => this._iceBreakers$.next(_));
  }

  openShareIceBreakerModal(data: IShareIceBreakerModal) {
    this._dialog.open(ShareIceBreakerModalComponent, {
      data,
      panelClass: 'wcr-modal',
    });
  }

  async openModalIceBreakerCreationConfirmation(selectedSkillName: string) {
    const user = await firstValueFrom(this._authService.authorizedUser$);

    return this._dialog.open(CreateCapsuleModalComponent, {
      data: { user, skill: selectedSkillName },
      maxWidth: '498px',
      panelClass: 'create-capsule-dialog-container',
    });
  }

  navigateToIceBreakerCreation(userSkillId: number) {
    return this.router.navigate(
      ICE_BREAKER_CREATE_PATH.fromRootSegemntsWithParam({ userSkillId }),
    );
  }

  async initIceBreakerCreation(selectedSkillName: string, userSkillId: number) {
    const modalRef =
      await this.openModalIceBreakerCreationConfirmation(selectedSkillName);
    const confirmation = await firstValueFrom(modalRef.afterClosed());
    if (confirmation) {
      this.navigateToIceBreakerCreation(userSkillId);
    }
  }
}
