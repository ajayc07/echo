import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


import { PageEvent } from '@angular/material/paginator';

import { IdentityView } from './modals/filter-modal';
import { AppService } from './app.service';

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

  authorOptions: Array<IdentityView> = [];

  tagsOptions: Array<IdentityView> = [];

  quoteList: any = [];

  filteredAuthorOptions: Observable<any>;
  filteredTagsOptions: Observable<any>;

  toggleFilterDisplay: boolean = true;
  
  disableClearBtn: boolean = true;

  disableApplyBtn: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _appService: AppService
  ) { }

  ngOnInit() {

    this._createForm();
    this._getFilteredValue();
    this._handleFilterFormChange();
    this.getQuotes();
  }

  private _createForm(): void {
    this.filterForm = this._formBuilder.group({
      author: '',
      tags: ''
    })
  }

  private _handleFilterFormChange(): void {
    this.filterForm.valueChanges.subscribe((controlProp) => {
      let controlValue  = (this.filterForm.get('tags').value || this.filterForm.get('author').value);
      this.disableApplyBtn = !controlValue;
      this.disableClearBtn = controlValue;
    })
  }

  private _getFilteredValue(): void {

    this.getTags();
    this.getAuthor();
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

    let selectedTag = this.filterForm.get('tags').value.toLowerCase();
    let selectedAuthor = this.filterForm.get('author').value.toLowerCase();
    
    this.disableApplyBtn = true;
    this.disableClearBtn = false;

    this.quoteList = this.quoteList.filter((quotes) => {
      if(selectedAuthor && selectedTag) {
        return quotes.author.toLowerCase() == selectedAuthor  && quotes.tags.includes(selectedTag);
      } else {
        return ((selectedAuthor && quotes.author.toLowerCase() == selectedAuthor) ||  (selectedTag && quotes.tags.includes(selectedTag)));
      }
    })
  }

  public clearFilter(): void {

    this.disableClearBtn = true;
    this.filterForm.get('tags').setValue('');
    this.filterForm.get('author').setValue('');
    this.filterForm.updateValueAndValidity();
    this.getQuotes();
  }

  public toggleFilterPanel(): void {
    this.toggleFilterDisplay = !this.toggleFilterDisplay;
  }

  public getQuotes(): void {
    this._appService.getQuotes().subscribe((data) => {
      this.quoteList = data;
    })
  }

  public getTags(): void {
    this._appService.getTags().subscribe((data) => {
      this.tagsOptions = data;

      this.filteredTagsOptions = this.filterForm.get('tags').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.tagsOptions, value)));
    })
  }

  public getAuthor(): void {

    this._appService.getAuthor().subscribe((data) => {
      this.authorOptions = data;

      this.filteredAuthorOptions = this.filterForm.get('author').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.authorOptions, value)));
    })
  }

  public clearFilterOf(filterControl: string): void {
    this.filterForm.get(filterControl).setValue('');
  }

}
