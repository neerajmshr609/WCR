import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Skill } from 'src/app/shared/models/skill.model';
import {
  REPRESENT_ORGANIZATION_AS,
  SHARING_ADVICE_AS,
  UserSkill,
} from 'src/app/shared/models/UserSkill.model';
import { DeleteIconComponent } from 'src/app/shared/icons/delete-icon/delete-icon.component';
import { takeUntil } from 'rxjs';
import { IAction, ISkill, ISkillLevel } from '../../../interfaces';
import { CookieService } from '../../../../../services/cookie.service';
import { MatDialog } from '@angular/material/dialog';
import { SharingAdviceGuideModalComponent } from '../../sharing-advice-guide-modal/sharing-advice-guide-modal.component';

function prepareOptions(values) {
  return values.map((value, i) => ({ id: i, name: value }));
}

@Component({
  selector: 'app-skillset-item',
  templateUrl: './skillset-item.component.html',
  styleUrls: ['./skillset-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsetItemComponent extends BaseComponent implements OnInit {
  allSkills = input<Skill[]>();
  userSkill = input<UserSkill>();
  organisations = model<{ name: string }[]>([]);
  disabled = input<boolean>();
  representOrganisationOptions = signal(
    prepareOptions(Object.values(REPRESENT_ORGANIZATION_AS)),
  );
  adviceOptions = signal(prepareOptions(Object.values(SHARING_ADVICE_AS)));
  skills = computed(() => {
    if (this.allSkills() && this.userSkill() && !this.isAddMode()) {
      return [...this.allSkills(), this.userSkill().skill];
    } else {
      return this.allSkills();
    }
  });
  skillName = computed(() => this.userSkill()?.skill.name);

  skillAdd = output<ISkill>();
  skillUpdate = output<{ skill: UserSkill; id: number }>();
  // skillUpdate = output<ISkill>();
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

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private cookieService: CookieService,
  ) {
    super();
    this.form = new FormGroup({
      level: new FormControl('', Validators.required),
      organization_name: new FormControl(null),
      represent_organization_as: new FormControl(null, [Validators.required]),
      sharing_advice_as: new FormControl(null, [Validators.required]),
      rate: new FormControl(null),
    });
  }

  ngOnInit(): void {
    if (this.userSkill()) {
      this.initializeForm();
      this.subscribeToFormChanges();
      if (this.userSkill().organization_name) {
        this.organisations.set(
          this.organisations().concat({
            name: this.userSkill().organization_name,
          }),
        );
      }
      this.listenSharingAdviceAs();
    }
  }

  private initializeForm(): void {
    this.form.patchValue({
      level: this.userSkill().level,
      organization_name: this.userSkill().organization_name,
      represent_organization_as: this.representOrganisationOptions().find(
        (v) => v.name === this.userSkill().represent_organization_as,
      )?.id,
      sharing_advice_as: this.adviceOptions().find(
        (v) => v.name === this.userSkill().sharing_advice_as,
      )?.id,
      // TODO implement later
      // rate: this.userSkill().rate,
    });
    this.form.get('organization_name').disable();
    this.cdRef.detectChanges();
  }

  private subscribeToFormChanges(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroyed)).subscribe((res) => {
      this.isSaveModeActive.set(true);
    });
  }

  private listenSharingAdviceAs(): void {
    this.form
      .get('sharing_advice_as')
      .valueChanges.pipe(takeUntil(this.destroyed))
      .subscribe((value) => {
        const isAllowed = JSON.parse(
          this.cookieService.getFromCookies(`sharing_advice_as_${value}`),
        );
        if (!isAllowed) {
          const dialogRef = this.dialog.open(SharingAdviceGuideModalComponent, {
            width: '350px',
            maxHeight: '625px',
            height: '100%',
            data: {
              type: this.adviceOptions().find((v) => v.id === value)?.name,
            },
            autoFocus: false,
            panelClass: 'wcr-modal',
          });
          dialogRef.afterClosed().subscribe((res) => {
            this.cookieService.setInCookie(
              `sharing_advice_as_${value}`,
              res ? 'true' : 'false',
            );
          });
        }
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
    if (this.form.invalid) {
      this.form.markAsDirty();
      this.form.markAllAsTouched();
      return;
    }
    this.skillUpdate.emit({ skill: this.form.value, id: this.userSkill().id });
    this.isSaveModeActive.set(false);
  }

  isAddMode(): boolean {
    return !this.userSkill();
  }
}
