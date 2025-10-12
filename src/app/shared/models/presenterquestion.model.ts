import { Project } from './project.model';

export class Presenterquestion {
  constructor(
    public id?: number,
    public project_id?: number,
    public title?: string,
    public project?: Project,
    public _destroy?: boolean,
  ) {}
}
