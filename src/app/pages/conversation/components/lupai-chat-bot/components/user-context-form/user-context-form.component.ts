import {
  Component,
  OnInit,
  input,
  output,
  inject,
  effect,
} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '../../../../../../shared/UIkit/select/select.component';
import { UserContext } from '../../../../../../services/multi-agent-websocket.service';
import {
  slideInUpOnEnterAnimation,
  slideOutDownOnLeaveAnimation,
} from 'angular-animations';
import { TranslateModule } from '@ngx-translate/core';
import { SendIconComponent } from '@icons/send-icon/send-icon.component';
import { ButtonComponent } from '@ui-kit/button/button.component';

@Component({
  selector: 'app-user-context-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-context-form.component.html',
  styleUrls: ['./user-context-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    SelectComponent,
    TranslateModule,
    SendIconComponent,
    ButtonComponent,
  ],
  animations: [
    slideInUpOnEnterAnimation({ duration: 400 }),
    slideOutDownOnLeaveAnimation({ duration: 200 }),
  ],
})
export class UserContextFormComponent implements OnInit {
  // Inputs
  isVisible = input<boolean>(false);
  currentUserContext = input<UserContext>({
    origin_country: '',
    time_in_germany: '',
    age: '',
  });

  // Outputs
  userContextUpdated = output<UserContext>();
  locationUpdated = output<string>();
  formClosed = output<void>();
  formSubmitted = output<{ userContext: UserContext; question: string }>();

  // Injected services
  private fb = inject(FormBuilder);

  // Form
  contextForm: FormGroup;

  // Effect: currentUserContext değişince formu resetle
  private _resetFormOnInputChange = effect(() => {
    const context = this.currentUserContext();
    if (this.contextForm) {
      this.contextForm.reset({
        origin_country: context.origin_country,
        current_area_of_residence: '',
        time_in_germany: context.time_in_germany,
        age: context.age,
      });
    }
  });

  // Form options - using translation keys as labels
  countries: { value: string; label: string }[] = [
    { value: 'ukraine', label: 'user_context_form.countries.ukraine' },
    { value: 'syria', label: 'user_context_form.countries.syria' },
    { value: 'afghanistan', label: 'user_context_form.countries.afghanistan' },
    { value: 'turkey', label: 'user_context_form.countries.turkey' },
    { value: 'poland', label: 'user_context_form.countries.poland' },
    { value: 'romania', label: 'user_context_form.countries.romania' },
    { value: 'other', label: 'user_context_form.countries.other' },
  ];

  residenceAreas: { value: string; label: string }[] = [
    { value: 'Berlin', label: 'user_context_form.residence_areas.berlin' },
    // { value: 'Bavaria', label: 'user_context_form.residence_areas.bavaria' },
    // {
    //   value: 'Baden-Württemberg',
    //   label: 'user_context_form.residence_areas.baden_wuerttemberg',
    // },
    // {
    //   value: 'North Rhine-Westphalia',
    //   label: 'user_context_form.residence_areas.north_rhine_westphalia',
    // },
    // {
    //   value: 'Schleswig-Holstein',
    //   label: 'user_context_form.residence_areas.schleswig_holstein',
    // },
    // {
    //   value: 'Lower Saxony',
    //   label: 'user_context_form.residence_areas.lower_saxony',
    // },
    // {
    //   value: 'Mecklenburg-Western Pomerania',
    //   label: 'user_context_form.residence_areas.mecklenburg_western_pomerania',
    // },
    // { value: 'Saxony', label: 'user_context_form.residence_areas.saxony' },
    // { value: 'Hesse', label: 'user_context_form.residence_areas.hesse' },
    // {
    //   value: 'Rhineland-Palatinate',
    //   label: 'user_context_form.residence_areas.rhineland_palatinate',
    // },
    // {
    //   value: 'Brandenburg',
    //   label: 'user_context_form.residence_areas.brandenburg',
    // },
    // {
    //   value: 'Thuringia',
    //   label: 'user_context_form.residence_areas.thuringia',
    // },
    // { value: 'Hamburg', label: 'user_context_form.residence_areas.hamburg' },
    // {
    //   value: 'Saxony-Anhalt',
    //   label: 'user_context_form.residence_areas.saxony_anhalt',
    // },
    // { value: 'Bremen', label: 'user_context_form.residence_areas.bremen' },
    // { value: 'Saarland', label: 'user_context_form.residence_areas.saarland' },
    // { value: 'Other', label: 'user_context_form.residence_areas.other' },
  ];

  timeInGermanyOptions: { value: string; label: string }[] = [
    {
      value: 'not_living',
      label: 'user_context_form.time_in_germany.not_living',
    },
    { value: 'tourist', label: 'user_context_form.time_in_germany.tourist' },
    { value: '0-1 year', label: 'user_context_form.time_in_germany.0_1_year' },
    {
      value: '1-5 years',
      label: 'user_context_form.time_in_germany.1_5_years',
    },
    {
      value: '+5 years',
      label: 'user_context_form.time_in_germany.5_plus_years',
    },
  ];

  ageOptions: { value: string; label: string }[] = [
    { value: '18-25', label: 'user_context_form.age_options.18_25' },
    { value: '26-35', label: 'user_context_form.age_options.26_35' },
    { value: '36-45', label: 'user_context_form.age_options.36_45' },
    { value: '46-55', label: 'user_context_form.age_options.46_55' },
    { value: '55+', label: 'user_context_form.age_options.55_plus' },
    {
      value: 'unspecified',
      label: 'user_context_form.age_options.unspecified',
    },
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const context = this.currentUserContext();

    this.contextForm = this.fb.group({
      origin_country: [context.origin_country, [Validators.required]],
      current_area_of_residence: ['', [Validators.required]],
      time_in_germany: [context.time_in_germany, [Validators.required]],
      age: [context.age, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.contextForm.valid) {
      const formValue = this.contextForm.value;
      const userContext: UserContext = {
        origin_country: formValue.origin_country,
        time_in_germany: formValue.time_in_germany,
        age: formValue.age,
      };
      this.userContextUpdated.emit(userContext);
      if (formValue.current_area_of_residence) {
        this.locationUpdated.emit(formValue.current_area_of_residence);
      }
      this.formSubmitted.emit({ userContext, question: '' });
    } else {
      this.contextForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.formClosed.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Progress tracking helpers
  getCompletedFieldsCountForProgress(): number {
    return this.getCompletedFieldsCount();
  }

  getProgressPercentage(): number {
    const completed = this.getCompletedFieldsCount();
    const total = 4; // Artık 4 zorunlu alan var
    return (completed / total) * 100;
  }

  private getCompletedFieldsCount(): number {
    const formValue = this.contextForm?.value;
    let count = 0;
    if (formValue?.origin_country) count++;
    if (formValue?.current_area_of_residence) count++;
    if (formValue?.time_in_germany) count++;
    if (formValue?.age) count++;
    return count;
  }

  get isFormValid(): boolean {
    return this.contextForm?.valid || false;
  }

  get isFormComplete(): boolean {
    const formValue = this.contextForm?.value;
    return !!(
      formValue?.origin_country &&
      formValue?.current_area_of_residence &&
      formValue?.time_in_germany &&
      formValue?.age
    );
  }
}
