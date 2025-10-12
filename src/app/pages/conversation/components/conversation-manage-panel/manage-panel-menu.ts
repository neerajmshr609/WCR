import { MessageIconComponent } from '../../../../shared/icons/message-icon/message-icon.component';
import { IconHashComponent } from '../../../../shared/icons/icon-hash/icon-hash.component';
import { IconEventsComponent } from '../../../../shared/icons/icon-events/icon-events.component';
import { UploadIconComponent } from '../../../../shared/icons/upload-icon/upload-icon.component';
import { IconClipboardComponent } from '../../../../shared/icons/icon-clipboard/icon-clipboard.component';
import { IconRobotComponent } from '../../../../shared/icons/icon-robot/icon-robot.component';
import { ActivityIconComponent } from '../../../../shared/icons/activity-icon/activity-icon.component';
import { TaskIconComponent } from '../../../../shared/icons/task-icon/task-icon.component';

export type ConversationManageItems =
  | 'robots'
  | 'subgroups'
  | 'files'
  | 'events'
  | 'offer_boards'
  | 'questions'
  | 'public_boards'
  | 'summary'
  | 'client_chat'
  | 'internal_chat'
  | 'tasks';

export interface ConversationManageMenuItem {
  id: ConversationManageItems;
  className?: string;
  icon: any;
  title: string;
  iconColors: {
    activeColor: string;
    inActiveColor: string;
  };
  // getInput?: (state: boolean) => { [key: string]: string | number };
  readonly inputs: { [key: string]: any };
  selected: boolean;
  description?: string;
}

export const consultantMobileMenuItems: ConversationManageMenuItem[] = [
  {
    id: 'client_chat',
    className: 'client',
    icon: MessageIconComponent,
    title: 'conversation_manage_panel.client_chat',
    description: 'conversation_manage_panel.talk',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },

  {
    id: 'tasks',
    icon: TaskIconComponent,
    title: 'conversation_manage_panel.tasks',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'summary',
    icon: ActivityIconComponent,
    title: 'conversation_manage_panel.summary',
    selected: false,
    description: 'conversation_manage_panel.summary-description',
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return summaryInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },

  {
    id: 'files',
    icon: UploadIconComponent,
    title: 'conversation_manage_panel.file_vault',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return filesInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },

  {
    id: 'internal_chat',

    className: 'internal',
    icon: MessageIconComponent,
    title: 'conversation_manage_panel.internal_chat',
    description: 'conversation_manage_panel.internal-description',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },

  {
    id: 'robots',
    icon: IconRobotComponent,
    title: 'conversation_manage_panel.robots',
    description: 'conversation_manage_panel.robots-description',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return robotInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
];

export const consultantDesktopMenuItems: ConversationManageMenuItem[] = [
  {
    id: 'robots',
    icon: IconRobotComponent,
    title: 'conversation_manage_panel.robots',
    description: 'conversation_manage_panel.robots-description',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return robotInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'files',
    icon: UploadIconComponent,
    title: 'conversation_manage_panel.file_vault',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return filesInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'internal_chat',
    className: 'internal',
    icon: MessageIconComponent,
    title: 'conversation_manage_panel.internal_chat',
    description: 'conversation_manage_panel.internal-description',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'summary',
    className: 'summary',
    icon: ActivityIconComponent,
    title: 'conversation_manage_panel.summary',
    description: 'conversation_manage_panel.summary-description',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return summaryInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'tasks',
    icon: TaskIconComponent,
    title: 'conversation_manage_panel.tasks',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
];

export const userDesktopMenuItems: ConversationManageMenuItem[] = [
  {
    id: 'tasks',
    icon: TaskIconComponent,
    title: 'conversation_manage_panel.tasks',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'files',
    icon: UploadIconComponent,
    title: 'conversation_manage_panel.file_vault',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return filesInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'summary',
    icon: ActivityIconComponent,
    title: 'conversation_manage_panel.summary',
    description: 'conversation_manage_panel.summary-description',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return summaryInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
];

export const userMobileMenuItems: ConversationManageMenuItem[] = [
  {
    id: 'tasks',
    icon: TaskIconComponent,
    title: 'conversation_manage_panel.tasks',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'files',
    icon: UploadIconComponent,
    title: 'conversation_manage_panel.file_vault',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return filesInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'client_chat',
    className: 'client',
    icon: MessageIconComponent,
    title: 'conversation_manage_panel.client_chat',
    description: 'conversation_manage_panel.talk',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'summary',
    icon: ActivityIconComponent,
    title: 'conversation_manage_panel.summary',
    description: 'conversation_manage_panel.summary-description',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return summaryInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
];

export const communitiesMobileMenuItems: ConversationManageMenuItem[] = [
  {
    id: 'subgroups',
    icon: IconHashComponent,
    title: 'conversation_manage_panel.subgroups',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'events',
    icon: IconEventsComponent,
    title: 'conversation_manage_panel.events',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'files',
    icon: UploadIconComponent,
    title: 'conversation_manage_panel.file_vault',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return filesInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'client_chat',
    className: 'client',
    icon: MessageIconComponent,
    title: 'conversation_manage_panel.client_chat',
    description: 'conversation_manage_panel.talk',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'public_boards',
    icon: IconClipboardComponent,
    title: 'conversation_manage_panel.public_boards',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
];

export const communitiesDesktopMenuItems: ConversationManageMenuItem[] = [
  {
    id: 'subgroups',
    icon: IconHashComponent,
    title: 'conversation_manage_panel.subgroups',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'events',
    icon: IconEventsComponent,
    title: 'conversation_manage_panel.events',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'files',
    icon: UploadIconComponent,
    title: 'conversation_manage_panel.file_vault',
    selected: false,
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    get inputs() {
      return filesInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
  {
    id: 'public_boards',
    icon: IconClipboardComponent,
    title: 'conversation_manage_panel.public_boards',
    iconColors: {
      activeColor: '#1E1E1E',
      inActiveColor: '#757575',
    },
    selected: false,
    get inputs() {
      return defaultsInput(
        this.selected,
        this.iconColors.activeColor,
        this.iconColors.inActiveColor,
      );
    },
  },
];

function defaultsInput(
  selected: boolean,
  activeColor = '#1E1E1E',
  inActiveColor = '#757575',
) {
  return { color: selected ? activeColor : inActiveColor, strokeWidth: 2.5 };
}

function summaryInput(
  selected: boolean,
  activeColor = '#1E1E1E',
  inActiveColor = '#757575',
) {
  return { color: selected ? activeColor : inActiveColor, strokeWidth: 0.75 };
}

function filesInput(
  selected: boolean,
  activeColor = '#1E1E1E',
  inActiveColor = '#757575',
) {
  return { color: selected ? activeColor : inActiveColor, strokeWidth: 1.75 };
}

function robotInput(
  selected: boolean,
  activeColor = '#1E1E1E',
  inActiveColor = '#757575',
) {
  return { fill: selected ? activeColor : inActiveColor };
}
