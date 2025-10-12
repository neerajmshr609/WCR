import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  OnInit,
  signal,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, debounceTime, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IFormModel } from 'src/app/pages/usersettings/interfaces';
import { ConversationsService } from 'src/app/services/conversations.service';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import {
  Conversation,
  createConversation,
  CreateNewConversationDTO,
} from 'src/app/shared/models/conversation.model';
import { User } from 'src/app/shared/models/user.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  styleUrls: ['./new-conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewConversationComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public recipientName = new FormControl();

  addUsersList = signal<User[]>([]);
  selectedUser: User;
  logo: string;
  addNewChatForm = new UntypedFormGroup({
    recipient: new FormControl(null, [Validators.required]),
    conversation_type: new FormControl('direct_chat', [
      Validators.required,
    ]),
  });
  isOpen = true;
  chatTypeOptions = [
    { id: 'direct_chat', name: 'Direct chat' },
    { id: 'org_chat', name: 'Org chat' },
    { id: 'community_chat', name: 'Community' },
  ];
  viewModel = ['id', 'name'];
  folder = computed(
    () => 'chats/' + this.addNewChatForm.get('chatName') + '/logo',
  );
  currentUser: User;

  constructor(
    private readonly _conversationsService: ConversationsService,
    private readonly _uploaderService: UploaderService,
    private readonly _authService: AuthService,
    private dialogRef: MatDialogRef<NewConversationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cancel_btn: '';
      confirm_btn: '';
      title: '';
    },
  ) {
    super();
    this._uploaderService.uploaderConfig = {
      id: 'uploader--chat-avatar',
      target: 'uploader--chat-avatar',
      inline: false,
    };
  }

  ngOnInit() {
    this.addNewChatForm
      .get('conversation_type')
      .valueChanges.pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        if (res === 'direct_chat') {
          this.addNewChatForm.addControl(
            'recipient',
            new FormControl<string>(null, [Validators.required]),
          );
          this.addNewChatForm.removeControl('name');
          this.addNewChatForm.removeControl('image');
        } else {
          this.addNewChatForm.removeControl('recipient');
          this.addNewChatForm.addControl(
            'name',
            new FormControl('', [Validators.required]),
          );
          this.addNewChatForm.addControl(
            'image',
            new FormControl('/assets/user-settings/default-img.svg'),
          );
        }
      });

    this._authService.userSubject$.pipe(takeUntil(this.destroyed)).subscribe({
      next: (res) => {
        this.currentUser = res;
      },
    });

    this.recipientName.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((name) => {
          const trimmedName = name?.trim();

          if (trimmedName && trimmedName.length > 0) {
            return this._conversationsService.getUsersListToAdd(
              trimmedName,
              {} as Conversation,
            );
          }

          return [];
        }),
        catchError((err) => {
          // Incomplete
          console.error('Error fetching user list:', err);
          return [];
        }),
        takeUntil(this.destroyed),
      )
      .subscribe((res: User[]) => {
        this.addUsersList.set(
          res.filter((user) => user.id !== this.currentUser.id),
        );
        this.isOpen = true;
      });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  add(): void {
    if (this.addNewChatForm.invalid && this.selectedUser) {
      return;
    }
    const body: CreateNewConversationDTO = {
      conversation_type: this.addNewChatForm.value.conversation_type,
    };
    if (this.addNewChatForm.value.conversation_type !== 'direct_chat') {
      body.image = this.logo;
      body.name = this.addNewChatForm.value.name;
    } else {
      body.user_id = this.selectedUser.id;
    }
    this._conversationsService.createNewConversation(body).subscribe((res) => {
      const conversation: Conversation = createConversation({
        ...res.conversation,
        members: res.conversation.members,
      });
      this.dialogRef.close(conversation);
    });
  }

  selectUserToAdd(user: User): void {
    this.isOpen = false;
    this.selectedUser = user;
    this.recipientName.setValue(user.username, { emitEvent: false });
    this.addNewChatForm
      .get('recipient')
      .setValue(user.username, { emitEvent: false });
  }

  uploadAvatar(image: IFormModel): void {
    this.logo = image.value as string;
  }
}
