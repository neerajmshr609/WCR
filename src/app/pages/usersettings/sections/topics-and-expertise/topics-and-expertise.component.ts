import { Component, input, output } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-topics-and-expertise',
  templateUrl: './topics-and-expertise.component.html',
})
export class TopicsAndExpertiseComponent {
  onSave = output<string>();
  currentUser = input<User>();

  save($event): void {
    this.onSave.emit($event);
  }
}
