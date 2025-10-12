import { Project } from './project.model';
import { User } from './user.model';

export class Myadviser {
  constructor(
    public user?: User,
    public myadviser_id?: number,
    public id?: number,
  ) {}
}
