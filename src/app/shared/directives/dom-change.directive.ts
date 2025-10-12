import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDomChange]',
})
export class DomChangeDirective implements OnInit, OnDestroy {
  @Output() public domChange = new EventEmitter();

  private changes: MutationObserver;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;

    this.changes = new MutationObserver(() => this.domChange.emit());

    this.changes.observe(element, {
      attributes: true,
      attributeOldValue: true,
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
