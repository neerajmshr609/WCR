import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnInit,
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { OptionType } from '../types/option-type';

@Component({
  selector: 'app-autocomplete-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './autocomplete-option.component.html',
  styleUrls: ['./autocomplete-option.component.scss'],
})
export class AutocompleteOptionComponent<T extends object> implements OnInit {
  public value = input<OptionType<T>>();
  public click$: Observable<OptionType<T>>;

  constructor(private host: ElementRef) {}

  ngOnInit() {
    this.click$ = fromEvent(this.element, 'click').pipe(mapTo(this.value()));
  }

  get element() {
    return this.host.nativeElement;
  }
}
