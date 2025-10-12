import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-organization-icon',
  templateUrl: './organization-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./organization-icon.component.scss'],
})
export class OrganizationIconComponent extends BaseIconDirective {}
