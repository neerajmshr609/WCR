import { Component, Input, OnInit } from '@angular/core';
import { ProjectInfoCardTypeEnum } from '../../enums';
import { Project } from '../../models/project.model';
import { ProjectInfoCard } from '../../models/ProjectInfoCard.model';

@Component({
  selector: 'app-project-info-cards',
  templateUrl: './project-info-cards.component.html',
  styleUrls: ['./project-info-cards.component.scss'],
})
export class ProjectInfoCardsComponent implements OnInit {
  @Input() public isSmall: boolean;
  @Input() private project: Project;

  public projectCards: ProjectInfoCard[];
  public skillCards: ProjectInfoCard[];

  constructor() {}

  ngOnInit(): void {
    this.projectCards = [
      new ProjectInfoCard(
        this.project.title || 'Untitled',
        'Title',
        ProjectInfoCardTypeEnum.title_card,
      ),
      new ProjectInfoCard(
        this.project.category_name,
        'Category',
        ProjectInfoCardTypeEnum.category_card,
      ),
      new ProjectInfoCard(
        this.project.purpose || 'Unspecified',
        'Project purpose',
        ProjectInfoCardTypeEnum.purpose_card,
      ),
      new ProjectInfoCard(
        this.project.description || 'No description',
        'Description',
        ProjectInfoCardTypeEnum.description_card,
      ),
      new ProjectInfoCard(
        null,
        'Desired feedback focus',
        ProjectInfoCardTypeEnum.feedback_focus_card,
        null,
        this.project.feedback_focus_area,
      ),
    ];

    this.skillCards = this.project.project_skills?.map((skill) => {
      return new ProjectInfoCard(
        skill.skill.name,
        null,
        ProjectInfoCardTypeEnum.skill_card,
        skill.skill.icon,
      );
    });
  }
}
