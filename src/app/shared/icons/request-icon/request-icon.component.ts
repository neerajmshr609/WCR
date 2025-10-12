import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-request-icon',
  templateUrl: './request-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../icon.base.component.scss'],
})
export class RequestIconComponent extends BaseIconDirective {}
