import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IValidationError } from './validation-error.interface';
import { isArrayAndHasItems } from '../../../lib/array-helpers.lib';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationErrorsComponent {
  readonly errorOrErrorsInput = input<IValidationError | IValidationError[] | string | string[] | null>(null);
  readonly castedErrors = computed<Required<IValidationError>[]>(() => {
    const inputErrors = this.errorOrErrorsInput();
    const errorsList = [];
    if (isArrayAndHasItems(inputErrors as [])) {
      (inputErrors as []).forEach((error) => {
        const casted = this._castError(error);
        errorsList.push(casted);
      });
    } else if (typeof inputErrors === 'string') {
      const casted = this._castError(inputErrors as (string | IValidationError));
      errorsList.push(casted);
    }
    return errorsList;
  });

  readonly hasErrors = computed(() => {
    const inputErrors = this.errorOrErrorsInput();
    return isArrayAndHasItems(inputErrors as []) || typeof inputErrors === 'string';
  });

  @HostBinding('class.hidden')
  get hideValidationErrors() {
    return !this.hasErrors();
  }

  private _castError(error: IValidationError | string): Required<IValidationError> {
    return {
      message: typeof error === 'string' ? error : error.message,
      data: typeof error === 'object' && typeof error?.data === 'object' ? error.data : {},
    };
  }
}
