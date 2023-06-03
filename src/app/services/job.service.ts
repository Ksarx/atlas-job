import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDirection } from '../models/direction';
import { IJob } from '../models/job';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  getJobs(
    page: number,
    limit: number,
    field?: string,
    skills?: string,
    search?: string
  ): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (field && field !== 'Все профессии') {
      params = params.set('field', field);
    }
    if (skills) {
      params = params.set('skills', skills);
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(`${environment.apiUrl}/jobs`, { params });
  }

  getJobSkills(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/jobs/skills/');
  }

  getJobFields(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/jobs/fields/');
  }

  getJobById(id: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/jobs/' + id);
  }

  getJobNames(search_query?: string): Observable<any> {
    let params = new HttpParams();

    if (search_query) {
      params = params.set('search_query', search_query);
    }
    return this.http.get<any>(environment.apiUrl + '/jobs/search', { params });
  }
}
