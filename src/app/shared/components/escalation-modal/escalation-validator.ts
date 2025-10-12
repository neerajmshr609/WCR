import { EscalationLevel } from './escalation-modal.component';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function escalationLevelValidator(
  initialValue: EscalationLevel,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentValue = control.value;

    if (!Object.values(EscalationLevel).includes(currentValue)) {
      return { invalidLevel: true }; // Недопустимое значение
    }

    // Разрешённые переходы
    const validTransitions: Record<string, string[]> = {
      [EscalationLevel.YOURSELF]: [
        EscalationLevel.PLATFORM,
        EscalationLevel.MY_ORGANIZATION,
      ],
      [EscalationLevel.MY_ORGANIZATION]: [EscalationLevel.PLATFORM],
      [EscalationLevel.PLATFORM]: [EscalationLevel.PLATFORM],
    };

    if (initialValue === currentValue) {
      return { invalidTransition: true };
    }

    if (
      initialValue !== currentValue &&
      !validTransitions[initialValue].includes(currentValue)
    ) {
      return { invalidTransition: true };
    }

    return null;
  };
}
