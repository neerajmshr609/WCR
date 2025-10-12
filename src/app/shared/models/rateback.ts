import { AudioMessage } from './message.model';

export interface RatebackEvt {
  rateback: number;
  feedbackId: number;
}

export interface RatebacksStorage {
  [ratebackId: number]: {
    [fileId: number]: {
      rateback?: number;
      comment?: string;
      audioMessage?: AudioMessage;
    };
  };
}
