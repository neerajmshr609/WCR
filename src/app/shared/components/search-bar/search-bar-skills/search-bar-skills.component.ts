import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Skill } from 'src/app/shared/models/skill.model';
import { SearchService } from 'src/app/services/search.service';
import { AdminService } from 'src/app/pages/admin/admin.service';
import { SkillsService } from '../../../../services/skill/skills.service';

@Component({
  selector: 'app-search-bar-skills',
  templateUrl: './search-bar-skills.component.html',
  styleUrls: ['./search-bar-skills.component.scss'],
})
export class SearchBarSkillsComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @ViewChild('autocomplete') autocomplete: ElementRef;

  mySkillsControl = new UntypedFormControl();
  loadedSkills: Skill[] = [];
  loadedFilteredSkills: Skill[] = [];
  filteredSkills$: Observable<string[]>;
  selectedSkills: Skill[];

  isFilteredByOnline$ = this.searchService.selectedOnline$.asObservable();

  constructor(
    private skillService: SkillsService,
    private searchService: SearchService,
  ) {
    super();
  }

  ngOnInit(): void {
    combineLatest([
      this.skillService.skills$,
      this.searchService.selectedSkills$,
    ])
      .pipe(
        tap(([fetchedSkills, selectedSkill]: [Skill[], Skill[]]) => {
          this.loadedSkills = fetchedSkills;
          this.loadedFilteredSkills = this.loadedSkills;
          this.selectedSkills = selectedSkill;
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();

    this.filteredSkills$ = this.mySkillsControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );

    this.searchService.selectedSkills$
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => (this.selectedSkills = res)),
      )
      .subscribe();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.selectedSkills = [];
    // this.updateSkills();
    // this.filteredByOnline = false;
    this.searchService.selectedOnline$.next(false);
  }

  updateSkills() {
    this.searchService.selectedSkills$.next(this.selectedSkills);
  }

  didSelectSkill(skillName: string) {
    this.autocomplete.nativeElement.blur();
    const skill = this.loadedSkills.find((obj) => obj.name === skillName);
    this.didToggleSkill(skill);
    this.updateSkills();
  }

  didToggleSkill(skill: Skill) {
    if (this.selectedSkills.find((obj) => obj.id === skill.id)) {
      this.selectedSkills = this.selectedSkills.filter(
        (obj) => obj.id !== skill.id,
      );
    } else {
      this.selectedSkills.push(skill);
    }

    this.mySkillsControl.setValue('');
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    if (!this.loadedSkills) {
      return [];
    }

    const skillNames = this.loadedSkills
      .map((obj) => obj.name)
      .filter((skill) => this._normalizeValue(skill).includes(filterValue));
    this.loadedFilteredSkills = this.loadedSkills.filter((obj) =>
      skillNames.includes(obj.name),
    );

    return skillNames;
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  didCancelFilter() {
    this.mySkillsControl.setValue('');
  }

  filterByOnline(): void {
    const isFilteredByOnline = !this.searchService.selectedOnline$.value;
    this.searchService.selectedOnline$.next(isFilteredByOnline);
  }
}
