import { Project } from './project.model';
import { Myadviser } from './Myadviser.model';

export class Projectadvisor {
  constructor(
    public adviser_user_id?: number,
    public project_id?: number,
    public myadviser_id?: number,
    public project?: Project,
    public myadviser?: Myadviser,
    public id?: number,
  ) {}
}
