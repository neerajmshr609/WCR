import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-case-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './case-icon.component.html',
  styleUrls: ['./case-icon.component.scss'],
})
export class CaseIconComponent extends BaseIconDirective {}
