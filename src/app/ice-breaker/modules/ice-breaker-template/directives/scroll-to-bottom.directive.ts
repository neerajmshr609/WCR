import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appScrollToBottom]',
})
export class ScrollToBottomDirective {
  @Input('appScrollToBottom') set scrollToBottom(message: any) {
    setTimeout(() => {
      this.elRef.nativeElement.scrollTop =
        this.elRef.nativeElement.scrollHeight;
    });
  }

  constructor(private readonly elRef: ElementRef) {}
}
