import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchSubject = new Subject<string>();
  public search$ = this.searchSubject.asObservable();

  setSearch(data: string): void {
    this.searchSubject.next(data);
  }

  constructor() {}
}
