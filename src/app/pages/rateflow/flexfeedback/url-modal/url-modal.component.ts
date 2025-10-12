import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Feedback } from 'src/app/shared/models/feedback.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-url-modal',
  templateUrl: './url-modal.component.html',
  styleUrls: ['./url-modal.component.scss'],
})
export class UrlModalComponent implements OnInit {
  public url = new UntypedFormControl('', [Validators.required]);
  public feedback: Feedback;
  public author: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { feedback: Feedback; author: User },
  ) {}

  ngOnInit(): void {
    this.feedback = this.data.feedback;
    this.author = this.data.author;
  }
}
