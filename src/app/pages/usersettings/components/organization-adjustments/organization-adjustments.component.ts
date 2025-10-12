import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ORGANIZATION_ADJUSTMENTS } from '../../constants/forms';
import { IFormInput } from '../../interfaces';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-organization-adjustments',
  templateUrl: './organization-adjustments.component.html',
  styleUrls: ['./organization-adjustments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationAdjustmentsComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  formData: IFormInput[] = ORGANIZATION_ADJUSTMENTS;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = new FormGroup(this.setFormInputs());
  }

  ngAfterViewInit(): void {
    this.subscribeToForm();
  }

  private subscribeToForm(): void {
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      if (control) {
        control.valueChanges.pipe(debounceTime(1000)).subscribe((res) => {
          // TO DO: SAVE PERMISSIONS
        });
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  private setFormInputs() {
    const _formObj = {};

    this.formData.map((value) => {
      _formObj[value.name] = new FormControl(
        value.type === 'switch' ? value.checked : '',
      );
    });

    return _formObj;
  }
}
