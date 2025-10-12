import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export function uniqueLocaleValidator(
  formArray: FormArray,
): ValidationErrors | null {
  const locales = formArray.controls.map(
    (control) => control.get('locale')?.value,
  );
  const hasDuplicates = new Set(locales).size !== locales.length;
  if (hasDuplicates) {
    formArray.controls.forEach((control) => {
      control.get('locale')?.setErrors({ duplicateLocale: true });
    });
    return { duplicateLocale: true };
  }
  return null;
}
