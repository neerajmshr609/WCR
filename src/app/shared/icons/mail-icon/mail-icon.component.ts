import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-mail-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mail-icon.component.html',
  styleUrls: ['./mail-icon.component.scss'],
})
export class MailIconComponent extends BaseIconDirective {}
