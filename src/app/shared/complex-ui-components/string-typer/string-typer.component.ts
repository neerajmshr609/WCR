import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ComponentInputData,
  ITyperConfig,
} from './model/typer-config.interface';
import { parseStringTyperParams } from './lib/string-typer-params-parser';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, takeUntil } from 'rxjs/operators';
import { convertParsedStringsIntoObservable } from './lib/convert-parsed-strings-into-observable';
import { createRepeatableStringsEmitter } from './model/removable-strings-typer';
import { ResizeService } from '../../../services/resize.service';
import { BaseComponent } from '../../components/base.component';

@Component({
  selector: 'app-string-typer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './string-typer.component.html',
  styleUrls: ['./string-typer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringTyperComponent
  extends BaseComponent
  implements AfterViewInit
{
  readonly stringsToType = input.required<ComponentInputData>();
  readonly reserveSpaceWith = input<'min-width' | 'min-height' | null>(
    'min-height',
  );
  readonly defaultConfig = input<ITyperConfig>({
    startDelay: 200,
    typingSpeedMs: 70,
    removerDelayMs: 4000,
    removerSpeedMs: 50,
  });

  private readonly _parsedStringsToTyperParams = computed(() => {
    const stringsToType = this.stringsToType();
    const defaultConfig = this.defaultConfig();
    return parseStringTyperParams(stringsToType, defaultConfig);
  });
  private readonly _parsedStringsToTyperParams$ = toObservable(
    this._parsedStringsToTyperParams,
  );

  readonly text$ = this._parsedStringsToTyperParams$.pipe(
    switchMap((stringsToType) => {
      const createStringsEmitter = () =>
        convertParsedStringsIntoObservable(stringsToType);
      return createRepeatableStringsEmitter(createStringsEmitter);
    }),
  );

  @ViewChild('blinkingCursor')
  private readonly _blinkingCursor: ElementRef<HTMLSpanElement>;

  constructor(
    private readonly _elementRef: ElementRef,
    private readonly _resizeService: ResizeService,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this._updateCursorHeightOnResize();
  }

  private _updateCursorHeightOnResize() {
    this._resizeService.resize$
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this._updateCursorHeight();
      });
  }

  private _updateCursorHeight() {
    const { value, unit } = this._elementRef.nativeElement
      .computedStyleMap()
      .get('font-size');
    this._blinkingCursor.nativeElement.style.height = `${value}${unit}`;
  }
}
