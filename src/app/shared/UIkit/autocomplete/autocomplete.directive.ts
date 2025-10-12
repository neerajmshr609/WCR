import {
  Directive,
  ElementRef,
  Input,
  input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import {
  ConnectionPositionPair,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { NgControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TemplatePortal } from '@angular/cdk/portal';
import { OptionType } from './types/option-type';

@Directive({
  selector: '[appAutocomplete]',
})
export class AutocompleteDirective<T extends object>
  implements OnInit, OnDestroy
{
  // public appAutocomplete = input<AutocompleteComponent>();
  @Input() appAutocomplete: AutocompleteComponent<T>;
  private overlayRef: OverlayRef;
  private destroy$ = new Subject<void>();

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
    private vcr: ViewContainerRef,
    private overlay: Overlay,
  ) {}

  get control() {
    return this.ngControl.control;
  }

  ngOnInit() {
    fromEvent(this.origin, 'focus')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.openDropdown();

        this.appAutocomplete
          .optionsClick()
          .pipe(takeUntil(this.overlayRef.detachments()))
          .subscribe((value: OptionType<T>) => {
            if (value) {
              this.control.setValue(value.legal_name);
              this.appAutocomplete.valueChange.emit(value);
            }
            this.close();
          });
      });
  }

  openDropdown() {
    this.overlayRef = this.overlay.create({
      width: this.origin.offsetWidth,
      maxHeight: 40 * 3,
      backdropClass: '',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.getOverlayPosition(),
    });

    const template = new TemplatePortal(
      this.appAutocomplete.rootTemplate,
      this.vcr,
    );
    this.overlayRef.attach(template);

    overlayClickOutside(this.overlayRef, this.origin).subscribe(() =>
      this.close(),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public close() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }

  private getOverlayPosition() {
    const positions = [
      new ConnectionPositionPair(
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' },
      ),
      new ConnectionPositionPair(
        { originX: 'start', originY: 'top' },
        { overlayX: 'start', overlayY: 'bottom' },
      ),
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }

  get origin() {
    return this.host.nativeElement;
  }
}

export function overlayClickOutside(
  overlayRef: OverlayRef,
  origin: HTMLElement,
) {
  return fromEvent<MouseEvent>(document, 'click').pipe(
    filter((event) => {
      const clickTarget = event.target as HTMLElement;
      const notOrigin = clickTarget !== origin; // the input
      const notOverlay =
        !!overlayRef &&
        overlayRef.overlayElement.contains(clickTarget) === false; // the autocomplete
      return notOrigin && notOverlay;
    }),
    takeUntil(overlayRef.detachments()),
  );
}
