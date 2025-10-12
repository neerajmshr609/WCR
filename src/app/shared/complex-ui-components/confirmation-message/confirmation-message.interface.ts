import { Type } from '@angular/core';

export interface IConfirmationMessage {
  title: string;
  message: string |  Type<any>;
  question?: string;
  confirm: string |  Type<any>;
  cancel: string;
}
