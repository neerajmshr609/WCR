import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-click-to-copy',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslateModule],
  templateUrl: './click-to-copy.component.html',
  styleUrls: ['./click-to-copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClickToCopyComponent {
  readonly text = input.required<string>();
  readonly copyBtnText = input<string | null>(null);

  constructor(
    private readonly _clipboard: Clipboard,
    private readonly _snackBar: MatSnackBar,
    private readonly _translate: TranslateService,
  ) {}

  copy() {
    const text = this.text();
    if (this._clipboard.copy(text)) {
      this._snackBarShow('click-to-copy.copied-message');
    } else {
      this._snackBarShow('click-to-copy.failed-copy-message');
    }
  }

  private _snackBarShow(messageTranslateKey: string) {
    this._translate
      .stream(messageTranslateKey)
      .pipe(take(1))
      .subscribe((message) => {
        this._snackBar.open(message, null, { duration: 4000 });
      });
  }
}
