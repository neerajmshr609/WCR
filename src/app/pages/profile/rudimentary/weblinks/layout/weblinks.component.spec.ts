import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeblinksComponent } from './weblinks.component';

describe('WeblinksComponent', () => {
  let component: WeblinksComponent;
  let fixture: ComponentFixture<WeblinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeblinksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeblinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
