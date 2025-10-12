/// <reference lib="webworker" />

import { SortDialogData } from './sort-dialog-data';
import { Conversation } from '../../shared/models/conversation.model';
import { Lesson } from '../../shared/models/lesson.model';
import { DialogData } from './dialog-data';

addEventListener(
  'message',
  (
    data: MessageEvent<{
      conversation: Conversation;
      iceBreakerLessonForFeedback: Lesson;
    }>,
  ) => {
    const { conversation, iceBreakerLessonForFeedback } = data.data;
    const response: DialogData[] = SortDialogData(
      conversation,
      iceBreakerLessonForFeedback,
    );
    postMessage(response);
  },
);
