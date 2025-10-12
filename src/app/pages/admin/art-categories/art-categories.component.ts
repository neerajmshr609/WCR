import { Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AdminService } from '../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Artcategory } from 'src/app/shared/models/artcategory.model';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  id: number;
  hasParent: boolean;
  level: number;
}

@Component({
  selector: 'app-art-categories',
  templateUrl: './art-categories.component.html',
  styleUrls: ['./art-categories.component.scss'],
})
export class ArtCategoriesComponent implements OnInit {
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.subcategories,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  selectedCategory$ = new BehaviorSubject<Artcategory>(null);
  loadedCategories: Artcategory[];

  public get selectedCategory(): Artcategory {
    return this.selectedCategory$.value;
  }

  constructor(
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  private _transformer(node: Artcategory, level: number) {
    return {
      expandable: !!node.subcategories && node.subcategories.length > 0,
      name: node.name,
      id: node.id,
      hasParent: !!node.parent_id,
      level,
    };
  }

  ngOnInit(): void {
    this.adminService.fetchArtcategories().subscribe((results) => {
      this.dataSource.data = results;
      this.loadedCategories = results;
    });
  }

  onCategorySelect(cat: Artcategory, skipParentCheck = false) {
    if (!cat.hasParent && !skipParentCheck) {
      return;
    }

    this.selectedCategory$.next(cat);
  }
}
