import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICoverImage } from './cover-image.interface';

@Component({
  selector: 'app-cover-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cover-image.component.html',
  styleUrls: ['./cover-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverImageComponent {
  readonly image = input.required<ICoverImage>();
}
