import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Skill } from 'src/app/shared/models/skill.model';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-results-skills',
  templateUrl: './search-results-skills.component.html',
  styleUrls: ['./search-results-skills.component.scss'],
})
export class SearchResultsSkillsComponent
  extends BaseComponent
  implements OnInit
{
  @Input() public skills: Skill[];

  constructor(private searchService: SearchService) {
    super();
  }

  ngOnInit(): void {}

  public didDeselectSkill(skill: Skill): void {
    this.searchService.selectedSkills$.next(
      this.skills.filter((obj) => obj.id !== skill.id),
    );
  }
}
