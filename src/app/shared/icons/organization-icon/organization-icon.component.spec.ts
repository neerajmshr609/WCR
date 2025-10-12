import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationIconComponent } from './organization-icon.component';

describe('OrganizationIconComponent', () => {
  let component: OrganizationIconComponent;
  let fixture: ComponentFixture<OrganizationIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
