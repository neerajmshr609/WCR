import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAudioRecordComponent } from './icon-audio-record.component';

describe('IconAudioRecordComponent', () => {
  let component: IconAudioRecordComponent;
  let fixture: ComponentFixture<IconAudioRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconAudioRecordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconAudioRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
