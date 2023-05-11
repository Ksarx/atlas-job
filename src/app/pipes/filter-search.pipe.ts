import { Pipe, PipeTransform } from '@angular/core';
import { IJob } from '../models/job';

@Pipe({ name: 'filterSearch' })
export class FilterSearchPipe implements PipeTransform {
  transform(data: any[], search: string, filterMetadata: any): any[] {
    if (!data) {
      return [];
    }
    if (!search) {
      return data;
    }
    let filteredItems = data.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    filterMetadata.count = filteredItems.length;

    return filteredItems;
  }
}
