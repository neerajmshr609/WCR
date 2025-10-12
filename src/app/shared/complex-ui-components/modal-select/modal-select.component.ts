import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonCloseComponent } from '../../UIkit/buttons/button-close/button-close.component';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IModalSelectData, ISelectOption } from './modal-select.interface';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-modal-select',
  standalone: true,
  imports: [CommonModule, ButtonCloseComponent, ButtonComponent, TranslateModule, MatSelect, MatOption],
  templateUrl: './modal-select.component.html',
  styleUrls: ['./modal-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSelectComponent implements OnInit {
  readonly selected = signal<ISelectOption | null>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: IModalSelectData,
    private readonly _dialogRef: MatDialogRef<ModalSelectComponent>,
  ) {
  }

  ngOnInit(): void {
    if (this.data.preSelected) {
      this.selected.set(this.data.preSelected);
    }
  }

  close() {
    this._dialogRef.close(this.data.preSelected || null);
  }

  cancel() {
    this._dialogRef.close(this.data.preSelected || null);
  }

  changeSelected({ value: name }: MatSelectChange) {
    const currentSelected = this.selected();
    if (name !== currentSelected.name) {
      const newSelected = this.data.options.find(option => option.name === name);
      this.selected.set(newSelected);
    }
  }

  confirmSelected(): void {
    this._dialogRef.close(this.selected());
  }
}
