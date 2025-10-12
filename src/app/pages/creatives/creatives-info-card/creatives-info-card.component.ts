import {
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import Typewriter from 'typewriter-effect/dist/core';
import { filter, takeUntil, take } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { cardFlip } from 'src/app/shared/animations';
import { Point } from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-creatives-info-card',
  templateUrl: './creatives-info-card.component.html',
  styleUrls: ['./creatives-info-card.component.scss'],
  animations: [cardFlip],
})
export class CreativesInfoCardComponent
  extends BaseComponent
  implements AfterViewInit
{
  @ViewChild('cardRef') cardRef: ElementRef;

  @Output() private sortByCoordinates = new EventEmitter<Point>();

  isLocked = true;
  currentUser: User;
  typewriter: Typewriter;

  public state = 'default';
  public pinned: boolean;

  public coordinates: Point;
  public coordinatesChange = new EventEmitter<Point>();

  constructor(
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  private typeUnlocked() {
    this.typewriter
      .pauseFor(1500)
      .typeString(
        '<span class="info-card-slide info-card-slide-1">Here</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">are all</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">creatives</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">listed who</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">are willing</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">to pay</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">for an</span><br>',
      )
      .changeDelay(70)
      .typeString(
        '<span class="info-card-slide info-card-slide-1">inspiring</span><br>',
      )
      .pauseFor(800)
      .changeDelay(45)
      .typeString('<br><span class="subtext">first review.</span>')
      .pauseFor(1500)
      .deleteAll(8)
      .typeString(
        '<span class="info-card-slide info-card-slide-2">Pick the</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-2">projects</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-2">who you</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-2">think your</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-2">feedback</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-2">could really</span><br>',
      )
      .changeDelay(70)
      .typeString(
        '<span class="info-card-slide info-card-slide-2">make a</span><br>',
      )
      .pauseFor(800)
      .changeDelay(45)
      .typeString('<br><span class="subtext">positive impact.</span>')
      .start();
  }

  private typeLocked() {
    this.typewriter
      .pauseFor(1500)
      .typeString(
        '<span class="info-card-slide info-card-slide-1">Here</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">are all</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">creatives</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">listed who</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">are willing</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">to pay</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-1">for an</span><br>',
      )
      .changeDelay(70)
      .typeString(
        '<span class="info-card-slide info-card-slide-1">inspiring</span><br>',
      )
      .pauseFor(800)
      .changeDelay(45)
      .typeString('<br><span class="subtext">first review.</span>')
      .pauseFor(1500)
      .deleteAll(8)
      .typeString(
        '<span class="info-card-slide info-card-slide-4">To unlock this</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-4">lucrative area,</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-4">you have</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-4">to give five</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-4">inspiring</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-4">comments to</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-4">other creatives.</span><br>',
      )
      .typeString(
        '<span class="info-card-slide info-card-slide-4">To do this,</span><br>',
      )
      .changeDelay(70)
      .typeString(
        '<span class="info-card-slide info-card-slide-4">go to</span><br>',
      )
      .pauseFor(800)
      .changeDelay(45)
      .typeString('<br><span class="subtext">Give Feedback.</span>')
      .start();
  }

  ngAfterViewInit() {
    this.reset();
    this.pinned = JSON.parse(localStorage.getItem('creatives-pinned-card'));

    if (this.pinned) {
      this.state = 'flipped';
      return;
    }

    this.state = 'default';

    setTimeout(() => {
      this.initAnimation();
    });
  }

  private initAnimation() {
    this.typewriter = new Typewriter(this.cardRef.nativeElement, {
      delay: 45,
      cursor: '',
    });

    if (this.currentUser) {
      this.type();
    }

    if (!this.authService.userIsSignedIn()) {
      this.typeLocked();
    }

    this.authService.userSubject$
      .pipe(
        filter((res) => !!res),
        takeUntil(this.destroyed),
        take(1),
      )
      .subscribe((res) => {
        this.currentUser = res;
        this.type();
      });
  }

  private type() {
    this.isLocked = this.currentUser.inspiring_rates_count <= 5;
    this.cdr.detectChanges();

    if (this.isLocked) {
      this.typeLocked();
    } else {
      this.typeUnlocked();
    }
  }

  public toggleUserTutorials() {
    this.currentUser.showtutorials = !this.currentUser.showtutorials;
    this.authService.updateUser(this.currentUser).subscribe();
  }

  public changeState() {
    this.state = this.state === 'default' ? 'flipped' : 'default';
    this.state === 'default'
      ? setTimeout(() => this.initAnimation())
      : this.typewriter?.deleteAll(0).stop();
    this.cdr.detectChanges();
  }

  public pin() {
    this.pinned = !this.pinned;
    localStorage.setItem('creatives-pinned-card', JSON.stringify(this.pinned));
  }

  public reset() {
    this.coordinates = { x: 50, y: 60 };
    this.coordinatesChange.emit(this.coordinates);
  }

  public apply() {
    this.sortByCoordinates.emit(this.coordinates);
  }
}
