import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareIceBreakerModalComponent } from './share-ice-breaker-modal.component';

describe('ShareIceBreakerModalComponent', () => {
  let component: ShareIceBreakerModalComponent;
  let fixture: ComponentFixture<ShareIceBreakerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareIceBreakerModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareIceBreakerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
