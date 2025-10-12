import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-sunflawer-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sunflawer-icon.component.html',
  styleUrls: ['./sunflawer-icon.component.scss'],
})
export class SunflawerIconComponent extends BaseIconDirective {}
