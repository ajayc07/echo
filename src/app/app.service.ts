import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { QUOTES } from './data/quote-list';
import { TAGS, AUTHORS } from './data/filter-options';



@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor( 
    // private httpService: HttpClient
  ) { }

  public getQuotes(): Observable<any> {
      const mockObservable = of(QUOTES);
      return mockObservable;
  }

  public getTags(): Observable<any> {
      const mockObservable = of(TAGS);
      return mockObservable;
  }

  public getAuthor(): Observable<any> {
      const mockObservable = of(AUTHORS);
      return mockObservable;
  }
}
