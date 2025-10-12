import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConversationImageType,
  IConversationImage,
} from './conversation-image.interface';

@Component({
  selector: 'app-conversation-image',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './conversation-image.component.html',
  styleUrls: ['./conversation-image.component.scss'],
})
export class ConversationImageComponent {
  readonly images = input.required<ConversationImageType>();
  readonly imagesList = computed(() => {
    let images = this.images();
    if (!Array.isArray(images)) {
      images = [images];
    }
    return this._setZIndex(images);
  });

  private _setZIndex(images: IConversationImage[]) {
    const { length } = images;
    return images.map((image, i) => {
      return {
        ...image,
        zIndex: length - i,
      };
    });
  }
}
