import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LupaiRightSidebarComponent } from './lupai-right-sidebar.component';

describe('LupaiRightSidebarComponent', () => {
  let component: LupaiRightSidebarComponent;
  let fixture: ComponentFixture<LupaiRightSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LupaiRightSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LupaiRightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
