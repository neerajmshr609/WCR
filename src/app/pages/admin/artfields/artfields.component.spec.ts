import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArtfieldsComponent } from './artfields.component';

describe('ArtfieldsComponent', () => {
  let component: ArtfieldsComponent;
  let fixture: ComponentFixture<ArtfieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ArtfieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
