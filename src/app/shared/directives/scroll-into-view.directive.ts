import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appScrollIntoViewDirective]',
})
export class ScrollIntoViewDirective {
  @Output() visible = new EventEmitter<void>();

  private observer: IntersectionObserver;

  constructor(private el: ElementRef) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.visible.emit();
          }
        });
      },
      { threshold: 0.5 },
    );
  }

  ngOnInit() {
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
