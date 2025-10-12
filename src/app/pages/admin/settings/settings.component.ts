import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Setting } from 'src/app/shared/models/setting.model';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  isCreating = false;
  isDeleting = false;
  settings: Setting[];

  settingsFormGroup: UntypedFormGroup;
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.fetchSettings().subscribe((results) => {
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
        existing.settingtype = 'app';
        networkCalls.push(this.adminService.updateSetting(existing));
      } else {
        const setting = new Setting();
        setting.name = control.value.name;
        setting.value = control.value.value;
        setting.settingtype = 'app';
        networkCalls.push(this.adminService.createSetting(setting));
      }
    }

    this.isCreating = true;

    forkJoin(networkCalls)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe();
  }
}
