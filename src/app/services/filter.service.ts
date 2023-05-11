import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IJob } from '../models/job';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private dataSource = new BehaviorSubject([]);
  currentData = this.dataSource.asObservable();

  private searchFieldSource = new BehaviorSubject('');
  currentSearch = this.searchFieldSource.asObservable();

  constructor() {}

  changeData(data: any) {
    this.dataSource.next(data);
    console.log(data);
  }

  changeSearch(search: string) {
    this.searchFieldSource.next(search);
  }

  setFilters(filters: string[], data: any) {
    const filteredData = data.filter((job: IJob) => {
      const hasMatchingSkill = job.skills.some((skill) =>
        filters.includes(skill)
      );
      return hasMatchingSkill;
    });
    return filteredData;
  }
}
