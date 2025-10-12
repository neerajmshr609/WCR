import { Avfeedbacklane } from './avfeedbacklane.model';
export class Avtimelevel {
  constructor(
    public timeposition?: number,
    public level?: number,
    public id?: number,
    public order: number = 0,
    public avfeedbacklane_id?: number,
    public command?: 'start' | 'end',
    public local_avfeedbacklane?: Avfeedbacklane,
  ) {}
}
