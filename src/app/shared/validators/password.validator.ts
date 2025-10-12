import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const hasSixLetters = (value.match(/[A-Za-z]/g) || []).length >= 6;
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const valid = hasSixLetters && hasNumber && hasSpecialChar;

    return valid
      ? null
      : {
          passwordComplexity: {
            hasSixLetters,
            hasNumber,
            hasSpecialChar,
          },
        };
  };
}
