import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ISkillTranslation,
  Skill,
  Tag,
} from 'src/app/shared/models/skill.model';
import { AdminService } from '../../../admin.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  LANGUAGES_CODE,
  LANGUAGES_TITLES,
} from '../../../../../shared/app-language/data';
import { MatTabGroup } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { uniqueLocaleValidator } from './unique-locale.validator';

@Component({
  selector: 'app-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.scss'],
  providers: [UploaderService],
})
export class SkillItemComponent extends BaseComponent implements OnDestroy {
  @ViewChild('skillImage', { static: false }) skillImage: ElementRef;
  @ViewChild('skillCard', { static: false }) skillCard: MatTabGroup;
  @ViewChild('confirmationDialog') confirmationDialog: TemplateRef<{
    title: string;
    message: string;
  }>;

  @Output() skillCreated = new EventEmitter<void>();
  @Output() skillDeleted = new EventEmitter<{ id: number; showMsg: boolean }>();

  @Input() skillID: number;
  @Input() skill: Skill;
  readonly LANGUAGES = LANGUAGES_CODE;

  languageOptions = signal(this.getLanguageOptions());
  selectedIndex = signal(0);

  skillForm = signal(this.createFormGroup());

  constructor(
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private uploaderService: UploaderService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    super();

    this.uploaderService.uploaderConfig = {
      id: 'uploader--skill-image',
      target: 'uploader--skill-image',
      inline: false,
    };

    effect(() => {
      this.initForm(this.skill);
    });
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      link: [null],
      icon: [null],
      translations_attributes: this.fb.array<ISkillTranslation[]>(
        [],
        [uniqueLocaleValidator],
      ),
    });
  }

  openUploader(): void {
    this.uploaderService.openModal();
    this.uploaderService.meta = { folder: `skills` };
    this.uploaderService.options = {
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif'],
      },
    };

    this.uploaderService.uploadFinished
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        const uploadURL = decodeURIComponent(res.successful[0].uploadURL);
        this.skillForm().patchValue({ icon: uploadURL });
        this.skill.icon = uploadURL;

        this.uploaderService.closeModal();
      });
  }

  onSave() {
    const newSkill = this.buildSkill();

    if (this.skill && this.skill?.id) {
      this.adminService
        .updateSkill(newSkill)
        .pipe(
          switchMap((res) => {
            const tagsToUpdate = this.getUpdatedTags();
            this.skill = res;
            return tagsToUpdate.length
              ? this.adminService.bulkUpdateArtcategories(tagsToUpdate)
              : of(null);
          }),
        )
        .subscribe(() => {
          this.snackBar.open('Saved!', null, { duration: 1000 });
          this.skillCreated.emit();
        });
    } else {
      this.adminService
        .createSkill(newSkill)
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          this.skill = new Skill();
          this.skillCreated.emit();
          this.skillForm().reset();
          this.snackBar.open('Created!', null, { duration: 1000 });
        });
    }
  }

  getUpdatedTags() {
    const res = [];
    this.skill.artcategory_skills_attributes?.forEach((attr) => {
      if (attr._destroy) {
        const attrExistsInSkills = this.attributeExistsInSkill(attr);
        if (!attrExistsInSkills) {
          res.push({
            id: attr.artcategory_id,
            bound_to_skill: false,
            is_active: false,
          });
        }
      } else {
        const artcategories = this.adminService.artCategories$.value;
        const artcategory = artcategories.find(
          (cat) => cat.id === attr.artcategory_id,
        );
        if (!artcategory.bound_to_skill) {
          res.push({
            id: attr.artcategory_id,
            bound_to_skill: true,
            is_active: false,
          });
        }
      }
    });
    return res;
  }

  attributeExistsInSkill(attribute: Tag) {
    const skills = this.adminService.skills$.value;
    const res = skills.find((skill) => {
      return skill.artcategory_skills.find(
        (artcategory) =>
          artcategory.artcategory_id === attribute.artcategory_id,
      );
    });
    return res && res.id !== this.skill.id;
  }

  updateTags(tags: Tag[]) {
    const newTags = [...this.skill.artcategory_skills];
    tags.forEach((tag) => {
      const index = this.skill.artcategory_skills.findIndex(
        (c) => c.artcategory_id === tag.artcategory_id,
      );
      if (index === -1) {
        // if it is a newly added tag
        newTags.push(tag);
      }
    });

    this.skill.artcategory_skills.forEach((artcategory) => {
      const existing = tags.find(
        (tag) => tag.artcategory_id === artcategory.artcategory_id,
      );
      const index = newTags.findIndex(
        (tag) => tag.artcategory_id === artcategory.artcategory_id,
      );
      newTags[index]._destroy = existing ? 0 : 1;
    });

    this.skill.artcategory_skills_attributes = newTags.map((tag) => ({
      ...tag,
      skill_id: this.skill.id,
    }));
  }

  onDelete(skill: Skill, showMsg: boolean = true) {
    this.skillDeleted.emit({ id: skill.id, showMsg });
  }

  private initForm(skill: Skill) {
    this.skillForm().patchValue({
      name: skill?.name || null,
      shortname: skill?.shortname || null,
      link: skill?.link || null,
      icon: skill?.icon || null,
    });
    this.initFormArray(skill?.translations_attributes);
  }

  private initFormArray(translations_attributes: ISkillTranslation[]) {
    const formArray = this.skillForm().get(
      'translations_attributes',
    ) as FormArray;
    formArray.clear();

    if (translations_attributes && translations_attributes.length > 0) {
      translations_attributes.forEach((translationItem) => {
        formArray.push(
          this.fb.group({
            id: translationItem.id,
            locale: [translationItem.locale, [Validators.required]],
            name: [translationItem.name, [Validators.required]],
            shortname: [translationItem.shortname, Validators.required],
          }),
        );
      });
    } else {
      const newGroup = this.fb.group({
        locale: [LANGUAGES_CODE.ENGLISH, [Validators.required]],
        name: [null, [Validators.required]],
        shortname: [null, Validators.required],
      });
      formArray.push(newGroup);
    }
    formArray.setValidators([uniqueLocaleValidator]);
  }

  private getLanguageOptions() {
    return Object.entries(LANGUAGES_TITLES)
      .filter(([key]) => key !== LANGUAGES_CODE.ENGLISH)
      .map(([key, viewValue]) => ({
        value: key as (typeof LANGUAGES_CODE)[keyof typeof LANGUAGES_CODE],
        viewValue,
      }));
  }

  addTranslation() {
    const formArray = this.skillForm().get(
      'translations_attributes',
    ) as FormArray;
    formArray.push(
      this.fb.group({
        locale: [null, [Validators.required]],
        name: [null, [Validators.required]],
        shortname: [null, Validators.required],
      }),
    );

    this.skillCard?.focusTab(formArray.length - 1);
    this.selectedIndex.set(formArray.length - 1);
  }

  deleteTranslation(
    locale: (typeof LANGUAGES_CODE)[keyof typeof LANGUAGES_CODE],
  ) {
    const newSkill = this.buildSkill();

    const deleteTranslationIndex = newSkill.translations_attributes.findIndex(
      (translation) => translation.locale === locale,
    );
    if (deleteTranslationIndex !== -1) {
      newSkill.translations_attributes[deleteTranslationIndex]._destroy = true;
    }

    this.adminService
      .updateSkill(newSkill)
      .pipe(
        switchMap((res) => {
          const tagsToUpdate = this.getUpdatedTags();
          this.skill = res;
          this.initForm(res);
          return tagsToUpdate.length
            ? this.adminService.bulkUpdateArtcategories(tagsToUpdate)
            : of(null);
        }),
      )
      .subscribe(() => {
        this.snackBar.open('Saved!', null, { duration: 1000 });
      });
  }

  private buildSkill(): Skill {
    const { artcategory_skills, id } = { ...this.skill };

    return {
      id,
      artcategory_skills,
      name: this.skillForm().value.translations_attributes[0].name,
      shortname: this.skillForm().value.translations_attributes[0].shortname,
      icon: this.skillForm().value.icon,
      link: this.skillForm().value.link,
      translations_attributes: this.skillForm().value.translations_attributes,
    };
  }

  confirmDelete(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(this.confirmationDialog, {
      data: { title, message },
    });
    return dialogRef.afterClosed();
  }

  onDeleteSkill(skill: Skill) {
    this.confirmDelete(
      'Delete Skill',
      'Are you sure you want to delete this skill?',
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.onDelete(skill);
      }
    });
  }

  onDeleteTranslation(
    locale: (typeof LANGUAGES_CODE)[keyof typeof LANGUAGES_CODE],
  ) {
    const translationName = this.languageOptions().find(
      (el) => el.value === locale,
    )?.viewValue;
    this.confirmDelete(
      `Delete ${translationName} translation?`,
      'Are you sure you want to delete this translation?',
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.deleteTranslation(locale);
      }
    });
  }

  ngOnDestroy(): void {
    this.uploaderService.destroy();
    super.ngOnDestroy();
  }

  getTabLabel(
    locale: (typeof LANGUAGES_CODE)[keyof typeof LANGUAGES_CODE],
  ): string {
    if (
      !locale &&
      !this.skill?.id &&
      this.skillForm().value.translations_attributes.length < 2
    ) {
      return LANGUAGES_TITLES.en;
    }
    return LANGUAGES_TITLES[locale];
  }

  get translations_attributes() {
    return this.skillForm().get('translations_attributes') as FormArray;
  }

  get linkControl(): FormControl {
    return this.skillForm().get('link') as FormControl;
  }
}
