import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgoFooterComponent } from './ngo-footer.component';

describe('NgoFooterComponent', () => {
  let component: NgoFooterComponent;
  let fixture: ComponentFixture<NgoFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgoFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgoFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
