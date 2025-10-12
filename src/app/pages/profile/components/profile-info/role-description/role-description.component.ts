import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfileService } from '../../../services/profile.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-role-description',
  templateUrl: './role-description.component.html',
  styleUrls: ['./role-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDescriptionComponent implements OnInit {
  readonly orgMember = toSignal(this._profileService.userProfileOrgMember$);

  readonly jobTitle = computed(() => this.orgMember()?.job_title);
  readonly hasJobTitle = computed(() => !!this.jobTitle());

  readonly jobDescription = computed(() => this.orgMember()?.job_description);
  readonly hasRoleDescription = computed(() => !!this.jobDescription());

  readonly isProfileOwner = toSignal(this._profileService.isProfileOwner$);

  readonly titleMode = signal<'read' | 'edit'>('read');
  readonly isTitleEditMode = computed(() => this.titleMode() === 'edit');
  readonly isTitleReadMode = computed(() => this.titleMode() === 'read');

  readonly titleControl = new FormControl<string>('');

  private readonly _currentTitleValue = toSignal(
    this.titleControl.valueChanges,
  );
  readonly titleValueChanged = computed(
    () => this._currentTitleValue() !== this.jobTitle(),
  );

  readonly descriptionMode = signal<'read' | 'edit'>('read');
  readonly isDescriptionEditMode = computed(
    () => this.descriptionMode() === 'edit',
  );
  readonly isDescriptionReadMode = computed(
    () => this.descriptionMode() === 'read',
  );

  readonly descriptionControl = new FormControl<string>('');

  private readonly _currentDescriptionValue = toSignal(
    this.descriptionControl.valueChanges,
  );
  readonly descriptionValueChanged = computed(
    () => this._currentDescriptionValue() !== this.jobDescription(),
  );
  readonly validationErrors = toSignal(
    this.descriptionControl.valueChanges.pipe(
      map(() => Object.values(this.descriptionControl.errors || {})),
    ),
  );
  readonly isDescriptionInvalid = computed(
    () => !!this.validationErrors()?.length,
  );

  readonly DESCRIPTION_VALIDATORS = {
    maxSigns: {
      errorDescription: {
        message: 'role-description.max-signs-error',
        data: { maxSigns: 500 },
      },
      validatorFn: (control: FormControl<string>) => {
        const { errorDescription } = this.DESCRIPTION_VALIDATORS.maxSigns;
        const maxLength = errorDescription.data.maxSigns;
        return (control.value?.length || 0) <= maxLength
          ? null
          : { errorMaxSigns: errorDescription };
      },
    },
  } as const;

  private get _validators() {
    return Object.values(this.DESCRIPTION_VALIDATORS).map(
      (_) => _.validatorFn,
    ) as ValidatorFn[];
  }

  constructor(private readonly _profileService: ProfileService) {
    effect(
      () => {
        const title = this.jobTitle() || '';
        this.titleControl.setValue(title);
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        if (!this.hasJobTitle() && this.isProfileOwner()) {
          this.switchTitleToEditMode();
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const descriptionText = this.jobDescription() || '';
        this.descriptionControl.setValue(descriptionText);
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        if (!this.hasRoleDescription() && this.isProfileOwner()) {
          this.switchToDescriptionEditMode();
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.descriptionControl.setValidators(this._validators);
  }

  switchTitleToEditMode() {
    this.titleMode.set('edit');
  }

  switchToDescriptionEditMode() {
    this.descriptionMode.set('edit');
  }

  saveTitle(): void {
    if (this.titleValueChanged()) {
      this._profileService
        .updateJobTitleDescription({ job_title: this.titleControl.value })
        .subscribe(() => this._switchTitleToReadMode());
    } else {
      this._switchTitleToReadMode();
    }
  }

  saveDescription(): void {
    if (this.descriptionValueChanged()) {
      this._profileService
        .updateJobTitleDescription({
          job_description: this.descriptionControl.value,
        })
        .subscribe(() => this._switchDescriptionToReadMode());
    } else {
      this._switchDescriptionToReadMode();
    }
  }

  private _switchTitleToReadMode() {
    this.titleMode.set('read');
  }

  private _switchDescriptionToReadMode(): void {
    this.descriptionMode.set('read');
  }
}
