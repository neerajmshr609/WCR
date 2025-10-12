export interface IConversationImage extends Partial<HTMLImageElement> {
  src: string;
  alt: string;
}

export interface QueuedConversationImage extends IConversationImage {
  type?: string;
}

export type ConversationImageType = IConversationImage[] | IConversationImage;
