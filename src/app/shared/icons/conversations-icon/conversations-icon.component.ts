import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
} from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-conversations-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './conversations-icon.component.html',
  styleUrls: ['./conversations-icon.component.scss'],
})
export class ConversationsIconComponent extends BaseIconDirective {}
