import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PRIVACY_POLICY_ROUTE,
  TERMS_OF_SERVICE_ROUTE,
} from '../../../../../config/shared-routes';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
  stringifyUsernameAndEmail,
  User,
} from '../../../../shared/models/user.model';
import { ConversationsService } from '../../../../services/conversations.service';
import { Conversation } from '../../../../shared/models/conversation.model';
import {
  AddMemberResponse,
  ConnectMemberResponse,
} from '../../../../shared/models/response/add-member-response';

@Component({
  selector: 'app-adding-user',
  templateUrl: './adding-user.component.html',
  styleUrl: './adding-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddingUserComponent implements OnDestroy {
  readonly TERMS_OF_SERVICE_ROUTE = TERMS_OF_SERVICE_ROUTE;
  readonly PRIVACY_POLICY_ROUTE = PRIVACY_POLICY_ROUTE;

  readonly SEARCH_INPUT_NAME = 'name';
  readonly ROLE_INPUT_NAME = 'role';

  readonly addUserForm = new FormGroup({
    [this.SEARCH_INPUT_NAME]: new FormControl<string>(''),
    [this.ROLE_INPUT_NAME]: new FormControl(''),
  });

  private readonly _destroy$ = new Subject();
  private readonly _usersListIsLoading$ = new BehaviorSubject(false);

  readonly usersListIsLoading$ = this._usersListIsLoading$.asObservable();
  private readonly _selectedUserToAdd$ = new BehaviorSubject<User | null>(null);
  readonly selectedUserToAdd$ = this._selectedUserToAdd$.asObservable();
  public inviteTo = signal<string>(null);
  public note = signal<string>(null);

  private readonly _addUsersList$ = this.addUserForm.valueChanges.pipe(
    filter((formValues) => formValues[this.SEARCH_INPUT_NAME].length > 2),
    switchMap((formValues) => {
      const name = formValues[this.SEARCH_INPUT_NAME];
      const role = formValues[this.ROLE_INPUT_NAME];
      return this._conversationsService.getUsersListToAdd(
        name,
        this._data.conversation,
      );
    }),
    takeUntil(this._destroy$),
  ) as Observable<User[]>;

  readonly showUsersListToAdd$ = combineLatest([
    this._addUsersList$.pipe(map((_) => Array.isArray(_) && _.length > 0)),
    this.selectedUserToAdd$.pipe(map((_) => _ === null)),
  ]).pipe(
    map(
      ([listIsNotEmpty, userIsNotSelected]) =>
        listIsNotEmpty && userIsNotSelected,
    ),
  );

  readonly addUsersList = signal([]);

  @ViewChild('name_input') nameInput: ElementRef<HTMLInputElement>;
  @ViewChild('buttons_container') buttonsContainer: ElementRef<HTMLDivElement>;

  get listSizeStyles() {
    return `width:${this.nameInput.nativeElement.getBoundingClientRect().width}px;
            max-height: ${this.nameInput.nativeElement.getBoundingClientRect().bottom - this.buttonsContainer.nativeElement.getBoundingClientRect().top}px;`;
  }

  private readonly _addUsersListSubscription = this._addUsersList$.subscribe(
    (_) => {
      this.addUsersList.set(_);
    },
  );

  constructor(
    private readonly _dialogRef: MatDialogRef<AddingUserComponent>,
    private readonly _conversationsService: ConversationsService,
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {
      conversation: Conversation;
      inviteTo: string;
      note?: string;
      isInternal: boolean;
    },
  ) {
    this.inviteTo.set(_data.inviteTo);
    this.note.set(_data.note);
  }

  close() {
    this._dialogRef.close();
  }

  cancel() {
    this._dialogRef.close();
  }

  add() {
    this.selectedUserToAdd$
      .pipe(
        take(1),
        switchMap((selectedUser) => {
          if (this._data.isInternal) {
            return this._conversationsService.connectConversation({
              conversation_id: this._data.conversation.id,
              user_id: selectedUser.id,
            });
          }
          return this._conversationsService.addUserToConversation(
            this._data.conversation,
            selectedUser,
          );
        }),
      )
      .subscribe((conversationMember) => {
        // TODO: This is incorrect; Conversation should be implemented as state, and here should be call of
        //  conversation state change (not just pushing to array);
        if (
          (conversationMember as ConnectMemberResponse).conversation_members
        ) {
          this._data.conversation.updateMembers(
            (conversationMember as ConnectMemberResponse).conversation_members,
          );
        } else {
          this._data.conversation.addMember(conversationMember as User);
        }
        this.close();
      });
  }

  selectUserToAdd(event: MouseEvent, user: User) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this._selectedUserToAdd$.next(user);
    this._setUserDataToForm(user);
  }

  private _removeSelectedUser() {
    this.selectedUserToAdd$
      .pipe(
        take(1),
        filter((selectedUser) => selectedUser !== null),
      )
      .subscribe(() => {
        this._selectedUserToAdd$.next(null);
      });
  }

  private _setUserDataToForm(user: User) {
    this.addUserForm.setValue({
      [this.SEARCH_INPUT_NAME]: stringifyUsernameAndEmail(user),
      [this.ROLE_INPUT_NAME]: '',
    });
  }

  selectedUserKeyPressHandler() {
    combineLatest([
      this.selectedUserToAdd$.pipe(
        take(1),
        filter((_) => _ !== null),
      ),
      this.addUserForm.valueChanges.pipe(
        take(1),
        map((formValue) => formValue[this.SEARCH_INPUT_NAME]),
      ),
    ])
      .pipe(
        filter(([user, searchInputValue]) => {
          return !searchInputValue.includes(stringifyUsernameAndEmail(user));
        }),
      )
      .subscribe(() => {
        this._removeSelectedUser();
      });
  }

  ngOnDestroy(): void {
    this._addUsersListSubscription.unsubscribe();
    this._selectedUserToAdd$.next(null);
    this._selectedUserToAdd$.complete();
    this._usersListIsLoading$.next(false);
    this._usersListIsLoading$.complete();
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
