import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { OnboardingService } from '../onboarding.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { takeUntil } from 'rxjs/operators';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { Story } from 'src/app/shared/models/story.model';
import { Card } from 'src/app/shared/models/card.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  providers: [UploaderService],
})
export class StoryComponent extends BaseComponent implements OnDestroy {
  @Input() story: Story;

  @Output() deleted = new EventEmitter<number>();

  imageUrl: string;

  constructor(
    private snackBar: MatSnackBar,
    private onboardingService: OnboardingService,
    private uploaderService: UploaderService,
  ) {
    super();

    this.uploaderService.uploaderConfig = {
      id: 'uploader--card-image',
      target: 'uploader--card-image',
      inline: false,
    };
  }

  openUploader(card: Card): void {
    this.uploaderService.openModal();
    this.uploaderService.meta = { folder: `cards` };
    this.uploaderService.options = {
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif'],
      },
    };

    this.uploaderService.uploadFinished
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        const uploadURL = decodeURIComponent(res.successful[0].uploadURL);
        card ? (card.imageurl = uploadURL) : (this.imageUrl = uploadURL);
        this.uploaderService.closeModal();
      });
  }

  onStoryActiveToggle(change: MatSlideToggleChange) {
    this.story.active = change.checked;
    this.onboardingService
      .updateStory(this.story)
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }

  onDelete() {
    this.deleted.emit(this.story.id);
  }

  onCardUpdate(card: Card) {
    this.onboardingService
      .updateCard(card)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.snackBar.open('Saved!', null, { duration: 1000 }));
  }

  onCardCreate(card: Card) {
    const newCard = { ...card };
    newCard.imageurl = this.imageUrl;

    this.onboardingService
      .createCard(newCard)
      .pipe(takeUntil(this.destroyed))
      .subscribe(
        (res) => {
          this.imageUrl = null;
          this.story.cards.push(res);
          this.uploaderService.destroy();
        },
        (err) => this.snackBar.open(err, null, { duration: 1000 }),
      );
  }

  onCardDelete(cardID: number) {
    this.onboardingService
      .deleteCard(cardID)
      .pipe(takeUntil(this.destroyed))
      .subscribe(
        () =>
          (this.story.cards = this.story.cards.filter(
            (obj) => obj.id !== cardID,
          )),
      );
  }

  ngOnDestroy(): void {
    this.uploaderService.destroy();
    super.ngOnDestroy();
  }
}
