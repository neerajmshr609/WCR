import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-emoji-anim-fill-positive-two',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-emoji-anim-fill-positive-two.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconEmojiAnimFillPositiveTwoComponent extends BaseIconDirective {}
