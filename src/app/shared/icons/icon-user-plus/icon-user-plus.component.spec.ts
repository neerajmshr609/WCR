import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconUserPlusComponent } from './icon-user-plus.component';

describe('IconUserPlusComponent', () => {
  let component: IconUserPlusComponent;
  let fixture: ComponentFixture<IconUserPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconUserPlusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconUserPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
