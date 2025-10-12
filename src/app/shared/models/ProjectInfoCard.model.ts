import { Point } from '@angular/cdk/drag-drop';
import { ProjectInfoCardTypeEnum } from '../enums';
export class ProjectInfoCard {
  constructor(
    public title: string,
    public topText: string,
    public cardType: ProjectInfoCardTypeEnum,
    public iconURL?: string,
    public feedbackFocus?: Point,
  ) {}
}
