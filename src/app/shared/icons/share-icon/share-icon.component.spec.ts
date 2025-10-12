import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareIconComponent } from './share-icon.component';

describe('DolarIconComponent', () => {
  let component: ShareIconComponent;
  let fixture: ComponentFixture<ShareIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
