import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkillSelectService } from '../../services/skill-select.service';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { catchError, takeUntil } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cant-find-skill-dialog',
  templateUrl: './cant-find-skill-dialog.component.html',
  styleUrls: ['./cant-find-skill-dialog.component.scss'],
  providers: [SkillSelectService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CantFindSkillDialogComponent
  extends BaseComponent
  implements OnDestroy
{
  form: UntypedFormGroup = new UntypedFormGroup({
    text: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    email: new UntypedFormControl('', [Validators.email]),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<CantFindSkillDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly skillSelectService: SkillSelectService,
  ) {
    super();
  }

  submit(): void {
    this.skillSelectService
      .canFindSkill(this.form.value)
      .pipe(
        catchError(() => {
          this.snackBar.open('Something went wrong!');
          return EMPTY;
        }),
        takeUntil(this.destroyed),
      )
      .subscribe(() => this.dialogRef.close());
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
