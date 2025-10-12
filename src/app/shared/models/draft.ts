import { Avfeedbacklane } from './avfeedbacklane.model';
import { Feedback } from './feedback.model';

export interface Draft {
  id?: number;
  project_id?: number;
  created_at?: string;
  updated_at?: string;
  resort?: number[];
  slidervalues?: SliderValue[];
  curves?: Avfeedbacklane[];
  feedbacks?: Feedback[];
  timer?: number;
}

export interface SliderValue {
  projectfile_id: number;
  slidervalue: number;
}
