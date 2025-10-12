import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, ReactiveFormsModule],
})
export class RadioComponent {
  public control = input<AbstractControl | undefined | null>();
  public inputName = input<string>();
  public label = input<string>();
  public type = input<'checkbox' | 'radio'>();
  public description = input<string>();
  public disabled = input<boolean>();
}
