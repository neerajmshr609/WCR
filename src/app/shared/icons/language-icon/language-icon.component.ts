import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-language-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-icon.component.html',
  styleUrls: ['./language-icon.component.scss'],
})
export class LanguageIconComponent extends BaseIconDirective {}
