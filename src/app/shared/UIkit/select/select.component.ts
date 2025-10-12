import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [NgClass, ReactiveFormsModule, MatSelectModule, TranslateModule],
  standalone: true,
})
export class SelectComponent {
  public control = input<AbstractControl | undefined | null>();
  public inputName = input<string>();
  public label = input<string>();
  public placeholder = input<string>();
  public disabled = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });
  public options = input<unknown[]>([]);
  public viewModel = input<[string, string]>(['id', 'name']);
}
