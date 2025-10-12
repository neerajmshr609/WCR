import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-sidebar-shrink',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-shrink.component.html',
  styleUrls: ['./sidebar-shrink.component.scss'],
})
export class SidebarShrinkComponent extends BaseIconDirective {}
