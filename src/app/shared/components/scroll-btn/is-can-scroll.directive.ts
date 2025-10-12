import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appIsCanScroll]',
})
export class IsCanScrollDirective implements OnInit, OnDestroy {
  @Input() watchElement: HTMLElement | null = null;
  @Input() threshold = 0;
  @Input() isContinuous = true;

  @Output() canScroll: EventEmitter<boolean> = new EventEmitter<boolean>();
  private observer: IntersectionObserver;

  constructor(private readonly element: ElementRef) {}

  ngOnInit() {
    this.createAndObserve();
  }

  createAndObserve() {
    const options: IntersectionObserverInit = {
      root: this.element.nativeElement,
      threshold: this.threshold,
    };
    this.observer = new IntersectionObserver(
      (payload: IntersectionObserverEntry[]) => {
        // this.canScroll.emit(!payload[0].isIntersecting);
        this.canScroll.emit(true);
      },
      options,
    );
    this.observer.observe(this.watchElement);
  }

  ngOnDestroy() {
    this.observer.unobserve(this.watchElement);
  }
}
