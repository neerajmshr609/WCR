import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-hash',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-hash.component.html',
  styleUrls: ['./icon-hash.component.scss'],
})
export class IconHashComponent extends BaseIconDirective {}
