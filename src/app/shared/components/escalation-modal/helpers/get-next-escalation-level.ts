import {
  EscalationLevel,
  EscalationValue,
} from '../escalation-modal.component';

export function getNextLevel(level: EscalationValue): EscalationValue {
  if (level === EscalationLevel.YOURSELF) {
    return EscalationLevel.MY_ORGANIZATION;
  }
  if (level === EscalationLevel.MY_ORGANIZATION) {
    return EscalationLevel.PLATFORM;
  }
}
