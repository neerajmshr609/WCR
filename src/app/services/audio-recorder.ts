import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { interval, Subscription, from } from 'rxjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, scan, shareReplay, withLatestFrom, tap } from 'rxjs/operators';
import { NOT_LISTED_TEXT } from '../shared/constants';
import { Uppy } from '@uppy/core';
import { AwsS3 } from 'uppy';

import { COMPANION_URL } from 'src/config/config';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
  duration: number;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AudioRecordingService {
  private stream: MediaStream;
  private recorder: RecordRTC;
  private recorded$ = new Subject<RecordedAudioOutput>();
  private _recordedTime$ = new BehaviorSubject<number>(0);
  private _recordingFail$ = new Subject<string>();
  private recordingPaused$ = new BehaviorSubject<boolean>(false);

  private subscription = new Subscription();

  public get recordedBlob$(): Observable<RecordedAudioOutput> {
    return this.recorded$.pipe(shareReplay(1));
  }

  public get recordedTime$(): Observable<number> {
    return this._recordedTime$.pipe(shareReplay(1));
  }

  public get recordingFail$(): Observable<string> {
    return this._recordingFail$.pipe(shareReplay(1));
  }

  public startRecording(): void {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      this.recordingPaused$.next(false);
      this.recorder.resume();
      return;
    }

    this._recordedTime$.next(0);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((s) => {
        this.stream = s;
        this.record();
      })
      .catch(() => this._recordingFail$.next(null));
  }

  private record(): void {
    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm',
      bitsPerSecond: 16000,
    });

    this.recorder.record();
    this.initTimer();
  }

  public pauseRecording(): void {
    if (this.recorder) {
      this.recorder.pause();
      this.recordingPaused$.next(true);
    }
  }

  public useAudioUploader(
    blob: Blob,
    title: string,
    userId: number,
    name?: string,
  ) {
    const audioUploader = new Uppy({ id: 'audiomessage-uploader' }).use(AwsS3, {
      companionUrl: COMPANION_URL,
      metaFields: ['folder'],
      limit: 10,
    });
    audioUploader.addFile({
      data: blob,
      name,
      source: 'file input',
      type: blob.type,
    });
    audioUploader.setMeta({ folder: `users/${userId}/audio-messages` });

    return from(audioUploader.upload()).pipe(
      tap((res) => audioUploader.reset()),
    );
  }

  public stopRecording(): void {
    this.recorder?.stop(
      (blob: Blob) => {
        if (this._recordedTime$.value) {
          const uniqueName =
            new Date().valueOf().toString(36) +
            Math.random().toString(36).substr(2);
          const title = encodeURIComponent('audio_' + uniqueName + '.webm');
          this.recorded$.next({
            blob,
            title,
            duration: this._recordedTime$.value,
          });
        }
        this.stopMedia();
      },
      () => {
        this.stopMedia();
        this._recordingFail$.next(null);
      },
    );
  }

  private stopMedia(): void {
    this.recordingPaused$.next(false);
    this.recorder = null;
    this.stopTimer();

    if (this.stream) {
      this.stream.getAudioTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  private initTimer(): void {
    this.subscription = interval(1000)
      .pipe(
        withLatestFrom(this.recordingPaused$),
        filter(([_, paused]) => !paused),
        scan((acc) => acc + 1, 0),
      )
      .subscribe((res) => this._recordedTime$.next(res));
  }

  private stopTimer(): void {
    this.subscription.unsubscribe();
  }

  public abortRecording(): void {
    this.stopMedia();
  }

  public getLastUsedLanguage(languages: string[]): string {
    const audioMsgLangStorage = localStorage.getItem('audioMsgLang');
    let language = audioMsgLangStorage || NOT_LISTED_TEXT;
    if (!languages?.includes(language)) {
      language = NOT_LISTED_TEXT;
    }

    return language;
  }

  public createArrayOfAvailableLanguages(userLanguages: string): string[] {
    const languages: string[] = [NOT_LISTED_TEXT];

    if (userLanguages) {
      languages.unshift(...userLanguages.split(','));
    } else {
      languages.unshift('English');
    }

    return languages;
  }
}
