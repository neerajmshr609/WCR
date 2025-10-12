import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-name',
  standalone: true,
  imports: [CommonModule],
  template: `{{ categoryName() }}`,
  styleUrls: ['./category-name.component.scss'],
})
export class CategoryNameComponent {
  readonly categoryName = input.required<string>();
}
