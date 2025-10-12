import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-lupai-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lupai-icon.component.html',
  styleUrls: ['./lupai-icon.component.scss'],
})
export class LupaiIconComponent extends BaseIconDirective {}
