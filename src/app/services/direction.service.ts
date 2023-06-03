import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  constructor(private http: HttpClient) {}

  getJobDirections(
    jobId: number,
    page: number,
    limit: number,
    faculty?: string,
    search?: string
  ): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (faculty) {
      params = params.set('faculty', faculty);
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(
      `${environment.apiUrl}/jobs/${jobId}/directions`,
      { params }
    );
  }

  getDirectionFaculties(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/directions/faculties/`);
  }

  getDirectionNames(jobId: number, search_query?: string): Observable<any> {
    let params = new HttpParams();

    if (search_query) {
      params = params.set('search_query', search_query);
    }
    return this.http.get<any>(
      `${environment.apiUrl}/directions/search/${jobId}`,
      { params }
    );
  }
}
