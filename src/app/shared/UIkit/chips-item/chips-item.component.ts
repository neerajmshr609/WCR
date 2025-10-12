import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { IChipsItem } from './chips-item.interface';

@Component({
  selector: 'app-chips-item',
  standalone: true,
  templateUrl: './chips-item.component.html',
  imports: [TranslateModule, NgClass],
  styleUrls: ['./chips-item.component.scss'],
})
export class ChipsItemComponent<F extends IChipsItem> {
  readonly chipsItem = input.required<F>();
  readonly isSelected = input(false);
}
