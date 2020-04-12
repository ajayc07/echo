import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


import { PageEvent } from '@angular/material/paginator';

import { IdentityView } from './modals/filter-modal';
import { AUTHORS, CATEGORY } from './data/filter-options';
import { QUOTES } from './data/quote-list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Echo';

  // MatPaginator Inputs
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15];

  // MatPaginator Output
  pageEvent: PageEvent;

  lowValue: number = 0;
  highValue: number = 5;


  filterForm: FormGroup;

  saidByOptions: Array<IdentityView> = AUTHORS;

  categoryOptions: Array<IdentityView> = CATEGORY;

  quoteList: any = QUOTES;

  filteredSaidByOptions: Observable<any>;
  filteredCategoryOptions: Observable<any>;

  toggleFilterDisplay: boolean = true;

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this._createForm();
    this._getFilteredValue();
  }

  private _createForm(): void {
    this.filterForm = this._formBuilder.group({
      saidBy: '',
      category: ''
    })
  }

  private _getFilteredValue(): void {
    this.filteredSaidByOptions = this.filterForm.get('saidBy').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.saidByOptions, value)));

    this.filteredCategoryOptions = this.filterForm.get('category').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.categoryOptions, value)));
  }

  private _filter(filterList, val: string): string[] {
    return filterList.map(x => x.name).filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  public applyFilter(): void{
    let selectedCategory = this.filterForm.get('category').value.toLowerCase();
    let selectedSaidBy = this.filterForm.get('saidBy').value.toLowerCase();

    this.quoteList = this.quoteList.filter((quotes) => {
      if(selectedSaidBy && selectedCategory) {
        return quotes.saidBy.toLowerCase() == selectedSaidBy  && quotes.category.includes(selectedCategory);
      } else {
        return ((selectedSaidBy && quotes.saidBy.toLowerCase() == selectedSaidBy) ||  (selectedCategory && quotes.category.includes(selectedCategory)));
      }
    })
  }

  public toggleFilterPanel(): void {
    this.toggleFilterDisplay = !this.toggleFilterDisplay;
  }

}
