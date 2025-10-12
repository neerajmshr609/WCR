import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalMenuComponent } from './additional-menu.component';

describe('AdditionalMenuComponent', () => {
  let component: AdditionalMenuComponent;
  let fixture: ComponentFixture<AdditionalMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
