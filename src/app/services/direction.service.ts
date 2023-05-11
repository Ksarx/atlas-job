import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  constructor(private http: HttpClient) {}

  getJobDirections(id: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl +
        '/jobs/' +
        id +
        `/directions?page=${page}&limit=${limit}`
    );
  }

  getAllJobDirections(id: string): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl + '/jobs/' + id + '/directions/all'
    );
  }
}
