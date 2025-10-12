import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ConversationMobileMenuViewService {
  private view = new BehaviorSubject(this.getValueFromLocalStorage());
  public view$ = this.view.asObservable();

  public updateValue(value: boolean): void {
    localStorage.setItem('chat-menu-minimal', JSON.stringify(value));
    this.view.next(value);
  }

  public getValueFromLocalStorage(): boolean {
    return JSON.parse(localStorage.getItem('chat-menu-minimal')) || false;
  }
}
