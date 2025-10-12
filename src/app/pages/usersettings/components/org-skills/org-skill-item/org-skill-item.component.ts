import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Skill } from 'src/app/shared/models/skill.model';
import { UserSkill } from 'src/app/shared/models/UserSkill.model';
import { DeleteIconComponent } from 'src/app/shared/icons/delete-icon/delete-icon.component';
import { takeUntil } from 'rxjs';
import { IAction, ISkill, ISkillLevel } from '../../../interfaces';

@Component({
  selector: 'app-org-skill-item',
  templateUrl: './org-skill-item.component.html',
  styleUrls: ['./org-skill-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgSkillItemComponent extends BaseComponent implements OnInit {
  allSkills = input<Skill[]>();
  userSkill = input<UserSkill>();
  disabled = input<boolean>();

  skills = computed(() => {
    if (this.allSkills() && this.userSkill() && !this.isAddMode()) {
      return [...this.allSkills(), this.userSkill()];
    } else {
      return this.allSkills();
    }
  });

  skillAdd = output<ISkill>();
  skillUpdate = output<ISkill>();
  skillDelete = output<number>();

  form: FormGroup;
  isSaveModeActive = signal(false);

  skillLevelsStringsList: ISkillLevel[] = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Intermediate' },
    { id: 3, name: 'Professional' },
    { id: 4, name: 'Expert' },
  ];

  actionList: IAction[] = [
    {
      title: 'delete',
      icon: DeleteIconComponent,
      event: () => this.onDelete(),
    },
  ];

  constructor(private cdRef: ChangeDetectorRef) {
    super();

    this.form = new FormGroup({
      skill: new FormControl('', Validators.required),
      level: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.userSkill()) {
      this.initializeForm();
      this.subscribeToFormChanges();
    }
  }

  private initializeForm(): void {
    this.form.patchValue({
      skill: this.userSkill().id,
      level: this.userSkill().level,
    });

    this.cdRef.detectChanges();
  }

  private subscribeToFormChanges(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroyed)).subscribe((res) => {
      this.isSaveModeActive.set(
        res.level !== this.userSkill().level ||
          res.skill !== this.userSkill().id,
      );
    });
  }

  onSave(): void {
    if (!this.form.invalid) {
      this.skillAdd.emit(this.form.value);
      this.form.reset();
    }
  }

  onDelete(): void {
    this.skillDelete.emit(this.userSkill().id);
  }

  onEdit(): void {
    this.skillUpdate.emit(this.form.value);
    this.isSaveModeActive.set(false);
  }

  isAddMode(): boolean {
    return !this.userSkill();
  }
}
