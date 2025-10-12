import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseIconComponent } from '@icons/close-icon/close-icon.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ButtonComponent } from '@ui-kit/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import * as confetti from 'canvas-confetti';
import { OutletService } from '../../../../services/outlet.service';

@Component({
  selector: 'app-success-sign-up-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CloseIconComponent,
    MatDialogClose,
    ButtonComponent,
    MatDialogActions,
    TranslateModule,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './success-sign-up-modal.component.html',
  styleUrls: ['./success-sign-up-modal.component.scss'],
})
export class SuccessSignUpModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<SuccessSignUpModalComponent>);

  constructor(private _outletService: OutletService) {}

  public close(): void {
    this.dialogRef.close();
  }

  goBlog() {
    this._outletService.navigateToBlogSite();
  }

  ngOnInit(): void {
    this.launchConfetti();
  }

  private fire(
    myCanvas: HTMLCanvasElement,
    particleRatio: number,
    opts: confetti.Options,
  ) {
    const launchConfetti = confetti.create(myCanvas, {
      resize: true,
      useWorker: true,
    });
    const count = 300;
    const defaults = {
      origin: { y: 1, x: 0.5 },
      startVelocity: 75,
    };

    launchConfetti({
      ...opts,
      ...defaults,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  private launchConfetti(): void {
    const end = Date.now() + 15 * 1000;
    const confettiCanvas = document.getElementById(
      'canvas_confetti',
    ) as HTMLCanvasElement;
    if (confettiCanvas) {
      this.fire(confettiCanvas, 0.25, {
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: ['#000fff', '#fff000'],
      });
      this.fire(confettiCanvas, 0.2, {
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: ['#000fff', '#fff000'],
      });
      this.fire(confettiCanvas, 0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#000fff', '#fff000'],
      });
      this.fire(confettiCanvas, 0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        colors: ['#000fff', '#fff000'],
      });
      this.fire(confettiCanvas, 0.1, {
        spread: 120,
        startVelocity: 45,
        colors: ['#000fff', '#fff000'],
      });
    }

    if (Date.now() < end) {
      requestAnimationFrame(this.launchConfetti);
    }
  }
}
