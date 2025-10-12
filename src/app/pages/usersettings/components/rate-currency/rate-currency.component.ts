import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';

export interface RateCurrency {
  rate: number;
  currency: string;
}

@Component({
  selector: 'app-rate-currency',
  templateUrl: './rate-currency.component.html',
  styleUrls: ['./rate-currency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateCurrencyComponent extends BaseComponent implements OnInit {
  currencies = input<{ id: number; name: string }[]>([]);
  value = input<number>();

  updateRate = output<RateCurrency>();

  public form: UntypedFormGroup;

  constructor() {
    super();

    this.initForm();
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroyed),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.saveData()),
      )
      .subscribe();
  }

  private initForm(): void {
    this.form = new UntypedFormGroup({
      rate: new UntypedFormControl(this.value() || 45),
      currency: new UntypedFormControl(0),
    });
  }

  saveData() {
    this.updateRate.emit({ ...this.form.value });
  }
}
