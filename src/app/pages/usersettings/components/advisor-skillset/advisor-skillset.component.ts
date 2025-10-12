import {
  ChangeDetectorRef,
  Component,
  input,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  OnChanges,
  DestroyRef,
  inject,
  model,
  effect,
} from '@angular/core';
import { AdminService } from '../../../admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { User } from 'src/app/shared/models/user.model';
import { FormControl } from '@angular/forms';
import { UserSkill } from 'src/app/shared/models/UserSkill.model';
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
} from '@angular/material/core';
import { SkillsService } from '../../../../services/skill/skills.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Skill,
  skillFactory,
} from '../../../../services/skill/model/skill.model';
import { ArtCategory } from '../../../../services/artcategory/model/artcategory.model';

const rippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 300,
    exitDuration: 0,
  },
};

@Component({
  selector: 'app-advisor-skillset',
  templateUrl: './advisor-skillset.component.html',
  styleUrls: ['./advisor-skillset.component.scss'],
  providers: [{ provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: rippleConfig }],
})
export class AdvisorSkillsetComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges
{
  user = input<User>();
  allSkills: Skill[] = [];
  userSkills = signal<UserSkill[]>([]);
  isLoading = true;
  tags: ArtCategory[];
  selectedTag: number;
  filteredSkills: Skill[] = [];
  mySkillsControl = new FormControl(null, []);
  typeHeadSkillFiltered: Skill[] = [];
  public organisations = signal<unknown[]>([]);

  readonly selectedSkills = model<Skill[]>();

  private destroyRef = inject(DestroyRef);

  constructor(
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private skillsService: SkillsService,
    private skillService: SkillsService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();

    effect(() => {
      const skills = this.userSkills();
      this.filteredSkills = this.filteredSkills
        .filter(
          (skill) =>
            !skills.some((userSkill) => userSkill.skill.id === skill.id),
        )
        .map((skill) => skillFactory(skill));
    });
  }

  ngOnInit(): void {
    this.getAllSkills();

    this.adminService.fetchFlatArtcategories('is_active').subscribe(() => {
      this.tags = this.adminService.artCategories$.value
        .sort((a, b) => a.order - b.order)
        .filter((tag) => tag.id && tag.name) as ArtCategory[];
    });

    this.mySkillsControl.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        if (res) {
          const filterValue = this._normalizeValue(res);
          this.filteredSkills = [
            ...this.allSkills.filter((s) => {
              return this._normalizeValue(s.name).includes(filterValue);
            }),
          ];

          this.typeHeadSkillFiltered = this.filteredSkills;
        } else {
          this.typeHeadSkillFiltered = [];
          this.filterSkills();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user?.currentValue) {
      this.getUserSkills();
    }
  }

  addNewSkill(id: number, level: number): void {
    const newSkill: UserSkill = {
      user_id: this.user().id,
      skill_id: id,
      level,
      rate: this.user().advisorrate || 45,
    } as UserSkill;

    this.onUserSkillCreate(newSkill);
  }

  onUserSkillCreate(userSkill: UserSkill): void {
    this.skillService
      .createUserSkill(
        userSkill.user_id,
        userSkill.skill_id,
        userSkill.level,
        userSkill.rate,
      )
      .subscribe((result) => {
        this.filteredSkills = [
          ...this.filteredSkills.filter((f) => f.id !== result.skill.id),
        ];
        this.userSkills.set([...this.userSkills(), result]);
        this.user().user_skills = this.userSkills();
      });
  }

  getUserSkills(): void {
    this.skillsService.fetchUserSkills(this.user().id).subscribe((res) => {
      this.userSkills.set(res.sort((a, b) => a.order - b.order));
      this.filterSkills();
    });
  }

  getAllSkills(): void {
    this.skillsService.skills$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((skills) => {
        this.allSkills = skills;
        this.filterSkills();
      });
  }

  showPopup() {
    this.snackBar.open('Saved!', null, {
      duration: 1000,
    });
  }

  onUserSkillDelete(skillID: number) {
    const removedSkill = this.userSkills().find((obj) => {
      return obj.id === skillID;
    }).skill;
    this.filteredSkills = [...this.filteredSkills, removedSkill];
  }

  drop(event: CdkDragDrop<string[]>) {
    const oldSkills = [...this.userSkills()];
    moveItemInArray(this.userSkills(), event.previousIndex, event.currentIndex);
    const newSkills = this.userSkills().map((skill, index) => {
      return { ...skill, order: index };
    });

    const changedSkills = newSkills.filter((newSkill, index) => {
      return newSkill.id !== oldSkills[index].id;
    });

    this.userSkills.set(newSkills);

    // Отправляем только изменённые
    if (changedSkills.length > 0) {
      this.onUserSkillPositionUpdate(changedSkills);
    }
  }

  onUserSkillPositionUpdate(changedSkills: UserSkill[]) {
    this.skillService.updateUserSkillsOrder(changedSkills).subscribe(() => {
      this.showPopup();
    });
  }

  selectTag(id: number): void {
    this.selectedTag = this.selectedTag === id ? null : id;
    this.filterSkills();
  }

  filterSkills() {
    this.isLoading = false;

    if (!this.allSkills || !this.userSkills()) return;

    const selectedSkills = this.userSkills().map(
      (userSkill) => userSkill.skill.id,
    );

    this.filteredSkills = [
      ...this.allSkills.filter((skill) => {
        const notSelected = !selectedSkills.includes(skill.id);
        let hasTag = true;

        if (this.selectedTag) {
          hasTag = !!skill.artcategory_skills.find(
            (tag) => tag.artcategory_id === this.selectedTag,
          );
        }

        return notSelected && hasTag;
      }),
    ];

    this.cdRef.detectChanges();
  }

  didCancelFilter() {
    this.mySkillsControl.setValue('');
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  addedSkill(skill: Skill) {
    this.addNewSkill(skill.id, 1);
  }
}
