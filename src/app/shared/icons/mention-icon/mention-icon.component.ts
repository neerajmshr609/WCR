import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-mention-icon',
  templateUrl: './mention-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./mention-icon.component.scss'],
})
export class MentionIconComponent extends BaseIconDirective {}
