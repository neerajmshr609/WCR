import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-right-arrow-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './right-arrow-icon.component.html',
  styleUrls: ['./right-arrow-icon.component.scss'],
})
export class RightArrowIconComponent extends BaseIconDirective {}
