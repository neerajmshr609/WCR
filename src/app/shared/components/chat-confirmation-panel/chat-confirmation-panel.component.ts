import { Component, input, output } from '@angular/core';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-chat-confirmation-panel',
  templateUrl: './chat-confirmation-panel.component.html',
  styleUrls: ['./chat-confirmation-panel.component.scss'],
})
export class ChatConfirmationPanelComponent extends BaseComponent {
  public options = input<{ answer_id: number; text: string }[]>([]);
  reply = output<{ answer_id: number; text: string }>();

  public getOptionValue(answerId: number): string {
    if (answerId === 1) {
      return 'confirmation.yes';
    }
    if (answerId === 2) {
      return 'confirmation.no';
    }
  }
}
