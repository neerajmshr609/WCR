import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { RateflowService } from 'src/app/services/rateflow.service';
import { delay, filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { AVRatingParam } from 'src/app/shared/models/avratingparam.model';
import { avFileStateEnum } from '../../../shared/enums';

@Component({
  selector: 'app-av-rating-slider',
  templateUrl: './av-rating-slider.component.html',
  styleUrls: ['./av-rating-slider.component.scss'],
})
export class AvRatingSliderComponent
  extends BaseComponent
  implements AfterViewInit
{
  @Input() name: string;
  @Input() color: string;
  @Input() param: AVRatingParam;

  @Output() sliderDidChange = new EventEmitter<{
    param: AVRatingParam;
    value: number;
  }>();
  @Output() activateParam = new EventEmitter();
  @Output() selectParam = new EventEmitter();
  public paused = signal(true);
  public visible = signal(true);
  public options = signal({
    floor: -5,
    ceil: 5,
    showSelectionBar: false,
    showTicksValues: false,
    animateOnMove: true,
    translate: (value: number): string => {
      if (value !== 0) {
        if (value > 0) {
          return '+' + value;
        }
        return '' + value;
      }

      return '0';
    },
  });

  sliderValue = 0;

  constructor(public rateflowService: RateflowService) {
    super();
  }

  private isFocusedOnPause(param: AVRatingParam): boolean {
    return this.paused() && param.focused;
  }

  private updateSliderOptions(options: Options): void {
    const newOptions: any = { ...this.options(), ...options };
    this.options.set(newOptions);
  }

  onUserChangeEnd(changeContext: ChangeContext): void {
    this.sliderDidChange.emit({
      param: this.param,
      value: changeContext.value * 10,
    });
  }

  onUserChangeStart(slider): void {
    const el = slider.elementRef.nativeElement as HTMLElement;
    const value = el.querySelector('.ngx-slider-model-value') as HTMLElement;
    value.style.marginLeft = '0';
  }

  onParamClick(): void {
    if (
      this.param.active &&
      (!this.paused() || (this.paused() && this.param.focused))
    ) {
      this.selectParam.emit();
    }
  }

  toggleMode(): void {
    this.activateParam.emit();
  }

  ngAfterViewInit(): void {
    const fileId = this.param.projectfile_id;
    const curves = this.rateflowService.curves;

    if (curves) {
      this.sliderValue =
        curves[fileId]?.find((c) => c.avParamId === this.param.id)?.lastLevel ||
        0;
    }

    this.rateflowService.avFileStateChange$
      .pipe(takeUntil(this.destroyed))
      .subscribe((state) => {
        this.paused.set(!state || state?.state === avFileStateEnum.paused);
        if (!this.paused()) {
          this.updateSliderOptions({
            disabled: !this.param.active,
            readOnly: false,
          });
        }
      });

    this.rateflowService.playingModeChange
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => this.updateSliderOptions({ readOnly: !res }));

    this.rateflowService.avParamChange$
      .pipe(
        filter((res) => res && res.id === this.param.id),
        takeUntil(this.destroyed),
      )
      .subscribe((res) => {
        if (this.paused()) {
          this.updateSliderOptions({
            disabled: !res.active,
            readOnly: res.active && !this.isFocusedOnPause(res),
          });
        }
      });
  }
}
