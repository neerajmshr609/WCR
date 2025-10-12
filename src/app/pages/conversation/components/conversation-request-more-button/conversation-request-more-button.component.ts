import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Conversation } from '../../../../shared/models/conversation.model';
import { ButtonComponent } from '../../../../shared/UIkit/button/button.component';
import { IconMoreVerticalComponent } from '../../../../shared/icons/icon-more-vertical/icon-more-vertical.component';

@Component({
  selector: 'app-conversation-request-more-button',
  templateUrl: './conversation-request-more-button.component.html',
  styleUrls: ['./conversation-request-more-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconMoreVerticalComponent],
})
export class ConversationRequestMoreButtonComponent {
  private readonly _mouseOver = signal(false);
  readonly textColor = computed(() =>
    this._mouseOver() ? '#1e1e1e' : '#303030',
  );
  public disable = input<boolean>(false);

  constructor(public elementRef: ElementRef) {}

  @HostListener('mouseover')
  mouseOverHandler() {
    this._mouseOver.set(true);
  }

  @HostListener('mouseleave')
  mouseLeaveHandler() {
    this._mouseOver.set(false);
  }
}
