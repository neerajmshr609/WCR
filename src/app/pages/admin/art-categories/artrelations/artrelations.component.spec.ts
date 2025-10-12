import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArtrelationsComponent } from './artrelations.component';

describe('ArtrelationsComponent', () => {
  let component: ArtrelationsComponent;
  let fixture: ComponentFixture<ArtrelationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ArtrelationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtrelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
