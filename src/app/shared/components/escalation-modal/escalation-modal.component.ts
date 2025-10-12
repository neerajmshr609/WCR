import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { SelectComponent } from '../../UIkit/select/select.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { escalationLevelValidator } from './escalation-validator';
import { CloseIconComponent } from '../../icons/close-icon/close-icon.component';
import { EscalationService } from './escalation.service';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

export const EscalationLevel = {
  YOURSELF: 'consult_direct',
  PLATFORM: 'platform',
  MY_ORGANIZATION: 'organization_direct',
} as const;

export type EscalationLevel = keyof typeof EscalationLevel;
export type EscalationValue = (typeof EscalationLevel)[EscalationLevel];

export interface EscalationData {
  escalationLevel: EscalationLevel;
  conversation_id: number;
}

@Component({
  selector: 'app-escalation-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EscalationService],
  templateUrl: './escalation-modal.component.html',
  styleUrls: ['./escalation-modal.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ButtonComponent,
    MatDialogClose,
    SelectComponent,
    TranslateModule,
    CloseIconComponent,
  ],
})
export class EscalationModalComponent implements OnInit {
  public inProcess = signal(false);
  public errorState = signal(false);
  readonly dialogRef = inject(MatDialogRef<EscalationModalComponent>);
  readonly data = inject<EscalationData>(MAT_DIALOG_DATA);
  public escalationControl = new FormControl<EscalationLevel>(null);
  public escalationOptions = [
    {
      value: EscalationLevel.PLATFORM,
      name: 'escalation.platform',
    },
    {
      value: EscalationLevel.MY_ORGANIZATION,
      name: 'escalation.my_organization',
    },
    {
      value: EscalationLevel.YOURSELF,
      name: 'escalation.yourself',
    },
  ];
  public viewModel = ['value', 'name'];

  constructor(private escalationService: EscalationService) {}

  ngOnInit(): void {
    this.escalationControl.setValue(this.data.escalationLevel);
    this.escalationControl.setValidators(
      escalationLevelValidator(this.data.escalationLevel),
    );
  }

  public shareCase(): void {
    if (this.inProcess()) {
      return;
    }
    this.inProcess.set(true);
    this.dialogRef.close(true);
    this.escalationService
      .escalateRequest(this.data.conversation_id)
      .pipe(
        catchError((err) => {
          this.errorState.set(true);
          return EMPTY;
        }),
      )
      .subscribe((res) => {
        this.dialogRef.close(true);
      });
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
