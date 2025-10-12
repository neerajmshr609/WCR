import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  signal,
} from '@angular/core';
import { MessageFile } from '../../models/message.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RateflowService } from 'src/app/services/rateflow.service';
import { avFileStateEnum } from '../../enums';

type VideoSrc = {
  src: string;
  type: string;
};

@Component({
  selector: 'app-view-file',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './view-file.component.html',
  styleUrl: './view-file.component.scss',
})
export class ViewFileComponent {
  public playerOptions = {
    controls: [
      'play-large',
      'current-time',
      'progress',
      'duration',
      'mute',
      'volume',
      'settings',
      'fullscreen',
    ],
    storage: {
      enabled: false,
    },
  };

  public videoSrc = signal<[VideoSrc] | null>(null);

  constructor(
    private readonly dialogRef: MatDialogRef<ViewFileComponent>,
    @Inject(MAT_DIALOG_DATA) public item: MessageFile,
    private rateflowService: RateflowService,
  ) {
    this.videoSrc.set([{ src: this.item.url, type: this.item.mimetype }]);
  }

  close(): void {
    this.dialogRef.close();
  }

  public playAudio() {
    this.rateflowService.avFilePlaybackClickChange$.next({
      state: avFileStateEnum.playing,
      fileIDString: '1',
    });
  }
}
