import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditableFieldComponent } from './content-editable-field.component';

describe('ContentEditableFieldComponent', () => {
  let component: ContentEditableFieldComponent;
  let fixture: ComponentFixture<ContentEditableFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentEditableFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditableFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
