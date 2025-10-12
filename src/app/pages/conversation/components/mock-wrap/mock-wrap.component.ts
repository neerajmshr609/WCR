import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { ConversationManageItems } from '../conversation-manage-panel/manage-panel-menu';

@Component({
  selector: 'app-mock-wrap',
  templateUrl: './mock-wrap.component.html',
  styleUrls: ['./mock-wrap.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class MockWrapComponent {
  public selected = input<ConversationManageItems>('tasks');
  public isHoveredItem = signal<boolean>(false);

  public switchHoverState(): void {
    this.isHoveredItem.set(!this.isHoveredItem());
  }
}
