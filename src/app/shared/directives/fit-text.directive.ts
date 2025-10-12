import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFitText]',
})
export class FitTextDirective implements AfterViewInit {
  elem: HTMLElement;

  constructor(private elemRef: ElementRef) {
    this.elem = this.elemRef.nativeElement;
  }

  private get fontSize(): number {
    return parseInt(window.getComputedStyle(this.elem).fontSize, 10);
  }

  private get clientHeight(): number {
    return this.elem.clientHeight;
  }

  private get scrollHeight(): number {
    return this.elem.scrollHeight;
  }

  ngAfterViewInit(): void {
    while (this.clientHeight < this.scrollHeight && this.fontSize > 12) {
      this.elem.style.fontSize = `${this.fontSize - 1}px`;
    }
  }
}
