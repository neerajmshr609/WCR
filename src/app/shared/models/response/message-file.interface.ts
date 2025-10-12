import { avFileStateEnum } from '../../enums';

export interface IMessageFile {
  url: string;
  mimetype: string;
  name: string;
  kind: string;
  thumbnail: string | null;
  loadState: avFileStateEnum;
}
