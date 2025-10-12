import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareProfileModalComponent } from './share-profile-modal.component';

describe('ShareProfileModalComponent', () => {
  let component: ShareProfileModalComponent;
  let fixture: ComponentFixture<ShareProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ShareProfileModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
