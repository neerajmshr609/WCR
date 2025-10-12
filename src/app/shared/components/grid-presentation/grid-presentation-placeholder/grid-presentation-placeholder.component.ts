import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  DoCheck,
} from '@angular/core';
import { style, animate, trigger, transition } from '@angular/animations';
import { Observable } from 'rxjs';
import { fadeAnimation } from 'src/app/shared/animations';
import { getRandomInt } from 'src/app/shared/functions/get-random-int';
import { Projectfile } from 'src/app/shared/models/projectfile.model';

@Component({
  selector: 'app-grid-presentation-placeholder',
  templateUrl: './grid-presentation-placeholder.component.html',
  styleUrls: ['./grid-presentation-placeholder.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0.0 }),
        animate(150, style({ opacity: 1.0 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(150, style({ opacity: 0.0 })),
      ]),
    ]),
  ],
})
export class GridPresentationPlaceholderComponent
  implements OnInit, AfterViewInit, DoCheck
{
  @ViewChild('itemRef') private itemRef: ElementRef<HTMLElement>;
  @Input() file: Projectfile;
  @Input() private changes$: Observable<void>;

  public src: string;
  public badgeSrc: string;

  public height: number;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getSrc();
    this.getBadgeSrc();

    this.changes$?.subscribe(() => this.onResize());
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  ngDoCheck() {
    this.onResize();
  }

  private getSrc() {
    if (this.file.thumbnail) {
      this.src = this.file.thumbnail;
      return;
    }

    if (this.file.kind === 'audio') {
      const int = getRandomInt(0, 5);
      this.src = '/assets/default-thumbnails/audio/' + int + '.png';
      return;
    }

    if (this.file.kind === 'video' || this.file.kind === 'hostedvideo') {
      const int = getRandomInt(0, 4);
      this.src = '/assets/default-thumbnails/video/' + int + '.png';
      return;
    }

    if (this.file.kind === 'iframe') {
      const int = getRandomInt(0, 5);
      this.src = '/assets/default-thumbnails/iframe/' + int + '.png';
      return;
    }

    if (this.file.kind === 'pdf') {
      const int = getRandomInt(0, 5);
      this.src = '/assets/default-thumbnails/pdf/' + int + '.png';
      return;
    }

    if (this.file.kind === 'dummy') {
      const int = getRandomInt(0, 5);
      this.src = '/assets/default-thumbnails/dummy/' + int + '.png';
      return;
    }

    this.src = this.file.url;
  }

  private getBadgeSrc() {
    if (this.file.kind === 'video' || this.file.kind === 'hostedvideo') {
      this.badgeSrc = '/assets/projectfiles-types/video.svg';
    } else {
      this.badgeSrc = `/assets/projectfiles-types/${this.file.kind}.svg`;
    }
  }

  private countHeight() {
    if (!this.itemRef) {
      return;
    }
    this.height = this.itemRef.nativeElement.clientWidth / 1.78;
    this.cdr.detectChanges();
  }

  @HostListener('window:resize') onResize() {
    this.countHeight();
  }
}
