import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TransmittedComponent {
  component: Type<any> | any;
  inputs?: { [key: string]: any };
  isComponent: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConversationHeaderService {
  private conversationHeaderComponent: BehaviorSubject<TransmittedComponent | null> =
    new BehaviorSubject(null);
  public conversationHeaderComponent$ =
    this.conversationHeaderComponent.asObservable();
  constructor() {}

  public setUpComponent(component: TransmittedComponent) {
    this.conversationHeaderComponent.next(component);
  }

  public clearComponent(): void {
    this.conversationHeaderComponent.next(null);
  }
}
