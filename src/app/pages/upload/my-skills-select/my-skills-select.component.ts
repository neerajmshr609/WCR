import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, signal,
  ViewChild,
} from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { UntypedFormControl } from '@angular/forms';
import { startWith, tap } from 'rxjs/operators';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectSkill } from 'src/app/shared/models/ProjectSkill.model';
import { Skill } from 'src/app/shared/models/skill.model';
import { MatDialog } from '@angular/material/dialog';
import { CantFindSkillDialogComponent } from './components/cant-find-skill-dialog/cant-find-skill-dialog.component';

@Component({
  selector: 'app-my-skills-select',
  templateUrl: './my-skills-select.component.html',
  styleUrls: ['./my-skills-select.component.scss'],
})
export class MySkillsSelectComponent implements OnInit {
  @ViewChild('autocomplete') private readonly autocomplete: ElementRef;

  // @Output() selectedSkillsChanged = new EventEmitter<ProjectSkill[]>();
  // I'm not sure, but it seems that here was mistaken type, because  ProjectSkill is container for Skill
  @Output() selectedSkillsChanged = new EventEmitter<Skill[]>();
  @Input() project: Project;
  @Input() inDiscoverySearchMode: boolean;
  @Input() isSingleSelect = false;

  readonly isLoading = signal(true);
  loadedSkills: Skill[];
  selectedSkills: Skill[];

  mySkillsControl = new UntypedFormControl();
  loadedFilteredSkills: Skill[] = [];

  typeHeadSkillFiltered: Skill[] = [];
  currentProjectSkillsIDs: number[] = [];

  tags: Artcategory[];
  selectedTag: number;

  public skillsCount = 0;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.selectedSkills = [];

    if (this.project?.project_skills) {
      this.currentProjectSkillsIDs = this.project.project_skills.map(
        (obj) => obj.skill_id,
      );
    }

    this.adminService.fetchSkillData().subscribe(() => {
      this.loadedSkills = this.adminService.skills$.value;
      this.loadedSkills.sort((a, b) => b.advisors_count - a.advisors_count);
      this.selectedSkills = this.loadedSkills.filter((obj) =>
        this.currentProjectSkillsIDs.includes(obj.id),
      );
      this.filterSkills();
      this.isLoading.set(false);
    });

    this.mySkillsControl.valueChanges
      .pipe(
        startWith(''),
        tap(() => this.filterSkills()),
      )
      .subscribe();

    this.adminService.fetchFlatArtcategories('is_active').subscribe(() => {
      this.tags = this.adminService.artCategories$.value.sort(
        (a, b) => a.order - b.order,
      );
    });
  }

  selectTag(id: number) {
    this.selectedTag = this.selectedTag === id ? null : id;
    this.filterSkills();
  }

  didToggleSkill(skill: Skill) {
    this.autocomplete.nativeElement.blur();
    if (this.isSingleSelect) {
      this.selectedSkills = [skill];
    } else {
      if (this.selectedSkills.find((obj) => obj.id === skill.id)) {
        this.selectedSkills = this.selectedSkills.filter(
          (obj) => obj.id !== skill.id,
        );
      } else {
        this.selectedSkills.push(skill);
      }
    }
    this.filterSkills();
    this.selectedSkillsChanged.emit(this.selectedSkills);
  }

  filterSkills() {
    if (!this.loadedSkills) {
      return;
    }

    this.loadedFilteredSkills = this.loadedSkills.sort((a, b) => {
      if (this.selectedSkills.includes(a) && !this.selectedSkills.includes(b)) {
        return -1;
      }
      if (!this.selectedSkills.includes(a) && this.selectedSkills.includes(b)) {
        return 1;
      }
      if (
        !this.selectedSkills.includes(a) &&
        !this.selectedSkills.includes(b)
      ) {
        return a.advisors_count > b.advisors_count ? -1 : 1;
      }
    });

    if (this.selectedTag) {
      this.loadedFilteredSkills = this.loadedFilteredSkills.filter((s) => {
        return (
          s.artcategory_skills.find(
            (tag) => tag.artcategory_id === this.selectedTag,
          ) || this.selectedSkills.includes(s)
        );
      });
    }

    if (this.mySkillsControl.value) {
      const filterValue = this._normalizeValue(this.mySkillsControl.value);
      this.loadedFilteredSkills = this.loadedFilteredSkills.filter((s) => {
        return (
          this._normalizeValue(s.name).includes(filterValue) ||
          this.selectedSkills.includes(s)
        );
      });
      this.typeHeadSkillFiltered = this.loadedFilteredSkills;
    } else {
      this.typeHeadSkillFiltered = [];
    }

    this.skillsCount = this.loadedFilteredSkills.length;
  }

  didCancelFilter() {
    this.mySkillsControl.setValue('');
  }

  cantFindSkillPopup(): void {
    this.dialog.open(CantFindSkillDialogComponent);
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
