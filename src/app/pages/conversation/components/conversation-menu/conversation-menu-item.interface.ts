import { IMenuItem } from '../../../../main-content-menu/model/menu-item';

export interface IConversationMenuItem extends IMenuItem {
  selectHandler: () => void;
}
