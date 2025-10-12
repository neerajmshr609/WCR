import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../admin.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Setting } from 'src/app/shared/models/setting.model';

@Component({
  selector: 'app-nextwork-settings',
  templateUrl: './nextwork-settings.component.html',
  styleUrls: ['./nextwork-settings.component.scss'],
})
export class NextworkSettingsComponent implements OnInit {
  isCreating = false;
  isDeleting = false;
  settings: Setting[];

  settingsFormGroup: UntypedFormGroup;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.fetchNextworkSettings().subscribe((results) => {
      this.settings = results;

      const settingsArray = new UntypedFormArray([]);

      for (const setting of this.settings) {
        settingsArray.push(
          new UntypedFormGroup({
            name: new UntypedFormControl(setting.name, Validators.required),
            value: new UntypedFormControl(setting.value, [
              Validators.required,
              Validators.pattern(/^[1-9]+[1-9]*$/),
            ]),
          }),
        );
      }

      this.settingsFormGroup = new UntypedFormGroup({
        settings: settingsArray,
      });
    });
  }

  getControls() {
    return (this.settingsFormGroup.get('settings') as UntypedFormArray)
      .controls;
  }

  onDeleteSetting(index: number) {
    (this.settingsFormGroup.get('settings') as UntypedFormArray).removeAt(
      index,
    );
  }

  onAddSetting() {
    (this.settingsFormGroup.get('settings') as UntypedFormArray).push(
      new UntypedFormGroup({
        name: new UntypedFormControl(null, Validators.required),
        value: new UntypedFormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[1-9]*$/),
        ]),
      }),
    );
  }

  onSubmit() {
    const networkCalls = [];

    for (const control of this.getControls()) {
      const existing = this.settings.find((obj) => {
        return obj.name === control.value.name;
      });

      if (existing) {
        existing.value = control.value.value;
        existing.name = control.value.name;

        networkCalls.push(this.adminService.updateSetting(existing));
      } else {
        const setting = new Setting();
        setting.name = control.value.name;
        setting.value = control.value.value;
        setting.settingtype = 'nextwork';
        networkCalls.push(this.adminService.createSetting(setting));
      }
    }

    this.isCreating = true;

    forkJoin(networkCalls)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe();
  }
}
