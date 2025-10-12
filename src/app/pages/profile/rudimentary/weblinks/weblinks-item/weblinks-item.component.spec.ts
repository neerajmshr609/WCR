import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeblinksItemComponent } from './weblinks-item.component';

describe('WeblinksItemComponent', () => {
  let component: WeblinksItemComponent;
  let fixture: ComponentFixture<WeblinksItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeblinksItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeblinksItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
