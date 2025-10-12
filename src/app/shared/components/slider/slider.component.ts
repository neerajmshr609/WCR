import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, AfterViewInit {
  sliderConfig;
  sliderModel;

  @Input() uniqueID: string;
  @Input() projectID;
  @Input() ratingType;
  @Input() currentValue = 50;
  @Input() staticValue;
  @Input() disabled: boolean;
  @Input() rated: boolean;

  @Output() sliderValue = new EventEmitter<number>();
  @Output() sliderDragged = new EventEmitter<void>();
  @Output() sliderChangedValue = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {
    if (!this.currentValue) {
      this.currentValue = 50;
    }

    this.sliderConfig = {
      connect: true,
      start: [this.staticValue ? this.staticValue : this.currentValue],
      step: 1,
      range: { min: 0, max: 100 },
    };
  }

  ngAfterViewInit(): void {
    const sliderDiv = '.emoji-slider-' + this.projectID;

    if (!this.staticValue && !this.rated) {
      document
        .querySelector('.noUi-handle')
        ?.classList.add('noUi-handle--animated');
    }

    if (this.staticValue) {
      const face = document.querySelector(
        sliderDiv + ' .emoji-slider__face',
      ) as HTMLElement;
      face.style.left = this.staticValue + '%';
      const slider = document.querySelector('.emoji-slider') as HTMLElement;
      slider.style.pointerEvents = 'none';
    }
  }

  onChange(value) {
    const sliderDiv = '.emoji-slider-' + this.projectID;

    const handle = document.querySelector(
      sliderDiv + ' .noUi-handle',
    ) as HTMLElement;
    handle.style.background = '#6c757d';
    handle.classList.remove('noUi-handle--animated');

    const face = document.querySelector(
      sliderDiv + ' .emoji-slider__face',
    ) as HTMLElement;
    face.classList.remove('emoji-slider__face--visible');

    this.sliderChangedValue.emit(value);
    this.sliderValue.emit(value);
    this.sliderDragged.emit();
  }

  onSlide(value) {
    const sliderDiv = '.emoji-slider-' + this.projectID;

    if (value.type !== undefined) {
      return;
    }

    if (value === 0) {
      value = 1;
    }

    this.currentValue = value;

    const face = document.querySelector(
      sliderDiv + ' .emoji-slider__face',
    ) as HTMLElement;
    face.classList.add('emoji-slider__face--visible');
    face.style.left = value + '%';

    this.sliderValue.emit(value);
  }
}
