import { Projectfile } from './projectfile.model';
import { User } from './user.model';
import { Invite } from './invite.model';
import { Projectquestionanswer } from './Projectquestionanswer.model';
import { Projectadvisor } from './Projectadvisor.model';
import { ProjectSkill } from './ProjectSkill.model';
import { Presenterquestion } from './presenterquestion.model';
import { Point } from '@angular/cdk/drag-drop';

export interface InspiringFeedback {
  count: number;
  paid: number;
}

export interface Project {
  id?: number;
  sharetoken?: string;

  user_id?: number;
  user?: User;

  title?: string;
  description?: string;
  purpose?: string;

  projectfiles?: Projectfile[];
  projectfiles_attributes?: Projectfile[];

  projectadvisors?: Projectadvisor[];
  paid_feedback_request?: boolean;
  invites?: Invite[];

  category_name?: string;
  category_id?: number;
  artcategory_id?: number;
  parentcategory_id?: number;
  relation_id?: number;
  insightscategory?: string;

  project_skills?: ProjectSkill[];

  total_score?: number;
  project_score?: number;

  presenterquestion?: string;
  presenterquestions?: Presenterquestion[];

  inspiringrate?: number;
  preview?: string;
  created_at?: string;

  inspiring_feedback?: InspiringFeedback;
  feedback_focus_area?: Point;

  choosethebest?: boolean;
  show_in_public_feed?: boolean;
  show_in_give_feedback?: boolean;
  private?: boolean;
  published?: boolean;

  // for admin
  review_count?: number;
  last_rate_time?: string;
}
