import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-clipboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-clipboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./icon-clipboard.component.scss'],
})
export class IconClipboardComponent extends BaseIconDirective {}
