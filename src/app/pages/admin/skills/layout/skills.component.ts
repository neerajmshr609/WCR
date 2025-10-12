import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';

import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Skill } from 'src/app/shared/models/skill.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  skills: Skill[];
  filteredSkills: Skill[];

  filterControl = new UntypedFormControl();

  constructor(
    private snackBar: MatSnackBar,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.fetchSkills();
    this.adminService.fetchFlatArtcategories().subscribe();

    this.filterControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((res: string) => {
        this.filteredSkills = this.skills
          .filter((skill) =>
            skill.name.toLowerCase().includes(res.toLowerCase()),
          )
          .slice(0, 14);
      });
  }

  fetchSkills() {
    this.adminService.fetchSkills().subscribe(() => {
      this.skills = this.adminService.skills$.value.slice().reverse();
      this.filteredSkills = this.skills.slice(0, 14);
    });
  }

  onSkillDelete(event) {
    this.adminService.deleteSkill(event.id).subscribe(() => {
      const index = this.skills.findIndex((skill) => skill.id === event.id);
      this.skills.splice(index, 1);
      this.fetchSkills();

      if (event.showMsg) {
        this.snackBar.open('Deleted!', null, {
          duration: 1000,
        });
      }
    });
  }

  loadMore() {
    const startPos = this.filteredSkills.length;
    this.filteredSkills.push(...this.skills.slice(startPos, 14 + startPos));
  }
}
