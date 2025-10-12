import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-home-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-icon.component.html',
  styleUrls: ['./home-icon.component.scss'],
})
export class HomeIconComponent extends BaseIconDirective {}
