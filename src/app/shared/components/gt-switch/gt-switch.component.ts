import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-gt-switch',
  templateUrl: './gt-switch.component.html',
  styleUrls: ['./gt-switch.component.scss'],
})
export class GtSwitchComponent implements OnInit, AfterViewInit {
  @ViewChild('leftLabelRef') private leftLabelRef: ElementRef;
  @ViewChild('toggleContainerRef') private toggleContainerRef: ElementRef;
  @ViewChild('toggleRef') private toggleRef: ElementRef;
  @Output() didChangeEvent = new EventEmitter();

  @Input() onoffMode = false;
  @Input() isSwitched = false;
  @Input() small = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.updateSmallSwitch();
  }

  ngOnInit() {}

  didClickToggle() {
    this.didChangeEvent.emit();
    this.isSwitched = !this.isSwitched;
    this.cdRef.detectChanges();

    this.updateSmallSwitch();
  }

  updateSmallSwitch() {
    const toggleContainer = this.toggleContainerRef
      .nativeElement as HTMLElement;
    const toggle = this.toggleRef.nativeElement as HTMLElement;
    const leftLabel = this.leftLabelRef.nativeElement as HTMLElement;

    if (this.onoffMode && this.isSwitched) {
      toggle.style.backgroundColor = 'white';
      toggleContainer.style.backgroundColor = '#00C67E';
      leftLabel.style.color = '#676767';
    }

    if (this.onoffMode && !this.isSwitched) {
      toggleContainer.style.backgroundColor = '#d0d0d0';
      toggle.style.backgroundColor = 'white';
      leftLabel.style.color = '#797979';
    }
  }
}
