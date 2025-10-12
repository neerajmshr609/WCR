import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLoadMoreOnscroll]',
})
export class LoadMoreOnscrollDirective {
  @Output() loadMoreEvt = new EventEmitter<boolean>();

  @HostListener('document:scroll') onScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.body.scrollHeight - 380
    ) {
      this.loadMoreEvt.emit();
    }
  }
}
