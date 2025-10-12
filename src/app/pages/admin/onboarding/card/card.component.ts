import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Card } from 'src/app/shared/models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent extends BaseComponent implements OnInit {
  @ViewChild('cardTitle', { static: false }) cardTitle: ElementRef;
  @ViewChild('cardImage', { static: false }) cardImage: ElementRef;
  @ViewChild('cardText', { static: false }) cardText: ElementRef;

  @Input() storyID: number;
  @Input() card: Card;
  @Input() imageUrl: string;

  @Output() cardUpdated = new EventEmitter<Card>();
  @Output() cardCreated = new EventEmitter<Card>();
  @Output() cardDeleted = new EventEmitter<number>();
  @Output() openUploader = new EventEmitter<Card>();

  constructor() {
    super();
  }

  onSave(isNew: boolean) {
    if (isNew) {
      const card = new Card();
      card.title = this.cardTitle.nativeElement.innerText;
      card.text = this.cardText.nativeElement.innerText;
      card.imageurl = this.cardImage.nativeElement.src;
      card.story_id = this.storyID;
      this.cardCreated.emit(card);
      this.cardTitle.nativeElement.innerText = 'Card title';
      this.cardText.nativeElement.innerText = 'Card text';
    } else {
      this.card.title = this.cardTitle.nativeElement.innerText;
      this.card.text = this.cardText.nativeElement.innerText;
      this.card.imageurl = this.cardImage.nativeElement.src;
      this.card.story_id = this.storyID;
      this.cardUpdated.emit(this.card);
    }
  }

  onDelete() {
    this.cardDeleted.emit(this.card.id);
  }

  onImageClick(): void {
    this.openUploader.emit(this.card);
  }

  ngOnInit(): void {}
}
