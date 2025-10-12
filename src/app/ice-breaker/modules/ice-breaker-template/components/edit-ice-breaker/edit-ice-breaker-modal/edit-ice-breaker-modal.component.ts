import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IceBreakerTemplateMessage,
  StepQuestionTemplate,
} from '../../../ice-breaker-template-messages';
import { EditIceBreakerService } from '../../../services/edit-ice-breaker.service';
import { Observable } from 'rxjs';
import { Uppy } from '@uppy/core';
import { AwsS3 } from 'uppy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { shareReplay, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { PROFILE_PATH } from 'src/app/pages/profile/routing/profile.paths';
import { COMPANION_URL } from 'src/config/config';
import { isScrollable } from 'src/app/shared/components/scroll-btn/is-scrollable';
import { ICE_BREAKER_PATH } from 'src/app/ice-breaker/routing/ice-breaker.paths';

type DialogData = {
  icebreaker_id: number;
  step: StepQuestionTemplate;
  questionToEdit: IceBreakerTemplateMessage;
  isNewQuestions: boolean;
  iceBreakerTitle?: string;
};

@Component({
  selector: 'app-edit-ice-breaker-modal',
  templateUrl: './edit-ice-breaker-modal.component.html',
  styleUrls: ['./edit-ice-breaker-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EditIceBreakerService],
})
export class EditIceBreakerModalComponent implements OnInit {
  @ViewChild('containerOfMessages', { static: false })
  private messagesContainer: ElementRef;
  private uploader = new Uppy({ id: 'message-screenshot-uploader' }).use(
    AwsS3,
    {
      companionUrl: COMPANION_URL,
      metaFields: ['folder'],
    },
  );
  currentUser: User;
  shareLink = '';
  messageSentEvt = new EventEmitter<void>();
  messages$: Observable<IceBreakerTemplateMessage[]> =
    this.icebreakerEditService.messages$.pipe(
      tap(() => {
        setTimeout(() => {
          this.isCanScroll = isScrollable(this.messagesContainer.nativeElement);
        }, 0);
      }),
    );
  currentUser$: Observable<User> = this.authService.userSubject$.pipe(
    tap((user: User) => {
      this.currentUser = user;
      if (user) {
        this.shareLink = `${this._appDocument.location.origin}/${PROFILE_PATH}/${user.sharetoken}/${ICE_BREAKER_PATH.toRelativeUrl()}`;
      }
    }),
  );
  isCanFinishChanges$ = this.icebreakerEditService.isCanFinishChanges$;
  questionToSetOriginalTitle$ =
    this.icebreakerEditService.questionToSetOriginalTitle$;
  showSetPrice: Observable<boolean> =
    this.icebreakerEditService.isSetPrice.asObservable();
  showSetTitle: Observable<boolean> =
    this.icebreakerEditService.isSetTitle.asObservable();
  isCompleteIceBreaker$ = this.icebreakerEditService.isCompleteIceBreaker
    .asObservable()
    .pipe(
      tap((data: { id: number }) => {
        if (data && data.id) {
          this.shareLink = `${this.shareLink}?id=${data.id}`;
        }
      }),
      shareReplay(),
    );
  isCanScroll = false;
  isNewQuestionsState = false;
  stepQuestions: IceBreakerTemplateMessage[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<EditIceBreakerModalComponent>,
    private readonly icebreakerEditService: EditIceBreakerService,
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private readonly data: DialogData,
    @Inject(DOCUMENT)
    private readonly _appDocument: Document,
  ) {}

  ngOnInit(): void {
    if (this.data.isNewQuestions) {
      this.isNewQuestionsState = true;
      this.icebreakerEditService.isNewQuestionsState(
        true,
        this.data.icebreaker_id,
        this.data.iceBreakerTitle,
      );
    }
  }

  async sendMessage(message: any): Promise<void> {
    const file = message.message_screenshots[0].file;
    message.message_screenshots_attributes = [];
    delete message.message_screenshots;
    if (file) {
      try {
        const uploadedFile = await this.useUploader(
          file,
          'message-screenshot-' + new Date().getTime(),
        );
        message.message_screenshots_attributes = [
          { url: decodeURIComponent(uploadedFile.successful[0].uploadURL) },
        ];
        this.messageSentEvt.emit();
        if (this.data.isNewQuestions) {
          this.stepQuestions = [...this.stepQuestions, message];
        }
        this.icebreakerEditService.sendMessage(message);
        return;
      } catch {
        this.snackBar.open('Something went wrong!', null, {
          duration: 5000,
        });
        return;
      }
    }
    if (this.data.isNewQuestions) {
      this.stepQuestions = [...this.stepQuestions, message];
    }
    this.icebreakerEditService.sendMessage(message);
    this.messageSentEvt.emit();
  }

  complete(): void {
    this.icebreakerEditService.finishChanges(
      this.data.step,
      this.data.questionToEdit,
      this.data.icebreaker_id,
    );
  }

  nextQuestion(): void {
    this.icebreakerEditService.nextQuestion();
    this.saveUserQuestions();
  }

  readyToSetPrice(state: boolean): void {
    this.icebreakerEditService.setPriceState(state);
  }

  private async useUploader(blob: File, title: string) {
    this.uploader.addFile({
      data: blob,
      name: title,
      source: 'file input',
      type: blob.type,
    });
    const userId = this.currentUser.id;
    this.uploader.setMeta({ folder: `users/${userId}/message-screenshots` });

    const uploadedFile = await this.uploader.upload();
    this.uploader.reset();
    return uploadedFile;
  }

  scrollHistory(bottom: boolean = true): void {
    const history = this.messagesContainer.nativeElement;
    history?.scrollTo({ top: bottom ? history.scrollHeight : 0 });
  }

  readyToSetTitle(): void {
    this.saveUserQuestions();
    this.icebreakerEditService.wantToKeepOriginalTitleQuestion();
  }

  keepOriginalTitle(): void {
    this.icebreakerEditService.keepOriginalTitle(true);
  }

  wantSetNewTitle(): void {
    this.icebreakerEditService.wantToSetNewTitle();
  }

  private saveUserQuestions() {
    this.icebreakerEditService.saveUserQuestions(this.stepQuestions);
    this.stepQuestions = [];
  }

  onPriceChanged(price: number) {
    this.icebreakerEditService.setPrice(price);
  }

  close(): void {
    this.dialogRef.close();
  }
}
