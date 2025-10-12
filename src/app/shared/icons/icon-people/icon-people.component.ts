import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-people',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-people.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./icon-people.component.scss'],
})
export class IconPeopleComponent extends BaseIconDirective {}
