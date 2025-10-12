import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  model,
  ViewChild,
  output,
  input,
  effect,
} from '@angular/core';
import { Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { MessagesService } from 'src/app/services/messages.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { insertString } from '../../functions/insert-string';
import { AudioMessage, Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('messageInputRef') messageInputRef: ElementRef;
  @ViewChild('inputBnts', { static: true }) inputBtns: HTMLDivElement;

  @Input() public sendBtnSrc = 'assets/icons/send.svg';
  @Input() public scaleSendBtn = false;
  @Input() public showSendBtn = true;
  @Input() canSendMessage = true;
  @Input() editable = true;

  @Input() public externalAudioRecord: boolean;
  @Input() public recordBtnDisabled: boolean;
  @Input() public showInsertBtn: boolean;

  @Input() public inputPlaceholder = 'text_input.placeholder';
  @Input() public focusInput$: Observable<void>;

  @Input() public messageSent$: Observable<void>;
  @Input() public savedMessage: string;
  @Input() public savedAudioMessage: AudioMessage;

  @Input() private audioPage: string;
  @Input() private audioOrder: number;

  @Input() public user: User;
  @Input() private allowImages: boolean;
  @Input() allowAudioMessage = true;

  @Output() public recordBtnClicked = new EventEmitter<void>();
  @Output() public sendBtnClicked = new EventEmitter<Partial<Message>>();
  @Output() public messageUpdate = new EventEmitter<Partial<Message>>();
  @Output() onFocusInput: EventEmitter<boolean> = new EventEmitter<boolean>();

  public recordingProcess = input(false);

  public withAdditionalMenu = input(false);
  public isStartUploadAudio = input(false);

  public additionalMenu = model<boolean>();

  public messageIsSending: boolean;

  public isRecording: boolean;
  public audioMessage: AudioMessage;
  public stopRecordingEvt = new EventEmitter<void>();

  private changes = new Array<string>();
  private undoCount = 0;

  public file: File;
  public fileBase64: string;

  public get messageInput(): HTMLElement {
    return this.messageInputRef?.nativeElement;
  }

  public get inputIsEnabled(): boolean {
    return (
      (this.audioMessage?.url ||
        this.messageInput?.innerText.trim() ||
        this.file) &&
      !this.messageIsSending
    );
  }

  constructor(
    private rateflowService: RateflowService,
    public messagesService: MessagesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.changes = [''];
  }

  ngAfterViewInit() {
    this.messageInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey && this.inputIsEnabled) {
        event.preventDefault();
        this.send();
        return;
      }

      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        this.handleUndoRedo(1);
        return;
      }

      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        this.handleUndoRedo(-1);
        return;
      }

      const index = this.changes.length - this.undoCount;
      this.changes = this.changes.splice(0, index);
      this.undoCount = 0;

      setTimeout(() => {
        const value = this.messageInput.innerText;
        const lastValue = this.changes[this.changes.length - 1];
        if (value !== lastValue) {
          this.changes.push(value);
        }
      });
    });

    this.subscribeToFocusInput();
    this.subscribeToMessageSent();
    this.subscribeToAudioRecordingStarted();
    this.parseInput();
  }

  private subscribeToFocusInput() {
    this.focusInput$
      ?.pipe(
        takeUntil(this.destroyed),
        tap(() => this.messageInput.focus()),
      )
      .subscribe();
  }

  private handleUndoRedo(value: 1 | -1) {
    if (this.changes.length === 1) {
      return;
    }

    this.undoCount += value;
    const change = this.changes[this.changes.length - 1 - this.undoCount];

    if (change == null) {
      this.undoCount -= value;
      return;
    }

    this.messageInput.innerText = '';
    insertString(change);
  }

  private subscribeToMessageSent() {
    this.messageSent$
      ?.pipe(
        takeUntil(this.destroyed),
        tap(() => {
          this.changes = [''];
          this.messageInput.innerText = '';
          this.audioMessage = null;
          this.messageIsSending = false;
          this.deleteFile();
        }),
      )
      .subscribe();
  }

  private subscribeToAudioRecordingStarted() {
    this.rateflowService.audioRecordingStarted$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        filter(
          (res) => res.type === this.audioPage && res.order !== this.audioOrder,
        ),
        tap(() => this.stopRecordingEvt.emit()),
      )
      .subscribe();
  }

  private parseInput() {
    if (this.savedAudioMessage) {
      this.audioMessage = this.savedAudioMessage;
    }

    if (this.savedMessage) {
      this.messageInput.innerText = this.savedMessage;
    }
  }

  public send() {
    if (!this.messageInput.innerText || this.messageInput.innerText === '') {
      return;
    }
    if (!this.canSendMessage) {
      this.sendBtnClicked.emit();
      return;
    }
    this.messageIsSending = true;
    this.sendBtnClicked.emit({
      body: this.messageInput.innerText,
      audio_message: this.audioMessage,
      message_screenshots: [{ file: this.file }],
    });
  }

  public record() {
    if (this.externalAudioRecord) {
      this.recordBtnClicked.emit();
      return;
    }

    this.startAudioRecording();
  }

  public displayAdditionalMenu() {
    this.additionalMenu.set(true);
  }

  public onMessageKeyUp() {
    this.messageUpdate.emit({
      body: this.messageInput.innerText,
      audio_message: this.audioMessage,
    });
  }

  public startAudioRecording() {
    this.isRecording = true;
    this.rateflowService.audioRecordingStarted = {
      order: this.audioOrder,
      type: this.audioPage,
    };
  }

  public audioMessageUploaded(event: { url: string; duration: number }) {
    this.audioMessage = event;
    this.isRecording = false;
    this.onMessageKeyUp();
  }

  public deleteAudioMessage(clear: boolean) {
    this.isRecording = false;

    if (clear) {
      this.audioMessage = null;
    }
  }

  public insertMessage() {
    const message = this.messagesService.copiedMessage;
    this.audioMessage = message.audio_message;
    this.messageInput.innerText = message.body;
  }

  public detectPaste(event: ClipboardEvent) {
    event.preventDefault();

    const data = event.clipboardData;
    const textData = data.getData('text/plain');

    if (textData) {
      insertString(textData);
    }

    if (this.allowImages) {
      const file = data.files?.[0];
      this.setFileToInput(file);
    }
  }

  private setFileToInput(file: File) {
    if (!file) {
      return;
    }

    this.file = file;
    this.readScreenshotFile();
  }

  public deleteFile() {
    this.file = null;
    this.fileBase64 = null;
  }

  private handleReaderLoaded(e) {
    this.fileBase64 = 'data:image/png;base64,' + btoa(e.target.result);
  }

  private readScreenshotFile() {
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.file);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.messageInput.removeAllListeners('keydown');
  }
}
